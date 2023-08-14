import React from 'react'
import { useMutation } from '@apollo/client'
import { UPDATE_USER } from './path_to_userMutations'

const UpdateUserComponent = () => {
  const [updateUser, { data, loading, error }] = useMutation(UPDATE_USER)

  const handleUpdate = () => {
    updateUser({
      variables: {
        id: 'someUserId',
        input: {
          // ... your input data here
        },
      },
    })
  }

  if (loading) return <p>Updating...</p>
  if (error) return <p>Error: {error.message}</p>

  return (
    <div>
      <button onClick={handleUpdate}>Update User</button>
      {data && <div>{data.updateUser.username}</div>}
    </div>
  )
}

export default UpdateUserComponent
