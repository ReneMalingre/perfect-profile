import React from 'react'
import { Box, Heading, Text, Button, Center } from '@chakra-ui/react'
import { SET_CURRENT_PAGE } from '../../utils/actions'
import { useAppState } from '../../utils/AppContext'

function FourOhFour() {
  const { state, dispatch } = useAppState()
  const handleGoHome = () => {
    dispatch({ type: SET_CURRENT_PAGE, payload: 'home' })
  }

  return (
    <Center height="100vh" flexDirection="column" bg="gray.50">
      <Box textAlign="center" p={4} boxShadow="xl" borderRadius="lg" bg="white">
        <Heading size="2xl" mb={4}>
          404
        </Heading>
        <Text fontSize="xl" mb={4}>
          Oops! The page you're looking for does not exist.
        </Text>
        <Button onClick={handleGoHome}>Go Home</Button>
      </Box>
    </Center>
  )
}

export default FourOhFour
