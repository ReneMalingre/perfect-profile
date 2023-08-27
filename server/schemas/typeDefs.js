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

  type HealthProfessional {
    gp: String
    gpAddress: String
    ophthalmologist: String
    ophthalmologistAddress: String
    otherHealthProfessionals: String
  }

  type User {
    id: ID!
    username: String!
    password: String!
    nameDetails: NameDetails
    contactDetails: ContactDetails
    healthProfessionals: HealthProfessional
    dateOfBirth: String
    healthFund: String
    role: String
    dataFlag: String
    isNewClient: Boolean
    createdAt: String
    updatedAt: String
  }

  type UserNoPassword {
    id: ID!
    username: String!
    nameDetails: NameDetails
    contactDetails: ContactDetails
    healthProfessionals: HealthProfessional
    dateOfBirth: String
    healthFund: String
    role: String
    dataFlag: String
    isNewClient: Boolean
    createdAt: String
    updatedAt: String
  }

  type Lifestyle {
    occupation: String
    screenHoursPerDay: Int
    outdoorActivityFrequency: String
    hobbies: [String]
  }

  type Appointment {
    id: ID!
    userId: ID!
    appointmentDate: String!
    appointmentTime: String!
    location: String!
    locationAddress: String!
    optometristId: ID!
  }

  type VisitReason {
    id: ID!
    appointmentId: ID!
    reason: String!
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
    street2: String
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

  input HealthProfessionalInput {
    gp: String
    gpAddress: String
    ophthalmologist: String
    ophthalmologistAddress: String
    otherHealthProfessionals: String
  }

  input LifestyleInput {
    occupation: String
    screenHoursPerDay: Int
    outdoorActivityFrequency: String
    hobbies: [String]
  }

  input UserInput {
    id: ID!
    username: String
    nameDetails: NameDetailsInput
    contactDetails: ContactDetailsInput
    healthProfessionals: HealthProfessionalInput
    dateOfBirth: String
    healthFund: String
    role: String
    dataFlag: String
    isNewClient: Boolean
  }

  input UsernameInput {
    id: ID!
    username: String!
  }

  input AppointmentInput {
    id: ID!
    userId: ID!
    appointmentDate: String!
    appointmentTime: String!
    location: String
    locationAddress: String
    optometristId: ID!
  }

  input VisitReasonInput {
    id: ID
    reason: String!
    appointmentId: ID
  }

  type Auth {
    token: ID!
  }

  type AddUserResponse {
    token: ID!
    user: User
  }

  type LoginResponse {
    token: ID!
    user: UserNoPassword
    appointment: Appointment
    visitReasons: [VisitReason]
    optometrist: Optometrist
    newClientQuestions: NewClientQuestions
    visualNeeds: VisualNeeds
    pastOcularHistory: PastOcularHistory
  }

  type MessageResponse {
    success: Boolean!
    message: String!
  }

  type Optometrist {
    id: ID!
    title: String
    firstName: String!
    lastName: String!
    qualifications: String
    bio: String
    imageURL: String
  }

  input OptometristInput {
    title: String
    firstName: String!
    lastName: String!
    qualifications: String
    bio: String
    imageURL: String
  }

  type NewClientQuestions {
    id: ID!
    userId: ID!
    reasonForChoosing: String!
    otherReasonForChoosing: String!
    whoToThank: String!
    firstEyeExam: Boolean!
    timeSinceLastExam: String!
    spectacleWearer: Boolean!
    contactLensWearer: Boolean!
    spectacleTypes: String!
    contactLensTypes: String!
    contactLensSchedule: String!
    spectacleDesire: String!
    contactLensDesire: String!
    generalInfo: String!
  }

  input NewClientQuestionsInput {
    id: ID!
    userId: ID!
    reasonForChoosing: String
    otherReasonForChoosing: String
    whoToThank: String
    firstEyeExam: Boolean
    timeSinceLastExam: String
    spectacleWearer: Boolean
    contactLensWearer: Boolean
    spectacleTypes: String
    contactLensTypes: String
    contactLensSchedule: String
    spectacleDesire: String
    contactLensDesire: String
    generalInfo: String
  }

  type VisualNeeds {
    id: ID!
    userId: ID!
    occupation: String
    workEnvironment: String
    workScreenTime: String
    workExtendedNear: String
    workExtendedDistance: String
    workEyeSafety: String
    workOtherNeeds: String
    lifeScreenTime: String
    lifeReadingTime: String
    lifeOtherNear: String
    lifeDrivingTime: String
    lifeExerciseTime: String
    lifeExerciseTypes: String
    lifeOtherDistance: String
    generalInfo: String
  }

  input UpsertVisualNeedsInput {
    id: ID!
    userId: ID!
    occupation: String
    workEnvironment: String
    workScreenTime: String
    workExtendedNear: String
    workExtendedDistance: String
    workEyeSafety: String
    workOtherNeeds: String
    lifeScreenTime: String
    lifeReadingTime: String
    lifeOtherNear: String
    lifeDrivingTime: String
    lifeExerciseTime: String
    lifeExerciseTypes: String
    lifeOtherDistance: String
    generalInfo: String
  }

  type PastOcularHistory {
    id: ID!
    userId: ID!
    myopia: String
    hyperopia: String
    astigmatism: String
    presbyopia: String
    emmetropia: String
    glaucoma: String
    cataracts: String
    macularDegeneration: String
    dryEyes: String
    keratoconus: String
    diabeticRetinopathy: String
    retinalDetachment: String
    strabismus: String
    generalInfo: String
  }

  input UpsertPastOcularHistory {
    id: ID!
    userId: ID!
    myopia: String
    hyperopia: String
    astigmatism: String
    presbyopia: String
    emmetropia: String
    glaucoma: String
    cataracts: String
    macularDegeneration: String
    dryEyes: String
    keratoconus: String
    diabeticRetinopathy: String
    retinalDetachment: String
    strabismus: String
    generalInfo: String
  }

  type Query {
    allUsers: [User!]!
    getUserByEmail(email: String!): User
    getUserById(id: ID!): User
    getCurrentUser: User
    visitReasonsByAppointment(appointmentId: ID!): [VisitReason]!
    appointmentsByUser(userId: ID!): [Appointment]!
    nextAppointment(userId: ID!): Appointment
    getOptometrists: [Optometrist]
    getOptometrist(id: ID!): Optometrist
    getNewClientQuestionsByUserId(userId: ID!): NewClientQuestions
    getVisualNeedsByUserId(userId: ID!): VisualNeeds
    getPastOcularHistoryByUserId(userId: ID!): PastOcularHistory
    getLoginInfo: LoginResponse
  }

  type Mutation {
    addUser(
      username: String!
      email: String!
      password: String!
    ): AddUserResponse
    createUser(user: UserInput!): User!
    updateUser(input: UserInput!): UserNoPassword!
    deleteUser(id: ID!): MessageResponse!
    login(email: String!, password: String!): LoginResponse

    updateUsername(input: UsernameInput!): User!

    addVisitReason(appointmentId: ID!, reason: String!): VisitReason!
    updateVisitReason(input: VisitReasonInput!): VisitReason!
    deleteVisitReason(id: ID!): MessageResponse!
    updateVisitReasons(
      appointmentId: ID!
      visitReasons: [VisitReasonInput]!
      deletedReasonIds: [ID]
    ): [VisitReason]

    addAppointment(
      userId: ID!
      appointmentDate: String!
      appointmentTime: String!
      location: String!
      locationAddress: String!
      optometristId: ID!
    ): Appointment!
    updateAppointment(input: AppointmentInput!): Appointment!
    deleteAppointment(id: ID!): MessageResponse!

    addOptometrist(input: OptometristInput!): Optometrist
    updateOptometrist(id: ID!, input: OptometristInput!): Optometrist
    deleteOptometrist(id: ID!): MessageResponse!

    addNewClientQuestions(input: NewClientQuestionsInput!): NewClientQuestions!
    updateNewClientQuestionsByUserId(
      userId: ID!
      input: NewClientQuestionsInput!
    ): NewClientQuestions!
    deleteNewClientQuestionsByUserId(userId: ID!): MessageResponse!

    upsertVisualNeeds(userId: ID!, input: UpsertVisualNeedsInput!): VisualNeeds!
    upsertPastOcularHistory(
      userId: ID!
      input: UpsertPastOcularHistory!
    ): PastOcularHistory!
  }
`

module.exports = typeDefs
