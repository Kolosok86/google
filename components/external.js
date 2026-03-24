import Constants from '../config/constants.js'
import { httpRequest } from './requester.js'
import { HttpsProxyAgent } from 'https-proxy-agent';
import { logger } from '../services/logger.js'
import { conf } from '../config/index.js'

const proxy = conf.get('proxy')

const masterHeaders = {
  // settings tls
  'proxy-tls': Constants.JA3_HASH,
  'proxy-node-escape': 'true',
}

export function request({ url, headers, method, body }) {
  const options = {
    agent: new HttpsProxyAgent(proxy),
    headers: { ...masterHeaders, ...headers },
    method: method || 'GET',
  }

  return httpRequest(url, options, body).catch((err) => {
    logger.error(err)
  })
}
