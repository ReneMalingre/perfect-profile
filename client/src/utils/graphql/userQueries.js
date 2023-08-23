import { gql } from '@apollo/client'

export const USER_FRAGMENT = gql`
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
      email
      address {
        street1
        street2
        city
        state
        postalCode
        country
      }
    }
    dateOfBirth
    role
    dataFlag
    isNewClient
  }
`

export const GET_USER_BY_ID = gql`
  ${USER_FRAGMENT}

  query GetUserById($id: ID!) {
    getUserById(id: $id) {
      ...UserFields
    }
  }
`

export const GET_USER_BY_EMAIL = gql`
  ${USER_FRAGMENT}

  query GetUserByEmail($email: String!) {
    getUserByEmail(email: $email) {
      ...UserFields
    }
  }
`
