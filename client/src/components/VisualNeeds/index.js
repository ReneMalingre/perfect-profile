import React, { useRef, useState, useEffect } from 'react'
import { Box, Flex, Text, chakra, Center } from '@chakra-ui/react'
import { useAppState } from '../../utils/AppContext'
import { useMutation } from '@apollo/client'
import RenderRow from '../RenderRow'
import QuestionnaireSubHeading from '../QuestionnaireSubHeading'
import { UPSERT_VISUAL_NEEDS } from '../../utils/graphql/visualNeedsMutations'
import { SET_VISUAL_NEEDS, LOGOUT, SET_CURRENT_PAGE } from '../../utils/actions'
import {
  omitTypename,
  setNestedObjectValue,
  deepEqual,
} from '../../utils/utils'
import Auth from '../../utils/auth'

function VisualNeeds() {
  const { state, dispatch } = useAppState()
  const [upsertVisualNeeds, { loading, error }] =
    useMutation(UPSERT_VISUAL_NEEDS)
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

    // Create a deep copy of state.visualNeeds
    if (!state.visualNeeds) {
      updatedData = { userId: state.userData.id }
      updatedData[rowId] = newData
    } else {
      updatedData = JSON.parse(JSON.stringify(state.visualNeeds))

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
      type: SET_VISUAL_NEEDS,
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

          const { data, errors } = await upsertVisualNeeds({
            variables: { userId: queryUserId, input: userInput },
          })

          if (errors) {
            console.error('Errors from server:', errors)
            return
          }

          // update the state with the returned data
          if (data) {
            const returnedData = JSON.parse(
              JSON.stringify(data.upsertVisualNeeds, omitTypename)
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

  function validateCompulsory(data) {
    if (data === null) {
      return false
    }
    data = data.trim()
    if (data.length < 3) {
      return false
    }
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
        Extended distance activities:&nbsp;&nbsp;
      </chakra.div>

      <Center>
        <Text fontSize="xl" fontWeight="bold" mb={2} color="panelLightText.500">
          Your Visual Needs
        </Text>
      </Center>
      <Center>
        <Text mb={1} color="panelHeading.500">
          Knowing your needs helps us to advise you on the best vision
          solutions.
        </Text>
      </Center>
      <Flex direction="column">
        <QuestionnaireSubHeading heading="Your Occupational Vision Needs:" />
        <RenderRow
          label="Current occupation:"
          data={state.visualNeeds.occupation}
          width={labelWidth}
          onDataChange={(newData) => handleDataChange(newData, 'occupation')}
          validate={validateCompulsory}
          labelStyle={renderLabelStyle}
          inputPrompt="eg accountant, teacher, student, retiree"
        />
        <RenderRow
          label="Job environment:"
          data={state.visualNeeds.workEnvironment}
          width={labelWidth}
          onDataChange={(newData) =>
            handleDataChange(newData, 'workEnvironment')
          }
          validate={validateTextEntry}
          labelStyle={renderLabelStyle}
          inputPrompt="eg office, factory, clean, dusty, glary, outdoors"
        />
        <RenderRow
          label="Work screen time/day:"
          data={state.visualNeeds.workScreenTime}
          width={labelWidth}
          onDataChange={(newData) =>
            handleDataChange(newData, 'workScreenTime')
          }
          validate={validateTextEntry}
          labelStyle={renderLabelStyle}
          inputPrompt="eg 6 hours/day, desktop 2 screens, 80 cm away"
        />
        <RenderRow
          label="Extended near activities:"
          data={state.visualNeeds.workExtendedNear}
          width={labelWidth}
          onDataChange={(newData) =>
            handleDataChange(newData, 'workExtendedNear')
          }
          validate={validateTextEntry}
          labelStyle={renderLabelStyle}
          inputPrompt="eg drafting, writing, jewellery making"
        />
        <RenderRow
          label="Extended distance activities"
          data={state.visualNeeds.workExtendedDistance}
          width={labelWidth}
          onDataChange={(newData) =>
            handleDataChange(newData, 'workExtendedDistance')
          }
          validate={validateTextEntry}
          labelStyle={renderLabelStyle}
          inputPrompt="eg surveying 2 hours/day, driving 4 hours/day"
        />
        <RenderRow
          label="Eye safety issues:"
          data={state.visualNeeds.workEyeSafety}
          width={labelWidth}
          onDataChange={(newData) => handleDataChange(newData, 'workEyeSafety')}
          validate={validateTextEntry}
          labelStyle={renderLabelStyle}
          inputPrompt="eg dust, chemicals, UV, heat, glare, grinding"
        />
        <RenderRow
          label="Other job information:"
          data={state.visualNeeds.workOtherNeeds}
          width={labelWidth}
          onDataChange={(newData) =>
            handleDataChange(newData, 'workOtherNeeds')
          }
          validate={validateTextEntry}
          labelStyle={renderLabelStyle}
          inputPrompt="eg shift work, heavy machinery, night driving"
        />
        <QuestionnaireSubHeading heading="Near Vision Needs:" />
        <RenderRow
          label="Non-work screen time/day:"
          data={state.visualNeeds.lifeScreenTime}
          width={labelWidth}
          onDataChange={(newData) =>
            handleDataChange(newData, 'lifeScreenTime')
          }
          validate={validateTextEntry}
          labelStyle={renderLabelStyle}
          inputPrompt="eg 2 hours social media, 1 hour gaming"
        />
        <RenderRow
          label="Printed reading time/day:"
          data={state.visualNeeds.lifeReadingTime}
          width={labelWidth}
          onDataChange={(newData) =>
            handleDataChange(newData, 'lifeReadingTime')
          }
          validate={validateTextEntry}
          labelStyle={renderLabelStyle}
          inputPrompt="eg 1 hours during day, 1 hour in bed"
        />
        <RenderRow
          label="Other near activity:"
          data={state.visualNeeds.lifeOtherNear}
          width={labelWidth}
          onDataChange={(newData) => handleDataChange(newData, 'lifeOtherNear')}
          validate={validateTextEntry}
          labelStyle={renderLabelStyle}
          inputPrompt="eg sewing, model making, board games"
        />
        <QuestionnaireSubHeading heading="Distance Vision Needs:" />
        <RenderRow
          label="Driving hours/day"
          data={state.visualNeeds.lifeDrivingTime}
          width={labelWidth}
          onDataChange={(newData) =>
            handleDataChange(newData, 'lifeDrivingTime')
          }
          validate={validateTextEntry}
          labelStyle={renderLabelStyle}
          inputPrompt="eg 2 hours during day, 1 at night"
        />
        <RenderRow
          label="Sports/exercise hours/week:"
          data={state.visualNeeds.lifeExerciseTime}
          width={labelWidth}
          onDataChange={(newData) =>
            handleDataChange(newData, 'lifeExerciseTime')
          }
          validate={validateTextEntry}
          labelStyle={renderLabelStyle}
          inputPrompt="eg golf 4 hours, netball 2 hours"
        />
        <RenderRow
          label="Types of sport/exercise:"
          data={state.visualNeeds.lifeExerciseTypes}
          width={labelWidth}
          onDataChange={(newData) =>
            handleDataChange(newData, 'lifeExerciseTypes')
          }
          validate={validateTextEntry}
          labelStyle={renderLabelStyle}
          inputPrompt="eg running, gym, pilates"
        />
        <RenderRow
          label="Other distance activity:"
          data={state.visualNeeds.lifeOtherDistance}
          width={labelWidth}
          onDataChange={(newData) =>
            handleDataChange(newData, 'lifeOtherDistance')
          }
          validate={validateTextEntry}
          labelStyle={renderLabelStyle}
          inputPrompt="eg walking, hiking, bird watching"
        />
        <RenderRow
          label="What else do we need to know about your vision needs?"
          data={state.visualNeeds.generalInfo}
          width={labelWidth}
          onDataChange={(newData) => handleDataChange(newData, 'generalInfo')}
          validate={validateTextEntry}
          labelStyle={{
            ...renderLabelStyle,
            fontWeight: 'bold',
            fontSize: 'md',
            color: 'panelLightText.500',
          }}
          isTextArea={true}
          inputPrompt="Please enter any other information about your vision needs you think will be helpful to us to help you."
        />
      </Flex>
    </Box>
  )
}

export default VisualNeeds
