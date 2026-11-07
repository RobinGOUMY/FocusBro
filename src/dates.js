export function dayKey(timestamp = Date.now()) {
  const date = new Date(timestamp)
  return [date.getFullYear(), String(date.getMonth() + 1).padStart(2, '0'), String(date.getDate()).padStart(2, '0')].join('-')
}

export function weekKey(timestamp = Date.now()) {
  const date = new Date(timestamp)
  date.setDate(date.getDate() - (date.getDay() + 6) % 7)
  return dayKey(date)
}
