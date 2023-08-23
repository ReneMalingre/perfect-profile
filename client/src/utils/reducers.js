import {
  SET_CURRENT_PAGE,
  LOGIN,
  LOGOUT,
  SET_PROFILE,
  SET_USER_DATA,
  SET_QUESTIONNAIRE_DATA,
} from './actions' // import action type

export const reducer = (state, action) => {
  console.log('state', state)
  console.log('action', action)
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
      return {
        ...state,
        userData: action.payload,
      }
    case SET_QUESTIONNAIRE_DATA:
      return {
        ...state,
        questionnaireData: action.payload,
      }
    default:
      console.log('Unknown action: ' + action.type)
      return state
  }
}
