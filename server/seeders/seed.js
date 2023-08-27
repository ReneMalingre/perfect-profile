const db = require('../config/connection')
const { User, Appointment, Optometrist } = require('../models')
const seedData = require('./userSeeds.json')

db.once('open', async () => {
  try {
    // Clear old data
    await User.deleteMany({})
    await Appointment.deleteMany({})
    await Optometrist.deleteMany({})

    // Seed Optometrists
    const optometrists = await Optometrist.insertMany(seedData.optometrists)

    // Seed Users
    const users = await User.insertMany(seedData.users)

    // Seed Appointments
    const appointments = users.flatMap((user, i) => {
      const optometristId = optometrists[i % optometrists.length]._id
      const pastDate = new Date()
      pastDate.setDate(pastDate.getDate() - (i + 1))

      const futureDate = new Date()
      futureDate.setDate(futureDate.getDate() + (i + 1))

      const locations = [
        {
          name: 'Westbourne Park',
          address: '415 Goodwood Road, Westbourne Park, SA 5041, Australia',
        },
        {
          name: 'Mawson Lakes',
          address:
            'Shop 10A, 1-7 Main Street, Mawson Lakes, SA 5095, Australia',
        },
      ]

      const randomLocation1 =
        locations[Math.floor(Math.random() * locations.length)]
      const randomLocation2 =
        locations[Math.floor(Math.random() * locations.length)]

      return [
        {
          userId: user.id,
          appointmentDate: pastDate,
          appointmentTime: '09:00',
          location: randomLocation1.name,
          locationAddress: randomLocation1.address,
          optometristId,
        },
        {
          userId: user.id,
          appointmentDate: futureDate,
          appointmentTime: '10:00',
          location: randomLocation2.name,
          locationAddress: randomLocation2.address,
          optometristId,
        },
      ]
    })
    await Appointment.insertMany(appointments)

    console.log('Seeding completed successfully!')
    process.exit(0)
  } catch (error) {
    console.error(`Seeding failed. Error: ${error.message}`)
    process.exit(1)
  }
})
