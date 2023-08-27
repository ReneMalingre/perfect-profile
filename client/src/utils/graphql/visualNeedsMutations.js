import { gql } from '@apollo/client'
import { VISUAL_NEEDS_FIELDS } from './visualNeedsQueries'

export const UPSERT_VISUAL_NEEDS = gql`
  ${VISUAL_NEEDS_FIELDS}
  mutation UpsertVisualNeeds($userId: ID!, $input: UpsertVisualNeedsInput!) {
    upsertVisualNeeds(userId: $userId, input: $input) {
      ...VisualNeedsFields
    }
  }
`
