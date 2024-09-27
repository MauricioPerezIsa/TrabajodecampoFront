import React, { useEffect, useState } from 'react';
import logo from "../assets/ISO_UNSTA.png"
import { Button, Table, Form } from 'react-bootstrap';

function Home() {

  const [allEdificios, setAllEdificios] = useState([])

  const getEdificios = async () => {
    const requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    const response = await fetch("http://localhost:7000/edificio/", requestOptions);
    const result = await response.json();
    setAllEdificios(result);
  };

  useEffect(() => {
    getEdificios();
  }, []);

  return (

    <div className="container">
      {/* Título y Logo */}
      <div className='d-flex align-items-center justify-content-center my-5'>
        <img src={logo} alt="Logo" style={{ width: '70px', height: '70px', marginRight: '20px' }} />
        <h1 style={{ fontFamily: 'Crimson Text, serif' }}>Menú Principal</h1>
      </div>

      {/* Sección Edificios */}
      <div className="mb-4 text-center">
        <h6>Seleccione el edificio cuyos espacios quiera mostrar en la tabla</h6>
        <Form.Group controlId="selectEdificio">
          <Form.Control as="select">
            {/* Mapeo de los edificios obtenidos del backend */}
            {allEdificios.length > 0 ? (
              allEdificios.map((edificio, index) => (
                <option key={index} value={edificio.nombre}>
                  {edificio.nombre}
                </option>
              ))
            ) : (
              <option>Cargando edificios...</option>
            )}
          </Form.Control>
        </Form.Group>
      </div>

      {/* Sección Días */}
      <div className="mb-4 text-center">
        <h6>Seleccione el día de la semana</h6>
        <Form.Group id='selectDias'>
        <Form.Control as="select">
            <option>Lunes</option>
            <option>Martes</option>
            <option>Miércoles</option>
            <option>Jueves</option>
            <option>Viernes</option>
        </Form.Control>
      </Form.Group>
      </div>


      {/* Sección Materias */}
      <div className="mb-5 text-center">
        <h6>Seleccione la acción que desea realizar</h6>
        <div className="d-flex justify-content-center flex-wrap">
          <Button className="m-2" style={{ backgroundColor: 'rgb(114, 16, 16)', color: '#FFF', borderColor: '#FFF' }}>Asignar Automáticamente</Button>
          <Button className="m-2" style={{ backgroundColor: 'rgb(114, 16, 16)', color: '#FFF', borderColor: '#FFF' }}>Asignar Manualmente</Button>
          <Button className="m-2"style={{ backgroundColor: 'rgb(114, 16, 16)', color: '#FFF', borderColor: '#FFF' }}>Desasignar Automáticamente</Button>
          <Button className="m-2" style={{ backgroundColor: 'rgb(114, 16, 16)', color: '#FFF', borderColor: '#FFF' }}>Desasignar Manualmente</Button>
        </div>
      </div>


      {/* Tablas */}
      <div className="mb-5 text-center">
        {/* Primera Tabla: Módulos 1 a 9 */}
        <Table className='mb-5' bordered>
          <thead>
            <tr>
              <th>Espacios</th>
              {Array.from({ length: 9 }).map((_, index) => (
                <th key={index}>Módulo {index + 1}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 5 }).map((_, rowIndex) => (
              <tr key={rowIndex}>
                <td>Espacio {rowIndex + 1}</td>
                {Array.from({ length: 9 }).map((_, colIndex) => (
                  <td key={colIndex}></td>
                ))}
              </tr>
            ))}
          </tbody>
        </Table>

        {/* Segunda Tabla: Módulos 10 a 17 */}
        <Table bordered>
          <thead>
            <tr>
              <th>Espacios</th>
              {Array.from({ length: 8 }).map((_, index) => (
                <th key={index}>Módulo {index + 10}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 5 }).map((_, rowIndex) => (
              <tr key={rowIndex}>
                <td>Espacio {rowIndex + 1}</td>
                {Array.from({ length: 8 }).map((_, colIndex) => (
                  <td key={colIndex}></td>
                ))}
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>

  );

}

export default Home;
