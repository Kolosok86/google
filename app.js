import Koa from 'koa'

import middlewares from './middlewares/index.js'
import { logger } from './services/logger.js'
import AccountModel from './models/Account.js'
import { setIntervalCustom } from './utils/index.js'
import { Controller } from './components/controller.js'
import routes from './routes/index.js'
import { conf } from './config/index.js'
import mongoose from 'mongoose'

const MONGO = conf.get('mongo')
const PORT = conf.get('port')

mongoose.set('strictQuery', true)
mongoose.connect(MONGO)

mongoose.connection.on('open', () => {
  logger.info('Mongo database is ready!')
})

mongoose.connection.on('error', (err) => {
  logger.error(err)
  process.exit(1)
})

const controller = new Controller()
controller.checkAuthInterval('10m')

setIntervalCustom(async () => {
  const accounts = await AccountModel.find()

  for (let account of accounts) {
    controller.addAccounts(account)
  }
}, '30m')

const app = new Koa()

app.use(middlewares())
app.use(routes())

app.listen(PORT, () => {
  logger.info('Server listening on port: %s', PORT)
})
