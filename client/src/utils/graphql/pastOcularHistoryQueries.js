import { gql } from '@apollo/client'

export const PAST_OCULAR_HISTORY_FIELDS = gql`
  fragment PastOcularHistoryFields on PastOcularHistory {
    id
    userId
    myopia
    hyperopia
    astigmatism
    presbyopia
    emmetropia
    glaucoma
    cataracts
    macularDegeneration
    dryEyes
    keratoconus
    diabeticRetinopathy
    retinalDetachment
    strabismus
    generalInfo
  }
`
export const GET_PAST_OCULAR_HISTORY_BY_USER_ID = gql`
  query GetPastOcularHistoryByUserId($userId: ID!) {
    getPastOcularHistoryByUserId(userId: $userId) {
      ...PastOcularHistoryFields
    }
  }
  ${PAST_OCULAR_HISTORY_FIELDS}
`
