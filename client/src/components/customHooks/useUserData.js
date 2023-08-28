// hooks/useUserData.js
import { useState } from 'react'
import { useLazyQuery } from '@apollo/client'
import { GET_USER_LOGIN_DATA } from '../../utils/graphql/userQueries'
import Auth from '../../utils/auth'
import { useAppState } from '../../utils/AppContext'
import { omitTypename } from '../../utils/utils'
import {
  LOGIN,
  SET_PROFILE,
  SET_USER_DATA,
  SET_APPOINTMENT,
  SET_VISIT_REASONS,
  SET_OPTOMETRIST,
  SET_NEW_CLIENT_QUESTIONS,
  SET_VISUAL_NEEDS,
  SET_PAST_OCULAR_HISTORY,
  SET_CURRENT_PAGE,
} from '../../utils/actions'

export function useUserData() {
  const { state, dispatch } = useAppState()
  const [loadUser] = useLazyQuery(GET_USER_LOGIN_DATA)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const fetchUserData = async () => {
    // check for data in state
    const hasStateData =
      !!state.profile &&
      !!state.userData &&
      !!state.visualNeeds &&
      !!state.pastOcularHistory
    const isLoggedIn = Auth.loggedIn()
    // if no data in state and user is logged in, fetch data
    if (isLoggedIn && hasStateData) {
      // both login and state are true, so don't need to fetch data
      return true
    } else if (isLoggedIn && !hasStateData) {
      // login is true but state is false, so fetch data
      setLoading(true)
      try {
        const { data } = await loadUser()

        // Check if data and token exist before proceeding
        if (data && data.getLoginInfo && data.getLoginInfo.token) {
          Auth.login(data.getLoginInfo.token)

          // Use AppContext to update isAuthenticated
          dispatch({ type: LOGIN })

          // Use AppContext to update userProfile
          dispatch({ type: SET_PROFILE, payload: Auth.getProfile().data })

          // Use AppContext to update user
          let user = data.getLoginInfo.user

          user = JSON.parse(JSON.stringify(user, omitTypename))
          if (user) {
            dispatch({ type: SET_USER_DATA, payload: user })
          }
          // use AppContext to update appointment
          let userAppointment = data.getLoginInfo.appointment
          userAppointment = JSON.parse(
            JSON.stringify(userAppointment, omitTypename)
          )

          dispatch({
            type: SET_APPOINTMENT,
            payload: userAppointment,
          })

          let userVisitReasons = data.getLoginInfo.visitReasons
          userVisitReasons = JSON.parse(
            JSON.stringify(userVisitReasons, omitTypename)
          )
          dispatch({
            type: SET_VISIT_REASONS,
            payload: userVisitReasons,
          })

          // use AppContext to update optometrist
          let userOptometrist = data.getLoginInfo.optometrist
          userOptometrist = JSON.parse(
            JSON.stringify(userOptometrist, omitTypename)
          )
          dispatch({
            type: SET_OPTOMETRIST,
            payload: userOptometrist,
          })

          let userNewClientQuestions = data.getLoginInfo.newClientQuestions
          userNewClientQuestions = JSON.parse(
            JSON.stringify(userNewClientQuestions, omitTypename)
          )
          dispatch({
            type: SET_NEW_CLIENT_QUESTIONS,
            payload: userNewClientQuestions,
          })

          let userVisualNeeds = data.getLoginInfo.visualNeeds
          if (userVisualNeeds) {
            userVisualNeeds = JSON.parse(
              JSON.stringify(userVisualNeeds, omitTypename)
            )
          }
          dispatch({
            type: SET_VISUAL_NEEDS,
            payload: userVisualNeeds,
          })

          let userPastOcularHistory = data.getLoginInfo.pastOcularHistory
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
          return true // success
        } else {
          setLoading(false)
          return false
        }
      } catch (err) {
        console.error(err)
        setError(err)
      } finally {
        setLoading(false)
      }
    }
    // if user is not logged in, return false
    return false
  }

  return {
    fetchUserData,
    isUserDataLoaded:
      !!state.profile &&
      !!state.userData &&
      !!state.visualNeeds &&
      !!state.pastOcularHistory,
    loading,
    error,
  }
}
