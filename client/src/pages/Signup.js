import React, { useState } from 'react'
import { useMutation } from '@apollo/client'
import { CREATE_USER } from '../utils/graphql/userMutations'
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Text,
} from '@chakra-ui/react'
import { useAppState } from '../utils/AppContext'
import { SET_CURRENT_PAGE } from '../utils/actions'
import Auth from '../utils/auth'

const Signup = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    phone: '',
  })

  const [addUser, { error }] = useMutation(CREATE_USER)
  const [signupError, setSignupError] = useState(null)
  // Use AppContext to update currentPage
  const { state, dispatch } = useAppState()

  const handleInputChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
      const { data } = await addUser({
        variables: { ...formData },
      })

      if (data) {
        console.log('User added successfully!')
        Auth.login(data.login.token)

        // Use AppContext to update currentPage
        dispatch({ type: SET_CURRENT_PAGE, payload: 'home' })
      }
    } catch (e) {
      setSignupError(e.message)
    }

    setFormData({
      username: '',
      email: '',
      password: '',
      phone: '',
    })
  }

  return (
    <Box width="400px" margin="auto" marginTop="100px">
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <FormControl id="username" isRequired>
            <FormLabel>Username</FormLabel>
            <Input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="Enter your username"
            />
          </FormControl>

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

          {signupError && <Text color="red.500">{signupError}</Text>}

          <Button mt={4} colorScheme="teal" type="submit">
            Sign Up
          </Button>
        </VStack>
      </form>
    </Box>
  )
}

export default Signup
