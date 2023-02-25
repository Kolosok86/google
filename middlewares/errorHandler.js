import { getBoom } from '../services/errors.js'
import { logger } from '../services/logger.js'
import Boom from '@hapi/boom'

export async function errorHandler(ctx, next) {
  try {
    await next()
  } catch (err) {
    if (err?.status === 401) {
      const boom = Boom.unauthorized()
      const payload = getBoom(boom)
      ctx.unauthorized(payload)

      return
    }

    logger.error(err)

    const boom = getBoom()
    ctx.internalServerError(boom)
  }
}
