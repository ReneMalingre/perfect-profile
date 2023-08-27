const { Schema, model } = require('mongoose')

const newClientQuestionsSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  reasonForChoosing: {
    type: String,
    trim: true,
    default: '',
  },
  otherReasonForChoosing: {
    type: String,
    trim: true,
    default: '',
  },
  whoToThank: {
    type: String,
    trim: true,
    default: '',
  },
  firstEyeExam: {
    type: Boolean,
    default: false,
  },
  timeSinceLastExam: {
    type: String,
    trim: true,
    default: '',
  },
  spectacleWearer: {
    type: Boolean,
    default: true,
  },
  contactLensWearer: {
    type: Boolean,
    default: false,
  },
  spectacleTypes: {
    type: String,
    trim: true,
    default: '',
  },
  contactLensTypes: {
    type: String,
    trim: true,
    default: '',
  },
  contactLensSchedule: {
    type: String,
    trim: true,
    default: '',
  },
  spectacleDesire: {
    type: String,
    trim: true,
    default: '',
  },
  contactLensDesire: {
    type: String,
    trim: true,
    default: '',
  },
  generalInfo: {
    type: String,
    trim: true,
    default: '',
  },
})
newClientQuestionsSchema.virtual('id').get(function () {
  return this._id.toString()
})

// Ensure virtual fields are serialised.
newClientQuestionsSchema.set('toJSON', {
  virtuals: true,
})
newClientQuestionsSchema.set('toObject', {
  virtuals: true,
})

const NewClientQuestions = model('NewClientQuestions', newClientQuestionsSchema)

module.exports = NewClientQuestions
