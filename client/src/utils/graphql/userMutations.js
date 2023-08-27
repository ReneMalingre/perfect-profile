import { gql } from '@apollo/client'
import { USER_FIELDS } from './userQueries'
import { APPOINTMENT_FIELDS } from './appointmentQueries'
import { OPTOMETRIST_FIELDS } from './optometristQueries'
import { NEW_CLIENT_QUESTIONS_FIELDS } from './newClientQueries'
import { VISUAL_NEEDS_FIELDS } from './visualNeedsQueries'
// ${APPOINTMENT_FIELDS}
// ${OPTOMETRIST_FIELDS}
// appointment {
//   ...AppointmentFields
// }

export const LOGIN_USER = gql`
  ${USER_FIELDS}
  ${APPOINTMENT_FIELDS}
  ${OPTOMETRIST_FIELDS}
  ${NEW_CLIENT_QUESTIONS_FIELDS}
  ${VISUAL_NEEDS_FIELDS}
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        ...UserFields
      }
      appointment {
        ...AppointmentFields
      }
      visitReasons {
        id
        appointmentId
        reason
      }
      optometrist {
        ...OptometristFields
      }
      newClientQuestions {
        ...NewClientQuestionsFields
      }
      visualNeeds {
        ...VisualNeedsFields
      }
    }
  }
`

// CREATE USER
export const CREATE_USER = gql`
  mutation CreateUser($input: UserInput!) {
    createUser(input: $input) {
      ...UserFields
    }
  }
  ${USER_FIELDS}
`

// DELETE USER
export const DELETE_USER = gql`
  mutation DeleteUser($id: ID!) {
    deleteUser(id: $id) {
      success
      message
    }
  }
`
// UPDATE USER
export const UPDATE_USER = gql`
  ${USER_FIELDS}
  mutation UpdateUser($input: UserInput!) {
    updateUser(input: $input) {
      ...UserFields
    }
  }
`
export const UPDATE_USERNAME = gql`
  mutation UpdateUsername($input: UsernameInput!) {
    updateUsername(input: $input) {
      id
      username
    }
  }
`
