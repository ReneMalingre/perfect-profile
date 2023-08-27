import {
  SET_CURRENT_PAGE,
  LOGIN,
  LOGOUT,
  SET_PROFILE,
  SET_USER_DATA,
  SET_USER_SINGLE_VALUE,
  SET_USER_NAME_DATA,
  SET_USER_ADDRESS_DATA,
  SET_APPOINTMENT,
  SET_OPTOMETRIST,
  SET_VISIT_REASONS,
  SET_NEW_CLIENT_QUESTIONS,
  SET_VISUAL_NEEDS,
} from './actions' // import action type

import { setNestedObjectValue } from './utils'

export const reducer = (state, action) => {
  switch (action.type) {
    case SET_CURRENT_PAGE:
      return {
        ...state,
        currentPage: action.payload,
      }
    case LOGIN:
      return {
        ...state,
        isAuthenticated: true,
      }
    case LOGOUT:
      return {
        ...state,
        isAuthenticated: false,
      }
    case SET_PROFILE:
      return {
        ...state,
        userProfile: action.payload,
      }
    case SET_USER_DATA:
      if (!action.payload) {
        return state
      }
      const returnedState = {
        ...state,
        userData: action.payload,
      }
      console.log('SET_USER_DATA returnedState', returnedState)
      return returnedState
    case SET_USER_SINGLE_VALUE:
      // Create a deep copy of state.userData
      const updatedData = JSON.parse(JSON.stringify(state.userData))

      // Update the nested property using the utility function
      setNestedObjectValue(updatedData, action.rowId, action.newData)

      return { ...state, userData: updatedData }

    case SET_USER_NAME_DATA:
      return {
        ...state,
        userData: {
          ...state.userData,
          nameDetails: action.payload,
        },
      }
    case SET_USER_ADDRESS_DATA:
      return {
        ...state,
        userData: {
          ...state.userData,
          contactDetails: {
            ...state.userData.contactDetails,
            address: action.payload,
          },
        },
      }
    case SET_APPOINTMENT:
      return {
        ...state,
        appointment: action.payload,
      }
    case SET_OPTOMETRIST:
      return {
        ...state,
        optometrist: action.payload,
      }
    case SET_VISIT_REASONS:
      return {
        ...state,
        visitReasons: action.payload,
      }
    case SET_NEW_CLIENT_QUESTIONS:
      return {
        ...state,
        newClientQuestions: action.payload,
      }
    case SET_VISUAL_NEEDS:
      console.log('SET_VISUAL_NEEDS action.payload', action.payload)
      return {
        ...state,
        visualNeeds: action.payload,
      }
    default:
      console.log('Unknown action: ' + action.type)
      return state
  }
}
