import convict from 'convict'
import dotenv from 'dotenv'

dotenv.config({ quiet: true})

const conf = convict({
  env: {
    doc: 'The application environment.',
    format: ['production', 'development'],
    default: 'development',
    env: 'NODE_ENV',
  },
  logLevel: {
    doc: 'Winston log level',
    format: ['debug', 'info'],
    default: 'debug',
    env: 'LOG_LEVEL',
  },
  port: {
    doc: 'The port to bind.',
    format: 'port',
    default: 3000,
    env: 'PORT',
  },
  mongo: {
    doc: 'Url to mongo db',
    format: String,
    default: 'mongodb://localhost:27017/example?authSource=admin',
    env: 'MONGO',
  },
  proxy: {
    doc: 'Url to tls proxy server',
    format: String,
    default: 'http://127.0.0.1:3128',
    env: 'PROXY',
  },
})

conf.validate()

export { conf }
