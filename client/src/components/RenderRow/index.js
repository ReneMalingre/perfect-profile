import React, { useState, useRef, useEffect } from 'react'
import {
  Text,
  Flex,
  Input,
  Button,
  Textarea,
  useBreakpointValue,
} from '@chakra-ui/react'

function RenderRow({
  label,
  data, // this is the data that'll be displayed and edited
  width,
  labelStyle = {},
  onDataChange, // This callback notifies the parent when data changes
  validate,
  formatData,
  isTextArea = false,
  inputPrompt,
}) {
  const [isEditing, setIsEditing] = useState(false)
  const [localData, setLocalData] = useState(data || '') // local copy for editing
  const [initialData, setInitialData] = useState(data || '') // initial data for cancel
  const [isValid, setIsValid] = useState(true) // is the data valid?
  const inputRef = useRef(null)
  const isSmallScreen = useBreakpointValue({ base: true, md: false })
  // check for valid data when the data changes & at the start
  useEffect(() => {
    const initialValidity = validate ? validate(localData) : true
    setIsValid(initialValidity)
  }, [localData, validate])

  // Focus the input when editing begins
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isEditing])

  const saveButtonStyle = {
    fontWeight: 'normal',
    color: isValid ? 'green.50' : 'red.50',
    bgColor: isValid ? 'green.500' : 'red.800',
    size: 'sm',
    _hover: { bgColor: isValid ? 'green.800' : 'red.800' },
  }

  const cancelButtonStyle = {
    fontWeight: 'normal',
    color: 'blue.50',
    bgColor: 'headerFooterBg.500',
    size: 'sm',
    _hover: { bgColor: 'blue.800' },
  }

  // user clicks the text to start editing
  const handleTextClick = () => {
    setInitialData(localData) // Capture the value when editing starts
    setIsEditing(true)
  }

  // user changes the input value so update local state
  const handleInputChange = (event) => {
    setLocalData(event.target.value)
  }
  const handleCancel = () => {
    setLocalData(initialData)
    setIsEditing(false)
  }

  // user clicks the save button, so notify the parent
  const handleSave = () => {
    // Check if data has changed
    if (localData !== initialData) {
      // If a validate function is provided, use it.
      // Otherwise, assume the data is valid
      const isDataValid = validate ? validate(localData) : true
      setIsValid(isDataValid) //update state
      if (isDataValid) {
        // If data is valid, format it if a function is provided
        const formattedData = formatData ? formatData(localData) : localData
        if (formattedData !== localData) {
          setLocalData(formattedData) // update local state
        }
        onDataChange(formattedData) // notify the parent of the change
        setIsEditing(false)
      } else {
        // If data is invalid, don't save it
      }
    }
    setIsEditing(false)
  }

  const handleInputKeyDown = (event) => {
    if (event.key === 'Enter' && isValid) {
      // Check if pressed key is Enter and data is valid
      handleSave()
    } else if (event.key === 'Escape') {
      handleCancel()
    }
  }

  return (
    <Flex
      my={1}
      direction={
        isTextArea
          ? 'column'
          : isSmallScreen
          ? 'column'
          : isEditing
          ? 'column'
          : 'row'
      }
    >
      <Text
        as="strong"
        {...labelStyle}
        width={isTextArea ? '100%' : width}
        onClick={isEditing ? null : handleTextClick}
        cursor={isEditing ? 'default' : 'pointer'}
      >
        {label}
      </Text>
      {isEditing ? (
        <Flex
          direction={isTextArea ? 'column' : isSmallScreen ? 'column' : 'row'}
          flex="1"
          alignItems={isTextArea ? 'start' : isSmallScreen ? 'end' : 'center'}
          width="100%"
        >
          {isTextArea ? (
            <Textarea
              value={localData}
              onChange={handleInputChange}
              ref={inputRef}
              backgroundColor={!isValid ? 'red.50' : 'green.50'}
              border={!isValid ? '1px solid red' : '1px solid green'}
              focusBorderColor={!isValid ? 'red.200' : 'green.200'}
              onKeyDown={handleInputKeyDown}
              mb={2}
              placeholder={inputPrompt}
              sx={{
                '::placeholder': {
                  color: 'gray.500',
                  fontSize: 'xs',
                },
              }}
              height={'4rem'}
            />
          ) : (
            <Input
              value={localData}
              onChange={handleInputChange}
              ref={inputRef}
              backgroundColor={!isValid ? 'red.50' : 'green.50'}
              border={!isValid ? '1px solid red' : '1px solid green'}
              focusBorderColor={!isValid ? 'red.200' : 'green.200'}
              onKeyDown={handleInputKeyDown}
              placeholder={inputPrompt}
              sx={{
                '::placeholder': {
                  color: 'gray.500',
                  fontSize: 'xs',
                },
              }}
              height={'2rem'}
            />
          )}
          <Flex flex="0" mt={isSmallScreen ? 1 : 0}>
            <Button
              onClick={handleSave}
              ml={isTextArea ? 0 : 1}
              isDisabled={!isValid}
              {...saveButtonStyle}
            >
              Save
            </Button>
            <Button onClick={handleCancel} ml={1} {...cancelButtonStyle}>
              Cancel
            </Button>
          </Flex>
        </Flex>
      ) : (
        <Text
          flex="1"
          onClick={handleTextClick}
          cursor="pointer"
          backgroundColor={isValid ? 'green.50' : 'red.100'}
          _hover={{ backgroundColor: isValid ? 'green.200' : 'red.200' }}
          px={2}
          borderRadius="md"
        >
          {isTextArea ? localData || 'Click to enter data' : localData}
        </Text>
      )}
    </Flex>
  )
}

export default RenderRow
