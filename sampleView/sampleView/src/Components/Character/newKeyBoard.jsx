import React, { useEffect, useRef } from 'react'

export default function newKeyBoard () {
  const keyMap=useRef({});
  
      useEffect(()=>{
        const onDocumentKey = (e) => {
          keyMap.current[e.code] = e.type === 'keydown'
      }
        document.addEventListener('keydown',onDocumentKey)
        document.addEventListener('keyup',onDocumentKey)
        return ()=>{
          document.removeEventListener('keydown',onDocumentKey)
          document.removeEventListener('keyup',onDocumentKey)
        }
      })
      return keyMap.current;
}
