import React, { useRef, useState, useEffect } from 'react'
import { Box, Flex, Text, chakra, Link, Icon, Center } from '@chakra-ui/react'
import { useAppState } from '../../utils/AppContext'

function VisualNeeds() {
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
          Your Visual Needs
        </Text>
      </Center>
      <Text>explanation here</Text>
      <Text mb={1}>
        Please review these details below, and correct any errors:
      </Text>
      <Flex direction="column">
        <Text fontSize="xl" fontWeight="bold">
          Your Occupational Visual Needs:
        </Text>
        {renderRow('Current occupation:', 'optometrist', labelWidth)}
        {renderRow('Job environment:', 'indoors, clean, well lit', labelWidth)}
        {renderRow('Work screen time/day:', '5 hours', labelWidth)}
        {renderRow('Extended near activities:', '', labelWidth)}
        {renderRow('Extended distance activities', 'yes', labelWidth)}
        {renderRow('Eye safety issues:', 'yes - lathes', labelWidth)}
        {renderRow('Other job information:', '', labelWidth)}
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

export default VisualNeeds
