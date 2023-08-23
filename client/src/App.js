// import logo from './logo.svg'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import RouteWrangler from './components/RouteWrangler' // import the RouteWrangler to handle routing
import Login from './pages/Login'
import Signup from './pages/Signup'
import HomePage from './pages/HomePage'
import DynamicForm from './pages/DynamicForm'
import questionnaireData from './assets/questionnaire/questionnaireFlow.json'

import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from '@apollo/client'

import {
  ChakraProvider,
  Container,
  Box,
  CSSReset,
  extendTheme,
} from '@chakra-ui/react'

import { setContext } from '@apollo/client/link/context'
import { AppProvider } from './utils/AppContext'
import Header from './components/Header'
import Footer from './components/Footer'

// uri: '/graphql',
const httpLink = createHttpLink({
  uri: 'http://localhost:3001/graphql',
})

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('id_token')
  console.log(token)
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  }
})

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
})

// Custom Theme Information
// as a good optometrist, I am using this font due to its readability
// https://www.brailleinstitute.org/freefont
const theme = extendTheme({
  styles: {
    global: {
      'html, body': {
        backgroundColor: 'oxfordBlue.900',
        color: 'periwinkle.500',
      },
    },
  },
  fonts: {
    heading: 'Atkinson Hyperlegible, sans-serif',
    body: 'Atkinson Hyperlegible, sans-serif',
  },
  colors: {
    // original
    // oxfordBlue: { 500: '#0A192F', 900: '#02070D' },
    // coolGray: { 500: '#8892B0' },
    // periwinkle: { 500: '#CCD6F6' },
    // turquoise: { 500: '#50D0B8', 600: '#42b6a1' },
    // classic and neutral
    // deepBlue: { 500: '#1E2A38', 900: '#0D131A' },
    // slateGray: { 500: '#708297' },
    // softGray: { 500: '#D0D5E2' },
    // navyBlue: { 500: '#2F4D75', 600: '#253a5b' },
    // headerFooterText: { 500: '#ECEFF4' },
    // earthy and trustworthy
    // charcoal: { 500: '#2E3338', 900: '#1A1C1D' },
    // oliveGray: { 500: '#7F8C8D' },
    // clay: { 500: '#BDC3C7' },
    // forestGreen: { 500: '#407D63', 600: '#33624f' },
    // modern and minimalist
    spaceGray: { 500: '#2D313D', 900: '#181A20' },
    mutedCyan: { 500: '#7FA8A5' },
    lightGray: { 500: '#EBEBEB' },
    deepCyan: { 500: '#2A6866', 600: '#204d4c' },
    headerFooterText: { 500: '#F5F7FA' }, // Added for contrast against deepCyan
  },
})

function App() {
  return (
    <ChakraProvider theme={theme}>
      <CSSReset />
      <ApolloProvider client={client}>
        <AppProvider>
          <Container maxW="1280px" boxShadow="lg" bg="oxfordBlue.500" p={0}>
            <Router>
              <RouteWrangler>
                <Box
                  minH="100vh"
                  w="100%"
                  display="flex"
                  flexDirection="column"
                  justifyContent="space-between"
                >
                  <Header />
                  <main>
                    <Routes>
                      <Route path="/" element={<HomePage />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/signup" element={<Signup />} />
                      <Route
                        path="/questionnaire"
                        element={<DynamicForm data={questionnaireData} />}
                      />
                      <Route path="*">"404: Not Found"</Route>{' '}
                      {/* TODO: make a 404 page */}
                    </Routes>
                  </main>
                  <Footer />
                </Box>
              </RouteWrangler>
            </Router>
          </Container>
        </AppProvider>
      </ApolloProvider>
    </ChakraProvider>
  )
}

export default App
