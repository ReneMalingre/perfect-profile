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
  ${USER_FRAGMENT}
  mutation UpdateUser($id: ID!, $input: UpdateUserInput!) {
    updateUser(id: $id, input: $input) {
      ...UserFields
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
