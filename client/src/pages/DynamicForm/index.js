import React, { useState } from 'react'
import { useAppState } from '../../utils/AppContext'
import {
  getValueFromProfile,
  setValueInProfile,
  validateUserData,
} from '../../utils/utils'
import { SET_USER_DATA, SET_CURRENT_PAGE } from '../../utils/actions'
import { useMutation } from '@apollo/client'
import { UPDATE_USER } from '../../utils/graphql/userMutations' // Import your mutation

import {
  Box,
  Text,
  FormControl,
  FormLabel,
  Input,
  Select,
  Checkbox,
  VStack,
  Button,
} from '@chakra-ui/react'

function DynamicForm({ data }) {
  const { state, dispatch } = useAppState()
  // get the user profile from the state
  const userData = state.userData
  // console.log('userData in DynamicForm', userData)
  const [localUserData, setLocalUserData] = useState(userData)
  const [updateUser] = useMutation(UPDATE_USER)

  // get the questionnaire data from the state
  // const questionnaireData = state.questionnaireData

  // get the audience type from the user profile
  const audienceType = userData.isNewClient
    ? ['new', 'all']
    : ['returning', 'all']

  function updateLocalUserData(id, value) {
    console.log('Updating user data in DynamicForm', id, value)

    setLocalUserData((prevState) => {
      // Create a clone of prevState to avoid modifying state directly
      const updatedUserData = { ...prevState }
      // Use setValueInProfile to set the value in the nested object
      setValueInProfile(id, value, updatedUserData)
      console.log('updatedUserData', updatedUserData)
      return updatedUserData
    })
  }
  async function finaliseChanges() {
    const isValid = validateUserData(localUserData)
    if (!isValid) {
      console.log('Invalid user data')
      return
    }

    // update the user profile in the database
    try {
      // convert user data to the correct format for the database
      const formattedUserData = {
        username: localUserData.username,
        nameDetails: localUserData.nameDetails,
        contactDetails: localUserData.contactDetails,
        dateOfBirth: localUserData.dateOfBirth,
        role: localUserData.role,
        dataFlag: localUserData.dataFlag,
        isNewClient: localUserData.isNewClient,
      }

      updateUser({
        variables: {
          id: localUserData.id,
          input: formattedUserData,
        },
      })

      // update the user profile in the state when the user is finished (ie in click finish button)
      dispatch({
        type: SET_USER_DATA,
        payload: localUserData,
      })
      dispatch({
        type: SET_CURRENT_PAGE,
        payload: 'home',
      })
    } catch (err) {
      console.log('Error updating user data', err)
      return
    }
  }

  return (
    <VStack spacing={5}>
      {data.questionnaire.map((topic) => {
        if (!audienceType.some((type) => topic.audience.includes(type)))
          return null
        return (
          <Box key={topic.topic}>
            <Text fontSize="xl">{topic.topic}</Text>
            {topic.subTopics.map((subTopic) => (
              <Box key={subTopic.subTopicTitle}>
                <Text fontSize="lg">{subTopic.subTopicTitle}</Text>
                {subTopic.moreInfo && <Text>{subTopic.moreInfo}</Text>}
                {subTopic.questions.map((question) => (
                  <QuestionComponent
                    key={question.id}
                    question={question}
                    audienceType={audienceType}
                    userData={userData}
                    updateValue={updateLocalUserData}
                  />
                ))}
              </Box>
            ))}
          </Box>
        )
      })}
      <Button
        type="button"
        backgroundColor="deepCyan.500"
        color="spaceGray.500"
        mt={2}
        _hover={{ backgroundColor: 'deepCyan.600' }}
        onClick={finaliseChanges}
      >
        Finish Questionnaire
      </Button>
    </VStack>
  )
}

function QuestionComponent({ question, audienceType, userData, updateValue }) {
  const [isCheckboxChecked, setCheckboxChecked] = useState(false)
  const [selectValue, setSelectValue] = useState('')
  const fieldValue = getValueFromProfile(question.id, userData)
  const [textInputValue, setTextInputValue] = useState(fieldValue || '')
  const [dateInputValue, setDateInputValue] = useState(fieldValue || '')

  const handleTextInputChange = (e) => {
    const value = e.target.value
    setTextInputValue(value)
    updateValue(question.id, value)
  }
  const handleSelectChange = (e) => {
    const value = e.target.value
    setSelectValue(value)
    updateValue(question.id, value)
  }
  const handleCheckboxChange = (e) => {
    const isChecked = e.target.checked
    setCheckboxChecked(isChecked)
    updateValue(question.id, isChecked)
  }

  const handleDateInputChange = (e) => {
    const value = e.target.value
    setDateInputValue(value)
    updateValue(question.id, value)
  }

  if (!audienceType.some((type) => question.audience.includes(type)))
    return null
  switch (question.type) {
    case 'text':
      return (
        <FormControl>
          <FormLabel>{question.label}</FormLabel>
          <Input
            key={`${question.id}-input`}
            id={question.id}
            name={question.id}
            value={textInputValue}
            placeholder={question.placeholder}
            onChange={handleTextInputChange}
          />
        </FormControl>
      )
    case 'select':
      return (
        <FormControl>
          <FormLabel>{question.label}</FormLabel>
          <Select onChange={handleSelectChange} key={`${question.id}-select`}>
            {question.options.map((option) =>
              typeof option === 'string' ? (
                <option key={option} value={option}>
                  {option}
                </option>
              ) : (
                <optgroup key={option.group} label={option.group}>
                  {option.items.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </optgroup>
              )
            )}
          </Select>
          {question.conditional?.ifSelected?.item === selectValue && (
            <QuestionComponent
              key={`${question.id}-followUp`}
              question={question.conditional.ifSelected.followUp}
              audienceType={audienceType}
              userData={userData}
              updateValue={updateValue}
            />
          )}
        </FormControl>
      )
    case 'checkbox':
      return (
        <FormControl>
          <Checkbox onChange={handleCheckboxChange}>{question.label}</Checkbox>
          {isCheckboxChecked && question.conditional?.ifChecked && (
            <QuestionComponent
              key={`${question.id}-conditional`}
              question={question.conditional.ifChecked}
              audienceType={audienceType}
              userData={userData}
              updateValue={updateValue}
            />
          )}
        </FormControl>
      )
    case 'date':
      return (
        <FormControl>
          <FormLabel>{question.label}</FormLabel>
          <Input
            key={`${question.id}-date`}
            type="date"
            id={question.id}
            name={question.id}
            value={dateInputValue}
            onChange={handleDateInputChange}
          />
        </FormControl>
      )
    default:
      return null
  }
}

export default DynamicForm

// Usage
// <DynamicForm data={yourJsonData} audienceType="new" />
