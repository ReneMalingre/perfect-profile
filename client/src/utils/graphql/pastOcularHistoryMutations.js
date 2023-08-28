import { gql } from '@apollo/client'
import { PAST_OCULAR_HISTORY_FIELDS } from './pastOcularHistoryQueries'

export const UPSERT_PAST_OCULAR_HISTORY = gql`
  ${PAST_OCULAR_HISTORY_FIELDS}
  mutation UpsertPastOcularHistory(
    $userId: ID!
    $input: UpsertPastOcularHistory!
  ) {
    upsertPastOcularHistory(userId: $userId, input: $input) {
      ...PastOcularHistoryFields
    }
  }
`
