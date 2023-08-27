import React, { useRef, useState, useEffect } from 'react'
import { Box, Flex, Text, chakra, Center } from '@chakra-ui/react'
import { useAppState } from '../../utils/AppContext'
import { useMutation } from '@apollo/client'
import RenderRow from '../RenderRow'
import { UPSERT_VISUAL_NEEDS } from '../../utils/graphql/visualNeedsMutations'
import { SET_VISUAL_NEEDS } from '../../utils/actions'
import {
  omitTypename,
  setNestedObjectValue,
  deepEqual,
} from '../../utils/utils'

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
    fontStyle: 'italic',
    paddingLeft: '0px',
  }

  const handleDataChange = async (newData, rowId) => {
    console.log('handleDataChange', newData, rowId)
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
      console.log('no state.visualNeeds')
      updatedData = { userId: state.userData.id }
      updatedData[rowId] = newData
    } else {
      console.log('state.visualNeeds exists')

      updatedData = JSON.parse(JSON.stringify(state.visualNeeds))
      console.log('updatedData', updatedData)

      // Update the nested property using the utility function
      setNestedObjectValue(updatedData, rowId, newData)
    }
    console.log('New updatedData', updatedData)

    // update the global state
    if (!updatedData) {
      console.log('no updatedData', rowId, newData)
      return
    }

    // update the global state
    if (!updatedData) {
      console.log('no updatedData', rowId, newData)
      return
    }

    dispatch({
      type: SET_VISUAL_NEEDS,
      payload: updatedData,
    })

    // update the database
    if (!lastSavedData || !deepEqual(updatedData, lastSavedData)) {
      console.log('updatedData', updatedData)
      console.log('lastSavedData', lastSavedData)
      const queryUserId = state.userData.id
      try {
        const userInput = {
          ...updatedData,
        }
        console.log('userInput', userInput)
        console.log('userId', queryUserId)

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
          console.log('returnedData', returnedData)
          setLastSavedData(returnedData)
        }
      } catch (error) {
        console.error('Network error:', error)
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
    <Box borderWidth="1px" borderRadius="lg" p={4} boxShadow="md">
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
          Your Occupational Vision Needs:
        </Text>
        <RenderRow
          label="Current occupation:"
          data={state.visualNeeds.occupation}
          width={labelWidth}
          onDataChange={(newData) => handleDataChange(newData, 'occupation')}
          validate={validateCompulsory}
          labelStyle={renderLabelStyle}
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
        />
        <RenderRow
          label="Extended distance activities"
          data={state.visualNeeds.workExtendedDistance}
          width={labelWidth}
          onDataChange={(newData) =>
            handleDataChange(newData, 'WorkExtendedDistance')
          }
          validate={validateTextEntry}
          labelStyle={renderLabelStyle}
        />
        <RenderRow
          label="Eye safety issues:"
          data={state.visualNeeds.workEyeSafety}
          width={labelWidth}
          onDataChange={(newData) => handleDataChange(newData, 'workEyeSafety')}
          validate={validateTextEntry}
          labelStyle={renderLabelStyle}
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
        />
        <Text fontSize="xl" fontWeight="bold">
          Near Vision Needs:
        </Text>
        <RenderRow
          label="Non-work screen time/day:"
          data={state.visualNeeds.lifeScreenTime}
          width={labelWidth}
          onDataChange={(newData) =>
            handleDataChange(newData, 'lifeScreenTime')
          }
          validate={validateTextEntry}
          labelStyle={renderLabelStyle}
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
        />
        <RenderRow
          label="Other near activity:"
          data={state.visualNeeds.lifeOtherNear}
          width={labelWidth}
          onDataChange={(newData) => handleDataChange(newData, 'lifeOtherNear')}
          validate={validateTextEntry}
          labelStyle={renderLabelStyle}
        />
        <Text fontSize="xl" fontWeight="bold">
          Distance Vision Needs:
        </Text>
        <RenderRow
          label="Driving hours/day"
          data={state.visualNeeds.lifeDrivingTime}
          width={labelWidth}
          onDataChange={(newData) =>
            handleDataChange(newData, 'lifeDrivingTime')
          }
          validate={validateTextEntry}
          labelStyle={renderLabelStyle}
        />
        <RenderRow
          label="Sports/exercise hours/day:"
          data={state.visualNeeds.lifeExerciseTime}
          width={labelWidth}
          onDataChange={(newData) =>
            handleDataChange(newData, 'lifeExerciseTime')
          }
          validate={validateTextEntry}
          labelStyle={renderLabelStyle}
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
        />
        <Text fontSize="xl" fontWeight="bold">
          Other Visual Needs:
        </Text>
        <RenderRow
          label="What else do we need to know about your vision needs?"
          data={state.visualNeeds.generalInfo}
          width={labelWidth}
          onDataChange={(newData) => handleDataChange(newData, 'generalInfo')}
          validate={validateTextEntry}
          labelStyle={renderLabelStyle}
          isTextArea={true}
        />
      </Flex>
    </Box>
  )
}

export default VisualNeeds
