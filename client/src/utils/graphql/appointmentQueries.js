import { gql } from '@apollo/client'

export const APPOINTMENT_FIELDS = gql`
  fragment AppointmentFields on Appointment {
    id
    userId
    appointmentDate
    appointmentTime
    location
    locationAddress
    optometristId
  }
`
export const GET_APPOINTMENTS = gql`
  ${APPOINTMENT_FIELDS}
  query GetAppointmentsByUser($userId: ID!) {
    appointmentsByUser(userId: $userId) {
      ...AppointmentFields
    }
  }
`

export const GET_NEXT_APPOINTMENT = gql`
  ${APPOINTMENT_FIELDS}
  query GetNextAppointment($userId: ID!) {
    nextAppointment(userId: $userId) {
      ...AppointmentFields
    }
  }
`
