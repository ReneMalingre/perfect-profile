const { Schema, model } = require('mongoose')

const questionnaireSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  lifestyle: {
    type: Schema.Types.ObjectId,
    ref: 'Lifestyle',
  },
  reasonsForVisit: {
    type: Schema.Types.ObjectId,
    ref: 'VisitReason',
  },
  symptoms: {
    type: Schema.Types.ObjectId,
    ref: 'Symptoms',
  },
  // ... (other fields)
})
const Questionnaire = model('Questionnaire', questionnaireSchema)

module.exports = Questionnaire
