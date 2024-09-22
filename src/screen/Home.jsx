import React from 'react'
import logo from "../assets/logo.png"


function Home() {
  return ( 
    <div>
      <div className='d-flex align-items-center justify-content-center my-5' >
        <img src={logo} alt="Logo" style={{ width: '70px', height: '70px', marginRight: '20px' }} />
        <h1 style={{fontFamily: "Crimson Text, serif"}} >Menú Principal</h1>
      </div>
    
    </div>
  )
}

export default Home