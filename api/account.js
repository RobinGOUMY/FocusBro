import { createHash, randomBytes, scrypt, timingSafeEqual } from 'node:crypto'
import { promisify } from 'node:util'
import { neon } from '@neondatabase/serverless'

const derive = promisify(scrypt)
const hash = value => createHash('sha256').update(value).digest('hex')
const sessionAge = 30 * 24 * 60 * 60
const usernamePattern = /^[a-z0-9][a-z0-9_.-]{2,23}$/
const uuidPattern = /^[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}$/i
const record = value => value !== null && typeof value === 'object' && !Array.isArray(value)
const reply = (data, status = 200, headers = {}) => Response.json(data, {
  status, headers: { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff', ...headers },
})

function sessionCookie(name, token, age) {
  return { 'Set-Cookie': `${name}=${token}; Path=/; Max-Age=${age}; HttpOnly; SameSite=Strict${name.startsWith('__Host-') ? '; Secure' : ''}` }
}

function cookieToken(request, name) {
  const prefix = `${name}=`
  const value = request.headers.get('cookie')?.split(';').map(part => part.trim())
    .find(part => part.startsWith(prefix))?.slice(prefix.length)
  return /^[a-zA-Z0-9_-]{43}$/.test(value ?? '') ? hash(value) : null
}

async function readBody(request, limit) {
  if (!request.headers.get('content-type')?.startsWith('application/json')) return null
  if (!request.body) return null
  const reader = request.body.getReader()
  const decoder = new TextDecoder()
  let text = ''
  let length = 0
  try {
    for (;;) {
      const { done, value } = await reader.read()
      if (done) return JSON.parse(text + decoder.decode())
      length += value.byteLength
      if (length > limit) {
        await reader.cancel()
        return null
      }
      text += decoder.decode(value, { stream: true })
    }
  } catch {
    return null
  } finally {
    reader.releaseLock()
  }
}

async function passwordHash(password, salt) {
  return derive(password, salt, 32, { N: 32768, r: 8, p: 3, maxmem: 64 * 1024 * 1024 })
}

async function allowAttempt(sql, request, username) {
  const ip = request.headers.get('x-real-ip') ?? 'local'
  const ipKey = hash(`ip:${ip}`)
  const userKey = hash(`user:${username}`)
  const bucket = Math.floor(Date.now() / 900_000)
  const rows = await sql`
    WITH expired AS (DELETE FROM focusbro_auth_attempts WHERE bucket < ${bucket - 1})
    INSERT INTO focusbro_auth_attempts AS rate (key, bucket, attempts)
    VALUES (${ipKey}, ${bucket}, 1), (${userKey}, ${bucket}, 1)
    ON CONFLICT (key) DO UPDATE SET bucket = EXCLUDED.bucket,
      attempts = CASE WHEN rate.bucket = EXCLUDED.bucket THEN rate.attempts + 1 ELSE 1 END
    RETURNING key, attempts
  `
  return rows.every(row => row.attempts <= (row.key === ipKey ? 35 : 10))
}

const snapshotOf = row => ({ revision: row.revision, changeId: row.change_id, state: row.progress })
const accountOf = row => ({ account: row.username, snapshot: snapshotOf(row) })

async function authenticate(sql, request, body, name, previous) {
  const username = typeof body.username === 'string' ? body.username.trim().toLowerCase() : ''
  const password = body.password
  if (!usernamePattern.test(username) || typeof password !== 'string' || password.length < 12 || password.length > 128) {
    return reply({ error: 'Utilise un pseudo de 3 à 24 caractères et un mot de passe de 12 à 128 caractères.' }, 400)
  }
  if (!await allowAttempt(sql, request, username)) {
    return reply({ error: 'Trop de tentatives. Réessaie dans quelques minutes.' }, 429, { 'Retry-After': '900' })
  }
  const token = randomBytes(32).toString('base64url')
  const tokenHash = hash(token)
  let account
  if (body.action === 'register') {
    const salt = randomBytes(16).toString('hex')
    const digest = (await passwordHash(password, salt)).toString('hex')
    const [created] = await sql`
      WITH account AS (
        INSERT INTO focusbro_accounts (username, password_hash) VALUES (${username}, ${salt + ':' + digest})
        ON CONFLICT DO NOTHING RETURNING username
      )
      INSERT INTO focusbro_sessions (username, token_hash, expires_at)
      SELECT username, ${tokenHash}, now() + interval '30 days' FROM account
      RETURNING username
    `
    if (!created) return reply({ error: 'Ce pseudo est déjà utilisé.' }, 409)
    account = { account: username, snapshot: { revision: 0, changeId: null, state: null } }
  } else {
    const [row] = await sql`SELECT * FROM focusbro_accounts WHERE username = ${username}`
    const [salt, digest] = row?.password_hash.split(':') ?? ['0'.repeat(32), '0'.repeat(64)]
    const actual = await passwordHash(password, salt)
    if (!timingSafeEqual(actual, Buffer.from(digest, 'hex')) || !row) {
      return reply({ error: 'Pseudo ou mot de passe incorrect.' }, 401)
    }
    await sql`
      INSERT INTO focusbro_sessions (username, token_hash, expires_at)
      VALUES (${username}, ${tokenHash}, now() + interval '30 days')
    `
    account = accountOf(row)
  }
  await sql`DELETE FROM focusbro_sessions WHERE token_hash = ${previous} OR expires_at <= now()`
  return reply(account, 200, sessionCookie(name, token, sessionAge))
}

function validProgress(state) {
  return record(state) && ['sessions', 'reviews', 'customCards', 'notes'].every(key => Array.isArray(state[key]) && state[key].every(record))
    && ['schedule', 'reading', 'timer', 'mathPractice', 'profile', 'arcade'].every(key => record(state[key]))
    && ['focus', 'break'].includes(state.timer.phase) && ['ready', 'running', 'paused'].includes(state.timer.status)
    && ['days', 'tracks', 'skills'].every(key => record(state.mathPractice[key]))
    && record(state.arcade.records) && record(state.arcade.days) && Array.isArray(state.arcade.recent)
}

async function saveProgress(sql, body, token, username) {
  if (!Number.isInteger(body.revision) || body.revision < 0 || !uuidPattern.test(body.changeId ?? '') || !validProgress(body.state)) {
    return reply({ error: 'Cette sauvegarde ne peut pas être synchronisée.' }, 400)
  }
  const [written] = await sql`
    UPDATE focusbro_accounts SET revision = revision + 1, change_id = ${body.changeId}, progress = ${JSON.stringify(body.state)}::jsonb
    WHERE username = ${username} AND revision = ${body.revision}
      AND EXISTS (SELECT 1 FROM focusbro_sessions WHERE token_hash = ${token} AND expires_at > now())
    RETURNING revision, change_id
  `
  if (written) return reply({ account: username, snapshot: { revision: written.revision, changeId: written.change_id } })
  const [latest] = await sql`SELECT username, revision, change_id, progress FROM focusbro_accounts WHERE username = ${username}`
  return reply(accountOf(latest), 409)
}

export default {
  async fetch(request) {
    const { method } = request
    const url = new URL(request.url)
    const secure = url.protocol === 'https:'
    const name = secure ? '__Host-focusbro' : 'focusbro-session'
    const token = cookieToken(request, name)
    if (!['GET', 'POST', 'PUT'].includes(method)) return reply({}, 405, { Allow: 'GET, POST, PUT' })
    if (method !== 'GET' && request.headers.get('origin') !== url.origin) return reply({ error: 'Requête refusée.' }, 403)
    if (method === 'GET' && !token) return reply({ account: null })
    if (!process.env.DATABASE_URL) return reply({ error: 'La sauvegarde en ligne est indisponible sur cette adresse.' }, 503)

    try {
      const sql = neon(process.env.DATABASE_URL)
      const body = method === 'GET' ? null : await readBody(request, method === 'PUT' ? 2 * 1024 * 1024 : 4096)
      if (method !== 'GET' && !record(body)) return reply({ error: 'Requête invalide ou sauvegarde trop volumineuse.' }, 400)
      if (method === 'POST' && ['register', 'login'].includes(body.action)) return await authenticate(sql, request, body, name, token)
      const [session] = token ? await sql`
        SELECT username FROM focusbro_sessions WHERE token_hash = ${token} AND expires_at > now()
      ` : []
      if (method === 'GET') {
        if (!session) return reply({ account: null }, 200, sessionCookie(name, '', 0))
        const [row] = await sql`SELECT username, revision, change_id, progress FROM focusbro_accounts WHERE username = ${session.username}`
        return reply(accountOf(row))
      }
      if (!session || body.account !== session.username) return reply({ error: 'Reconnecte-toi pour synchroniser ta progression.' }, 401)
      if (method === 'PUT') return await saveProgress(sql, body, token, session.username)
      if (body.action !== 'logout') return reply({}, 400)
      await sql`DELETE FROM focusbro_sessions WHERE token_hash = ${token}`
      return reply({ account: null }, 200, sessionCookie(name, '', 0))
    } catch (error) {
      console.error('FocusBro account API:', error.code ?? error.name)
      return reply({ error: 'La sauvegarde en ligne est momentanément indisponible.' }, 503)
    }
  },
}
