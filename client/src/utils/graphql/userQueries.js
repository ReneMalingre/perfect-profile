import { gql } from '@apollo/client'

export const USER_FIELDS = gql`
  fragment UserFields on User {
    id
    username
    nameDetails {
      title
      firstName
      middleName
      lastName
      preferredFirstName
    }
    contactDetails {
      phone
      address {
        street1
        street2
        city
        state
        postalCode
        country
      }
      email
    }
    healthProfessionals {
      gp
      gpAddress
      ophthalmologist
      ophthalmologistAddress
      otherHealthProfessionals
    }
    dateOfBirth
    healthFund
    role
    dataFlag
    isNewClient
  }
`

export const GET_USER_BY_ID = gql`
  ${USER_FIELDS}

  query GetUserById($id: ID!) {
    getUserById(id: $id) {
      ...UserFields
    }
  }
`
export const GET_ALL_USERS = gql`
  query AllUsers {
    allUsers {
      ...UserFields
    }
  }
  ${USER_FIELDS}
`

export const GET_USER_BY_EMAIL = gql`
  ${USER_FIELDS}

  query GetUserByEmail($email: String!) {
    getUserByEmail(email: $email) {
      ...UserFields
    }
  }
`
