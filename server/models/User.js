const { Schema, model } = require('mongoose')
const bcrypt = require('bcrypt')

const contactDetailsSchema = new Schema({
  phone: {
    type: String,
    required: true,
  },
  address: {
    street: String,
    street2: String,
    city: String,
    state: String,
    postalCode: String,
    country: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: [
      /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
      'Must match an email address!',
    ],
    index: true,
  },
})

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 5,
    },
    contactDetails: contactDetailsSchema,
    dateOfBirth: {
      type: String,
      required: false,
    },
    role: {
      type: String,
      enum: ['USER', 'ADMIN'],
      default: 'USER',
    },
    dataFlag: {
      type: String,
      enum: ['STALE', 'FRESH'],
      default: 'STALE',
    },
  },
  {
    timestamps: true,
  }
)

userSchema.pre('save', async function (next) {
  if (this.isNew || this.isModified('password')) {
    const saltRounds = 10
    this.password = await bcrypt.hash(this.password, saltRounds)
  }
  next()
})

userSchema.methods.isCorrectPassword = async function (password) {
  return bcrypt.compare(password, this.password)
}

// Create a virtual field `id` to get the value of `_id`
userSchema.virtual('id').get(function () {
  return this._id.toString()
})

// Ensure virtual fields are serialised.
userSchema.set('toJSON', {
  virtuals: true,
})

const User = model('User', userSchema)

module.exports = User
