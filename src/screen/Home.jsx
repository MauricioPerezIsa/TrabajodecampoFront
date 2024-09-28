import React, { useEffect, useState } from 'react';
import logo from "../assets/ISO_UNSTA.png"
import { Button, Table, Form, Modal } from 'react-bootstrap';

function Home() {

  const [allEdificios, setAllEdificios] = useState([]);
  const [allCarreras, setAllCarreras] = useState([]);
  const [allMaterias, setAllMaterias] = useState([]);
  const [selectedEdificio, setSelectedEdificio] = useState('');
  const [selectedDia, setSelectedDia] = useState('Lunes');
  const [espacios, setEspacios] = useState([]);

  const [selectedCarrera, setSelectedCarrera] = useState('');
  const [selectedMateria, setSelectedMateria] = useState('');
  const [horarios, setHorarios] = useState([{ dia: 'Lunes', moduloInicio: 1, moduloFin: 1 }]);
  const [showModal, setShowModal] = useState(false);

  const getEdificios = async () => {
    const requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    const response = await fetch("http://localhost:7000/edificio/buscar", requestOptions);
    const result = await response.json();
    setAllEdificios(result);
  };

  useEffect(() => {
    getEdificios();
  }, []);


  const getCarreras = async () => {
    const requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    const response = await fetch("http://localhost:7000/carrera/", requestOptions);
    const result = await response.json();
    setAllCarreras(result);
  };

  useEffect(() => {
    getCarreras();
  }, []);

  const getMaterias = async () => {
    const requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    const response = await fetch("http://localhost:7000/materia/", requestOptions);
    const result = await response.json();
    setAllMaterias(result);
  };

  useEffect(() => {
    getMaterias();
  }, []);

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const agregarDia = () => {
    setHorarios([...horarios, { dia: 'Lunes', moduloInicio: 1, moduloFin: 1 }]);
  };

  const eliminarDia = () => {
    if (horarios.length > 1) {
      const newHorarios = horarios.slice(0, -1);
      setHorarios(newHorarios);
    }
  };

  const handleHorarioChange = (index, field, value) => {
    const newHorarios = [...horarios];
    newHorarios[index][field] = value;
    setHorarios(newHorarios);
  };

  const fetchEspacios = async () => {
    if (selectedEdificio && selectedDia) {
      try {
        const response = await fetch(`http://localhost:7000/edificio/filtrar/${selectedDia}/${selectedEdificio}`);
        console.log("Aqui1",response)
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
  
        const data = await response.json();
        setEspacios(data);
        console.log("Data fetched:", data); // Asegúrate de que los datos son los esperados
      } catch (error) {
        console.error('Error al obtener espacios:', error);
      }
    }
  };

  useEffect(() => {
    fetchEspacios();
  }, [selectedEdificio, selectedDia]);

  const handleEdificioChange = (e) => {
    setSelectedEdificio(e.target.value);
  };

  const handleDiaChange = (e) => {
    setSelectedDia(e.target.value);
  };

  return (

    <div className="container">
      {/* Título y Logo */}
      <div className='d-flex align-items-center justify-content-center my-5'>
        <img src={logo} alt="Logo" style={{ width: '70px', height: '70px', marginRight: '20px' }} />
        <h1 style={{ fontFamily: 'Crimson Text, serif' }}>Menú Principal</h1>
      </div>

      {/* Sección Edificios */}
      <div className="mb-3 text-center">
        <h6>Seleccione el edificio cuyos espacios quiera mostrar en la tabla</h6>
        <Form.Group controlId="selectEdificio">
          <Form.Control as="select" onChange={handleEdificioChange} value={selectedEdificio}>
            <option value="">Seleccione un edificio</option>
            {allEdificios.map((edificio, index) => (
              <option key={index} value={edificio._id}>
                {edificio.nombre}
              </option>
            ))}
          </Form.Control>
        </Form.Group>
      </div>

      {/* Sección Días */}
      <div className="mb-5 text-center">
        <h6>Seleccione el día de la semana</h6>
        <Form.Group id='selectDias'>
          <Form.Control as="select" onChange={handleDiaChange} value={selectedDia}>
            <option>Lunes</option>
            <option>Martes</option>
            <option>Miercoles</option>
            <option>Jueves</option>
            <option>Viernes</option>
          </Form.Control>
        </Form.Group>
      </div>

      {/* Botones Asignación */}

      <div className="mb-5 text-center">
      <h6>Seleccione la asignación que desea realizar</h6>
      <div className="d-flex justify-content-center flex-wrap">
      <Button className="m-2" style={{ backgroundColor: 'rgb(114, 16, 16)', color: '#FFF', borderColor: '#FFF' }}>Asignar Automáticamente</Button>
      <>
      <Button className="m-2" style={{ backgroundColor: 'rgb(114, 16, 16)', color: '#FFF', borderColor: '#FFF' }} onClick={handleShow}>
        Asignar Manualmente
      </Button>

      {/* Modal */}
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Complete los campos</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {/* Select de Carreras */}
            <Form.Group className="mb-3">
              <Form.Label>Carrera</Form.Label>
              <Form.Select value={selectedCarrera} onChange={(e) => setSelectedCarrera(e.target.value)}>
                <option value="">Seleccione una carrera</option>
                {allCarreras.map((carrera) => (
                  <option key={carrera._id} value={carrera._id}>{carrera.nombre}</option>
                ))}
              </Form.Select>
            </Form.Group>

            {/* Select de Materias */}
            <Form.Group className="mb-3">
              <Form.Label>Materia</Form.Label>
              <Form.Select value={selectedMateria} onChange={(e) => setSelectedMateria(e.target.value)}>
                <option value="">Seleccione una materia</option>
                {allMaterias.map((materia) => (
                  <option key={materia._id} value={materia._id}>{materia.nombre}</option>
                ))}
              </Form.Select>
            </Form.Group>

            {/* Horarios */}
            {horarios.map((horario, index) => (
              <div key={index} className="mb-3">
                <Form.Group className="mb-3">
                  <Form.Label>Día</Form.Label>
                  <Form.Select value={horario.dia} onChange={(e) => handleHorarioChange(index, 'dia', e.target.value)}>
                    <option value="Lunes">Lunes</option>
                    <option value="Martes">Martes</option>
                    <option value="Miércoles">Miércoles</option>
                    <option value="Jueves">Jueves</option>
                    <option value="Viernes">Viernes</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Módulo Inicio</Form.Label>
                  <Form.Select value={horario.moduloInicio} onChange={(e) => handleHorarioChange(index, 'moduloInicio', e.target.value)}>
                    {Array.from({ length: 17 }, (_, i) => i + 1).map((modulo) => (
                      <option key={modulo} value={modulo}>{modulo}</option>
                    ))}
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Módulo Fin</Form.Label>
                  <Form.Select value={horario.moduloFin} onChange={(e) => handleHorarioChange(index, 'moduloFin', e.target.value)}>
                    {Array.from({ length: 17 }, (_, i) => i + 1).map((modulo) => (
                      <option key={modulo} value={modulo}>{modulo}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </div>
            ))}

            <Button style={{ backgroundColor: 'rgb(114, 16, 16)', color: '#FFF', borderColor: '#FFF' }} onClick={agregarDia}>Agregar Día</Button>
            {horarios.length > 1 && (
              <Button style={{ backgroundColor: 'rgb(114, 16, 16)', color: '#FFF', borderColor: '#FFF' }} className="ms-3" onClick={eliminarDia}>Eliminar Día</Button>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button style={{ backgroundColor: 'rgb(114, 16, 16)', color: '#FFF', borderColor: '#FFF' }} onClick={handleClose}>Asignar</Button>
          <Button variant="secondary" onClick={handleClose}>Cancelar</Button>
        </Modal.Footer>
      </Modal>
    </>
        </div>
      </div>

  
          {/* Tablas */}
          <div className="mb-5 text-center">
            {/* Primera Tabla: Módulos 1 a 9 */}
            <Table className='mb-5' bordered>
              <thead>
                <tr>
                  <th>Espacio</th>
                  {Array.from({ length: 9 }).map((_, index) => (
                    <th key={index}>Módulo {index + 1} 8am - 9am</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {espacios.map((espacio, rowIndex) => {
                  console.log(espacio.horarios); // Log de espacio.horarios aquí
                  return (
                    <tr key={rowIndex}>
                      <td>{espacio.nombre}</td>
                      {Array.from({ length: 9 }).map((_, colIndex) => {
                        const horario = espacio.horarios[colIndex]; // Obtener el horario correspondiente
                        return (
                          <td key={colIndex}>
                            {horario && horario.materia && horario.materia.length > 0 
                              ? horario.materia[0].nombre // Acceder al nombre de la materia
                              : "Disponible"}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </Table>

            {/* Segunda Tabla: Módulos 10 a 17 */}
            <Table bordered>
              <thead>
                <tr>
                  <th>Espacio</th>
                  {Array.from({ length: 8 }).map((_, index) => (
                    <th key={index}>Módulo {index + 10}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {espacios.map((espacio, rowIndex) => {
                  console.log(espacio.horarios); // Log de espacio.horarios aquí
                  return (
                    <tr key={rowIndex}>
                      <td>{espacio.nombre}</td>
                      {Array.from({ length: 8 }).map((_, colIndex) => {
                        const horario = espacio.horarios[colIndex + 9]; // Obtener el horario correspondiente
                        return (
                          <td key={colIndex}>
                            {horario && horario.materia && horario.materia.length > 0 
                              ? horario.materia[0].nombre // Acceder al nombre de la materia
                              : "Disponible"}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </Table>


          </div>

              <div className="mb-5 text-center">
                <h6>Click aquí para desasignar automáticamente</h6>
                <div className="d-flex justify-content-center flex-wrap">
                  <Button className="m-2"style={{ backgroundColor: 'rgb(114, 16, 16)', color: '#FFF', borderColor: '#FFF' }}>Desasignar Automáticamente</Button>
                </div>
              </div>

            </div>

  );

}

export default Home;
