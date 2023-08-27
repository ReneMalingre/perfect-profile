const { Schema, model } = require('mongoose')

const visualNeedsSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  occupation: {
    type: String,
    trim: true,
  },
  workEnvironment: {
    type: String,
    trim: true,
  },
  workScreenTime: {
    type: String,
    trim: true,
  },
  workExtendedNear: {
    type: String,
    trim: true,
  },
  workExtendedDistance: {
    type: String,
    trim: true,
  },
  workEyeSafety: {
    type: String,
    trim: true,
  },
  workOtherNeeds: {
    type: String,
    trim: true,
  },
  lifeScreenTime: {
    type: String,
    trim: true,
  },
  lifeReadingTime: {
    type: String,
    trim: true,
  },
  lifeOtherNear: {
    type: String,
    trim: true,
  },
  lifeDrivingTime: {
    type: String,
    trim: true,
  },
  lifeExerciseTime: {
    type: String,
    trim: true,
  },
  lifeExerciseTypes: {
    type: String,
    trim: true,
  },
  lifeOtherDistance: {
    type: String,
    trim: true,
  },
  generalInfo: {
    type: String,
    trim: true,
  },
})
visualNeedsSchema.virtual('id').get(function () {
  return this._id.toString()
})

// Ensure virtual fields are serialised.
visualNeedsSchema.set('toJSON', {
  virtuals: true,
})
visualNeedsSchema.set('toObject', {
  virtuals: true,
})

const VisualNeeds = model('VisualNeeds', visualNeedsSchema)

module.exports = VisualNeeds
