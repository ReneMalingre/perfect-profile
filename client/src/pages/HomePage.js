import React from 'react'
import { useAppState } from '../utils/AppContext'
import { SET_CURRENT_PAGE } from '../utils/actions'
import Auth from '../utils/auth'
import { Box, Button, VStack, Text } from '@chakra-ui/react'

const HomePage = () => {
  // Access state and dispatch from AppContext
  // eslint-disable-next-line
  const { state, dispatch } = useAppState()

  // Get the logged-in user's information
  const loggedInUser = Auth.getProfile()

  const navigateTo = (page) => {
    dispatch({ type: SET_CURRENT_PAGE, payload: page })
  }

  return (
    <Box width="400px" margin="auto" marginTop="100px">
      <VStack spacing={4} textAlign="center">
        {/* Display user information */}
        {loggedInUser ? (
          <Text>Welcome, {loggedInUser.username}!</Text>
        ) : (
          <Text>Not logged in</Text>
        )}

        {/* Navigation buttons */}
        <Button colorScheme="teal" onClick={() => navigateTo('login')}>
          Go to Login
        </Button>
        <Button colorScheme="blue" onClick={() => navigateTo('signup')}>
          Go to Signup
        </Button>
      </VStack>
    </Box>
  )
}

export default HomePage
