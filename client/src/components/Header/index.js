// Header
import React from 'react'
import {
  Flex,
  Spacer,
  useBreakpointValue,
  Grid,
  Text,
  Divider,
} from '@chakra-ui/react'
import NavElement from './NavElement'
import Logo from './Logo'
import { useAppState } from '../../utils/AppContext'
import { SET_CURRENT_PAGE, LOGOUT } from '../../utils/actions'
import Auth from '../../utils/auth'

function Header() {
  // global context
  const { state, dispatch } = useAppState()

  const direction = useBreakpointValue({ base: 'column', md: 'row' })

  const gridTemplateColumns = useBreakpointValue({
    base: 'repeat(2, 1fr)',
    md: 'repeat(4, 1fr)',
  })

  const logoSize = useBreakpointValue({ base: '40px', md: '50px' })
  const logoMargin = useBreakpointValue({ base: '1rem', md: '0px' })

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

  return (
    <Flex
      as="nav"
      px={2}
      py={4}
      mb={4}
      bg="deepCyan.500"
      color="white"
      flexDirection={direction}
      alignItems="center"
    >
      <Flex alignItems="center">
        <Logo width={logoSize} />
        <Text fontSize="2xl" color="headerFooterText.500" ml={4}>
          Perfect Profile
        </Text>
      </Flex>
      <Spacer mb={logoMargin} />
      {direction === 'column' ? (
        <Divider mb="1rem" borderColor="headerFooterText.500" />
      ) : (
        ''
      )}

      <Grid templateColumns={gridTemplateColumns} gap={2}>
        {state.isAuthenticated ? (
          <NavElement
            id="logout"
            title="Log Out"
            link="/"
            isSelected={false}
            onClick={() => logOut()}
          />
        ) : (
          <>
            <NavElement
              id="login"
              title="Login"
              link="/"
              isSelected={state.currentPage === 'login'}
              onClick={() => handlePageChange('login')}
            />
            <NavElement
              id="signup"
              title="Register"
              link="/"
              isSelected={state.currentPage === 'signup'}
              onClick={() => handlePageChange('signup')}
            />
          </>
        )}
      </Grid>
    </Flex>
  )
}

export default Header
