import { gql } from '@apollo/client'
import { APPOINTMENT_FIELDS } from './appointmentQueries'
import { OPTOMETRIST_FIELDS } from './optometristQueries'
import { NEW_CLIENT_QUESTIONS_FIELDS } from './newClientQueries'
import { VISUAL_NEEDS_FIELDS } from './visualNeedsQueries'
import { PAST_OCULAR_HISTORY_FIELDS } from './pastOcularHistoryQueries'

export const USER_FIELDS = gql`
  fragment UserFields on UserNoPassword {
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

export const GET_USER_LOGIN_DATA = gql`
  ${USER_FIELDS}
  ${APPOINTMENT_FIELDS}
  ${OPTOMETRIST_FIELDS}
  ${NEW_CLIENT_QUESTIONS_FIELDS}
  ${VISUAL_NEEDS_FIELDS}
  ${PAST_OCULAR_HISTORY_FIELDS}
  query GetLoginInfo {
    getLoginInfo {
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
      pastOcularHistory {
        ...PastOcularHistoryFields
      }
    }
  }
`
