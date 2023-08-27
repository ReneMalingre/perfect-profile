import React from 'react'
import { Text } from '@chakra-ui/react'

function QuestionnaireSubHeading({ heading, styleInfo }) {
  const headingStyle = {
    fontSize: 'md',
    fontWeight: 'bold',
    color: 'headerFooterBg.500',
    ...styleInfo,
  }
  return <Text style={headingStyle}>{heading}</Text>
}

export default QuestionnaireSubHeading
