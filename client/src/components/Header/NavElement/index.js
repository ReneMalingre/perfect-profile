import React from 'react'
import { Link } from '@chakra-ui/react'

function NavElement({ id, title, link, isSelected, onClick }) {
  return (
    <Link
      px={2}
      py={1}
      rounded={'md'}
      display="block"
      textAlign="center"
      _hover={{
        textDecoration: 'none',
        bg: 'headerFooterText.500',
        color: 'headerFooterSelectedText.500',
      }}
      link={link}
      bg={isSelected ? 'headerFooterText.500' : ''}
      color={
        isSelected ? 'headerFooterSelectedText.500' : 'headerFooterText.500'
      }
      onClick={(event) => {
        event.preventDefault()
        onClick(id)
      }}
    >
      {title}
    </Link>
  )
}

export default NavElement
