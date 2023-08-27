const { Schema, model } = require('mongoose')

const pastOcularHistorySchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  myopia: {
    type: String,
    trim: true,
  },
  hyperopia: {
    type: String,
    trim: true,
  },
  astigmatism: {
    type: String,
    trim: true,
  },
  presbyopia: {
    type: String,
    trim: true,
  },
  emmetropia: {
    type: String,
    trim: true,
  },
  glaucoma: {
    type: String,
    trim: true,
  },
  cataracts: {
    type: String,
    trim: true,
  },
  macularDegeneration: {
    type: String,
    trim: true,
  },
  dryEyes: {
    type: String,
    trim: true,
  },
  keratoconus: {
    type: String,
    trim: true,
  },
  diabeticRetinopathy: {
    type: String,
    trim: true,
  },
  retinalDetachment: {
    type: String,
    trim: true,
  },
  strabismus: {
    type: String,
    trim: true,
  },
  generalInfo: {
    type: String,
    trim: true,
  },
})
pastOcularHistorySchema.virtual('id').get(function () {
  return this._id.toString()
})

// Ensure virtual fields are serialised.
pastOcularHistorySchema.set('toJSON', {
  virtuals: true,
})
pastOcularHistorySchema.set('toObject', {
  virtuals: true,
})

const PastOcularHistory = model('PastOcularHistory', pastOcularHistorySchema)

module.exports = PastOcularHistory
