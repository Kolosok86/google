import accounts from './accounts.js'
import Router from 'koa-router'
import pkg from 'koa-convert'

const { compose } = pkg

const router = new Router({
  prefix: '/api',
})

router.use(accounts())
export default () => compose([router.allowedMethods(), router.routes()])
