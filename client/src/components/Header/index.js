// Header
import React from 'react'
import {
  Flex,
  Spacer,
  useBreakpointValue,
  Text,
  Divider,
  HStack,
} from '@chakra-ui/react'
import NavElement from './NavElement'
import Logo from './Logo'
import { useAppState } from '../../utils/AppContext'
import { SET_CURRENT_PAGE, LOGOUT } from '../../utils/actions'
import Auth from '../../utils/auth'
import { useUserData } from '../customHooks/useUserData'

function Header() {
  // global context
  const { state, dispatch } = useAppState()
  const { fetchUserData, isUserDataLoaded, loading, error } = useUserData() // custom hook to retrieve user data from server
  const direction = useBreakpointValue({ base: 'column', md: 'row' })
  const logoSize = useBreakpointValue({ base: '30px', md: '50px' })
  const logoMargin = useBreakpointValue({ base: '0.5rem', md: '0px' })
  const isSmallScreen = useBreakpointValue({ base: true, md: false })

  const handlePageChange = (page) => {
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

  const handleLogoClick = () => {
    switch (state.currentPage) {
      case 'home':
        return
      case 'login':
        return dispatch({ type: SET_CURRENT_PAGE, payload: 'home' })
      case 'signup':
        return dispatch({ type: SET_CURRENT_PAGE, payload: 'home' })
      case 'profile':
        return dispatch({ type: SET_CURRENT_PAGE, payload: 'home' })
      case 'appointment':
        return dispatch({ type: SET_CURRENT_PAGE, payload: 'home' })
      case 'optometrist':
        return dispatch({ type: SET_CURRENT_PAGE, payload: 'home' })
      default:
        return
    }
  }
  const goToProfile = async () => {
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
    <Flex
      as="nav"
      px={2}
      py={2}
      mb={2}
      bg="headerFooterBg.500"
      color="headerFooterText.500"
      flexDirection={direction}
      alignItems="center"
    >
      <Flex
        alignItems="center"
        mx={4}
        onClick={handleLogoClick}
        cursor="pointer"
      >
        <Logo width={logoSize} />
        <Text
          fontSize="2xl"
          color="headerFooterText.500"
          ml={isSmallScreen ? 2 : 6}
        >
          {isSmallScreen
            ? 'Perfect Profile'
            : 'Perfect Profile - Adelaide Eye Care'}
        </Text>
      </Flex>
      {isSmallScreen ? (
        <Text mt={1} fontSize="xl" color="headerFooterText.500">
          Adelaide Eye Care
        </Text>
      ) : (
        ''
      )}
      <Spacer mb={logoMargin} />
      {direction === 'column' ? (
        <Divider mb={1} borderColor="headerFooterText.500" />
      ) : (
        ''
      )}

      {state.isAuthenticated ? (
        <>
          <HStack mx={6} spacing={4}>
            {state.currentPage !== 'profile' ? (
              <NavElement
                id="profile"
                title="Your Profile"
                link="/"
                isSelected={false}
                onClick={() => goToProfile()}
              />
            ) : (
              ''
            )}
            <NavElement
              id="logout"
              title="Log Out"
              link="/"
              isSelected={false}
              onClick={() => logOut()}
              ml={4}
            />
          </HStack>
        </>
      ) : (
        <HStack mx={6} spacing={4}>
          <NavElement
            id="login"
            title="Login"
            link="/"
            isSelected={state.currentPage === 'login'}
            onClick={() => handlePageChange('login')}
          />
          {/* <NavElement
            id="signup"
            title="Register"
            link="/"
            isSelected={state.currentPage === 'signup'}
            onClick={() => handlePageChange('signup')}
          /> */}
        </HStack>
      )}
    </Flex>
  )
}

export default Header
