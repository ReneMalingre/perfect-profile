import React from 'react'
import { Box, Text, Link, Icon, Center } from '@chakra-ui/react'
import { FaMapMarkerAlt } from 'react-icons/fa' // This is for the location icon

function AppointmentCard({ date, time, location, address }) {
  const googleMapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    address
  )}`

  return (
    <Box borderWidth="1px" borderRadius="lg" p={4} boxShadow="md">
      <Center>
        <Text fontSize="xl" fontWeight="bold" mb={2}>
          Your Appointment
        </Text>
      </Center>
      <Text mb={2}>
        <strong>Date:</strong> {date}
      </Text>

      <Text mb={2}>
        <strong>Time:</strong> {time}
      </Text>

      <Link
        href={googleMapsLink}
        isExternal
        color="teal.500"
        display="flex"
        alignItems="center"
      >
        <Icon as={FaMapMarkerAlt} mr={2} />
        <strong>Location: </strong>&nbsp;{location}
      </Link>
    </Box>
  )
}

export default AppointmentCard
