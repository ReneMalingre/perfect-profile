import { gql } from '@apollo/client'

export const VISUAL_NEEDS_FIELDS = gql`
  fragment VisualNeedsFields on VisualNeeds {
    id
    userId
    occupation
    workEnvironment
    workScreenTime
    workExtendedNear
    workExtendedDistance
    workEyeSafety
    workOtherNeeds
    lifeScreenTime
    lifeReadingTime
    lifeOtherNear
    lifeDrivingTime
    lifeExerciseTime
    lifeExerciseTypes
    lifeOtherDistance
    generalInfo
  }
`
export const GET_VISUAL_NEEDS_BY_USER_ID = gql`
  ${VISUAL_NEEDS_FIELDS}
  query GetVisualNeedsByUserId($userId: ID!) {
    getVisualNeedsByUserId(userId: $userId) {
      ...VisualNeedsFields
    }
  }
`
