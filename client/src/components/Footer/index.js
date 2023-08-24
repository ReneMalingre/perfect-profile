import React from 'react'
import { IconButton, Flex, Link, Text } from '@chakra-ui/react'
import { FaFacebook, FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa'

const Footer = () => {
  return (
    <Flex
      as="footer"
      direction="column"
      paddingY={1}
      mb={0}
      mt="auto"
      align="center"
      justifyContent="center"
      bg="deepCyan.500"
      color="white"
    >
      <Flex
        direction={['column', 'row']}
        align="center"
        justify="center"
        mb={2}
      >
        <Link href="https://www.adelaideeyecare.com.au" isExternal mx={5}>
          <IconButton
            aria-label="Github Profile"
            icon={<FaGithub fontSize="32px" />}
            size="md"
            color="headerFooterText.500"
            variant="ghost"
            _hover={{ color: 'deepCyan.500', bg: 'headerFooterText.500' }}
          />
        </Link>
        <Link href="https://twitter.com/ReneMalingre" isExternal mx={5}>
          <IconButton
            aria-label="Twitter Profile"
            icon={<FaFacebook fontSize="28px" />}
            size="md"
            color="headerFooterText.500"
            variant="ghost"
            _hover={{ color: 'deepCyan.500', bg: 'headerFooterText.500' }}
          />
        </Link>
      </Flex>
      <Text align="center" mt={0} mb={2} color="headerFooterText.500">
        © {new Date().getFullYear()} Rene Malingre
      </Text>
    </Flex>
  )
}

export default Footer
