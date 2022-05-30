import React from 'react'
import styled from 'styled-components'
import { Stars } from '@react-three/drei'

const HeaderContainer = styled.div`
line-height: 1rem;

`
const HeaderTitle = styled.h1`
color: white;
font-size: 5rem;
font-weight: 100;
font-family: var(--font);
`
const HeaderDesc = styled.h3`
color: white;
font-size: 1.5rem;
font-weight: 100;
font-family: var(--font);
`

const Header = () => {
  return (
   
 
   <HeaderContainer>
      <HeaderTitle> 
          Earth
      </HeaderTitle>
      <HeaderDesc>
          Heckin big blue ball 
      </HeaderDesc>
   </HeaderContainer>
 
  )
}

export default Header