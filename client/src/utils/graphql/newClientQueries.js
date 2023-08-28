import { gql } from '@apollo/client'

export const NEW_CLIENT_QUESTIONS_FIELDS = gql`
  fragment NewClientQuestionsFields on NewClientQuestions {
    id
    userId
    reasonForChoosing
    otherReasonForChoosing
    whoToThank
    firstEyeExam
    timeSinceLastExam
    spectacleWearer
    contactLensWearer
    spectacleTypes
    contactLensTypes
    contactLensSchedule
    spectacleDesire
    contactLensDesire
    generalInfo
  }
`
export const GET_NEW_CLIENT_QUESTIONS_BY_USER = gql`
  query NewClientQuestionsByUser($userId: ID!) {
    getNewClientQuestionsByUserId(userId: $userId) {
      ...NewClientQuestionsFields
    }
  }
  ${NEW_CLIENT_QUESTIONS_FIELDS}
`
