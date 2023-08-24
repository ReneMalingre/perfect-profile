import React, { useState } from 'react'
import { useMutation } from '@apollo/client'
import { LOGIN_USER } from '../utils/graphql/userMutations'
import Auth from '../utils/auth'
import { useAppState } from '../utils/AppContext'
import {
  SET_CURRENT_PAGE,
  LOGIN,
  SET_PROFILE,
  SET_USER_DATA,
  SET_QUESTIONNAIRE_DATA,
} from '../utils/actions'
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
} from '@chakra-ui/react'
import { omitTypename } from '../utils/utils'

const Login = (props) => {
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [login] = useMutation(LOGIN_USER)
  const [loginError, setLoginError] = useState('')

  // Use AppContext to update currentPage
  const { state, dispatch } = useAppState()

  // update state based on form input changes
  const handleInputChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // submit form
  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      const { data } = await login({
        variables: { ...formData },
      })
      console.log('Login Data Returned: ', data)
      // Check if data and token exist before proceeding
      if (data && data.login && data.login.token) {
        Auth.login(data.login.token)

        // Use AppContext to update isAuthenticated
        dispatch({ type: LOGIN })
        // Use AppContext to update userProfile
        dispatch({ type: SET_PROFILE, payload: Auth.getProfile().data })
        // Use AppContext to update user
        let user = data.login.user
        user = JSON.parse(JSON.stringify(user, omitTypename))
        dispatch({ type: SET_USER_DATA, payload: user })
        // use AppContext to update questionnaireData
        // dispatch({
        //   type: SET_QUESTIONNAIRE_DATA,
        //   payload: data.login.questionnaireData,
        // })

        // Use AppContext to update currentPage
        dispatch({ type: SET_CURRENT_PAGE, payload: 'profile' })
      } else {
        throw new Error('Something went wrong!')
      }
    } catch (e) {
      console.error(e)
      setLoginError(
        'Login failed. Please check your credentials and try again.'
      )
    }

    // clear form values
    setFormData((prev) => ({
      ...prev,
      password: '',
    }))
  }

  return (
    <Box width="400px" margin="auto" marginTop="100px">
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <FormControl id="email" isRequired>
            <FormLabel>Email address</FormLabel>
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
            />
          </FormControl>

          <FormControl id="password" isRequired>
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter your password"
            />
          </FormControl>
          {loginError && <p style={{ color: 'red' }}>{loginError}</p>}
          <Button mt={4} colorScheme="teal" type="submit">
            Login
          </Button>
        </VStack>
      </form>
    </Box>
  )
}

export default Login
