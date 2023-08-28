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

/* SET_USER_SINGLE_VALUE
 * - payload: row description and new data
 * - sets the user data in state
 */
export const SET_USER_SINGLE_VALUE = 'SET_USER_SINGLE_VALUE'

/* SET_USER_NAME_DATA
 * - payload: user nameDetails data object
 * - sets the user nameDetails data in state
 */
export const SET_USER_NAME_DATA = 'SET_USER_NAME_DATA'

/* SET_USER_ADDRESS_DATA
 * - payload: user contactDetails address data object
 * - sets the user contactDetails address data in state
 */
export const SET_USER_ADDRESS_DATA = 'SET_USER_ADDRESS_DATA'
/*
 * SET_QUESTIONNAIRE_DATA
 * - payload: user questionnaire data object
 * - sets the user questionnaire data in state
 */
export const SET_QUESTIONNAIRE_DATA = 'SET_QUESTIONNAIRE_DATA'

/* SET_VISIT_REASONS
 * - payload: visit reason data object array
 * - sets the visit reason data array in state
 */
export const SET_VISIT_REASONS = 'SET_VISIT_REASONS'

/* ADD_VISIT_REASON
 * - payload: visit reason data object
 * - adds a new visit reason to the state
 */
export const ADD_VISIT_REASON = 'ADD_VISIT_REASON'

/* UPDATE_VISIT_REASON
 * - payload: visit reason data object with updated fields
 * - updates an existing visit reason in state
 */
export const UPDATE_VISIT_REASON = 'UPDATE_VISIT_REASON'

/* DELETE_VISIT_REASON
 * - payload: visit reason ID
 * - deletes the specified visit reason from state
 */
export const DELETE_VISIT_REASON = 'DELETE_VISIT_REASON'

/* SET_APPOINTMENT
 * - payload: appointment data object
 * - sets the appointment data in state
 */
export const SET_APPOINTMENT = 'SET_APPOINTMENT'

/* SET_OPTOMETRIST
 * - payload: optometrist data object
 * - sets the optometrist data in state
 */
export const SET_OPTOMETRIST = 'SET_OPTOMETRIST'

/* SET_NEW_CLIENT_QUESTIONS
 * - payload: new client questions data object
 * - sets the new client questions data in state
 */
export const SET_NEW_CLIENT_QUESTIONS = 'SET_NEW_CLIENT_QUESTIONS'

/* SET_VISUAL_NEEDS

    * - payload: visual needs data object
    * - sets the visual needs data in state
    * */
export const SET_VISUAL_NEEDS = 'SET_VISUAL_NEEDS'

/* SET_PAST_OCULAR_HISTORY
 * - payload: past ocular history data object
 * - sets the past ocular history data in state
 * */
export const SET_PAST_OCULAR_HISTORY = 'SET_PAST_OCULAR_HISTORY'
