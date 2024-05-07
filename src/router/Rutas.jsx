import React from 'react'
import { BrowserRouter,Route,Routes} from 'react-router-dom'
import Carreras from '../screen/Menu/Carreras'
import Edificios from '../screen/Menu/Edificios'
import Elementos from '../screen/Menu/Elementos'
import Espacios from '../screen/Menu/Espacios'
import Horarios from '../screen/Menu/Horarios'
import Materias from '../screen/Menu/Materias'
import PlanDeEstudio from '../screen/Menu/PlanDeEstudio'
import Profesores from '../screen/Menu/Profesores'
import Home from '../screen/Home'




function Rutas() {
  return (
     <BrowserRouter>
     <Routes>
     <Route path='/' element={<Home/>}/>
    <Route path ='/Carreras' element={<Carreras/>}/>
    <Route path='/Edificios' element={<Edificios/>}/> 
    <Route path='/Elementos' element={<Elementos/>} />
    <Route path='/Espacios' element={<Espacios/>}/> 
    <Route path='/Horarios' element={<Horarios/>}/>
    <Route path='/Materias' element={<Materias/>}/>
    <Route path='/PlanDeEstudio' element={<PlanDeEstudio/>}/>
    <Route path='/Profesores' element={<Profesores/>}/>
     </Routes>
    

    </BrowserRouter>
  )
}

export default Rutas