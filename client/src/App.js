// import logo from './logo.svg'
import './App.css'
import TestPages from './components/TestPages'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import { AppProvider } from './utils/AppContext'
import Login from './pages/Login'
const HomePage = () => (
  <>
    <div>Home Page</div>
    <TestPages></TestPages>{' '}
  </>
)

function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Router>
    </AppProvider>
  )
}

export default App
