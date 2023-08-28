import React, { createContext, useContext, useReducer } from 'react'
import { reducer } from './reducers'
import { initialState } from './state'
import Auth from '../utils/auth'
const AppContext = createContext()

export const AppProvider = ({ children }) => {
  const initialProfile = Auth.loggedIn() ? Auth.getProfile().data : null
  const [state, dispatch] = useReducer(reducer, {
    ...initialState,
    // Check if user is logged in
    isAuthenticated: Auth.loggedIn(),
    // Set user profile data
    userProfile: initialProfile,
  })

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  )
}

export const useAppState = () => useContext(AppContext)
