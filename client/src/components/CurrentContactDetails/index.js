import React, { useRef, useState, useEffect } from 'react'
import { Box, Flex, Text, chakra, Center } from '@chakra-ui/react'
import { useAppState } from '../../utils/AppContext'
import { formatDate, convertDateStringToISO } from '../../utils/utils'
import { useMutation } from '@apollo/client'
import RenderRow from '../RenderRow'
import AddressEntry from '../AddressEntry'
import NameEntry from '../NameEntry'
import { UPDATE_USER } from '../../utils/graphql/userMutations'
import { SET_USER_DATA } from '../../utils/actions'
import {
  omitTypename,
  setNestedObjectValue,
  deepEqual,
} from '../../utils/utils'
import dayjs from 'dayjs'

function CurrentContactDetails() {
  const { state, dispatch } = useAppState()
  const [updateUser, { loading, error }] = useMutation(UPDATE_USER)
  const [lastSavedData, setLastSavedData] = useState({}) // this is the last saved data from the database

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
    if (rowId === 'dateOfBirth') {
      const myDate = convertDateStringToISO(newData)
      if (myDate.length === 0) {
        newData = undefined
      } else {
        newData = myDate
      }
    }

    // Create a deep copy of state.userData
    const updatedData = JSON.parse(JSON.stringify(state.userData))

    // Update the nested property using the utility function
    setNestedObjectValue(updatedData, rowId, newData)

    // update the global state
    if (!updatedData) {
      console.log('no updatedData', rowId, newData)
      return
    }

    dispatch({
      type: SET_USER_DATA,
      payload: updatedData,
    })

    // update the database
    // updatedData is the userData
    if (!lastSavedData || !deepEqual(updatedData, lastSavedData)) {
      console.log('updatedData', updatedData)
      console.log('lastSavedData', lastSavedData)
      try {
        const userInput = {
          id: updatedData.id,
          ...updatedData,
        }
        console.log('userInput', userInput)

        const { data, errors } = await updateUser({
          variables: { input: userInput },
        })

        if (errors) {
          console.error('Errors from server:', errors)
          return
        }
        console.log('returned data from updating userData', data)
        // update the state with the returned data
        if (data) {
          const returnedData = JSON.parse(
            JSON.stringify(data.updateUser, omitTypename)
          )
          console.log('returnedData', returnedData)
          setLastSavedData(returnedData)
        }
      } catch (error) {
        console.error('Network error:', error)
      }
    }
  }

  function dateFormatter(data) {
    const date = convertDateStringToISO(data)
    if (!date) {
      return data
    }
    return formatDate(date)
  }

  const dateValidation = (data) => {
    const date = convertDateStringToISO(data)
    if (!date) {
      return false
    }
    // check that the date is in the past but <120 years ago
    const today = dayjs()
    const minDate = dayjs().subtract(120, 'year')
    const dateToCheck = dayjs(date)
    if (dateToCheck.isAfter(today)) {
      return false
    }
    if (dateToCheck.isBefore(minDate)) {
      return false
    }
    return true
  }
  const phoneValidation = (data) => {
    if (!data) {
      return true
    }
    const strippedNumber = data.replace(/\s+/g, '')
    if (strippedNumber.length === 0) {
      return true
    }

    const regex = /^(\+614\d{8}|04\d{8}|[0-9\+\-\(\)]{6,})$/

    return regex.test(strippedNumber)
  }

  const emailValidation = (data) => {
    const regex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
    return regex.test(data)
  }

  return (
    <Box borderWidth="1px" borderRadius="lg" p={4} boxShadow="md">
      {/* Invisible text to get its width using chakra */}
      <chakra.div
        ref={longestLabelRef}
        position="absolute"
        opacity="0"
        fontWeight="bold"
      >
        Other Practitioners:&nbsp;&nbsp;
      </chakra.div>

      <Center>
        <Text fontSize="xl" fontWeight="bold" mb={2}>
          Your Contact and Personal Details
        </Text>
      </Center>
      <Text mb={1}>
        Please review your contact details below, and correct any errors or
        omissions:
      </Text>
      <Flex direction="column">
        <AddressEntry
          label="Address:"
          data={state.userData.contactDetails.address}
          width={labelWidth}
          onDataChange={(newData) =>
            handleDataChange(newData, 'contactDetails.address')
          }
        />
        <NameEntry
          label="Name:"
          data={state.userData.nameDetails}
          width={labelWidth}
          onDataChange={(newData) => handleDataChange(newData, 'nameDetails')}
        />
        <RenderRow
          label="Phone:"
          data={state.userData.contactDetails.phone}
          width={labelWidth}
          onDataChange={(newData) =>
            handleDataChange(newData, 'contactDetails.phone')
          }
          validate={phoneValidation}
        />
        <RenderRow
          label="Email:"
          data={state.userData.contactDetails.email}
          width={labelWidth}
          onDataChange={(newData) =>
            handleDataChange(newData, 'contactDetails.email')
          }
          validate={emailValidation}
          formatData={(data) => data.toLowerCase()}
        />
        <RenderRow
          label="Date of Birth:"
          data={formatDate(state.userData.dateOfBirth)}
          width={labelWidth}
          onDataChange={(newData) => handleDataChange(newData, 'dateOfBirth')}
          validate={dateValidation}
          formatData={dateFormatter}
        />
        <RenderRow
          label="Health Fund:"
          data={state.userData.healthFund}
          width={labelWidth}
          onDataChange={(newData) => handleDataChange(newData, 'healthFund')}
        />
        <RenderRow
          label="Your GP:"
          data={state.userData.healthProfessionals.gp}
          width={labelWidth}
          onDataChange={(newData) =>
            handleDataChange(newData, 'healthProfessionals.gp')
          }
        />
        <RenderRow
          label="Suburb:"
          data={state.userData.healthProfessionals.gpAddress}
          width={labelWidth}
          onDataChange={(newData) =>
            handleDataChange(newData, 'healthProfessionals.gpAddress')
          }
          labelStyle={{ paddingLeft: '16px' }}
        />

        <RenderRow
          label="Ophthalmologist:"
          data={state.userData.healthProfessionals.ophthalmologist}
          width={labelWidth}
          onDataChange={(newData) =>
            handleDataChange(newData, 'healthProfessionals.ophthalmologist')
          }
        />

        <RenderRow
          label="Suburb:"
          data={state.userData.healthProfessionals.ophthalmologistAddress}
          width={labelWidth}
          onDataChange={(newData) =>
            handleDataChange(
              newData,
              'healthProfessionals.ophthalmologistAddress'
            )
          }
          labelStyle={{ paddingLeft: '16px' }}
        />

        <RenderRow
          label="Other Practitioners:"
          data={state.userData.healthProfessionals.otherHealthProfessionals}
          width={labelWidth}
          onDataChange={(newData) =>
            handleDataChange(
              newData,
              'healthProfessionals.otherHealthProfessionals'
            )
          }
        />
      </Flex>
    </Box>
  )
}

export default CurrentContactDetails
