import React from 'react'
import { useAppState } from '../utils/AppContext'
import { SET_CURRENT_PAGE, LOGOUT } from '../utils/actions'
import { Box, Button, VStack, Text } from '@chakra-ui/react'
import Auth from '../utils/auth'
const HomePage = () => {
  // Access state and dispatch from AppContext
  const { state, dispatch } = useAppState()

  const userProfile = state.userProfile

  const navigateTo = (page) => {
    dispatch({ type: SET_CURRENT_PAGE, payload: page })
  }

  const logOut = () => {
    // run the logout method to clear the token and log us out of the db
    Auth.logout()
    // once logged out, set isAuthenticated to false
    dispatch({ type: LOGOUT })
    // once logged out, set the state load the home page
    dispatch({ type: SET_CURRENT_PAGE, payload: 'home' })
  }

  return (
    <Box width="400px" margin="auto" marginTop="100px">
      <VStack spacing={4} textAlign="center">
        {/* Display user information */}
        {state.isAuthenticated ? (
          <>
            <Text>Welcome, {userProfile.username}!</Text>
            <Button colorScheme="teal" onClick={() => logOut()}>
              Log Out
            </Button>
          </>
        ) : (
          <>
            <Text>Not logged in</Text>
            {/* Navigation buttons */}
            <Button colorScheme="teal" onClick={() => navigateTo('login')}>
              Go to Login
            </Button>
            <Button colorScheme="blue" onClick={() => navigateTo('signup')}>
              Go to Signup
            </Button>
          </>
        )}
      </VStack>
    </Box>
  )
}

export default HomePage
