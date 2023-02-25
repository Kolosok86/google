import { Accounts } from '../controllers/index.js'
import Router from 'koa-router'

const router = new Router().get('/accounts', (ctx, next) => Accounts.getAccounts(ctx, next))

export default () => router.routes()
