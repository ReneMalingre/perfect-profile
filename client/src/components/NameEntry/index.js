import React, { useState, useRef, useEffect } from 'react'
import { Input, Flex, Button, Text, useBreakpointValue } from '@chakra-ui/react'
import { getFullName, deepEqual } from '../../utils/utils'

function NameEntry({
  label,
  data, // this is the data that'll be displayed and edited
  width,
  labelStyle = {},
  onDataChange, // This callback notifies the parent when data changes
}) {
  const [isEditing, setIsEditing] = useState(false)
  const [isValid, setIsValid] = useState(true) // is the data valid?
  const [localData, setLocalData] = React.useState({
    title: data.title || '',
    firstName: data.firstName || '',
    middleName: data.middleName || '',
    lastName: data.lastName || '',
    preferredFirstName: data.preferredFirstName || '',
  })

  const [initialData, setInitialData] = useState({
    title: data.title || '',
    firstName: data.firstName || '',
    middleName: data.middleName || '',
    lastName: data.lastName || '',
    preferredFirstName: data.preferredFirstName || '',
  }) // initial data for cancel

  useEffect(() => {
    const validate = (data) => {
      if (!data) {
        return false
      }
      if (!data.firstName) {
        return false
      }
      if (!data.lastName) {
        return false
      }
      return true
    }

    setIsValid(validate(localData))
  }, [localData])

  const inputRef = useRef(null)

  // Focus the input when editing begins
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isEditing])

  const isSmallScreen = useBreakpointValue({ base: true, md: false })
  const nameDetails = getFullName(localData)

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
  const inputStyle = {
    height: '1.8rem',
    backgroundColor: !isValid ? 'red.100' : 'green.50',
    border: !isValid ? '1px solid red' : '1px solid green',
    focusBorderColor: !isValid ? 'red.200' : 'green.200',
    sx: {
      '::placeholder': {
        color: 'gray.500',
        fontSize: 'xs',
      },
    },
    mb: 1,
  }
  const inputStyleNotCompulsory = {
    height: '1.8rem',
    backgroundColor: 'green.50',
    border: '1px solid green',
    focusBorderColor: 'green.200',
    sx: {
      '::placeholder': {
        color: 'gray.500',
        fontSize: 'xs',
      },
    },
    mb: 1,
  }

  // user clicks the text to start editing
  const handleTextClick = () => {
    setInitialData(localData) // Capture the value when editing starts
    setIsEditing(true)
  }

  // user changes the input value so update local state
  const handleInputChange = (event, identifier) => {
    const value = event.target.value
    // copy the local data object
    const obj = { ...localData }

    const keys = identifier.split('.')
    let current = obj

    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]]
    }

    current[keys[keys.length - 1]] = value
    // set the single field value
    setLocalData(current)
  }

  // user clicks the save button, so notify the parent
  const handleSave = () => {
    // Check if data has changed
    if (!deepEqual(localData, initialData)) {
      onDataChange(localData) // notify the parent of the change only if data changed
    }
    // reset the UI
    setIsEditing(false)
  }

  const handleCancel = () => {
    // reset the UI
    setLocalData(initialData)
    setIsEditing(false)
  }

  return (
    <Flex
      my={1}
      direction={isEditing ? (isSmallScreen ? 'column' : 'row') : 'row'}
    >
      <Text
        as="strong"
        {...labelStyle}
        width={width}
        onClick={isEditing ? null : handleTextClick}
        cursor={isEditing ? 'default' : 'pointer'}
      >
        {label}
      </Text>
      {isEditing ? (
        <Flex direction="column" flex="1">
          <Input
            placeholder="Title"
            value={localData.title}
            onChange={(e) => handleInputChange(e, 'title')}
            ref={inputRef}
            {...inputStyleNotCompulsory}
          />
          <Input
            placeholder="First Name"
            value={localData.firstName}
            onChange={(e) => handleInputChange(e, 'firstName')}
            {...inputStyle}
          />
          <Input
            placeholder="Middle Name"
            value={localData.middleName}
            onChange={(e) => handleInputChange(e, 'middleName')}
            {...inputStyleNotCompulsory}
          />
          <Input
            placeholder="Last Name"
            value={localData.lastName}
            onChange={(e) => handleInputChange(e, 'lastName')}
            {...inputStyle}
          />
          <Input
            placeholder="Preferred First name"
            value={localData.preferredFirstName}
            onChange={(e) => handleInputChange(e, 'preferredFirstName')}
            {...inputStyleNotCompulsory}
          />
          <Flex mb={1} direction="row" mt={1}>
            <Button
              onClick={handleSave}
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
          px={1}
          borderRadius="md"
        >
          {nameDetails}
        </Text>
      )}
    </Flex>
  )
}

export default NameEntry
