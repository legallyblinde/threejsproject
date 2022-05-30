import logo from './logo.svg';
import './App.css';
import styled from 'styled-components'
import { Canvas } from '@react-three/fiber'
import { Suspense, useEffect, useRef } from 'react'
import Earth from './components/earth'
import Header from './components/Header'
import gsap from 'gsap'

const Container = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  // background-color: #000b0f;
  background-color: black;
  `

const CanvasContainer = styled.div`
  width: 50%;
  height: 100%;
 
  `

 const HeaderContainer = styled.div`
 z-index: 5;
 width: 50%;
 display: flex;
  align-items: center;
  justify-content: center;
 `

function App() {

  const Group = useRef()
  const mouse = {
    x: undefined,
    y: undefined
}

//useEffect to load event function after everything has loaded
//adding `window.` before the keyword
useEffect(() => {
    window.addEventListener('mousemove', (e) => {
        mouse.x = (e.clientX / window.innerWidth) *2 -1
        mouse.y = -(e.clientY / window.innerHeight) *2 +1
    })
}, [])


  return (
      <Container>
        <HeaderContainer><Header/></HeaderContainer>
        <CanvasContainer>
          <Canvas camera={{ fov: 100 , position: [0, 0, 5] }} >
            <Suspense fallback ={null}>
              <mesh 
              ref={Group}
              onPointerMove={(e) => {
                  gsap.to(Group.current.rotation, {
                      y: mouse.x * 0.2,
                      x: -mouse.y * 0.2,
                      duration: 2
                  })
              }} 
              > 
                <Earth />
              </mesh>
            </Suspense>
          </Canvas>
        </CanvasContainer>
      </Container>
  );
}

export default App;
