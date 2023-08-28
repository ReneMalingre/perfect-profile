import React from 'react'
import { Text } from '@chakra-ui/react'

function QuestionnaireSubHeading({ heading, styleInfo }) {
  const headingStyle = {
    fontSize: 'md',
    fontWeight: 'bold',
    color: 'panelLightText.500',
    ...styleInfo,
  }
  return <Text {...headingStyle}>{heading}</Text>
}

export default QuestionnaireSubHeading
