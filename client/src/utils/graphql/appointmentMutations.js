import { gql } from '@apollo/client'
import { APPOINTMENT_FIELDS } from './appointmentQueries'

export const ADD_APPOINTMENT = gql`
  ${APPOINTMENT_FIELDS}
  mutation AddAppointment($input: AppointmentInput!) {
    addAppointment(input: $input) {
      ...AppointmentFields
    }
  }
`

export const UPDATE_APPOINTMENT = gql`
  mutation UpdateAppointment($id: ID!, $input: AppointmentInput!) {
    ${APPOINTMENT_FIELDS}
    updateAppointment(id: $id, input: $input) {
      ...AppointmentFields
    }
  }
`

export const DELETE_APPOINTMENT = gql`
  mutation DeleteAppointment($id: ID!) {
    deleteAppointment(id: $id) {
      success
      message
    }
  }
`
