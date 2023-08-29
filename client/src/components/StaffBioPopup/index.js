import React from 'react'
import {
  Image,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Text,
  useDisclosure,
  Flex,
} from '@chakra-ui/react'

function StaffBioPopup({ imageURL, name, qualifications, bio }) {
  const { isOpen, onOpen, onClose } = useDisclosure() // custom hook for handling modal state

  return (
    <Flex
      flexDirection="column"
      alignItems="center"
      borderWidth="1px"
      borderRadius="lg"
      p={4}
      boxShadow="inset 0 0 6px rgba(0, 0, 0, 0.25)"
    >
      {/* Staff Image */}
      <Text fontSize="xl" fontWeight="bold" mb={2} color="contrastText.500">
        Your Optometrist
      </Text>
      <Image
        src={imageURL}
        alt={name}
        cursor="pointer"
        onClick={onOpen}
        boxSize="150px"
        borderRadius="full"
      />
      <Text color="panelLightText.500" cursor="pointer" onClick={onOpen}>
        {name}
      </Text>
      <Text fontSize="xs">{qualifications}</Text>
      {/* Modal for Staff Bio */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader bgColor="contrastText.500" color="headerFooterText.500">
            {name}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>{bio}</Text>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Flex>
  )
}

export default StaffBioPopup
