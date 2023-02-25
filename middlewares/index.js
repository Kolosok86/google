import * as opts from '../config/options.js'
import { errorHandler } from './errorHandler.js'
import logger from 'koa-logger'
import helmet from 'koa-helmet'
import convert from 'koa-convert'
import bodyParser from 'koa-bodyparser'
import respond from 'koa-respond'

const { compose } = convert

const middlewares = [
  respond(),
  errorHandler,
  logger(opts.log),
  bodyParser(opts.bodyparser),
  helmet(opts.helmet),
]

export default () => compose(middlewares)
