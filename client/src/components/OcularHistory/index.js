import React, { useRef, useState, useEffect } from 'react'
import { Box, Flex, Text, chakra, Link, Icon, Center } from '@chakra-ui/react'
import { useAppState } from '../../utils/AppContext'
import RenderRow from '../RenderRow'

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
        <RenderRow
          label="Myopia (shortsightedness):"
          data={'no'}
          width={labelWidth}
          id="myopia"
        />
        <RenderRow
          label="Hyperopia (longsightedness):"
          data={'no'}
          width={labelWidth}
          id="hyperopia"
        />
        <RenderRow
          label="Astigmatism:"
          data={'yes'}
          width={labelWidth}
          id="astigmatism"
        />
        <RenderRow
          label="Presbyopia (age-related near blur):"
          data={'yes'}
          width={labelWidth}
          id="presbyopia"
        />
        <RenderRow
          label="Emmetropia (great eyes!):"
          data={'no'}
          width={labelWidth}
          id="emmetropia"
        />
        <Text fontSize="xl" fontWeight="bold">
          Your Eye Conditions:
        </Text>
        <RenderRow
          label="Glaucoma:"
          data={'no'}
          width={labelWidth}
          id="glaucoma"
        />
        <RenderRow
          label="Cataracts:"
          data={'no'}
          width={labelWidth}
          id="cataracts"
        />
        <RenderRow
          label="Macular Degeneration:"
          data={'no'}
          width={labelWidth}
          id="armd"
        />
        <RenderRow
          label="Dry Eyes:"
          data={'no'}
          width={labelWidth}
          id="dryEyes"
        />
        <RenderRow
          label="Keratoconus:"
          data={'no'}
          width={labelWidth}
          id="keratoconus"
        />
        <RenderRow
          label="Diabetic Retinopathy:"
          data={'no'}
          width={labelWidth}
          id="diabeticRetinopathy"
        />
        <RenderRow
          label="Retinal Detachment:"
          data={'no'}
          width={labelWidth}
          id="retinalDetachment"
        />
        <RenderRow
          label="Strabismus or Amblyopia:"
          data={'no'}
          width={labelWidth}
          id="strabismus"
        />
        <RenderRow
          label="Other Eye Conditions:"
          data={'no'}
          width={labelWidth}
          id="otherEyeConditions"
        />
      </Flex>
    </Box>
  )
}

export default OcularHistory
