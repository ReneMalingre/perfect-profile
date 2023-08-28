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
  SET_APPOINTMENT,
  SET_OPTOMETRIST,
  SET_VISIT_REASONS,
  SET_NEW_CLIENT_QUESTIONS,
  SET_VISUAL_NEEDS,
  SET_PAST_OCULAR_HISTORY,
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
        if (user) {
          dispatch({ type: SET_USER_DATA, payload: user })
        }
        // use AppContext to update appointment
        let userAppointment = data.login.appointment
        userAppointment = JSON.parse(
          JSON.stringify(userAppointment, omitTypename)
        )

        dispatch({
          type: SET_APPOINTMENT,
          payload: userAppointment,
        })

        let userVisitReasons = data.login.visitReasons
        userVisitReasons = JSON.parse(
          JSON.stringify(userVisitReasons, omitTypename)
        )
        dispatch({
          type: SET_VISIT_REASONS,
          payload: userVisitReasons,
        })

        // use AppContext to update optometrist
        let userOptometrist = data.login.optometrist
        userOptometrist = JSON.parse(
          JSON.stringify(userOptometrist, omitTypename)
        )
        dispatch({
          type: SET_OPTOMETRIST,
          payload: userOptometrist,
        })

        let userNewClientQuestions = data.login.newClientQuestions
        userNewClientQuestions = JSON.parse(
          JSON.stringify(userNewClientQuestions, omitTypename)
        )
        dispatch({
          type: SET_NEW_CLIENT_QUESTIONS,
          payload: userNewClientQuestions,
        })

        let userVisualNeeds = data.login.visualNeeds
        if (userVisualNeeds) {
          userVisualNeeds = JSON.parse(
            JSON.stringify(userVisualNeeds, omitTypename)
          )
        }
        dispatch({
          type: SET_VISUAL_NEEDS,
          payload: userVisualNeeds,
        })

        let userPastOcularHistory = data.login.pastOcularHistory
        if (userPastOcularHistory) {
          userPastOcularHistory = JSON.parse(
            JSON.stringify(userPastOcularHistory, omitTypename)
          )
        }
        dispatch({
          type: SET_PAST_OCULAR_HISTORY,
          payload: userPastOcularHistory,
        })

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

  const pageElementStyle = {
    border: '0px',
    borderRadius: 'xl',
    boxShadow: '2xl',
    p: 4,
    backgroundColor: 'panelBg.500',
  }
  return (
    <Box width="400px" margin="auto" marginTop="100px" {...pageElementStyle}>
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
          <Button
            mt={4}
            bgColor="panelHeading.500"
            color="pageBg.500"
            fontWeight="normal"
            type="submit"
          >
            Login
          </Button>
        </VStack>
      </form>
    </Box>
  )
}

export default Login
