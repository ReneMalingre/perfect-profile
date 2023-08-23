const { AuthenticationError } = require('apollo-server-express')
const {
  User,
  Lifestyle,
  Symptoms,
  VisitReason,
  Questionnaire,
} = require('../models')
const { signToken } = require('../utils/auth')

const resolvers = {
  Query: {
    users: async (parent, args, context) => {
      if (context.user) {
        return User.find()
      }
      throw new AuthenticationError('Not logged in')
    },
    getUserByEmail: async (parent, { email }, context) => {
      if (!email) {
        throw new AuthenticationError(
          'You need to provide a valid email address'
        )
      }
      email = email.trim().toLowerCase()
      if (context.user) {
        return User.findOne({ 'contactDetails.email': email })
      }
      throw new AuthenticationError('Not logged in')
    },
    getUserById: async (parent, { id }, context) => {
      if (context.user) {
        if (!id) {
          throw new AuthenticationError('You need to provide a valid id')
        }
        return await User.findById(id)
      }
      throw new AuthenticationError('Not logged in')
    },
    getCurrentUser: async (parent, args, context) => {
      if (context.user) {
        return User.findById({ _id: context.user._id })
      }
      throw new AuthenticationError('Not logged in')
    },
    getQuestionnaire: async (_, { userId }) => {
      return await Questionnaire.findOne({ userId })
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
      const token = signToken(
        user.contactDetails.email,
        user.username,
        user._id
      )
      return { token, user }
    },
    login: async (parent, { email, password }) => {
      console.log('login', email, password)
      if (!email || !password) {
        throw new AuthenticationError(
          'You need to provide a valid email address and password'
        )
      }
      email = email.trim().toLowerCase()

      const userData = await User.findOne({ 'contactDetails.email': email })

      if (!userData) {
        throw new AuthenticationError('No user found with this email address')
      }

      const correctPw = await userData.isCorrectPassword(password)

      if (!correctPw) {
        throw new AuthenticationError('Incorrect credentials')
      }

      const token = signToken(
        userData.contactDetails.email,
        userData.username,
        userData._id
      )
      // const userQuestionnaire = await Questionnaire.findOne({
      //   userId: userData._id,
      // })

      console.log('userData', userData)
      return {
        token, // contains username and _id
        user: userData,
        // questionnaireData: userQuestionnaire ? userQuestionnaire.data : null,
      }
    },
    updateUser: async (parent, { id, input }, context) => {
      if (context.user) {
        if (!id) {
          throw new AuthenticationError('You need to provide a valid id')
        }
        if (!input) {
          throw new AuthenticationError('You need to provide valid input')
        }
        return await User.findByIdAndUpdate(id, input, { new: true })
      }
      throw new AuthenticationError('Not logged in')
    },
    removeUser: async (parent, { id }, context) => {
      if (!id) {
        throw new AuthenticationError('You need to provide a valid id')
      }
      if (context.user) {
        return await User.findOneAndDelete({ _id: id })
      }
      throw new AuthenticationError('Not logged in')
    },
    createQuestionnaire: async (_, { userId, lifestyle }) => {
      const user = await User.findById(userId)
      if (!user) {
        throw new Error('User not found!')
      }

      const newLifestyle = new Lifestyle(lifestyle)
      await newLifestyle.save()
      const newSymptoms = new Symptoms()
      await newSymptoms.save()
      const newVisitReason = new VisitReason()
      await newVisitReason.save()

      const questionnaire = new Questionnaire({
        userId: user._id,
        lifestyle: newLifestyle._id,
        symptoms: newSymptoms._id,
        reasonsForVisit: newVisitReason._id,
      })
      return await questionnaire.save()
    },
    updateQuestionnaire: async (
      _,
      { id, lifestyle, symptoms, reasonsForVisit }
    ) => {
      const questionnaire = await Questionnaire.findById(id)
      if (!questionnaire) {
        throw new Error('Questionnaire not found!')
      }

      if (lifestyle) {
        await Lifestyle.findByIdAndUpdate(questionnaire.lifestyle, lifestyle)
      }
      if (symptoms) {
        await Symptoms.findByIdAndUpdate(questionnaire.symptoms, symptoms)
      }
      if (reasonsForVisit) {
        await VisitReason.findByIdAndUpdate(
          questionnaire.reasonsForVisit,
          reasonsForVisit
        )
      }

      return questionnaire // You might want to return the updated document here
    },
  },
}

module.exports = resolvers
