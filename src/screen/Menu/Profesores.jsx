  import React from 'react'
  import { useEffect,useState } from 'react'
  import { Table } from 'react-bootstrap'

  function Profesores() {
    const [allPersonal, setAllPersonal] = useState([])
    
    const getPersonal = async () => {
      try {
        const response = await fetch("http://localhost:7000/profesor/");
        if (!response.ok) {
          throw new Error("No se pudieron obtener los empleados");
        }
        const result = await response.json();
        console.log(result); // Verificar los datos recibidos en la consola
        setAllPersonal(result);
      } catch (error) {
        console.error(error);
        alert("Hubo un error al obtener los empleados");
      }
  
  }

    useEffect(() => {
      getPersonal()

  }, [])
    return (
    <>
    <h1>Profesores</h1>
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Apellido</th>
          <th>DNI</th>
        </tr>
      </thead>
      <tbody>
        {allPersonal.map((profesor) => (
          <tr key={profesor._id}>
            <td>{profesor.nombre}</td>
            <td>{profesor.apellido}</td>
            <td>{profesor.dni}</td>
          </tr>
        ))}
      </tbody>
    </Table>
    </>
    )
  }

  export default Profesores