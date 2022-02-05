export function toFixed (number, digit = 2) {
  return Number.parseFloat(number).toFixed(digit)
}

export function padZero (number) {
  return number < 10 ? `0${number}` : number
}

export function toTime (timestamp) {
  const dateObj = new Date(timestamp)
  return `${padZero(dateObj.getHours())}:${padZero(dateObj.getMinutes())}:${padZero(dateObj.getSeconds())}`
}