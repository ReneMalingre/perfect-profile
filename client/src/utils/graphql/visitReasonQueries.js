import { gql } from '@apollo/client'

export const GET_VISIT_REASONS = gql`
  query {
    visitReasons {
      id
      appointmentId
      reason
    }
  }
`
