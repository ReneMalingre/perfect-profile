import { gql } from '@apollo/client'

export const USER_FRAGMENT = gql`
  fragment UserFields on User {
    id
    username
    contactDetails {
      phone
      email
      address {
        street
        city
        state
        postalCode
        country
      }
    }
    role
    dataFlag
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
