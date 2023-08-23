import React, { useState } from 'react'
import { useAppState } from '../../utils/AppContext'
import { getValueFromProfile } from '../../utils/utils'
import { SET_USER_DATA } from '../../utils/actions'
import {
  Box,
  Text,
  FormControl,
  FormLabel,
  Input,
  Select,
  Checkbox,
  VStack,
} from '@chakra-ui/react'

function DynamicForm({ data }) {
  const { state, dispatch } = useAppState()
  // get the user profile from the state
  const userData = state.userData
  console.log('userData in DynamicForm', userData)
  const [localUserData, setLocalUserData] = useState(userData)

  // get the questionnaire data from the state
  const questionnaireData = state.questionnaireData

  // get the audience type from the user profile
  const audienceType = userData.isNewClient
    ? ['new', 'all']
    : ['returning', 'all']

  function updateLocalUserData(id, value) {
    setLocalUserData((prevState) => ({
      ...prevState,
      [id]: value,
    }))
  }
  function finalizeChanges() {
    // update the user profile in the state when the user is finished (ie in click finish button)
    dispatch({
      type: SET_USER_DATA,
      payload: localUserData,
    })
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
      <button onClick={finalizeChanges}>Finish</button>
    </VStack>
  )
}

function QuestionComponent({ question, audienceType, userData, updateValue }) {
  const [isCheckboxChecked, setCheckboxChecked] = useState(false)
  const [selectValue, setSelectValue] = useState('')
  const fieldValue = getValueFromProfile(question.id, userData)
  const [textInputValue, setTextInputValue] = useState(fieldValue || '')

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
  if (!audienceType.some((type) => question.audience.includes(type)))
    return null
  switch (question.type) {
    case 'text':
      return (
        <FormControl>
          <FormLabel>{question.label}</FormLabel>
          <Input
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
          <Select onChange={handleSelectChange}>
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
    default:
      return null
  }
}

export default DynamicForm

// Usage
// <DynamicForm data={yourJsonData} audienceType="new" />
