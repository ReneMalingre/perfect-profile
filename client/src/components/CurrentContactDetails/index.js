import React, { useRef, useState, useEffect } from 'react'
import { Box, Flex, Text, chakra, Link, Icon, Center } from '@chakra-ui/react'
import { useAppState } from '../../utils/AppContext'
import { formatDate } from '../../utils/utils'

function CurrentContactDetails() {
  const { state, dispatch } = useAppState()

  // get the width of the longest label
  const longestLabelRef = useRef(null)
  const [labelWidth, setLabelWidth] = useState(200)
  useEffect(() => {
    if (longestLabelRef.current) {
      setLabelWidth(longestLabelRef.current.offsetWidth)
    }
  }, [longestLabelRef])

  // get the user profile from the state
  const userData = state.userData
  const fullName = `${userData.nameDetails.title} ${
    userData.nameDetails.firstName
  } ${
    userData.nameDetails.preferredName
      ? `(${userData.nameDetails.preferredFirstName})`
      : ''
  } ${userData.nameDetails.middleName} ${userData.nameDetails.lastName}`.trim()
  const fullAddress =
    `${userData.contactDetails.address.street1} ${userData.contactDetails.address.street2} ${userData.contactDetails.address.city} 
    ${userData.contactDetails.address.state} ${userData.contactDetails.address.postalCode} ${userData.contactDetails.address.country}`.trim()

  return (
    <Box borderWidth="1px" borderRadius="lg" p={4} boxShadow="md">
      {/* Invisible text to get its width using chakra */}
      <chakra.div
        ref={longestLabelRef}
        position="absolute"
        opacity="0"
        fontWeight="bold"
      >
        Ophthalmologist:&nbsp;&nbsp;
      </chakra.div>

      <Center>
        <Text fontSize="xl" fontWeight="bold" mb={2}>
          Your Contact and Personal Details
        </Text>
      </Center>
      <Text mb={1}>
        Please review your contact details below, and correct any errors or
        omissions:
      </Text>
      <Flex direction="column">
        {renderRow('Name:', fullName, labelWidth)}
        {renderRow('Address:', fullAddress, labelWidth)}
        {renderRow('Phone:', userData.contactDetails.phone, labelWidth)}
        {renderRow('Email:', userData.contactDetails.email, labelWidth)}
        {renderRow(
          'Date of Birth:',
          formatDate(userData.dateOfBirth),
          labelWidth
        )}
        {renderRow('Health Fund:', userData.healthFund, labelWidth)}
        {renderRow('Your GP:', userData.GP, labelWidth)}
        {renderRow("GP's Suburb:", userData.GPSuburb, labelWidth)}
        {renderRow('Ophthalmologist:', userData.ophthalmologist, labelWidth)}
      </Flex>
    </Box>
  )
}

function renderRow(label, data, width) {
  return (
    <Flex my={1}>
      <Text as="strong" width={width}>
        {label}
      </Text>
      <Text flex="1">{data}</Text>
    </Flex>
  )
}

export default CurrentContactDetails
