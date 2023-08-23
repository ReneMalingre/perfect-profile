// List of actions for use with useReducer

/*
 * SET_CURRENT_PAGE
 * - payload: string of page name
 * - sets the current page state
 * - navigates to the page using Route
 */
export const SET_CURRENT_PAGE = 'SET_CURRENT_PAGE'

/*
 * LOGIN
 * - sets isAuthenticated to true
 * - sets the token in localStorage
 * - sets the token in the Authorization header
 * - sets the user profile in state
 */
export const LOGIN = 'LOGIN'

/*
 * LOGOUT
 * - sets isAuthenticated to false
 * - removes the token from localStorage
 * - removes the token from the Authorization header
 * - removes the user profile from state
 * - navigates to the home page
 * - clears the Apollo cache
 */
export const LOGOUT = 'LOGOUT'

/*
 * SET_PROFILE
 * - payload: user profile object: { username, _id }
 * - sets the user profile in state
 * - sets the user profile in localStorage
 * - sets the user profile in the Apollo cache
 * - sets the user profile in the Authorization header
 * - sets isAuthenticated to true
 */
export const SET_PROFILE = 'SET_PROFILE'

/* SET_USER_DATA
 * - payload: user data object
 * - sets the user data in state
 */
export const SET_USER_DATA = 'SET_USER_DATA'

/*
 * SET_QUESTIONNAIRE_DATA
 * - payload: user questionnaire data object
 * - sets the user questionnaire data in state
 */
export const SET_QUESTIONNAIRE_DATA = 'SET_QUESTIONNAIRE_DATA'
