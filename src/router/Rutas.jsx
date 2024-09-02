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
import Cuadrito from '../components/Cuadrito'
import Sidebarlateral from "../components/Sidebarlateral"
import FooterCustom from "../components/FooterCustom"
import Styles from "../styles/footerStyle.module.css"




function Rutas() {
  return (
     <BrowserRouter>
     <Sidebarlateral></Sidebarlateral>
     <div className="main-content">
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
     <FooterCustom className={` ${Styles["footer-grid"]}`} ></FooterCustom>
     </div>
     
    
    </BrowserRouter>
  )
}

export default Rutas