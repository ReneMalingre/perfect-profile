import { gql } from '@apollo/client'
import { USER_FRAGMENT } from './userQueries'
// import { QUESTIONNAIRE_FRAGMENT } from './questionnaireQueries'

export const LOGIN_USER = gql`
  ${USER_FRAGMENT}
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        ...UserFields
      }
    }
  }
`

export const UPDATE_USER = gql`
  mutation UpdateUser($id: ID!, $input: UserInput!) {
    updateUser(id: $id, input: $input) {
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
  }
`

export const ADD_USER = gql`
  ${USER_FRAGMENT}
  mutation addUser($username: String!, $email: String!, $password: String!) {
    addUser(username: $username, email: $email, password: $password) {
      token
      user {
        ...UserFields
      }
    }
  }
`

export const REMOVE_USER = gql`
  ${USER_FRAGMENT}
  mutation removeUser($id: ID!) {
    removeUser(id: $id) {
      ...UserFields
    }
  }
`
