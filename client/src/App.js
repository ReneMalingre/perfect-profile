// import logo from './logo.svg'
import './App.css'
// import TestPages from './components/TestPages'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import RouteWrangler from './components/RouteWrangler' // import the RouteWrangler to handle routing
import Login from './pages/Login'
import Signup from './pages/Signup'
import HomePage from './pages/HomePage'

function App() {
  return (
    <Router>
      <RouteWrangler>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </RouteWrangler>
    </Router>
  )
}

export default App
