const { gql } = require('apollo-server-express')

const typeDefs = gql`
  type Address {
    street: String
    street2: String
    city: String
    state: String
    postalCode: String
    country: String
  }
  type ContactDetails {
    phone: String!
    address: Address
    email: String!
  }
  type User {
    id: ID!
    username: String!
    password: String!
    contactDetails: ContactDetails
    role: String!
    dataFlag: String!
  }

  input AddressInput {
    street: String
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
    contactDetails: ContactDetailsInput
  }

  type Auth {
    token: ID!
    user: User
  }

  type Query {
    users: [User]
    getUserByEmail(email: String!): User
    getUserById(id: ID!): User
  }

  type Mutation {
    addUser(username: String!, email: String!, password: String!): Auth
    updateUser(id: ID!, input: UpdateUserInput!): User
    login(email: String!, password: String!): Auth
    removeUser(id: ID!): User
  }
`

module.exports = typeDefs
