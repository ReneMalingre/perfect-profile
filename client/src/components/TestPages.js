import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppState } from '../utils/AppContext'
import { SET_CURRENT_PAGE } from '../utils/actions'

const TestPages = () => {
  const { dispatch } = useAppState()
  const navigate = useNavigate()

  const handleButtonClick = () => {
    dispatch({ type: SET_CURRENT_PAGE, payload: 'login' }) // set new page state
    navigate('/login') // change URL using React Router's `useNavigate`
  }

  return <button onClick={handleButtonClick}>Go to Home</button>
}

export default TestPages
