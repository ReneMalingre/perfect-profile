import React, { useState } from 'react'
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

function StaffBioPopup({ imageUrl, name, qualifications, bio }) {
  const { isOpen, onOpen, onClose } = useDisclosure() // custom hook for handling modal state

  return (
    <Flex
      flexDirection="column"
      alignItems="center"
      borderWidth="1px"
      borderRadius="lg"
      p={4}
      boxShadow="md"
    >
      {/* Staff Image */}
      <Text fontSize="xl" fontWeight="bold" mb={2}>
        Your Optometrist
      </Text>
      <Image
        src={imageUrl}
        alt={name}
        cursor="pointer"
        onClick={onOpen}
        boxSize="150px"
        borderRadius="full"
      />
      <Text cursor="pointer" onClick={onOpen}>
        {name}
      </Text>
      <Text fontSize="xs">{qualifications}</Text>
      {/* Modal for Staff Bio */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{name}</ModalHeader>
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
