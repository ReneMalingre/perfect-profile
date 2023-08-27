import React, { useState, useRef, useEffect } from 'react'
import {
  Box,
  Text,
  Select,
  Stack,
  FormControl,
  FormLabel,
  Radio,
  RadioGroup,
  chakra,
} from '@chakra-ui/react'

import RenderRow from '../RenderRow'
import { useMutation } from '@apollo/client'
import { useAppState } from '../../utils/AppContext'
import { UPDATE_NEW_CLIENT_QUESTIONS_BY_USER_ID } from '../../utils/graphql/newClientMutations'
import { SET_NEW_CLIENT_QUESTIONS } from '../../utils/actions'
import {
  omitTypename,
  setNestedObjectValue,
  deepEqual,
} from '../../utils/utils'

function NewClientQueries() {
  const { state, dispatch } = useAppState()
  const [updateNewClientQuestionsByUserId, { loading, error }] = useMutation(
    UPDATE_NEW_CLIENT_QUESTIONS_BY_USER_ID
  )
  const [lastSavedData, setLastSavedData] = useState({}) // this is the last saved data from the database

  // style of the label of the RenderRow component
  const renderLabelStyle = {
    fontSize: 'sm',
    fontWeight: 'normal',
    fontStyle: 'italic',
    paddingLeft: '0px',
  }

  // get the width of the longest label
  const longestLabelRef = useRef(null)
  const [labelWidth, setLabelWidth] = useState(200)
  useEffect(() => {
    if (longestLabelRef.current) {
      setLabelWidth(longestLabelRef.current.offsetWidth)
    }
  }, [longestLabelRef])

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

    // Create a deep copy of state.newClientQuestions
    if (!state.newClientQuestions) {
      updatedData = { userId: state.userData.id }
      updatedData[rowId] = newData
    } else {
      updatedData = JSON.parse(JSON.stringify(state.newClientQuestions))

      // Update the nested property using the utility function
      setNestedObjectValue(updatedData, rowId, newData)
    }

    // update the global state
    if (!updatedData) {
      return
    }

    dispatch({
      type: SET_NEW_CLIENT_QUESTIONS,
      payload: updatedData,
    })

    // update the database
    if (!lastSavedData || !deepEqual(updatedData, lastSavedData)) {
      const queryUserId = state.userData.id

      try {
        const userInput = {
          ...updatedData,
        }

        const { data, errors } = await updateNewClientQuestionsByUserId({
          variables: { userId: queryUserId, input: userInput },
        })

        if (errors) {
          console.error('Errors from server:', errors)
          return
        }

        // update the state with the returned data
        if (data) {
          const returnedData = JSON.parse(
            JSON.stringify(data.updateNewClientQuestionsByUserId, omitTypename)
          )
          setLastSavedData(returnedData)
        }
      } catch (error) {
        console.error('Network error:', error)
      }
    }
  }

  function validateCompulsoryTextEntry(data) {
    if (data === null) {
      return false
    }
    data = data.trim()
    if (data.length === 0) {
      return false
    }
    return true
  }

  function validateTextEntry(data) {
    return true
  }

  return (
    <Box padding="5" bg="white" boxShadow="md" borderRadius="md">
      {/* Invisible text to get its width using chakra */}
      <chakra.div
        ref={longestLabelRef}
        position="absolute"
        opacity="0"
        {...renderLabelStyle}
      >
        How would you like them improved?&nbsp;&nbsp;
      </chakra.div>
      <Text fontSize="xl" fontWeight="bold" mb={4}>
        New Client Questions
      </Text>

      <Stack spacing={5}>
        <FormControl>
          <FormLabel>Why did you choose Adelaide Eye Care?</FormLabel>
          <Select
            value={state.newClientQuestions.reasonForChoosing}
            onChange={(e) =>
              handleDataChange(e.target.value, 'reasonForChoosing')
            }
          >
            <option value="">Select an option</option>
            <option value="advertisement">Advertisement</option>
            <option value="professional">Health Professional</option>
            <option value="friend">Friend/Family</option>
            <option value="other">Other</option>
          </Select>
          {(state.newClientQuestions.reasonForChoosing === 'professional' ||
            state.newClientQuestions.reasonForChoosing === 'friend') && (
            <RenderRow
              label="Who can we thank?"
              data={state.newClientQuestions.contactLensTypes}
              width={labelWidth}
              onDataChange={(newData) =>
                handleDataChange(newData, 'whoToThank')
              }
              labelStyle={renderLabelStyle}
            />
          )}
        </FormControl>

        <FormControl>
          <FormLabel>Is this your First Eye Examination?</FormLabel>
          <RadioGroup
            value={state.newClientQuestions.firstEyeExam ? 'yes' : 'no'}
            onChange={(value) =>
              handleDataChange(value === 'yes', 'firstEyeExam')
            }
          >
            <Stack direction="row">
              <Radio mx={1} value="yes">
                Yes
              </Radio>
              <Radio mx={1} value="no">
                No
              </Radio>
            </Stack>
          </RadioGroup>
          {state.newClientQuestions.firstEyeExam && (
            <Box mt={3}>
              <RenderRow
                label="Approx. how long ago was your last eye examination?"
                data={state.newClientQuestions.timeSinceLastExam}
                width={labelWidth}
                onDataChange={(newData) =>
                  handleDataChange(newData, 'timeSinceLastExam')
                }
                labelStyle={renderLabelStyle}
                validate={validateCompulsoryTextEntry}
              />
            </Box>
          )}
        </FormControl>

        <FormControl>
          <FormLabel>Do you currently wear spectacles?</FormLabel>
          <RadioGroup
            value={state.newClientQuestions.spectacleWearer ? 'yes' : 'no'}
            onChange={(value) =>
              handleDataChange(value === 'yes', 'spectacleWearer')
            }
          >
            <Stack direction="row">
              <Radio mx={1} value="yes">
                Yes
              </Radio>
              <Radio mx={1} value="no">
                No
              </Radio>
            </Stack>
          </RadioGroup>
          {state.newClientQuestions.spectacleWearer && (
            <Box mt={3}>
              <RenderRow
                label="What specs do you wear (eg multifocals, readers, Rx sunnies)?"
                data={state.newClientQuestions.spectacleTypes}
                width={labelWidth}
                onDataChange={(newData) =>
                  handleDataChange(newData, 'spectacleTypes')
                }
                labelStyle={renderLabelStyle}
                validate={validateCompulsoryTextEntry}
              />
              <RenderRow
                label="How would you like them improved?"
                data={state.newClientQuestions.spectacleDesire}
                width={labelWidth}
                onDataChange={(newData) =>
                  handleDataChange(newData, 'spectacleDesire')
                }
                labelStyle={renderLabelStyle}
                validate={validateCompulsoryTextEntry}
              />
            </Box>
          )}
        </FormControl>

        <FormControl>
          <FormLabel>
            Do currently wear or have you worn contact lenses?
          </FormLabel>
          <RadioGroup
            value={state.newClientQuestions.contactLensWearer ? 'yes' : 'no'}
            onChange={(value) =>
              handleDataChange(value === 'yes', 'contactLensWearer')
            }
          >
            <Stack direction="row">
              <Radio mx={1} value="yes">
                Yes
              </Radio>
              <Radio mx={1} value="no">
                No
              </Radio>
            </Stack>
          </RadioGroup>
          {state.newClientQuestions.contactLensWearer && (
            <Box mt={3}>
              <RenderRow
                label="Types you wear:"
                data={state.newClientQuestions.contactLensTypes}
                width={labelWidth}
                onDataChange={(newData) =>
                  handleDataChange(newData, 'contactLensTypes')
                }
                labelStyle={renderLabelStyle}
                validate={validateCompulsoryTextEntry}
              />
              <RenderRow
                label="How often do you wear them?"
                data={state.newClientQuestions.contactLensSchedule}
                width={labelWidth}
                onDataChange={(newData) =>
                  handleDataChange(newData, 'contactLensSchedule')
                }
                labelStyle={renderLabelStyle}
                validate={validateCompulsoryTextEntry}
              />
              <RenderRow
                label="How would you like them improved?"
                data={state.newClientQuestions.contactLensDesire}
                width={labelWidth}
                onDataChange={(newData) =>
                  handleDataChange(newData, 'contactLensDesire')
                }
                labelStyle={renderLabelStyle}
                validate={validateCompulsoryTextEntry}
              />
            </Box>
          )}
        </FormControl>
        <FormControl>
          <RenderRow
            label="Is there information we should know about you?"
            data={state.newClientQuestions.generalInfo}
            width={labelWidth}
            onDataChange={(newData) => handleDataChange(newData, 'generalInfo')}
            labelStyle={renderLabelStyle}
            validate={validateTextEntry}
            isTextArea={true}
          />
        </FormControl>
      </Stack>
    </Box>
  )
}

export default NewClientQueries
