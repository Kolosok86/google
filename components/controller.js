import { setIntervalCustom } from '../utils/index.js'
import { Account } from './account.js'

export class Controller {
  constructor() {
    this.accounts = []
  }

  checkAuthInterval(ms = '10m') {
    setIntervalCustom(async () => {
      for (let account of this.accounts) {
        await account.checkSession()
      }
    }, ms)
  }

  addAccounts(data) {
    const found = this.getAccount(data.username)
    if (found) return

    const account = new Account(data)
    this.accounts.push(account)
  }

  getAccount(username) {
    return this.accounts.find((account) => account.username === username)
  }
}
