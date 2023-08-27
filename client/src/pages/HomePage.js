import React from 'react'
import { useAppState } from '../utils/AppContext'
import { SET_CURRENT_PAGE, LOGOUT } from '../utils/actions'
import {
  Box,
  Button,
  Heading,
  Image,
  VStack,
  HStack,
  Text,
  useBreakpointValue,
  Center,
} from '@chakra-ui/react'
import Auth from '../utils/auth'
import { useUserData } from '../components/customHooks/useUserData'

const HomePage = () => {
  // Access state and dispatch from AppContext
  const { state, dispatch } = useAppState()
  const { fetchUserData, isUserDataLoaded, loading, error } = useUserData() // custom hook to retrieve user data from server
  const imageMaxWidth = useBreakpointValue({ base: '100%', md: '75%' })
  const imageWidth = useBreakpointValue({ base: '100%', md: '75%' })
  const explanatoryTextWidth = useBreakpointValue({ base: '100%', md: '70%' })

  console.log(state.isAuthenticated ? 'logged in' : 'not logged in')

  const handleLoginClick = () => {
    dispatch({ type: SET_CURRENT_PAGE, payload: 'login' })
  }
  const handleRegisterClick = () => {
    dispatch({ type: SET_CURRENT_PAGE, payload: 'signup' })
  }
  const handleGoToProfile = async () => {
    if (!isUserDataLoaded) {
      const success = await fetchUserData()
      if (success) {
        dispatch({ type: SET_CURRENT_PAGE, payload: 'profile' })
      } else {
        Auth.logout()
        dispatch({ type: LOGOUT })
        dispatch({ type: SET_CURRENT_PAGE, payload: 'login' })
      }
    } else {
      if (Auth.loggedIn()) {
        dispatch({ type: SET_CURRENT_PAGE, payload: 'profile' })
      } else {
        dispatch({ type: SET_CURRENT_PAGE, payload: 'login' })
      }
    }
  }

  if (error) {
    console.error('Error fetching user data:', error)
    Auth.logout()
    dispatch({ type: LOGOUT })
    dispatch({ type: SET_CURRENT_PAGE, payload: 'login' })
  }

  return (
    <Box minHeight="80vh" flexDirection="column" display="flex" px={4}>
      <VStack spacing={8} alignItems="center" justifyContent="start" flex="1">
        {/* Welcome Section */}
        <Box textAlign="center">
          <Heading color="contrastText.500" mb={4}>
            Welcome to Perfect Profile
          </Heading>
          <Center>
            <Text
              maxWidth={explanatoryTextWidth}
              fontWeight="semibold"
              textAlign="center"
              color="panelLightText.500"
              fontSize="lg"
            >
              Use our secure site to check that we have your contact details,
              your lifestyle details and your eye history information correct to
              help us best serve your eye health and optical needs.
            </Text>
          </Center>
          <Center>
            <Text maxWidth={explanatoryTextWidth}>
              Your information helps us personalise your eye care experience at
              Adelaide Eye Care. The better we know you and your eyes, the
              better we can protect your eyes for life, and perfect your vision
              by recommending you the best optical solutions.
            </Text>
          </Center>
        </Box>

        {/* Image */}
        <Box maxWidth={imageMaxWidth} width="full">
          <Image
            src="https://aecwebresources.s3.ap-southeast-2.amazonaws.com/Bootcamp/images/landing-page-image.jpg"
            alt="Fun image of a woman making glasses with her fingers in front of her eyes"
            maxWidth={imageMaxWidth}
            width={imageWidth}
            borderRadius="md"
            objectFit="cover"
            mx="auto"
          />
        </Box>

        {/* Call to Action */}
        {state.isAuthenticated ? (
          <Button
            size="lg"
            bgColor="contrastText.500"
            color="white"
            fontWeight="normal"
            mb={6}
            onClick={() => {
              handleGoToProfile()
            }}
          >
            Go to your Profile
          </Button>
        ) : (
          <HStack spacing={4} mb={6}>
            <Button
              size="lg"
              bgColor="panelLightText.400"
              color="white"
              fontWeight="normal"
              onClick={() => {
                handleLoginClick()
              }}
            >
              Login
            </Button>
            <Button
              size="lg"
              bgColor="panelLightText.800"
              color="white"
              fontWeight="normal"
              onClick={() => {
                handleRegisterClick()
              }}
            >
              Register with your pass code
            </Button>
          </HStack>
        )}
      </VStack>
    </Box>
  )
}

export default HomePage
