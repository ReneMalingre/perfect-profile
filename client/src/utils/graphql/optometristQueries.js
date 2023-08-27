import { gql } from '@apollo/client'

export const OPTOMETRIST_FIELDS = gql`
  fragment OptometristFields on Optometrist {
    id
    title
    firstName
    lastName
    qualifications
    bio
    imageURL
  }
`

export const GET_OPTOMETRISTS = gql`
  ${OPTOMETRIST_FIELDS}
  query {
    getOptometrists {
      ...OptometristFields
    }
  }
`

export const GET_OPTOMETRIST = gql`
  ${OPTOMETRIST_FIELDS}
  query GetOptometrist($id: ID!) {
    getOptometrist(id: $id) {
      ...OptometristFields
    }
  }
`
