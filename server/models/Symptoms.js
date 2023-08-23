const mongoose = require('mongoose')
const { Schema, model } = mongoose

const symptomsSchema = new Schema({
  symptom: {
    type: [String], // This allows for storing multiple symptoms as an array.
    enum: ['Blurry Vision', 'Eye Strain', 'Dry Eyes', 'Others'],
  },
  customSymptom: String,
})

const Symptoms = model('Symptoms', symptomsSchema)

module.exports = Symptoms
