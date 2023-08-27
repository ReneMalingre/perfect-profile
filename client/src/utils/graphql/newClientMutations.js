import { gql } from '@apollo/client'
import { NEW_CLIENT_QUESTIONS_FIELDS } from './newClientQueries'

export const ADD_NEW_CLIENT_QUESTIONS = gql`
  mutation AddNewClientQuestions($input: NewClientQuestionsInput!) {
    addNewClientQuestions(input: $input) {
      ...NewClientQuestionsFields
    }
  }
  ${NEW_CLIENT_QUESTIONS_FIELDS}
`
export const UPDATE_NEW_CLIENT_QUESTIONS_BY_USER_ID = gql`
  mutation UpdateNewClientQuestionsByUserId(
    $userId: ID!
    $input: NewClientQuestionsInput!
  ) {
    updateNewClientQuestionsByUserId(userId: $userId, input: $input) {
      ...NewClientQuestionsFields
    }
  }
  ${NEW_CLIENT_QUESTIONS_FIELDS}
`
export const DELETE_NEW_CLIENT_QUESTIONS = gql`
  mutation DeleteNewClientQuestions($userId: ID!) {
    deleteNewClientQuestions(userId: $userId) {
      success
      message
    }
  }
  ${NEW_CLIENT_QUESTIONS_FIELDS}
`
