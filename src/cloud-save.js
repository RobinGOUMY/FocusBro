import { createState, storageKey } from './study.js'

const sessionKey = 'focusbro:account'
const cacheKey = username => `${storageKey}:${username}`
const empty = () => ({ revision: 0, changeId: null, syncedId: null, state: null })
const dirty = entry => entry.changeId !== entry.syncedId

function changeId() {
  const id = Array.from(crypto.getRandomValues(new Uint8Array(16)), byte => byte.toString(16).padStart(2, '0')).join('')
  return `${id.slice(0, 8)}-${id.slice(8, 12)}-${id.slice(12, 16)}-${id.slice(16, 20)}-${id.slice(20)}`
}

async function request(method = 'GET', payload) {
  const body = payload && JSON.stringify(payload)
  const response = await fetch('/api/account', {
    method, body, credentials: 'same-origin', cache: 'no-store',
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    signal: AbortSignal.timeout(12_000),
    keepalive: method === 'PUT' && new TextEncoder().encode(body).length < 60_000,
  })
  const data = await response.json()
  if (!response.ok && !(method === 'PUT' && response.status === 409)) {
    throw Object.assign(new Error(data.error ?? 'La sauvegarde en ligne est indisponible.'), { status: response.status })
  }
  return { ...data, written: method === 'PUT' && response.ok }
}

export function createCloudSave({ onState, onStatus, getState }) {
  let account = null
  try { account = localStorage.getItem(sessionKey) } catch {}
  let shadow
  let failedWrite = false
  let conflict
  let status = account ? 'pending' : ''
  let timer
  let flight
  let changingAccount = false
  const lock = operation => navigator.locks ? navigator.locks.request(storageKey, operation) : operation()
  function current() {
    try { return localStorage.getItem(sessionKey) === account } catch { return true }
  }

  function readCache(username = account) {
    if (username === account && failedWrite) return shadow
    return JSON.parse(localStorage.getItem(cacheKey(username))) ?? empty()
  }

  function writeCache(entry, username = account) {
    if (username === account) shadow = entry
    try {
      localStorage.setItem(cacheKey(username), JSON.stringify(entry))
      if (username === account) failedWrite = false
    } catch (error) {
      if (username !== account) throw error
      failedWrite = true
    }
  }

  function setStatus(next) {
    if (status === next) return
    status = next
    onStatus()
  }

  function schedule(delay = 700) {
    clearTimeout(timer)
    if (account && !conflict) timer = setTimeout(sync, delay)
  }

  function read() {
    return account ? readCache().state : JSON.parse(localStorage.getItem(storageKey))
  }

  function save(state) {
    if (!account) {
      localStorage.setItem(storageKey, JSON.stringify(state))
      return
    }
    const entry = readCache()
    writeCache({ ...entry, state, changeId: changeId() })
    if (!conflict && status !== 'reconnect') setStatus('pending')
    schedule()
  }

  function adopt(remote) {
    writeCache({ ...remote, syncedId: remote.changeId })
    void onState()
  }

  function clearSession() {
    localStorage.removeItem(cacheKey(account))
    localStorage.removeItem(sessionKey)
    location.reload()
  }

  function reconcile(result, sent) {
    const local = readCache()
    if (result.account !== account) {
      if (dirty(local)) setStatus('reconnect')
      else if (result.account) switchAccount(result)
      else clearSession()
      return
    }
    const remote = result.snapshot
    if (remote.revision < local.revision) return
    if (remote.changeId === local.changeId || (result.written && sent.revision === local.revision)) {
      writeCache({ ...local, revision: remote.revision, syncedId: remote.changeId })
    } else if (!dirty(local)) {
      if (remote.revision > local.revision || !local.state) adopt(remote)
    } else if (remote.revision !== local.revision) {
      conflict = remote
      setStatus('conflict')
      return
    }
    conflict = null
    const pending = dirty(readCache())
    setStatus(pending ? 'pending' : 'saved')
    if (pending) schedule()
  }

  function switchAccount(result, transfer = null) {
    const username = result.account
    const remote = result.snapshot
    const cached = readCache(username)
    if (transfer) {
      writeCache({ ...empty(), state: transfer, changeId: changeId() }, username)
    } else if (!cached.state || (!dirty(cached) && remote.revision > cached.revision)) {
      writeCache({ ...remote, state: remote.state ?? createState(), syncedId: remote.changeId }, username)
    }
    localStorage.setItem(sessionKey, username)
    location.reload()
  }

  function sync() {
    if (flight || conflict || changingAccount) return flight
    const username = account
    flight = (async () => {
      try {
        const sent = username ? readCache() : null
        const result = sent && dirty(sent)
          ? await request('PUT', { account: username, revision: sent.revision, changeId: sent.changeId, state: sent.state })
          : await request()
        await lock(() => {
          if (changingAccount || !current()) return
          if (!username && result.account) switchAccount(result)
          else if (username) reconcile(result, sent)
        })
      } catch (error) {
        if (username) setStatus(error.status === 401 ? 'reconnect' : error.status === 400 ? 'invalid' : 'offline')
      }
    })().finally(() => { flight = null })
    return flight
  }

  async function authenticate(action, username, password) {
    if (changingAccount) return
    changingAccount = true
    try {
      const result = await request('POST', { action, username, password })
      await lock(() => {
        if (result.account === account) reconcile(result, null)
        else switchAccount(result, action === 'register' ? getState() : null)
      })
    } finally {
      changingAccount = false
    }
    schedule(0)
  }

  async function logout() {
    await sync()
    await lock(async () => {
      if (!current() || !account) return
      if (dirty(readCache())) throw new Error('Ta progression est encore sur cet appareil. Synchronise-la avant de te déconnecter.')
      changingAccount = true
      try {
        await request('POST', { action: 'logout', account })
      } catch (error) {
        if (error.status !== 401) throw error
      } finally {
        changingAccount = false
      }
      clearSession()
    })
  }

  async function resolve(keepLocal) {
    await lock(() => {
      if (!conflict) return
      if (keepLocal) writeCache({ ...readCache(), revision: conflict.revision, syncedId: conflict.changeId })
      else adopt(conflict)
      conflict = null
      setStatus(keepLocal ? 'pending' : 'saved')
      schedule(0)
    })
  }

  function storageChanged(key) {
    if (key === sessionKey && localStorage.getItem(sessionKey) !== account) {
      location.reload()
      return false
    }
    if (key !== (account ? cacheKey(account) : storageKey)) return false
    if (account) {
      const entry = readCache()
      if (conflict && entry.revision >= conflict.revision) conflict = null
      if (!conflict) {
        setStatus(dirty(entry) ? 'pending' : 'saved')
        if (dirty(entry)) schedule()
      }
    }
    return true
  }

  return { read, save, sync, authenticate, logout, resolve, storageChanged, current, info: () => ({ account, status }) }
}
