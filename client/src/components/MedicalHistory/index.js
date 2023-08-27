import React, { useRef, useState, useEffect } from 'react'
import { Box, Flex, Text, chakra, Center } from '@chakra-ui/react'
import { useAppState } from '../../utils/AppContext'
import RenderRow from '../RenderRow'

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
        Presbyopia (age near blur):&nbsp;&nbsp;
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
        <RenderRow
          label="Diabetes:"
          data={'no'}
          width={labelWidth}
          id="diabetes"
        />
        <RenderRow
          label="High blood pressure:"
          data={'no'}
          width={labelWidth}
          id="highBloodPressure"
        />
        <RenderRow
          label="Autoimmune disease"
          data={'yes'}
          width={labelWidth}
          id="autoimmuneDisease"
        />
        <RenderRow
          label="Thyroid disease"
          data={'yes'}
          width={labelWidth}
          id="thyroidDisease"
        />
        <RenderRow
          label="Smoker:"
          data={'yes'}
          width={labelWidth}
          id="smoker"
        />
        <RenderRow
          label="Other significant:"
          data={'no'}
          width={labelWidth}
          id="otherSignificant"
        />
        <Text fontSize="xl" fontWeight="bold">
          Your Family's Eye and Health Conditions:
        </Text>
        <RenderRow
          label="Diabetes:"
          data={'no'}
          width={labelWidth}
          id="familyDiabetes"
        />
        <RenderRow
          label="Autoimmune disease"
          data={'yes'}
          width={labelWidth}
          id="familyAutoImmuneDisease"
        />
        <RenderRow
          label="Glaucoma:"
          data={'no'}
          width={labelWidth}
          id="familyGlaucoma"
        />
        <RenderRow
          label="Cataracts:"
          data={'no'}
          width={labelWidth}
          id="familyCataracts"
        />
        <RenderRow
          label="Macular Degeneration:"
          data={'no'}
          width={labelWidth}
          id="familyARMD"
        />
        <RenderRow
          label="Keratoconus:"
          data={'no'}
          width={labelWidth}
          id="familyKeratoconus"
        />
        <RenderRow
          label="Retinal Detachment:"
          data={'no'}
          width={labelWidth}
          id="familyRetinalDetachment"
        />
        <RenderRow
          label="Strabismus or Amblyopia:"
          data={'no'}
          width={labelWidth}
          id="familyStrabismus"
        />
        <RenderRow
          label="Other inheritable conditions:"
          data={'no'}
          width={labelWidth}
          id="familyOtherInheritableConditions"
        />
      </Flex>
    </Box>
  )
}

export default MedicalHistory
