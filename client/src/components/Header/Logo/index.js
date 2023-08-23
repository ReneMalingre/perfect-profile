import React from 'react'
import { Box, useColorModeValue } from '@chakra-ui/react'

import { ReactComponent as LogoIcon } from '../../../assets/images/logos/header-logo.svg'

export const Logo = (props) => {
  const color = useColorModeValue('spaceGray.500', 'spaceGray.500')
  return <Box as={LogoIcon} w={props.width} color={color} />
}

export default Logo
