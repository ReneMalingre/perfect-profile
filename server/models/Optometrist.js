const { Schema, model } = require('mongoose')

const optometristSchema = new Schema({
  title: {
    type: String,
    trim: true,
    default: '',
  },
  firstName: {
    type: String,
    trim: true,
    required: true,
  },
  lastName: {
    type: String,
    trim: true,
    required: true,
  },
  qualifications: {
    type: String,
    trim: true,
    default: '',
  },
  bio: {
    type: String,
    trim: true,
    default: '',
  },
  imageURL: {
    type: String,
    trim: true,
    default: '',
  },
})
optometristSchema.virtual('id').get(function () {
  return this._id.toString()
})

// Ensure virtual fields are serialised.
optometristSchema.set('toJSON', {
  virtuals: true,
})
optometristSchema.set('toObject', {
  virtuals: true,
})

const Optometrist = model('Optometrist', optometristSchema)

module.exports = Optometrist
