import React from 'react'
import { useQuery } from '@apollo/client'
import { GET_USER, GET_USER_BY_EMAIL } from '../utils/graphql/userQueries'

const SomeComponent = () => {
  // Example using GET_USER
  const { data, loading, error } = useQuery(GET_USER, {
    variables: { id: 'someUserId' },
  })

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error: {error.message}</p>

  return <div>{data.getUser.username}</div>
}

const AnotherComponent = () => {
  // Example using GET_USER_BY_EMAIL
  const { data, loading, error } = useQuery(GET_USER_BY_EMAIL, {
    variables: { email: 'example@example.com' },
  })

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error: {error.message}</p>

  return <div>{data.getUserByEmail.username}</div>
}

export { SomeComponent, AnotherComponent }
