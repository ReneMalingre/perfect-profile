// import logo from './logo.svg'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import RouteWrangler from './components/RouteWrangler' // import the RouteWrangler to handle routing
import Login from './pages/Login'
import Signup from './pages/Signup'
import HomePage from './pages/HomePage'
import Profile from './pages/Profile'
import FourOhFour from './pages/FourOhFour'

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
  uri: '/graphql', //'http://localhost:3001/graphql',
})

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('id_token')
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
        backgroundColor: 'pageMargins.500',
        color: 'panelText.500',
      },
    },
  },
  fonts: {
    heading: 'Atkinson Hyperlegible, sans-serif',
    body: 'Atkinson Hyperlegible, sans-serif',
  },
  colors: {
    // Header and Footer
    headerFooterText: { 500: '#F4F5F7' },
    headerFooterSelectedText: { 500: '#1A365D' }, // Dark blue for selected text
    headerFooterBg: { 500: '#23395D' }, // Dark navy blue background

    // Page Background
    pageBg: { 500: '#F4F5F7' }, // A soft grayish background
    pageMargins: { 500: '#E5E7EB' }, // A slightly darker gray for page margins

    // Panels
    panelBg: { 500: '#FFFFFF' }, // Pure white for panels for contrast and readability
    panelText: { 500: '#333333' }, // Near-black for regular text
    panelHeading: { 500: '#23395D' }, // Using the same dark navy blue for headings for consistency
    contrastText: { 500: '#E07A5F' }, // Pure white for contrast text
    panelLightText: {
      50: '#EBEDF5',
      100: '#CED3E1',
      200: '#B0B9CC',
      300: '#919FB7',
      400: '#7285A2',
      500: '#556C9D', // A medium-light navy blue, brighter than the regular text but not as bright as the background.
      600: '#435883',
      700: '#324468',
      800: '#21304E',
      900: '#101C33',
    },
  },
})

function App() {
  return (
    <ChakraProvider theme={theme}>
      <CSSReset />
      <ApolloProvider client={client}>
        <AppProvider>
          <Container maxW="1280px" boxShadow="lg" bg="pageBg.500" p={0}>
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
                      <Route path="/profile" element={<Profile />} />
                      <Route path="*" element={<FourOhFour />} />
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
