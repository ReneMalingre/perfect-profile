import React from 'react'
import { Box, Text, Link, Icon, Center } from '@chakra-ui/react'
import { FaMapMarkerAlt } from 'react-icons/fa' // This is for the location icon
import { formatDate } from '../../utils/utils'
import { useAppState } from '../../utils/AppContext'

function AppointmentCard() {
  const { state } = useAppState()
  const appointment = state.appointment
  const hasAppointment = appointment && appointment.id

  let googleMapsLink = ''
  if (appointment && appointment.locationAddress) {
    googleMapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      appointment.locationAddress
    )}`
  } else {
    googleMapsLink =
      'https://www.google.com/maps/search/?api=1&query=Adelaide+Eye+Care'
  }

  let bookingLink = 'https://www.adelaideeyecare.com.au/book-appointment'
  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      p={4}
      boxShadow="inset 0 0 6px rgba(0, 0, 0, 0.25)"
    >
      <Center>
        <Text fontSize="xl" fontWeight="bold" mb={2} color="contrastText.500">
          Your Appointment
        </Text>
      </Center>
      {hasAppointment ? (
        <>
          <Text mb={2}>
            <strong>Date:</strong> {formatDate(appointment.appointmentDate)}
          </Text>

          <Text mb={2}>
            <strong>Time:</strong> {appointment.appointmentTime}
          </Text>

          <Text mb={2}>
            <strong>Phone:</strong>
            <Link
              href={`tel:${appointment.locationTelephone}`}
              color="inherit"
              _hover={{ textDecoration: 'none' }}
            >
              {' '}
              {appointment.locationTelephone}
            </Link>
          </Text>
          <Link
            href={googleMapsLink}
            isExternal
            color="panelLightText.500"
            display="flex"
            alignItems="center"
          >
            <Icon as={FaMapMarkerAlt} mr={2} />
            <strong>Location: </strong>&nbsp;{appointment.location}
          </Link>
        </>
      ) : (
        <>
          <Text mb={2}>
            <strong>You have no upcoming appointments</strong>
          </Text>
          <Link
            href={bookingLink}
            isExternal
            color="panelLightText.500"
            display="flex"
            alignItems="center"
          >
            <strong>Make an Appointment</strong>
          </Link>
        </>
      )}
    </Box>
  )
}

export default AppointmentCard
