import React from 'react'
import {
  Flex,
  Link,
  Text,
  Image,
  Spacer,
  useBreakpointValue,
} from '@chakra-ui/react'
import adelaideEyeCareLogo from '../../assets/images/logos/aec-logo.png'

const Footer = () => {
  const isMdUp = useBreakpointValue({ base: false, md: true })

  return (
    <Flex
      as="footer"
      direction="column"
      paddingY={1}
      mb={0}
      mt="auto"
      align="center"
      justifyContent="center"
      bg="headerFooterBg.500"
      color="pageBg.500"
    >
      <Flex
        direction={isMdUp ? 'row' : 'column'}
        align="center"
        justify="space-between"
        width={['full', '80%']}
        mb={2}
      >
        <Link
          href="https://www.adelaideeyecare.com.au"
          isExternal
          mx={5}
          mt={isMdUp ? 2 : 4}
        >
          <Image
            src={adelaideEyeCareLogo}
            alt="Adelaide Eye Care"
            boxSize="60px"
            _hover={{
              filter: 'brightness(0.8)',
            }}
          />
        </Link>

        <Text align="center" mt={isMdUp ? 0 : 2} color="headerFooterText.500">
          © {new Date().getFullYear()} Rene Malingre
        </Text>

        <Link
          href="https://aecwebresources.s3.ap-southeast-2.amazonaws.com/Bootcamp/documents/privacy-policy.pdf"
          isExternal
          mx={5}
          mt={isMdUp ? 0 : 2}
        >
          Privacy Policy
        </Link>
      </Flex>
    </Flex>
  )
}

export default Footer
