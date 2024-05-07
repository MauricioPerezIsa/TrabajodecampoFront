 import React from 'react'
 import { useEffect,useState } from 'react'
 import { Table, Button, Modal,Dropdown  } from 'react-bootstrap'


 
 function PlanDeEstudio() {
  const [allPlanes,setAllPlanes] =useState([])

  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showModal, setShowModal] = useState(false)

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

const handleVerMaterias = (planesdeestudio) => {
  setSelectedPlan(planesdeestudio);
  setShowModal(true);
};

const handleYearFilter = (year) => {
  setSelectedYear(year);
};
   return (
    <> <Table striped bordered hover>
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
          <td> <Button variant="primary" onClick={() => handleVerMaterias(planesdeestudio)}>Ver materias</Button>
              </td>
          
        </tr>
      ))}
    </tbody>
  </Table>

  <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Materias de {selectedPlan?.nombre}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ul>  
            {selectedPlan?.materia.map((materia) => (
              <li key={materia._id}>
                {materia.nombre} - Año: {materia.anio}
              </li>
            ))}
          </ul>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cerrar</Button>
        </Modal.Footer>
      </Modal>
    </>
   )
 }
 
 export default PlanDeEstudio