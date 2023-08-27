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
  Center,
} from '@chakra-ui/react'

import RenderRow from '../RenderRow'
import { useMutation } from '@apollo/client'
import { useAppState } from '../../utils/AppContext'
import { UPDATE_NEW_CLIENT_QUESTIONS_BY_USER_ID } from '../../utils/graphql/newClientMutations'
import {
  SET_NEW_CLIENT_QUESTIONS,
  LOGOUT,
  SET_CURRENT_PAGE,
} from '../../utils/actions'
import {
  omitTypename,
  setNestedObjectValue,
  deepEqual,
} from '../../utils/utils'
import Auth from '../../utils/auth'

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
    fontStyle: 'normal',
    paddingLeft: '12px',
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
      if (Auth.loggedIn()) {
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
              JSON.stringify(
                data.updateNewClientQuestionsByUserId,
                omitTypename
              )
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
    <Box>
      {/* Invisible text to get its width using chakra */}
      <chakra.div
        ref={longestLabelRef}
        position="absolute"
        opacity="0"
        {...renderLabelStyle}
      >
        How would you like them improved?&nbsp;&nbsp;
      </chakra.div>
      <Center>
        <Text fontSize="xl" fontWeight="bold" mb={4}>
          Questions for New Clients
        </Text>
      </Center>
      <Stack spacing={4}>
        <FormControl>
          <FormLabel fontWeight="bold">
            Why did you choose Adelaide Eye Care?
          </FormLabel>
          <Select
            height={'2rem'}
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
              data={state.newClientQuestions.whoToThank}
              width={labelWidth}
              onDataChange={(newData) =>
                handleDataChange(newData, 'whoToThank')
              }
              labelStyle={renderLabelStyle}
              inputPrompt="eg Dr Smith, Jane Doe"
            />
          )}
        </FormControl>

        <FormControl>
          <FormLabel fontWeight="bold">
            Is this your First Eye Examination?
          </FormLabel>
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
          {!state.newClientQuestions.firstEyeExam && (
            <Box mt={2}>
              <RenderRow
                label="How long ago was your previous?"
                data={state.newClientQuestions.timeSinceLastExam}
                width={labelWidth}
                onDataChange={(newData) =>
                  handleDataChange(newData, 'timeSinceLastExam')
                }
                labelStyle={renderLabelStyle}
                validate={validateCompulsoryTextEntry}
                inputPrompt="eg 2 years, 1 month"
              />
            </Box>
          )}
        </FormControl>

        <FormControl>
          <FormLabel fontWeight="bold">
            Do you currently wear spectacles?
          </FormLabel>
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
            <Box mt={2}>
              <RenderRow
                label="What types of specs do you wear?"
                data={state.newClientQuestions.spectacleTypes}
                width={labelWidth}
                onDataChange={(newData) =>
                  handleDataChange(newData, 'spectacleTypes')
                }
                labelStyle={renderLabelStyle}
                validate={validateCompulsoryTextEntry}
                inputPrompt="eg multifocals, readers, Rx sunnies"
              />
              <RenderRow
                label="How would you like them improved?"
                data={state.newClientQuestions.spectacleDesire}
                width={labelWidth}
                onDataChange={(newData) =>
                  handleDataChange(newData, 'spectacleDesire')
                }
                labelStyle={renderLabelStyle}
                validate={validateTextEntry}
                inputPrompt="eg thinner, clearer, more stylish, more comfortable"
              />
            </Box>
          )}
        </FormControl>

        <FormControl>
          <FormLabel fontWeight="bold">
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
            <Box mt={2}>
              <RenderRow
                label="Contact lens types you wear:"
                data={state.newClientQuestions.contactLensTypes}
                width={labelWidth}
                onDataChange={(newData) =>
                  handleDataChange(newData, 'contactLensTypes')
                }
                labelStyle={renderLabelStyle}
                validate={validateCompulsoryTextEntry}
                inputPrompt="eg soft, rigid, multifocal, toric"
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
                inputPrompt="eg daily, just for sport, occasionally"
              />
              <RenderRow
                label="How would you like them improved?"
                data={state.newClientQuestions.contactLensDesire}
                width={labelWidth}
                onDataChange={(newData) =>
                  handleDataChange(newData, 'contactLensDesire')
                }
                labelStyle={renderLabelStyle}
                validate={validateTextEntry}
                inputPrompt="eg more comfortable, better vision, less dryness"
              />
            </Box>
          )}
        </FormControl>
        <FormControl>
          <RenderRow
            label="Is there other information we should know about you?"
            data={state.newClientQuestions.generalInfo}
            width={labelWidth}
            onDataChange={(newData) => handleDataChange(newData, 'generalInfo')}
            labelStyle={{
              ...renderLabelStyle,
              fontWeight: 'bold',
              fontSize: 'md',
            }}
            validate={validateTextEntry}
            isTextArea={true}
            inputPrompt="eg I'm a bit colour blind, my mother had glaucoma"
          />
        </FormControl>
      </Stack>
    </Box>
  )
}

export default NewClientQueries
