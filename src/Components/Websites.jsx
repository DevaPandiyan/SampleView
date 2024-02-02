import { Html } from '@react-three/drei'
import React from 'react'

export const Websites = () => {
  return (

    <Html style={{ userSelect: 'none' }} castShadow receiveShadow position={[3.69, 1.496, 3.04]}  rotation={[0, 4.712,0]}  occlude="blending" zIndexRange={1} transform scale={0.15} >
  <iframe  style={{border:'none',borderRadius:"25px",}} width={600} height={1000} src='https://shrewdbs.com/' allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share">

</iframe>
    </Html>
  
  )
}
