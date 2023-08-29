import React, { useState } from 'react'
import {
  Select,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Flex,
  HStack,
  List,
  ListItem,
  useDisclosure,
  Box,
  Text,
  Textarea,
  Center,
} from '@chakra-ui/react'
import { useAppState } from '../../utils/AppContext'
import {
  SET_VISIT_REASONS,
  LOGOUT,
  SET_CURRENT_PAGE,
} from '../../utils/actions'
import { useMutation } from '@apollo/client'
import { UPDATE_VISIT_REASONS } from '../../utils/graphql/visitReasonMutations'
import { arraysOfObjectsAreEqual } from '../../utils/utils'
import Auth from '../../utils/auth'

function sanitise(text) {
  // Implement a sanitization function based on your needs
  return text.trim()
}

function VisitReason({ appointmentId }) {
  const { state, dispatch } = useAppState()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [reasons, setReasons] = useState(state.visitReasons)
  const [currentText, setCurrentText] = useState('') // this is the text in the modal
  const [selectedReasonIndex, setSelectedReasonIndex] = useState(null)
  const [deletedReasonIds, setDeletedReasonIds] = useState([]) // KEEP TRACK OF DELETED REASONS
  const [lastSavedData, setLastSavedData] = useState([]) // this is the last saved data from the database
  const [selectValue, setSelectValue] = useState('default') // this is the value of the select element
  const [updateVisitReasons, { loading, error, data }] =
    useMutation(UPDATE_VISIT_REASONS)
  const [modalTitle, setModalTitle] = useState(
    'What is the reason for your visit?'
  )

  const isValid = true
  const saveButtonStyle = {
    fontWeight: 'normal',
    color: isValid ? 'green.50' : 'red.50',
    bgColor: isValid ? 'green.500' : 'red.800',
    _hover: { bgColor: isValid ? 'green.800' : 'red.800' },
  }
  const cancelButtonStyle = {
    fontWeight: 'normal',
    color: 'blue.50',
    bgColor: 'headerFooterBg.500',
    _hover: { bgColor: 'blue.800' },
  }

  const editButtonStyle = {
    fontWeight: 'normal',
    color: isValid ? 'blue.50' : 'red.50',
    bgColor: isValid ? 'headerFooterBg.500' : 'red.800',
    _hover: { bgColor: isValid ? 'blue.800' : 'red.800' },
  }
  const deleteButtonStyle = {
    fontWeight: 'normal',
    color: 'red.50',
    bgColor: 'red.500',
    _hover: { bgColor: 'red.800' },
  }

  //Select value
  const handleChange = (e) => {
    const { value } = e.target

    if (value === 'custom') {
      setModalTitle('What is the reason for your visit?')
      onOpen()
    } else if (value !== 'default') {
      const selectedText = e.target.options[e.target.selectedIndex].text
      setModalTitle('Edit the reason for your visit')
      handleAdd(selectedText)
    }

    // Reset the Select value to "default"
    setSelectValue('default')
  }

  const handleAdd = (reason) => {
    onClose()
    setCurrentText('')
    if (!reason) {
      return
    }
    if (reason.length === 0) {
      return
    }
    // Check if the reason already exists
    const isDuplicate = reasons.some(
      (r) => r.reason.toLowerCase() === reason.toLowerCase()
    )

    // adding a reason to the array
    if (!isDuplicate) {
      const newReason = {
        id: null,
        reason: reason,
        appointmentId: appointmentId,
      }
      const reasonList = [...reasons, newReason]
      setReasons(reasonList) // set the local state
      updateStateAndSaveToDatabase(reasonList, '', true) // update the state and save to the database
    }
  }

  const handleSave = () => {
    const sanitisedText = sanitise(currentText)
    if (sanitisedText.length === 0) {
      return
    }
    let reasonsList = []
    if (selectedReasonIndex !== null) {
      // Update if the reason is different
      reasonsList = [...reasons]
      if (!(reasonsList[selectedReasonIndex].reason === sanitisedText)) {
        reasonsList[selectedReasonIndex].reason = sanitisedText
        setReasons(reasonsList)
        setSelectedReasonIndex(null)

        updateStateAndSaveToDatabase(reasonsList, '', true)
      }
      // close the modal if it is open
      onClose()
      setCurrentText('')
    } else {
      // Add
      reasonsList = handleAdd(sanitisedText)
    }
  }

  // Cancel the modal and reset the current text
  const handleCancelModal = () => {
    onClose()
    setCurrentText('')
  }

  const handleDelete = () => {
    if (selectedReasonIndex !== null) {
      // copy the array
      const reasonList = [...reasons]
      // get the id of the reason to delete
      const deletedReasonId = reasonList[selectedReasonIndex].id
      // add the id to the deletedReasonIds array
      setDeletedReasonIds((prev) => [...prev, deletedReasonId])
      // remove the reason from the array
      reasonList.splice(selectedReasonIndex, 1)
      // update the local state
      setReasons(reasonList)
      // reset the selected index
      setSelectedReasonIndex(null)
      // close the modal if it is open
      onClose()
      // update the state and save to the database
      updateStateAndSaveToDatabase(reasonList, deletedReasonId, false)
    }
  }

  async function updateStateAndSaveToDatabase(
    reasonsList,
    deletedReasonId,
    pushToDatabase
  ) {
    // now set state
    dispatch({ type: SET_VISIT_REASONS, payload: reasonsList })
    // add the deleted reason id to the array and ensure it only contains valid ids
    const itemsToDelete = [...deletedReasonIds, deletedReasonId].filter(
      (id) => id
    )

    // now save to database
    const okToSave =
      pushToDatabase ||
      !lastSavedData ||
      itemsToDelete.length > 0 ||
      !arraysOfObjectsAreEqual(reasonsList, lastSavedData)

    if (okToSave) {
      // ensure that the data is in the correct format and has the appointmentId
      let savedList = [...reasonsList]
      savedList = savedList.map((reason) => {
        return {
          id: reason.id,
          reason: reason.reason,
          appointmentId: appointmentId,
        }
      })
      if (Auth.loggedIn()) {
        try {
          const response = await updateVisitReasons({
            variables: {
              appointmentId: appointmentId,
              visitReasons: savedList,
              deletedReasonIds: itemsToDelete,
            },
          })

          // Do something with the response
          let newList = response.data.updateVisitReasons
          newList = newList.map((reason) => {
            return {
              id: reason.id,
              reason: reason.reason,
              appointmentId: appointmentId,
            }
          })
          // set the last saved data
          setReasons([...newList])
          setLastSavedData([...newList])
          setDeletedReasonIds([])
        } catch (err) {
          console.error('Error updating visit reasons:', err)
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

  return (
    <Flex direction="column" height="100%">
      <Box>
        <Center>
          <Text
            fontSize="xl"
            fontWeight="bold"
            mb={2}
            color="panelLightText.500"
          >
            What can we help you with during your visit?
          </Text>
        </Center>
      </Box>
      <Select
        value={selectValue}
        onChange={handleChange}
        my={1}
        height={'2rem'}
      >
        <option value="default">
          Choose existing reasons from this list or create your own
        </option>
        <option value="custom">Add a Custom Reason</option>
        <option value="routine">
          Routine Checkup of eye health and vision
        </option>
        <option value="glasses">New Glasses</option>
        <option value="blurry">Blurry or changed vision</option>
        <option value="contact-lens">Contact Lens fitting or check</option>
        <option value="headaches">Headaches or eye strain</option>
        <option value="red-eye">Red eye or possible eye infection</option>
        <option value="dry-eye">Dry or watery eyes</option>
        <option value="pain">Eye pain or discomfort</option>
        <option value="flashes">Flashes or floaters</option>
        <option value="child">Child's vision assessment</option>
        <option value="myopia">Myopia control</option>
        <option value="follow-up">Following up a recent visit</option>
      </Select>
      <Box
        border="1px"
        borderRadius="md"
        width="100%"
        overflowY="auto"
        flexGrow={1}
        my={1}
      >
        <List minHeight="200px">
          {reasons.map((reason, index) => (
            <ListItem
              key={index}
              onClick={() => setSelectedReasonIndex(index)}
              onDoubleClick={() => {
                setSelectedReasonIndex(index)
                setModalTitle('Edit the reason for your visit')
                setCurrentText(reasons[index].reason)
                onOpen()
              }}
              bg={selectedReasonIndex === index ? 'green.100' : 'green.50'}
              p={2}
              m={1}
              borderRadius="md"
              cursor="pointer"
            >
              {reason.reason}
            </ListItem>
          ))}
        </List>
      </Box>
      <HStack spacing={2}>
        <Button
          {...editButtonStyle}
          onClick={() => {
            if (selectedReasonIndex !== null) {
              setCurrentText(reasons[selectedReasonIndex].reason)
              onOpen()
            }
          }}
          isDisabled={selectedReasonIndex === null}
        >
          Edit
        </Button>
        <Button
          {...deleteButtonStyle}
          onClick={handleDelete}
          isDisabled={selectedReasonIndex === null}
        >
          Delete
        </Button>
      </HStack>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            bgColor="panelLightText.500"
            color="headerFooterText.500"
          >
            {modalTitle}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody p={2}>
            <Textarea
              value={currentText}
              onChange={(e) => setCurrentText(e.target.value)}
              m={0}
              width={'100%'}
              autoFocus
            />
          </ModalBody>
          <ModalFooter p={2}>
            <Button mx={1} onClick={handleSave} {...saveButtonStyle}>
              Save
            </Button>
            <Button mx={1} onClick={handleCancelModal} {...cancelButtonStyle}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  )
}

export default VisitReason
