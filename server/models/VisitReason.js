const { Schema, model } = require('mongoose')

const visitReasonSchema = new Schema({
  reason: {
    type: String,
    enum: [
      'Routine Checkup',
      'Vision Problems',
      'Follow-up',
      'Lens Consultation',
      'Other',
    ],
  },
  customReason: String, // in case they select 'Other' and want to specify.
})

const VisitReason = model('VisitReason', visitReasonSchema)

module.exports = VisitReason
