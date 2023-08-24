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
  Input,
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

function sanitise(text) {
  // Implement a sanitization function based on your needs
  return text.trim()
}

function VisitReason() {
  const { state, dispatch } = useAppState()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [reasons, setReasons] = useState([])
  const [currentText, setCurrentText] = useState('')
  const [selectedReasonIndex, setSelectedReasonIndex] = useState(null)

  // get the user profile from the state
  const userData = state.userData

  const handleAdd = (reason) => {
    // adding a reason to the
    setReasons([...reasons, reason])
    onClose()
    setCurrentText('')
  }

  const handleSave = () => {
    const sanitisedText = sanitise(currentText)
    if (selectedReasonIndex !== null) {
      // Update
      const updatedReasons = [...reasons]
      updatedReasons[selectedReasonIndex] = sanitisedText
      setReasons(updatedReasons)
      setSelectedReasonIndex(null)
    } else {
      // Add
      handleAdd(sanitisedText)
    }
  }

  return (
    <Flex direction="column" height="100%">
      <Box>
        <Center>
          <Text fontSize="xl" fontWeight="bold" mb={2}>
            What can we help you with during your visit?
          </Text>
        </Center>
      </Box>
      <Select
        onChange={(e) => {
          if (e.target.value === 'custom') {
            onOpen()
          } else {
            const selectedText = e.target.options[e.target.selectedIndex].text
            handleAdd(selectedText)
          }
        }}
        my={1}
      >
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
        <option value="custom">Add a Custom Reason</option>
      </Select>
      <Box
        border="1px"
        borderRadius="md"
        width="100%"
        overflowY="auto"
        flexGrow={1}
        my={1}
      >
        <List>
          {reasons.map((reason, index) => (
            <ListItem
              key={index}
              onClick={() => setSelectedReasonIndex(index)}
              bg={selectedReasonIndex === index ? 'gray.200' : ''}
              p={2}
              borderRadius="md"
            >
              {reason}
            </ListItem>
          ))}
        </List>
      </Box>
      <HStack spacing={4}>
        <Button
          onClick={() => {
            if (selectedReasonIndex !== null) {
              setCurrentText(reasons[selectedReasonIndex])
              onOpen()
            }
          }}
          isDisabled={selectedReasonIndex === null}
        >
          Edit
        </Button>
        <Button
          onClick={() => {
            if (selectedReasonIndex !== null) {
              setReasons((prev) =>
                prev.filter((_, i) => i !== selectedReasonIndex)
              )
              setSelectedReasonIndex(null)
            }
          }}
          isDisabled={selectedReasonIndex === null}
        >
          Delete
        </Button>
      </HStack>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add or Edit your purpose for visiting</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Textarea
              value={currentText}
              onChange={(e) => setCurrentText(e.target.value)}
            />
          </ModalBody>
          <ModalFooter>
            <Button mx={2} onClick={handleSave}>
              Save
            </Button>
            <Button mx={2} onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  )
}

export default VisitReason
