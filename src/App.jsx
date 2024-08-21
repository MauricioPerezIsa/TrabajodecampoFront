import React from 'react'
import { useState } from 'react'
import { Route } from 'react-router-dom'
import Rutas from '../src/router/Rutas'
import FooterCustom from './components/FooterCustom'



function App() {
  return (    
    <div>
      <div>
        <Rutas />
        <FooterCustom />
      </div>
      
    </div>
  )
}

export default App
