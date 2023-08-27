import React, { useRef, useState, useEffect } from 'react'
import { Box, Flex, Text, chakra, Center } from '@chakra-ui/react'
import { useAppState } from '../../utils/AppContext'
import { useMutation } from '@apollo/client'
import RenderRow from '../RenderRow'
import QuestionnaireSubHeading from '../QuestionnaireSubHeading'
import { UPSERT_PAST_OCULAR_HISTORY } from '../../utils/graphql/pastOcularHistoryMutations'
import {
  SET_PAST_OCULAR_HISTORY,
  LOGOUT,
  SET_CURRENT_PAGE,
} from '../../utils/actions'
import {
  omitTypename,
  setNestedObjectValue,
  deepEqual,
} from '../../utils/utils'
import Auth from '../../utils/auth'

function PastOcularHistory() {
  const { state, dispatch } = useAppState()
  const [upsertPastOcularHistory, { loading, error }] = useMutation(
    UPSERT_PAST_OCULAR_HISTORY
  )
  const [lastSavedData, setLastSavedData] = useState({}) // this is the last saved data from the database

  // get the width of the longest label
  const longestLabelRef = useRef(null)
  const [labelWidth, setLabelWidth] = useState(200)
  useEffect(() => {
    if (longestLabelRef.current) {
      setLabelWidth(longestLabelRef.current.offsetWidth)
    }
  }, [longestLabelRef])

  // style of the label of the RenderRow component
  const renderLabelStyle = {
    fontSize: 'sm',
    fontWeight: 'normal',
    fontStyle: 'normal',
    paddingLeft: '0px',
  }

  const handleDataChange = async (newData, rowId) => {
    // update the state using rowId as the direction to the right property
    // ie rowId = 'contactDetails.phone' will update state.userData.contactDetails.phone
    if (newData === null) {
      newData = ''
    }
    if (!rowId) {
      return
    }
    if (rowId === '') {
      return
    }
    let updatedData

    // Create a deep copy of state.pastOcularHistory
    if (!state.pastOcularHistory) {
      updatedData = { userId: state.userData.id }
      updatedData[rowId] = newData
    } else {
      updatedData = JSON.parse(JSON.stringify(state.pastOcularHistory))

      // Update the nested property using the utility function
      setNestedObjectValue(updatedData, rowId, newData)
    }

    // update the global state
    if (!updatedData) {
      return
    }

    // update the global state
    if (!updatedData) {
      return
    }

    dispatch({
      type: SET_PAST_OCULAR_HISTORY,
      payload: updatedData,
    })

    // update the database
    if (!lastSavedData || !deepEqual(updatedData, lastSavedData)) {
      if (Auth.loggedIn()) {
        const queryUserId = state.userData.id
        try {
          const userInput = {
            ...updatedData,
          }

          const { data, errors } = await upsertPastOcularHistory({
            variables: { userId: queryUserId, input: userInput },
          })

          if (errors) {
            console.error('Errors from server:', errors)
            return
          }

          // update the state with the returned data
          if (data) {
            const returnedData = JSON.parse(
              JSON.stringify(data.upsertPastOcularHistory, omitTypename)
            )
            setLastSavedData(returnedData)
          }
        } catch (error) {
          console.error('Network error:', error)
        }
      } else {
        // not logged in
        // update state
        Auth.logout()

        dispatch({
          type: LOGOUT,
        })

        dispatch({
          type: SET_CURRENT_PAGE,
          payload: 'login',
        })
      }
    }
  }

  // set up data validation for each field if needed
  function validateTextEntry(data) {
    return true
  }

  return (
    <Box>
      {/* Invisible text to get its width using chakra */}
      <chakra.div
        ref={longestLabelRef}
        position="absolute"
        opacity="0"
        {...renderLabelStyle}
      >
        Hyperopia (longsightedness)?&nbsp;&nbsp;
      </chakra.div>

      <Center>
        <Text fontSize="xl" fontWeight="bold" mb={2}>
          Your Eye History
        </Text>
      </Center>
      <Center>
        <Text>
          We can help your eyes and vision better if we know more about you.
        </Text>
      </Center>
      <Flex direction="column">
        <QuestionnaireSubHeading heading="Your Prescription Type" />
        <RenderRow
          label="Myopia (shortsightedness)?"
          data={state.pastOcularHistory.myopia}
          width={labelWidth}
          onDataChange={(newData) => handleDataChange(newData, 'myopia')}
          validate={validateTextEntry}
          labelStyle={renderLabelStyle}
          inputPrompt="eg yes, no, mild, moderate, severe, had laser surgery"
        />
        <RenderRow
          label="Hyperopia (longsightedness)?"
          data={state.pastOcularHistory.hyperopia}
          width={labelWidth}
          onDataChange={(newData) => handleDataChange(newData, 'hyperopia')}
          validate={validateTextEntry}
          labelStyle={renderLabelStyle}
          inputPrompt="eg yes, no, mild, from infancy, left eye only,"
        />
        <RenderRow
          label="Astigmatism?"
          data={state.pastOcularHistory.astigmatism}
          width={labelWidth}
          onDataChange={(newData) => handleDataChange(newData, 'astigmatism')}
          validate={validateTextEntry}
          labelStyle={renderLabelStyle}
          inputPrompt="eg yes, no, RE only"
        />
        <RenderRow
          label="Presbyopia (age near blur)?"
          data={state.pastOcularHistory.presbyopia}
          width={labelWidth}
          onDataChange={(newData) => handleDataChange(newData, 'presbyopia')}
          validate={validateTextEntry}
          labelStyle={renderLabelStyle}
          inputPrompt="eg since 44, drives me crazy, reading glasses"
        />
        <RenderRow
          label="Emmetropia (normal vision)?"
          data={state.pastOcularHistory.emmetropia}
          width={labelWidth}
          onDataChange={(newData) => handleDataChange(newData, 'emmetropia')}
          validate={validateTextEntry}
          labelStyle={renderLabelStyle}
          inputPrompt="eg great vision, no glasses, no contacts"
        />
        <QuestionnaireSubHeading heading="Your Eye Conditions" />
        <RenderRow
          label="Glaucoma?"
          data={state.pastOcularHistory.glaucoma}
          width={labelWidth}
          onDataChange={(newData) => handleDataChange(newData, 'glaucoma')}
          validate={validateTextEntry}
          labelStyle={renderLabelStyle}
          inputPrompt="eg suspect, family history, using drops"
        />
        <RenderRow
          label="Cataracts?"
          data={state.pastOcularHistory.cataracts}
          width={labelWidth}
          onDataChange={(newData) => handleDataChange(newData, 'cataracts')}
          validate={validateTextEntry}
          labelStyle={renderLabelStyle}
          inputPrompt="eg no, yes, already had surgery"
        />
        <RenderRow
          label="Macular Degeneration?"
          data={state.pastOcularHistory.macularDegeneration}
          width={labelWidth}
          onDataChange={(newData) =>
            handleDataChange(newData, 'macularDegeneration')
          }
          validate={validateTextEntry}
          labelStyle={renderLabelStyle}
          inputPrompt="eg yes, dry, having treatment, mother has it"
        />
        <RenderRow
          label="Dry Eyes or Other Irritations?"
          data={state.pastOcularHistory.dryEyes}
          width={labelWidth}
          onDataChange={(newData) => handleDataChange(newData, 'dryEyes')}
          validate={validateTextEntry}
          labelStyle={renderLabelStyle}
          inputPrompt="eg yes, mild, using drops, worse in winter"
        />
        <RenderRow
          label="Keratoconus or Corneal Graft?"
          data={state.pastOcularHistory.keratoconus}
          width={labelWidth}
          onDataChange={(newData) => handleDataChange(newData, 'keratoconus')}
          validate={validateTextEntry}
          labelStyle={renderLabelStyle}
          inputPrompt="eg from age 17, corneal graft 2010, scleral lenses"
        />
        <RenderRow
          label="Strabismus or Amblyopia?"
          data={state.pastOcularHistory.strabismus}
          width={labelWidth}
          onDataChange={(newData) => handleDataChange(newData, 'strabismus')}
          validate={validateTextEntry}
          labelStyle={renderLabelStyle}
          inputPrompt="eg patching as child, eye muscle surgery 2010"
        />
        <RenderRow
          label="What else should we know about your eyes?"
          data={state.pastOcularHistory.generalInfo}
          width={labelWidth}
          onDataChange={(newData) => handleDataChange(newData, 'generalInfo')}
          validate={validateTextEntry}
          labelStyle={{
            ...renderLabelStyle,
            fontWeight: 'bold',
            fontSize: 'md',
          }}
          inputPrompt="eg prone to chalazia, eye allergies, had eye injuries, always wear sunnies when driving"
          isTextArea={true}
        />
      </Flex>
    </Box>
  )
}

export default PastOcularHistory
