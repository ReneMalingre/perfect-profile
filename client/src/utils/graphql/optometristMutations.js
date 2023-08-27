import { gql } from '@apollo/client'
import { OPTOMETRIST_FIELDS } from './optometristQueries'

export const ADD_OPTOMETRIST = gql`
  ${OPTOMETRIST_FIELDS}
  mutation AddOptometrist($input: OptometristInput!) {
    addOptometrist(input: $input) {
      ...OptometristFields
    }
  }
`

export const UPDATE_OPTOMETRIST = gql`
  ${OPTOMETRIST_FIELDS}
  mutation UpdateOptometrist($id: ID!, $input: OptometristInput!) {
    updateOptometrist(id: $id, input: $input) {
      ...OptometristFields
    }
  }
`

export const DELETE_OPTOMETRIST = gql`
  mutation DeleteOptometrist($id: ID!) {
    deleteOptometrist(id: $id) {
      success
      message
    }
  }
`
