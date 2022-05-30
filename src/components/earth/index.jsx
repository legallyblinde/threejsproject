import React, { useRef, useEffect } from 'react'
import gsap from "gsap";
import { useFrame, useLoader, extend } from '@react-three/fiber'
import { TextureLoader } from 'three'
import { OrbitControls, Stars, shaderMaterial } from '@react-three/drei'
import * as THREE from 'three'
import { DoubleSide } from 'three'
import glsl from 'babel-plugin-glsl/macro'

import EarthDayMap from '../../assets/textures/8081_earthmap10k.jpg'
import EarthTextureMap from '../../assets/textures/8081_earthbump10k.jpg'
import EarthTextureMap2 from '../../assets/textures/8k_earth_normal_map.jpg'

import EarthSpecularMap from '../../assets/textures/8081_earthspec10k.jpg'
import EarthCloudMap from '../../assets/textures/earthcloudmap.jpg'


const EarthShaderMaterial = shaderMaterial(
    //uniform
    {
        // uTexture: new THREE.TextureLoader,
        uTexture: new THREE.Texture(),
    },
    //vertex shader
    glsl`
        varying vec2 vertexUV; //two coordinated to map texture 
        varying vec3 vertexNormal;

        void main() {
            vertexUV = uv;
            vertexNormal = normalize(normalMatrix * normal);
            gl_Position =  projectionMatrix * modelViewMatrix * vec4(position, 1);
        }
    `,
    //fragment shader
    glsl`
        uniform sampler2D uTexture;
        varying vec2 vertexUV;
        varying vec3 vertexNormal;

        void main() {
            float intensity = 1.02 - dot(vertexNormal, vec3(0.0, 0.0, 1.0));
            vec3 cloud = vec3(0.3, 0.6, 1.0) * pow(intensity, 1.0);
            gl_FragColor = vec4( cloud + texture2D(uTexture, vertexUV).xyz, 1.0);
           
        }    
    `
)
extend({EarthShaderMaterial})


const CloudShaderMaterial = shaderMaterial(
    //uniform
    {
        // uTexture: new THREE.TextureLoader,
       
    },
    //vertex shader
    glsl`
        varying vec2 vertexUV; //two coordinated to map texture 
        varying vec3 vertexNormal;

        void main() {
            vertexUV = uv;
            vertexNormal = normalize(normalMatrix * normal); 
            // using normalize and normalMatrix to update the position of lighting from a 2d to 3d space
            gl_Position =  projectionMatrix * modelViewMatrix * vec4(position, 0.9);
        }
    `,
    //fragment shader
    glsl`
        varying vec3 vertexNormal;

        void main() {
            float intensity = pow(0.6 - dot(vertexNormal, vec3(0, 0, 1.0)), 2.0) ;
            gl_FragColor = vec4(1.0, 1.0, 1.0, 0.2) * intensity ;
           
        }    
    `
)
extend({CloudShaderMaterial})

const Earth = (props) => {

    const [normalMap, specularMap, cloudMap] = useLoader(THREE.TextureLoader, [ EarthTextureMap2, EarthSpecularMap, EarthCloudMap])
    const [earthskin] = useLoader(THREE.TextureLoader, [EarthDayMap]);

    const earthRef = useRef() 
    const cloudsRef = useRef()
   

    

    useFrame(({ clock }) => {
        const timeElapsed = clock.getElapsedTime()

        earthRef.current.rotation.y = timeElapsed / 15
        cloudsRef.current.rotation.y = timeElapsed / 12
    })

  return (
  <>
    <ambientLight intensity={0.5} />

    {/* <pointLight 
        color= "#f7f0cf"
        position={[3,0,3]}
        intensity={1.4}
    /> */}

    <Stars 
        radius={300} 
        depth={1} 
        count={3000} 
        factor={6} 
        saturation={0} 
        fade={true} 
    />

    

        <mesh ref={cloudsRef} >
            <sphereGeometry args={[2.01, 50, 50]} /> 
            <meshPhongMaterial 
                map= {cloudMap} 
                opacity= {0.4} 
                depthWrite= {true} 
                transparent= {true} 
                side= {THREE.DoubleSide}
        />
        </mesh>

        <mesh>
            <sphereGeometry args={[2.5, 50, 50]} /> 
            <cloudShaderMaterial 
                side= {THREE.BackSide} 
                blending= {THREE.AdditiveBlending}
                transparent= {true} 
            />
        </mesh>

        <mesh ref={earthRef} >  
            <sphereGeometry args={[2, 50, 50]} />
            <meshPhongMaterial specularMap={specularMap} />
            {/* <meshStandardMaterial 
                map={colorMap}  
                normalMap={normalMap}
                metalness={0.4}
                roughness={0.7}
            /> */}
    
            {/* replace meshStandardMaterial with new shadermaterial */}
            {/* can use shadermaterial with the lowercase at the beginning */}
            <earthShaderMaterial uTexture={earthskin} /> 
            
            <OrbitControls 
                enableZoom={false} zoomSpeed={0.5}
                enablePan={true} panSpeed={0.4}
                enableRotate={true}  rotateSpeed={0.3}
            />
        </mesh>
    
  </>
  )
}

export default Earth