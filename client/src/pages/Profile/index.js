import React from 'react'
import { useAppState } from '../../utils/AppContext'
import { SET_CURRENT_PAGE, LOGOUT } from '../../utils/actions'
import { Box, Grid, Flex, Button, VStack, Text, Image } from '@chakra-ui/react'
import StaffBioPopup from '../../components/StaffBioPopup'
import AppointmentCard from '../../components/AppointmentCard'
import VisitReasons from '../../components/VisitReasons'
import CurrentContactDetails from '../../components/CurrentContactDetails'
import NewClientQueries from '../../components/NewClientQuestions'
import OcularHistory from '../../components/OcularHistory'
import MedicalHistory from '../../components/MedicalHistory'
import VisualNeeds from '../../components/VisualNeeds'

const Profile = () => {
  const { state, dispatch } = useAppState()
  const userData = state.userData
  const optometrist = state.optometrist
  let optomName = ''
  if (optometrist) {
    optomName = `${optometrist.title} ${optometrist.firstName} ${optometrist.lastName}`
  }
  const appointmentId = state.appointment.id
  const newClientQuestions = state.newClientQuestions

  console.log('appointmentId', appointmentId)

  return (
    <Grid templateColumns={{ base: '1fr', lg: 'repeat(2, 1fr)' }} gap={6} p={4}>
      <Box border="2px" borderRadius="md" boxShadow="2xl" p={4}>
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
                imageUrl={optometrist.imageUrl}
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
            <Text fontSize="xl" fontWeight="bold" mb={2}>
              Some Information
            </Text>
            <Text fontWeight="bold">
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
      <Box border="2px" borderRadius="md" boxShadow="2xl" p={4}>
        <CurrentContactDetails />
      </Box>
      {userData.isNewClient && newClientQuestions ? (
        <Box border="2px" borderRadius="md" boxShadow="2xl" p={4}>
          <NewClientQueries />
        </Box>
      ) : (
        ''
      )}
      <Box border="2px" borderRadius="md" boxShadow="2xl" p={4}>
        <VisitReasons appointmentId={appointmentId} />
      </Box>
      <Box border="2px" borderRadius="md" boxShadow="2xl" p={4}>
        <VisualNeeds />
      </Box>
      {/* <Box border="2px" borderRadius="md" boxShadow="2xl" p={4}>
        <OcularHistory />
      </Box>
      <Box border="2px" borderRadius="md" boxShadow="2xl" p={4}>
        <MedicalHistory />
      </Box> */}
    </Grid>
  )
}

export default Profile
