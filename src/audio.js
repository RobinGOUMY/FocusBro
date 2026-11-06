const AudioEngine = window.AudioContext || window.webkitAudioContext
let context
let ambience

function audioContext() {
  if (!AudioEngine) return null
  context ??= new AudioEngine()
  if (context.state === 'suspended') void context.resume().catch(() => {})
  return context
}

function note(ctx, output, pitch, start, duration, volume, type = 'sine') {
  const oscillator = ctx.createOscillator()
  const envelope = ctx.createGain()
  oscillator.type = type
  oscillator.frequency.value = 440 * 2 ** ((pitch - 69) / 12)
  envelope.gain.setValueAtTime(0.001, start)
  envelope.gain.linearRampToValueAtTime(volume, start + 0.035)
  envelope.gain.exponentialRampToValueAtTime(0.001, start + duration)
  oscillator.connect(envelope).connect(output)
  oscillator.start(start)
  oscillator.stop(start + duration)
}

function noise(ctx, output, rain) {
  const length = ctx.sampleRate * 4
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate)
  const data = buffer.getChannelData(0)
  let last = 0
  for (let index = 0; index < length; index += 1) {
    const sample = Math.random() * 2 - 1
    last = (last + 0.03 * sample) / 1.03
    data[index] = rain ? last * 3 + sample * 0.14 : sample * 0.23
  }
  const source = ctx.createBufferSource()
  source.buffer = buffer
  source.loop = true
  const filter = ctx.createBiquadFilter()
  filter.type = rain ? 'lowpass' : 'highpass'
  filter.frequency.value = rain ? 1600 : 80
  source.connect(filter).connect(output)
  source.start()
  return () => source.stop()
}

function lofi(ctx, output) {
  const chords = [[48, 55, 59, 64], [45, 52, 55, 60], [50, 57, 60, 65], [43, 53, 57, 59]]
  let measure = 0
  let start = ctx.currentTime + 0.06
  function schedule() {
    if (start < ctx.currentTime) start = ctx.currentTime + 0.06
    while (start < ctx.currentTime + 0.4) {
      const chord = chords[measure % chords.length]
      chord.forEach((pitch, index) => note(ctx, output, pitch, start + index * 0.035, 2.65, 0.055, index === 0 ? 'sine' : 'triangle'))
      note(ctx, output, chord[2] + 12, start + 1.05, 1.25, 0.045)
      note(ctx, output, chord[3] + 12, start + 1.78, 0.8, 0.025)
      start += 2.85
      measure += 1
    }
  }
  schedule()
  const interval = setInterval(schedule, 200)
  return () => clearInterval(interval)
}

export function unlockAudio() { audioContext() }

export function setVolume(volume) {
  if (ambience) ambience.output.gain.value = volume / 100
}

export function setAmbience(mode, volume) {
  if (ambience) {
    ambience.stop()
    ambience.output.disconnect()
    ambience = null
  }
  if (mode === 'off') return true
  const ctx = audioContext()
  if (!ctx) return false
  const output = ctx.createGain()
  output.gain.value = volume / 100
  output.connect(ctx.destination)
  ambience = { output, stop: mode === 'lofi' ? lofi(ctx, output) : noise(ctx, output, mode === 'rain') }
  return true
}

export function chime(enabled, volume) {
  if (!enabled || !volume || !context || context.state !== 'running') return
  const output = context.createGain()
  output.gain.value = volume / 100
  output.connect(context.destination)
  const start = context.currentTime + 0.02
  const pitches = [67, 72, 76, 79]
  pitches.forEach((pitch, index) => note(context, output, pitch, start + index * 0.085, 0.44, 0.18))
  setTimeout(() => output.disconnect(), 900)
}
