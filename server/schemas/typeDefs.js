const { gql } = require('apollo-server-express')

const typeDefs = gql`
  type NameDetails {
    title: String
    firstName: String
    middleName: String
    lastName: String
    preferredFirstName: String
  }

  type Address {
    street1: String
    street2: String
    city: String
    state: String
    postalCode: String
    country: String
  }

  type ContactDetails {
    phone: String
    address: Address
    email: String
  }

  type User {
    id: ID!
    username: String
    password: String
    nameDetails: NameDetails
    contactDetails: ContactDetails
    dateOfBirth: String
    role: String
    dataFlag: String
    isNewClient: Boolean
  }

  type Lifestyle {
    occupation: String
    screenHoursPerDay: Int
    outdoorActivityFrequency: String
    hobbies: [String]
  }

  type VisitReason {
    reason: String!
  }

  type Symptoms {
    symptom: String!
  }

  type Questionnaire {
    userId: User!
    lifestyle: Lifestyle!
    reasonsForVisit: [String]
    symptoms: [String]
  }
  input NameDetailsInput {
    title: String
    firstName: String
    middleName: String
    lastName: String
    preferredFirstName: String
  }

  input AddressInput {
    street1: String
    city: String
    state: String
    postalCode: String
    country: String
  }

  input ContactDetailsInput {
    phone: String
    email: String
    address: AddressInput
  }

  input UpdateUserInput {
    username: String
    nameDetails: NameDetailsInput
    contactDetails: ContactDetailsInput
    dateOfBirth: String
  }

  input LifestyleInput {
    occupation: String
    screenHoursPerDay: Int
    outdoorActivityFrequency: String
    hobbies: [String]
  }

  type Auth {
    token: ID!
  }

  type Query {
    users: [User]
    getUserByEmail(email: String!): User
    getUserById(id: ID!): User
    getCurrentUser: User
    getQuestionnaire(userId: ID!): Questionnaire
  }
  type AddUserResponse {
    token: ID!
    user: User
  }

  type LoginResponse {
    token: ID!
    user: User
  }

  type Mutation {
    addUser(
      username: String!
      email: String!
      password: String!
    ): AddUserResponse
    updateUser(id: ID!, input: UpdateUserInput!): User
    login(email: String!, password: String!): LoginResponse
    removeUser(id: ID!): User
    createQuestionnaire(userId: ID!, lifestyle: LifestyleInput): Questionnaire!
    updateQuestionnaire(id: ID!, lifestyle: LifestyleInput): Questionnaire!
  }
`

module.exports = typeDefs
