import Boom from '@hapi/boom'

export function getBoom(value) {
  const data = value || Boom.internal()
  const { payload } = data.output

  return payload
}
