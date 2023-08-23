const { Schema, model } = require('mongoose')

const lifestyleSchema = new Schema({
  occupation: String,
  screenHoursPerDay: Number,
  outdoorActivityFrequency: String,
  hobbies: [String],
})

const Lifestyle = model('Lifestyle', lifestyleSchema)

module.exports = Lifestyle
