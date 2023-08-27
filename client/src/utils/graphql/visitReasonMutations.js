import { gql } from '@apollo/client'

export const UPDATE_VISIT_REASONS = gql`
  mutation UpdateVisitReasons(
    $appointmentId: ID!
    $visitReasons: [VisitReasonInput!]!
    $deletedReasonIds: [ID!]
  ) {
    updateVisitReasons(
      appointmentId: $appointmentId
      visitReasons: $visitReasons
      deletedReasonIds: $deletedReasonIds
    ) {
      id
      appointmentId
      reason
    }
  }
`
