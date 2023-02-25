import AccountModel from '../models/Account.js'

// prettier-ignore
export async function getAccounts(ctx, next) {
  const accounts = await AccountModel.find()
  
  if (!Array.isArray(accounts)) {
    ctx.badRequest({ error: 'bad response from mongo' })
  } else {
    ctx.ok(accounts)
  }

  return next()
}
