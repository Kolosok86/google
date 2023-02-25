import pkg from 'mongoose'

const { model, Schema } = pkg

const accountSchema = new Schema(
  {
    username: String,
    password: String,

    token: String,
    android: String,
    sig: String,
    account: String,
    auth: String,
    expire: Number,
  },
  {
    versionKey: false,
    timestamps: true,
  }
)

accountSchema.index({ username: 1 }, { unique: true })

export default model('accounts', accountSchema)
