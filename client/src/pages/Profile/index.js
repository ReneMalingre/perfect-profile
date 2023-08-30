import React from 'react'
import { useAppState } from '../../utils/AppContext'
import { Box, Grid, Flex, VStack, Text } from '@chakra-ui/react'
import StaffBioPopup from '../../components/StaffBioPopup'
import AppointmentCard from '../../components/AppointmentCard'
import VisitReasons from '../../components/VisitReasons'
import CurrentContactDetails from '../../components/CurrentContactDetails'
import NewClientQueries from '../../components/NewClientQuestions'
import OcularHistory from '../../components/OcularHistory'
import VisualNeeds from '../../components/VisualNeeds'

const Profile = () => {
  const { state, dispatch } = useAppState()

  const userData = state.userData
  const optometrist = state.optometrist

  let optomName = ''
  if (optometrist) {
    optomName = `${optometrist.title} ${optometrist.firstName} ${optometrist.lastName}`
  }
  let appointmentId = null
  if (state.appointment) {
    appointmentId = state.appointment.id
  }

  const newClientQuestions = state.newClientQuestions

  const pageElementStyle = {
    border: '0px',
    borderRadius: 'xl',
    boxShadow: '2xl',
    p: 4,
    backgroundColor: 'panelBg.500',
  }

  return (
    <Grid templateColumns={{ base: '1fr', lg: 'repeat(2, 1fr)' }} gap={6} p={4}>
      <Box {...pageElementStyle}>
        <Flex direction={{ base: 'column', md: 'row' }}>
          {/* Left Sub-element */}
          <VStack
            spacing={4}
            width={{ base: '100%', md: '280px' }}
            mr={{ base: 0, md: 4 }}
            align="stretch"
          >
            <AppointmentCard />
            {optometrist ? (
              <StaffBioPopup
                imageURL={optometrist.imageURL}
                name={optomName}
                qualifications={optometrist.qualifications}
                bio={optometrist.bio}
              />
            ) : (
              ''
            )}
          </VStack>

          {/* Right Sub-element */}
          <Box flex={1}>
            <Text
              fontSize="xl"
              fontWeight="bold"
              mb={2}
              color="panelLightText.500"
              minWidth="18ch"
            >
              Some Information
            </Text>
            <Text fontWeight="bold" color="panelLightText.500">
              We are so grateful that you have chosen us to look after your eye
              health and vision needs. We will do our best to look after you and
              to answer any of your concerns or questions.
            </Text>
            <Text>
              It is helpful to arrive a few minutes early for your appointment
              to let us check you in, do some pre-testing imaging if needed, and
              update your details, or to give you extra time to find beautiful
              new spectacle frames. If you are running late, please call us to
              let us know. If you are a new patient, please bring your Medicare
              card, private Health Fund card and any glasses or contact lenses,
              eye drops or medications you are currently using for your eyes. If
              you are a contact lens wearer, please bring your contact lens case
              and solution.
            </Text>
          </Box>
        </Flex>
      </Box>
      <Box {...pageElementStyle}>
        <CurrentContactDetails />
      </Box>
      {userData && userData.isNewClient && newClientQuestions ? (
        <Box {...pageElementStyle}>
          <NewClientQueries />
        </Box>
      ) : (
        ''
      )}
      <Box {...pageElementStyle}>
        <OcularHistory />
      </Box>
      <Box {...pageElementStyle}>
        <VisitReasons appointmentId={appointmentId} />
      </Box>
      <Box {...pageElementStyle}>
        <VisualNeeds />
      </Box>

      {/* 
      <Box  {...pageElementStyle}>
        <MedicalHistory />
      </Box> */}
    </Grid>
  )
}

export default Profile
