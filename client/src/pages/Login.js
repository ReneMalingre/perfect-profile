import React, { useState } from 'react'
import { useMutation } from '@apollo/client'
import { LOGIN_USER } from '../utils/graphql/userMutations'
import Auth from '../utils/auth'
import { useAppState } from '../utils/AppContext'
import { SET_CURRENT_PAGE } from '../utils/actions'
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
} from '@chakra-ui/react'

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
    console.log(formData)
    try {
      console.log(formData)
      const { data } = await login({
        variables: { ...formData },
      })
      console.log(data)

      Auth.login(data.login.token)

      // Use AppContext to update currentPage
      dispatch({ type: SET_CURRENT_PAGE, payload: 'home' })
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
