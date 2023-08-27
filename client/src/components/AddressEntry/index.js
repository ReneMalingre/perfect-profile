import React, { useState, useRef, useEffect } from 'react'
import { Input, Flex, Button, Text } from '@chakra-ui/react'
import { getFullAddress, deepEqual } from '../../utils/utils'

function AddressEntry({
  label,
  data, // this is the data that'll be displayed and edited
  width,
  labelStyle = {},
  onDataChange, // This callback notifies the parent when data changes
}) {
  const [isEditing, setIsEditing] = useState(false)
  const [localData, setLocalData] = useState({
    street1: data.street1 || '',
    street2: data.street2 || '',
    city: data.city || '',
    state: data.state || '',
    postalCode: data.postalCode || '',
    country: data.country || '',
  })

  // local copy for editing
  const [initialData, setInitialData] = useState({
    street1: data.street1 || '',
    street2: data.street2 || '',
    city: data.city || '',
    state: data.state || '',
    postalCode: data.postalCode || '',
    country: data.country || '',
  }) // initial data for cancel

  const addressDetails = getFullAddress(localData)

  const inputRef = useRef(null)

  // Focus the input when editing begins
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isEditing])
  const isValid = true

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
    <Flex my={1}>
      <Text as="strong" {...labelStyle} width={width}>
        {label}
      </Text>
      {isEditing ? (
        <Flex flex="1" direction="column">
          <Input
            placeholder="Street 1"
            value={localData.street1}
            onChange={(e) => handleInputChange(e, 'street1')}
            ref={inputRef}
            {...inputStyle}
          />
          <Input
            placeholder="Street 2"
            value={localData.street2}
            onChange={(e) => handleInputChange(e, 'street2')}
            {...inputStyle}
          />
          <Input
            placeholder="City"
            value={localData.city}
            onChange={(e) => handleInputChange(e, 'city')}
            {...inputStyle}
          />
          <Input
            placeholder="State"
            value={localData.state}
            onChange={(e) => handleInputChange(e, 'state')}
            {...inputStyle}
          />
          <Input
            placeholder="Postal Code"
            value={localData.postalCode}
            onChange={(e) => handleInputChange(e, 'postalCode')}
            {...inputStyle}
          />
          <Input
            placeholder="Country"
            value={localData.country}
            onChange={(e) => handleInputChange(e, 'country')}
            {...inputStyle}
          />
          <Flex mb={1} direction="row">
            <Button onClick={handleSave} {...saveButtonStyle}>
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
          backgroundColor="green.50"
          _hover={{ backgroundColor: 'green.200' }}
          px={1}
          borderRadius="md"
        >
          {addressDetails}
        </Text>
      )}
    </Flex>
  )
}

export default AddressEntry
