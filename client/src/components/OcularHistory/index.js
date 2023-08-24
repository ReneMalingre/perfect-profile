import React, { useRef, useState, useEffect } from 'react'
import { Box, Flex, Text, chakra, Link, Icon, Center } from '@chakra-ui/react'
import { useAppState } from '../../utils/AppContext'

function OcularHistory() {
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
          Your Past Eye History
        </Text>
      </Center>
      <Text mb={1}>
        Please review these details below, and correct any errors:
      </Text>
      <Flex direction="column">
        <Text fontSize="xl" fontWeight="bold">
          Your Prescription Type:
        </Text>
        {renderRow('Myopia (shortsightedness):', 'no', labelWidth)}
        {renderRow('Hyperopia (longsightedness):', 'no', labelWidth)}
        {renderRow('Astigmatism:', 'yes', labelWidth)}
        {renderRow('Presbyopia (age-related near blur):', 'yes', labelWidth)}
        {renderRow('Emmetropia (great eyes!):', 'no', labelWidth)}
        <Text fontSize="xl" fontWeight="bold">
          Your Eye Conditions:
        </Text>
        {renderRow('Glaucoma:', 'no', labelWidth)}
        {renderRow('Cataracts:', 'no', labelWidth)}
        {renderRow('Macular Degeneration:', 'no', labelWidth)}
        {renderRow('Dry Eyes:', 'no', labelWidth)}
        {renderRow('Keratoconus:', 'no', labelWidth)}
        {renderRow('Diabetic Retinopathy:', 'no', labelWidth)}
        {renderRow('Retinal Detachment:', 'no', labelWidth)}
        {renderRow('Strabismus or Amblyopia:', 'no', labelWidth)}
        {renderRow('Other Eye Conditions:', 'no', labelWidth)}
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

export default OcularHistory
