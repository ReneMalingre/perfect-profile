const { Schema, model } = require('mongoose')

const visitReasonSchema = new Schema({
  appointmentId: {
    type: Schema.Types.ObjectId,
    ref: 'Appointment',
    required: true,
  },
  reason: {
    type: String,
    required: true,
    trim: true,
    minlength: 4,
  },
})
visitReasonSchema.virtual('id').get(function () {
  return this._id.toString()
})

// Ensure virtual fields are serialised.
visitReasonSchema.set('toJSON', {
  virtuals: true,
})
visitReasonSchema.set('toObject', {
  virtuals: true,
})

const VisitReason = model('VisitReason', visitReasonSchema)

module.exports = VisitReason
