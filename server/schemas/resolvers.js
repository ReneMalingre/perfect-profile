const { AuthenticationError } = require('apollo-server-express')
const { User } = require('../models')
const { signToken } = require('../utils/auth')
const { GraphQLDate } = require('graphql-scalars')

const resolvers = {
  Date: GraphQLDate,
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

      const user = await User.create({ username, email, password })
      const token = signToken(user)
      return { token, user }
    },
    login: async (parent, { email, password }) => {
      if (!email || !password) {
        throw new AuthenticationError(
          'You need to provide a valid email address and password'
        )
      }
      email = email.trim().toLowerCase()

      const user = await User.findOne({ email })

      if (!user) {
        throw new AuthenticationError('No user found with this email address')
      }

      const correctPw = await user.isCorrectPassword(password)

      if (!correctPw) {
        throw new AuthenticationError('Incorrect credentials')
      }

      const token = signToken(user)

      return { token, user }
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
  },
}

module.exports = resolvers
