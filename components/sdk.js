import Constants from '../config/constants.js'
import { readFile } from 'fs/promises'
import { request } from './external.js'
import { stringify } from 'querystring'
import nodeRSA from 'node-rsa'
import crypto from 'crypto'

const url = 'https://android.clients.google.com/auth'

export async function logIn(username, password, android, sig) {
  const encrypted = await generateSignature(username, password)

  const form = stringify({
    Email: username,
    EncryptedPasswd: encrypted,
    accountType: 'HOSTED_OR_GOOGLE',
    add_account: '1',
    androidId: android,
    device_country: 'us',
    has_permission: '1',
    lang: 'en',
    operatorCountry: 'us',
    sdk_version: '17',
    service: 'ac2dm',
    source: 'android',
    client_sig: sig,
    callerSig: sig,
  })

  const body = Buffer.from(form, 'utf8')

  const response = await request({
    url: url,
    headers: getHeaders(android, body.byteLength),
    method: 'POST',
    body,
  })

  const text = response?.body?.toString()
  return parseKeyValues(text)
}

export async function oAuth(android, token, sig) {
  const form = stringify({
    Token: token,
    app: 'com.google.android.apps.photos',
    callerSig: sig,
    client_sig: '24bb24c05e47e0aefa68a58a766179d9b613a600',
    device: android,
    google_play_services_version: 9877000,
    service:
      'oauth2:openid https://www.googleapis.com/auth/mobileapps.native https://www.googleapis.com/auth/photos.native',
    has_permission: '1',
    get_accountid: '1',
  })

  const body = Buffer.from(form, 'utf8')

  const response = await request({
    url: url,
    headers: getHeaders(android, body.byteLength),
    method: 'POST',
    body,
  })

  const text = response?.body?.toString()
  return parseKeyValues(text)
}

function parseKeyValues(body) {
  const obj = {}
  body.split('\n').forEach((line) => {
    let pos = line.indexOf('=')
    if (pos > 0) obj[line.substr(0, pos)] = line.substr(pos + 1)
  })
  return obj
}

async function generateSignature(email, password) {
  const keyBuffer = Buffer.from(Constants.defaultPublicKey, 'base64')

  const sha = crypto.createHash('sha1')
  sha.update(keyBuffer)

  const hash = sha.digest().slice(0, 4)

  const pem = await readFile('./config/public.pem')

  const rsa = new nodeRSA(pem)
  const encrypted = rsa.encrypt(email + '\x00' + password)

  let base64Output = Buffer.concat([Buffer.from([0]), hash, encrypted]).toString('base64')

  base64Output = base64Output.replace(/\+/g, '-')
  base64Output = base64Output.replace(/\//g, '_')

  return base64Output
}

function getHeaders(device, length) {
  return {
    Host: 'android.googleapis.com',
    Device: device,
    App: 'com.google.android.gms',
    'Accept-Encoding': 'gzip, deflate',
    'User-Agent': Constants.userAgent,
    'Content-Length': length,
    'Content-Type': 'application/x-www-form-urlencoded',
    Connection: 'Keep-Alive',
  }
}
