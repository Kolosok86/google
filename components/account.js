import { logger } from '../services/logger.js'
import AccountModel from '../models/Account.js'
import { logIn, oAuth } from './sdk.js'
import ms from 'ms'

export class Account {
  constructor(data) {
    const { username, password, token } = data
    const { android, sig, expire } = data

    this.username = username
    this.password = password

    this.token = token
    this.android = android
    this.sig = sig
    this.expire = expire
  }

  async checkSession() {
    try {
      const now = Date.now()

      if (!this.expire || this.expire < now) {
        await this.checkToken()
      }
    } catch (e) {
      logger.error('%s | error in refresh session, %s', this.username, e)
    }
  }

  async checkToken() {
    if (this.token) return this.refreshAuth()

    const masterToken = await logIn(this.username, this.password, this.android, this.sig)
    if (!masterToken) return

    logger.info('%s | created master token', this.username)

    this.token = masterToken.Token

    await this.updateAccount({
      token: masterToken.Token,
    })

    logger.info('%s | try update access token', this.username)

    await this.refreshAuth()
  }

  async refreshAuth() {
    logger.info('%s | trying update access token', this.username)

    const response = await oAuth(this.android, this.token, this.sig)
    if (!response) return

    const { Expiry, Auth, accountId } = response

    this.expire = +Expiry * 1000 - ms('30m')

    logger.info(`%s | updated photo access token`, this.username)

    await this.updateAccount({
      account: accountId,
      auth: Auth,
      expire: this.expire,
    })
  }

  // prettier-ignore
  updateAccount(data){
    return AccountModel.updateOne({
      username: this.username
    }, data)
  }
}
