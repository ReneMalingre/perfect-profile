import React, { useRef, useState, useEffect } from 'react'
import { Box, Flex, Text, chakra, Link, Icon, Center } from '@chakra-ui/react'
import { useAppState } from '../../utils/AppContext'

function MedicalHistory() {
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

  return (
    <Box borderWidth="1px" borderRadius="lg" p={4} boxShadow="md">
      {/* Invisible text to get its width using chakra */}
      <chakra.div
        ref={longestLabelRef}
        position="absolute"
        opacity="0"
        fontWeight="bold"
      >
        Presbyopia (age-related near blur):&nbsp;&nbsp;
      </chakra.div>

      <Center>
        <Text fontSize="xl" fontWeight="bold" mb={2}>
          Your Medical Details
        </Text>
      </Center>
      <Text>explanation here</Text>
      <Text mb={1}>
        Please review these details below, and correct any errors:
      </Text>
      <Flex direction="column">
        <Text fontSize="xl" fontWeight="bold">
          Your Health Conditions:
        </Text>
        {renderRow('Diabetes:', 'no', labelWidth)}
        {renderRow('High blood pressure:', 'no', labelWidth)}
        {renderRow('Autoimmune disease', 'yes', labelWidth)}
        {renderRow('Thyroid disease', 'yes', labelWidth)}
        {renderRow('Smoker:', 'yes', labelWidth)}
        {renderRow('Other significant:', 'no', labelWidth)}
        <Text fontSize="xl" fontWeight="bold">
          Your Family's Eye and Health Conditions:
        </Text>
        {renderRow('Diabetes:', 'no', labelWidth)}
        {renderRow('Autoimmune disease', 'yes', labelWidth)}
        {renderRow('Glaucoma:', 'no', labelWidth)}
        {renderRow('Cataracts:', 'no', labelWidth)}
        {renderRow('Macular Degeneration:', 'no', labelWidth)}
        {renderRow('Keratoconus:', 'no', labelWidth)}
        {renderRow('Retinal Detachment:', 'no', labelWidth)}
        {renderRow('Strabismus or Amblyopia:', 'no', labelWidth)}
        {renderRow('Other inheritable conditions:', 'no', labelWidth)}
      </Flex>
    </Box>
  )
}

function renderRow(label, data, width) {
  return (
    <Flex my="2px">
      <Text as="strong" width={width}>
        {label}
      </Text>
      <Text flex="1">{data}</Text>
    </Flex>
  )
}

export default MedicalHistory
