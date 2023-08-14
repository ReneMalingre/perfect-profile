import { gql } from '@apollo/client'
import { USER_FRAGMENT } from 'userQueries'

export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      ...UserFields
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
  mutation addUser($username: String!, $email: String!, $password: String!) {
    addUser(username: $username, email: $email, password: $password) {
      token
      ...UserFields
    }
  }
`

export const REMOVE_USER = gql`
  mutation removeUser($id: ID!) {
    removeUser(id: $id) {
      ...UserFields
    }
  }
`
