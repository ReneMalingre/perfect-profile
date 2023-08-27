const { AuthenticationError } = require('apollo-server-express')
const {
  User,
  VisitReason,
  Appointment,
  Optometrist,
  NewClientQuestions,
  VisualNeeds,
  PastOcularHistory,
} = require('../models')
const { signToken } = require('../utils/auth')

const resolvers = {
  Query: {
    allUsers: async (parent, args, context) => {
      if (!context.user) {
        throw new Error('You must be authenticated to perform this action.')
      }
      try {
        return await User.find()
      } catch (error) {
        throw new Error(`Failed to fetch users. Error: ${error.message}`)
      }
    },
    getUserByEmail: async (parent, { email }, context) => {
      if (!email) {
        throw new AuthenticationError(
          'You need to provide a valid email address'
        )
      }
      email = email.trim().toLowerCase()
      if (context.user) {
        try {
          return User.findOne({ 'contactDetails.email': email })
        } catch (error) {
          throw new Error(`Failed to fetch user. Error: ${error.message}`)
        }
      }
      throw new AuthenticationError('Not logged in')
    },
    getUserById: async (parent, { id }, context) => {
      if (context.user) {
        if (!id) {
          throw new AuthenticationError('You need to provide a valid id')
        }
        try {
          return await User.findById(id)
        } catch (error) {
          throw new Error(`Failed to fetch user. Error: ${error.message}`)
        }
      }
      throw new AuthenticationError('Not logged in')
    },
    getCurrentUser: async (parent, args, context) => {
      if (context.user) {
        try {
          return await User.findById({ _id: context.user._id })
        } catch (error) {
          throw new Error(`Failed to fetch user. Error: ${error.message}`)
        }
      }
      throw new AuthenticationError('Not logged in')
    },

    // Appointment Queries
    appointmentsByUser: async (_, { userId }) => {
      try {
        return await Appointment.find({ userId })
      } catch (error) {
        throw new Error(
          `Failed to fetch appointments for user. Error: ${error.message}`
        )
      }
    },
    nextAppointment: async (_, { userId }) => {
      const today = new Date()
      const currentTime = `${today.getHours() - 1}:${String(
        today.getMinutes()
      ).padStart(2, '0')}` // get current time less one hour in HH:mm format

      try {
        const doc = await Appointment.findOne({
          userId,
          $or: [
            {
              appointmentDate: { $gt: today },
            },
            {
              appointmentDate: { $eq: today },
              appointmentTime: { $gte: currentTime },
            },
          ],
        }).sort({ appointmentDate: 1, appointmentTime: 1 }) // sort by date, then by time
        // convert appointmentDate to ISO string
        const obj = doc.toObject()
        obj.appointmentDate = obj.appointmentDate.toISOString().split('T')[0]
      } catch (error) {
        throw new Error(
          `Failed to fetch next appointment. Error: ${error.message}`
        )
      }
    },

    // VisitReason Queries
    visitReasonsByAppointment: async (_, { appointmentId }) => {
      try {
        return await VisitReason.find({ appointmentId })
      } catch (error) {
        throw new Error(
          `Failed to fetch visit reasons for appointment. Error: ${error.message}`
        )
      }
    },

    // Optometrist Queries
    getOptometrists: async () => {
      try {
        return await Optometrist.find()
      } catch (error) {
        throw new Error(`Failed to fetch optometrists. Error: ${error.message}`)
      }
    },
    getOptometrist: async (_, { id }) => {
      try {
        return await Optometrist.findById(id)
      } catch (error) {
        throw new Error(
          `Failed to fetch optometrist with ID: ${id}. Error: ${error.message}`
        )
      }
    },
    getNewClientQuestionsByUserId: async (_, { userId }) => {
      try {
        let clientQuestions = await NewClientQuestions.findOne({ userId })
        if (!clientQuestions) {
          clientQuestions = new NewClientQuestions({ userId })
          await clientQuestions.save()
        }
        return clientQuestions
      } catch (error) {
        throw new Error(error.message)
      }
    },
    getVisualNeedsByUserId: async (_, { userId }) => {
      try {
        let visualNeeds = await VisualNeeds.findOne({ userId })
        if (!visualNeeds) {
          visualNeeds = new VisualNeeds({ userId })
          await visualNeeds.save()
        }
        return visualNeeds
      } catch (error) {
        throw new Error(error.message)
      }
    },
    getPastOcularHistoryByUserId: async (_, { userId }) => {
      try {
        let pastOcularHistory = await PastOcularHistory.findOne({ userId })
        if (!pastOcularHistory) {
          pastOcularHistory = new PastOcularHistory({ userId })
          await pastOcularHistory.save()
        }
        return pastOcularHistory
      } catch (error) {
        console.error('Error fetching past ocular history: ', error)
        throw new Error(error.message)
      }
    },
    getLoginInfo: async (parent, args, context) => {
      let userData = null
      // console.log(context)
      if (context.user) {
        console.log('context.user', context.user)
        try {
          userData = await User.findById({ _id: context.user._id })
        } catch (error) {
          throw new Error(`Failed to fetch user. Error: ${error.message}`)
        }
      } else {
        throw new AuthenticationError('Not logged in')
      }
      console.log('userData', userData)
      // recreate the token
      const token = signToken({
        email: userData.contactDetails.email,
        username: userData.username,
        _id: userData._id,
      })

      // now get the next appointment for this user
      let nextAppointment = null
      let visitReasons = []
      let appointmentOptometrist = null
      let newClientQuestions = null
      let visualNeeds = null
      let pastOcularHistory = null

      const today = new Date()
      const currentTime = `${today.getHours() - 1}:${String(
        today.getMinutes()
      ).padStart(2, '0')}` // get current time less one hour in HH:mm format

      try {
        console.log('fetching next appointment')
        console.log('userId', userData._id)
        const doc = await Appointment.findOne({
          userId: userData._id,
          $or: [
            {
              appointmentDate: { $gt: today },
            },
            {
              appointmentDate: { $eq: today },
              appointmentTime: { $gte: currentTime },
            },
          ],
        }).sort({ appointmentDate: 1, appointmentTime: 1 }) // sort by date, then by time
        if (doc) {
          // convert appointmentDate to ISO string
          nextAppointment = doc.toObject()
          nextAppointment.appointmentDate = doc.appointmentDate
            .toISOString()
            .split('T')[0]
        }
        console.log('next appointment', nextAppointment)
        if (nextAppointment) {
          try {
            appointmentOptometrist = await Optometrist.findById(
              nextAppointment.optometristId
            )
          } catch (error) {
            console.log('error fetching appointment optometrist', error)
          }
          try {
            visitReasons = await VisitReason.find({
              appointmentId: nextAppointment._id,
            })
          } catch (error) {
            console.log('error fetching visit reasons', error)
          }
        }
      } catch (error) {
        console.log('error fetching next appointment', error)
      }

      if (userData.isNewClient) {
        console.log(userData._id)

        try {
          // this will create one if it doesn't exist
          newClientQuestions = await NewClientQuestions.findOneAndUpdate(
            {
              userId: userData._id,
            },
            {},
            {
              upsert: true,
              new: true,
              setDefaultsOnInsert: true,
            }
          )
        } catch (error) {
          console.log('error fetching new client questions', error)
        }
      }

      try {
        // this is an upsert, so it will create a new record if one doesn't exist
        visualNeeds = await VisualNeeds.findOneAndUpdate(
          {
            userId: userData._id,
          },
          {},
          {
            upsert: true,
            new: true,
            setDefaultsOnInsert: true,
          }
        )
      } catch (error) {
        console.log('error fetching visual needs', error)
      }
      try {
        // this is an upsert, so it will create a new record if one doesn't exist
        pastOcularHistory = await PastOcularHistory.findOneAndUpdate(
          {
            userId: userData._id,
          },
          {},
          {
            upsert: true,
            new: true,
            setDefaultsOnInsert: true,
          }
        )
      } catch (error) {
        console.log('error fetching past ocular history', error)
      }

      return {
        token, // contains username and _id
        user: userData,
        appointment: nextAppointment || null,
        visitReasons: visitReasons || [],
        optometrist: appointmentOptometrist || null,
        newClientQuestions: newClientQuestions || null,
        visualNeeds: visualNeeds || null,
        pastOcularHistory: pastOcularHistory || null,
      }
    },
  },

  Mutation: {
    addUser: async (parent, { username, email, password }) => {
      // do validation and ensure email is lowercase
      if (!email || !password) {
        throw new AuthenticationError(
          'You need to provide a valid email address and password'
        )
      }
      email = email.trim().toLowerCase()

      const user = await User.create({
        username,
        'contactDetails.email': email,
        password,
      })
      const token = signToken({
        email: user.contactDetails.email,
        username: user.username,
        _id: user._id,
      })
      return { token, user }
    },
    createUser: async (_, { input }, context) => {
      if (!context.user) {
        throw new Error('You must be authenticated to perform this action.')
      }
      try {
        if (!input.username || !input.password) {
          throw new Error('Username and password are required fields.')
        }
        const newUser = new User(input)
        return await newUser.save()
      } catch (error) {
        throw new Error(`Failed to create user. Error: ${error.message}`)
      }
    },

    deleteUser: async (_, { id }, context) => {
      if (!context.user) {
        throw new Error('You must be authenticated to perform this action.')
      }
      try {
        const user = await User.findById(id)
        if (!user) {
          return {
            success: false,
            message: `No user found with ID: ${id}`,
          }
        }
        await user.remove()
        return {
          success: true,
          message: 'User deleted successfully',
        }
      } catch (error) {
        return {
          success: false,
          message: `Failed to delete user with ID: ${id}. Error: ${error.message}`,
        }
      }
    },
    updateUsername: async (_, { input: { id, username } }) => {
      console.log('updateUsername', id, username)

      const user = await User.findByIdAndUpdate(id, { username }, { new: true })

      if (!user) {
        throw new Error(`Failed to update user with ID: ${id}`)
      }
      console.log('updated user', user)

      return user
    },
    updateUser: async (_, { input }, context) => {
      if (!context.user) {
        throw new Error('You must be authenticated to perform this action.')
      }
      // destructure the input to get the id and the rest of the fields for the variables
      const { id, ...updateFields } = input

      try {
        if (!updateFields.username) {
          throw new Error('No valid fields to update provided.')
        }
        return await User.findByIdAndUpdate(id, updateFields, { new: true })
      } catch (error) {
        throw new Error(
          `Failed to update user with ID: ${id}. Error: ${error.message}`
        )
      }
    },
    login: async (parent, { email, password }) => {
      console.log('login', email, password)
      if (!email || !password) {
        throw new AuthenticationError(
          'You need to provide a valid email address and password'
        )
      }
      email = email.trim().toLowerCase()
      try {
        const userData = await User.findOne({ 'contactDetails.email': email })
        if (!userData) {
          throw new AuthenticationError('No user found with this email address')
        }

        const correctPw = await userData.isCorrectPassword(password)

        if (!correctPw) {
          throw new AuthenticationError('Incorrect credentials')
        }

        const token = signToken({
          email: userData.contactDetails.email,
          username: userData.username,
          _id: userData._id,
        })

        // now get the next appointment for this user
        let nextAppointment = null
        let visitReasons = []
        let appointmentOptometrist = null
        let newClientQuestions = null
        let visualNeeds = null
        let pastOcularHistory = null

        const today = new Date()
        const currentTime = `${today.getHours() - 1}:${String(
          today.getMinutes()
        ).padStart(2, '0')}` // get current time less one hour in HH:mm format

        try {
          console.log('fetching next appointment')
          console.log('userId', userData._id)
          const doc = await Appointment.findOne({
            userId: userData._id,
            $or: [
              {
                appointmentDate: { $gt: today },
              },
              {
                appointmentDate: { $eq: today },
                appointmentTime: { $gte: currentTime },
              },
            ],
          }).sort({ appointmentDate: 1, appointmentTime: 1 }) // sort by date, then by time
          if (doc) {
            // convert appointmentDate to ISO string
            nextAppointment = doc.toObject()
            nextAppointment.appointmentDate = doc.appointmentDate
              .toISOString()
              .split('T')[0]
          }
          console.log('next appointment', nextAppointment)
          if (nextAppointment) {
            try {
              appointmentOptometrist = await Optometrist.findById(
                nextAppointment.optometristId
              )
            } catch (error) {
              console.log('error fetching appointment optometrist', error)
            }
            try {
              visitReasons = await VisitReason.find({
                appointmentId: nextAppointment._id,
              })
            } catch (error) {
              console.log('error fetching visit reasons', error)
            }
          }
        } catch (error) {
          console.log('error fetching next appointment', error)
        }

        if (userData.isNewClient) {
          console.log(userData._id)

          try {
            // this will create one if it doesn't exist
            newClientQuestions = await NewClientQuestions.findOneAndUpdate(
              {
                userId: userData._id,
              },
              {},
              {
                upsert: true,
                new: true,
                setDefaultsOnInsert: true,
              }
            )
          } catch (error) {
            console.log('error fetching new client questions', error)
          }
        }

        try {
          // this is an upsert, so it will create a new record if one doesn't exist
          visualNeeds = await VisualNeeds.findOneAndUpdate(
            {
              userId: userData._id,
            },
            {},
            {
              upsert: true,
              new: true,
              setDefaultsOnInsert: true,
            }
          )
        } catch (error) {
          console.log('error fetching visual needs', error)
        }
        try {
          // this is an upsert, so it will create a new record if one doesn't exist
          pastOcularHistory = await PastOcularHistory.findOneAndUpdate(
            {
              userId: userData._id,
            },
            {},
            {
              upsert: true,
              new: true,
              setDefaultsOnInsert: true,
            }
          )
        } catch (error) {
          console.log('error fetching past ocular history', error)
        }

        return {
          token, // contains username and _id
          user: userData,
          appointment: nextAppointment || null,
          visitReasons: visitReasons || [],
          optometrist: appointmentOptometrist || null,
          newClientQuestions: newClientQuestions || null,
          visualNeeds: visualNeeds || null,
          pastOcularHistory: pastOcularHistory || null,
        }
      } catch (error) {
        throw new Error(
          `Failed to fetch user during login. Error: ${error.message}`
        )
      }
    },

    // Appointment Mutations
    addAppointment: async (
      _,
      { userId, appointmentDate, appointmentTime, location, optometristId }
    ) => {
      const appointment = new Appointment({
        userId,
        appointmentDate,
        appointmentTime,
        location,
        optometristId,
      })
      await appointment.save()
      return appointment
    },
    updateAppointment: async (_, { input }) => {
      const { id, ...updateFields } = input
      const updatedAppointment = await Appointment.findByIdAndUpdate(
        id,
        updateFields,
        { new: true }
      )
      if (!updatedAppointment) {
        throw new Error('Appointment not found')
      }
      return updatedAppointment
    },
    deleteAppointment: async (_, { id }) => {
      const deletedAppointment = await Appointment.findByIdAndRemove(id)
      if (!deletedAppointment) {
        return {
          success: false,
          message: 'Appointment not found or already deleted.',
        }
      }
      return { success: true, message: 'Appointment successfully deleted.' }
    },

    // VisitReason Mutations
    addVisitReason: async (_, { appointmentId, reason }) => {
      const visitReason = new VisitReason({ appointmentId, reason })
      await visitReason.save()
      return visitReason
    },
    updateVisitReason: async (_, { input }) => {
      const { id, ...updateFields } = input
      const updatedVisitReason = await VisitReason.findByIdAndUpdate(
        id,
        updateFields,
        { new: true }
      )
      if (!updatedVisitReason) {
        throw new Error('VisitReason not found')
      }
      return updatedVisitReason
    },
    deleteVisitReason: async (_, { id }) => {
      const deletedVisitReason = await VisitReason.findByIdAndRemove(id)
      if (!deletedVisitReason) {
        return {
          success: false,
          message: 'VisitReason not found or already deleted.',
        }
      }
      return { success: true, message: 'VisitReason successfully deleted.' }
    },
    // this is a bit complicated because we need to update, insert and delete
    updateVisitReasons: async (
      _,
      { appointmentId, visitReasons, deletedReasonIds }
    ) => {
      try {
        // Separate VisitReasons by those with an ID (existing) and those without (new)
        const existingReasons = visitReasons.filter(
          (r) => r.id && r.id.length > 0
        )
        const newReasons = visitReasons.filter(
          (r) => !r.id || r.id.length === 0
        )

        // Update existing reasons
        const updatePromises = existingReasons.map((reason) =>
          VisitReason.updateOne(
            { _id: reason.id },
            { reason: reason.reason },
            { appointmentId }
          )
        )
        await Promise.all(updatePromises)

        // Insert new reasons
        const insertedReasons = await VisitReason.insertMany(
          newReasons.map((reason) => ({
            appointmentId,
            reason: reason.reason,
          }))
        )

        // Delete reasons based on provided IDs
        console.log('deletedReasonIds', deletedReasonIds)
        await VisitReason.deleteMany({ _id: { $in: deletedReasonIds } })

        return [...existingReasons, ...insertedReasons] // or whatever response structure you prefer
      } catch (error) {
        console.error('Error updating visit reasons:', error)
        throw new Error('Failed to update visit reasons.') // you might want to refine this error message or even break down the try/catch into more specific sections for better error clarity.
      }
    },
    // Optometrist Mutations
    addOptometrist: async (_, { input }) => {
      const optometrist = new Optometrist(input)
      return await optometrist.save()
    },

    updateOptometrist: async (_, { id, input }) => {
      return await Optometrist.findByIdAndUpdate(id, input, { new: true })
    },

    deleteOptometrist: async (_, { id }) => {
      const deletedOptometrist = await Optometrist.findByIdAndDelete(id)
      if (!deletedOptometrist) {
        return {
          success: false,
          message: 'Optometrist not found or already deleted.',
        }
      }
      return {
        success: true,
        message: 'Optometrist successfully deleted.',
      }
    },
    addNewClientQuestions: async (_, { input }) => {
      try {
        // Before saving, it's a good idea to check if there's already a record with the same userId.
        const existingQuestions = await NewClientQuestions.findOne({
          userId: input.userId,
        })
        if (existingQuestions) {
          // update the existing record
          const updatedQuestions = await NewClientQuestions.findOneAndUpdate(
            { userId: input.userId },
            input,
            { new: true }
          )
          if (!updatedQuestions) {
            throw new Error('No questions found for the given user to update.')
          }
          return updatedQuestions
        }
        const newClientQuestions = new NewClientQuestions(input)
        return await newClientQuestions.save()
      } catch (error) {
        throw new Error(
          'Error while adding new client questions: ' + error.message
        )
      }
    },
    updateNewClientQuestionsByUserId: async (_, { userId, input }) => {
      try {
        const updatedQuestions = await NewClientQuestions.findOneAndUpdate(
          { userId },
          input,
          { new: true }
        )
        if (!updatedQuestions) {
          throw new Error('No questions found for the given user to update.')
        }
        return updatedQuestions
      } catch (error) {
        throw new Error(
          'Error while updating client questions: ' + error.message
        )
      }
    },
    deleteNewClientQuestionsByUserId: async (_, { userId }) => {
      try {
        const result = await NewClientQuestions.findOneAndDelete({ userId })
        if (!result) {
          return {
            success: false,
            message: 'NewClientQuestions not found or already deleted.',
          }
        }
        return {
          success: true,
          message: 'NewClientQuestions successfully deleted.',
        }
      } catch (error) {
        return {
          success: false,
          message: `Failed to delete NewClientQuestions with userId: ${userId}. Error: ${error.message}`,
        }
      }
    },
    upsertVisualNeeds: async (_, { userId, input }) => {
      try {
        const updatedVisualNeeds = await VisualNeeds.findOneAndUpdate(
          { userId },
          { ...input },
          { new: true, upsert: true, setDefaultsOnInsert: true }
        )
        return updatedVisualNeeds
      } catch (error) {
        throw new Error(error)
      }
    },
    upsertPastOcularHistory: async (_, { userId, input }) => {
      try {
        const pastOcularHistory = await PastOcularHistory.findOneAndUpdate(
          { userId },
          { ...input },
          {
            new: true, // Return the updated document
            upsert: true, // Create if doesn't exist
            setDefaultsOnInsert: true, // Set default values if not specified
          }
        )
        return pastOcularHistory
      } catch (error) {
        console.error('Error upserting past ocular history: ', error)
        throw new Error(error.message)
      }
    },
  },
}

module.exports = resolvers
