import { gql } from '@apollo/client'

export const QUESTIONNAIRE_FRAGMENT = gql`
  fragment QuestionnaireFields on Questionnaire {
    userId
    lifestyle {
      occupation
      screenHoursPerDay
      outdoorActivityFrequency
      hobbies
    }
    reasonsForVisit
    symptoms
  }
`
