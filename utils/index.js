import ms from 'ms'

export function setIntervalCustom(_callback, _delay) {
  if (typeof _delay === 'string') {
    _delay = ms(_delay)
  }

  _callback()
  return setInterval(_callback, _delay)
}
