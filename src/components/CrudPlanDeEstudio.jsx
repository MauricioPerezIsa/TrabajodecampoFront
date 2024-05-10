import React from 'react'
import { useEffect,useState } from 'react'
import { Table, Button, Modal,Dropdown  } from 'react-bootstrap'

function CrudPlanDeEstudio() {
    const [allPlanes,setAllPlanes] =useState([])

    const getplanes =async () =>{
      const requestOptions = {
        method: "GET",
        redirect: "follow"
      };
      
        const response = await fetch("http://localhost:7000/planDeEstudio/", requestOptions)
        const result = await response.json()
        setAllPlanes(result)
    }
  useEffect(() =>{
    getplanes()
  },[])
   

  return (
    <>
    <Table striped bordered hover>
    <thead>
      <tr>
        <th>Nombre</th>
        <th>Descripción</th>
        <th>Materias</th>
      </tr>
    </thead>
    <tbody>
      {allPlanes.map((planesdeestudio) => (
        <tr key={planesdeestudio._id}>
          <td>{planesdeestudio.nombre}</td>
          <td>{planesdeestudio.descripcion}</td>
          <td>
          <ul>
            {planesdeestudio.materia.map((materia) => (
              <li key={materia._id}>{materia.nombre}, Año: {materia.anio}</li>
            ))}
          </ul>
        </td>
          
        </tr>
      ))}
    </tbody>
  </Table>  

    </>
  )
}

export default CrudPlanDeEstudio