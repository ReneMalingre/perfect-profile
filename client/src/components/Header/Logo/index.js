import React from 'react'
import { Image, useColorModeValue } from '@chakra-ui/react'

import logoImagePath from '../../../assets/images/logos/iris-logo-dark.png'

export const Logo = (props) => {
  const color = useColorModeValue(
    'headerFooterText.500',
    'headerFooterText.500'
  )
  return (
    <Image src={logoImagePath} alt="Logo" boxSize={props.width} color={color} />
  )
}

export default Logo
