// models/Appointment.js
const { Schema, model } = require('mongoose')

const appointmentSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  appointmentDate: {
    type: Date, // Assuming date in YYYY-MM-DD format
    required: true,
  },
  appointmentTime: {
    type: String, // Assuming time in HH:mm format
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  locationAddress: {
    type: String,
    required: true,
  },
  locationTelephone: {
    type: String,
    required: false,
  },
  optometristId: {
    type: Schema.Types.ObjectId,
    ref: 'Optometrist',
    required: true,
  },
})

// Create a virtual field `id` to get the value of `_id`
appointmentSchema.virtual('id').get(function () {
  return this._id.toString()
})

// Ensure virtual fields are serialised.
appointmentSchema.set('toJSON', {
  virtuals: true,
})
appointmentSchema.set('toObject', {
  virtuals: true,
})

const Appointment = model('Appointment', appointmentSchema)

module.exports = Appointment
