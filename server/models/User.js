const { Schema, model } = require('mongoose')
const bcrypt = require('bcrypt')

const nameDetailsSchema = new Schema({
  title: {
    type: String,
    required: false,
    trim: true,
  },
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  middleName: {
    type: String,
    required: false,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  preferredFirstName: {
    type: String,
    required: false,
    trim: true,
  },
})

const contactDetailsSchema = new Schema({
  phone: {
    type: String,
    required: true,
  },
  address: {
    street1: String,
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

const healthProfessionalSchema = new Schema({
  gp: {
    type: String,
    required: false,
    trim: true,
  },
  gpAddress: {
    type: String,
    required: false,
    trim: true,
  },
  ophthalmologist: {
    type: String,
    required: false,
    trim: true,
  },
  ophthalmologistAddress: {
    type: String,
    required: false,
    trim: true,
  },
  otherHealthProfessionals: {
    type: String,
    required: false,
    trim: true,
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
    nameDetails: nameDetailsSchema,
    contactDetails: contactDetailsSchema,
    healthProfessionals: healthProfessionalSchema,
    dateOfBirth: {
      type: String,
      required: false,
    },
    healthFund: {
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
    isNewClient: {
      type: Boolean,
      default: true,
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

// ensure that the password is hashed before saving the user for insertMany
userSchema.pre('insertMany', async function (next, docs) {
  const saltRounds = 10

  for (const doc of docs) {
    if (doc.password) {
      doc.password = await bcrypt.hash(doc.password, saltRounds)
    }
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

userSchema.set('toObject', {
  virtuals: true,
})

const User = model('User', userSchema)

module.exports = User
