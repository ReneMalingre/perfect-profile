import React, { createContext, useContext, useReducer } from 'react'
import { reducer } from './reducers'
import { initialState } from './state'

const AppContext = createContext()

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState)

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  )
}

export const useAppState = () => useContext(AppContext)
