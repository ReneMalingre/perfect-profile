// RouteWrangler.js
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppState } from '../utils/AppContext'

const RouteWrangler = ({ children }) => {
  const { state } = useAppState()
  const navigate = useNavigate()

  useEffect(() => {
    switch (state.currentPage) {
      case 'home':
        navigate('/')
        break
      case 'login':
        navigate('/login')
        break
      case 'signup':
        navigate('/signup')
        break
      case 'profile':
        navigate('/profile')
        break
      default:
        navigate('/')
        break
    }
  }, [state.currentPage, navigate])

  return children
}

export default RouteWrangler
