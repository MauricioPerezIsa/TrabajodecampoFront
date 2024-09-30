import React, { useEffect, useState } from 'react';
import logo from "../assets/ISO_UNSTA.png"
import { Button, Table, Form, Modal, ModalHeader, ModalTitle, ModalBody, FormGroup } from 'react-bootstrap';
import styles from "../styles/detalles.module.css"
import ModalConfirmacion from "../components/ModalConfirmacion.jsx"

function Home() {

  const [allEdificios, setAllEdificios] = useState([]);
  const [allCarreras, setAllCarreras] = useState([]);
  const [allMaterias, setAllMaterias] = useState([]);
  const [allPlanes, setAllPlanes] = useState([]);
  const [selectedEdificio, setSelectedEdificio] = useState('');
  const [selectedDia, setSelectedDia] = useState('Lunes');
  const [espacios, setEspacios] = useState([]);
  const [materiaInfo, setMateriaInfo] = useState(null);

  const [selectedCarrera, setSelectedCarrera] = useState('');
  const [selectedMateria, setSelectedMateria] = useState('');
  const [selectedPlan, setSelectedPlan] = useState('');
  const [selectedCuatrimestre, setSelectedCuatrimestre] = useState("");
  const [horarios, setHorarios] = useState([{ dia: 'Lunes', moduloInicio: 1, moduloFin: 1 }]);
  const [showModal, setShowModal] = useState(false);
  const [showModal2, setShowModal2] = useState(false);
  const [showMateriaModal, setShowMateriaModal] = useState(false);
  const [showModalConfirmacion, setShowModalConfirmacion] = useState(false);
  const [showDesasignarBtn, setShowDesasignarBtn] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Estado de carga

  useEffect(() => {
    const estadoAsignacion = localStorage.getItem('estadoAsignacion');
    if (estadoAsignacion === 'asignado') {
      setShowDesasignarBtn(true); // Mostrar botón de desasignar si ya se asignaron materias
    }
  }, []);

  {/* Horarios correspondientes a cada módulo */}
  const horariosModulos1a9 = [
    '8:00 a 8:45', '8:50 a 9:35', '9:40 a 10:25', '10:30 a 11:15', 
    '11:20 a 12:05', '12:10 a 12:55', '13:00 a 13:45', '13:50 a 14:35', 
    '15:00 a 15:45'
  ];
  
  const horariosModulos10a17 = [
    '15:50 a 16:35', '16:40 a 17:25', '17:30 a 18:15', '18:20 a 19:05', 
    '19:10 a 19:55', '20:00 a 20:45', '20:50 a 21:35', '21:40 a 22:25'
  ];

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

  const getPlanes = async () => {
    const requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    const response = await fetch("http://localhost:7000/planDeEstudio/", requestOptions);
    const result = await response.json();
    setAllPlanes(result);
  };

  useEffect(() => {
    getPlanes();
  }, []);

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);
  const handleShow2 = () => setShowModal2(true);
  const handleClose2 = () => setShowModal2(false);

  const handleCheckboxChange = (e) => {
    // Actualiza el estado según el checkbox seleccionado
    setSelectedCuatrimestre(e.target.value);
  };

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

  const handleCellClick = (materia) => {
    setMateriaInfo(materia);
    setShowMateriaModal(true);
  };
  
  const handleCloseMateriaModal = () => {
    setShowMateriaModal(false);
    setMateriaInfo(null);
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

  // Simulación de una operación asíncrona
  const fakeAsyncOperation = () => {
    return new Promise((resolve) => {
      setTimeout(resolve, 2000); // Simular una espera de 2 segundos
    });
  };

  const handleAutomatico = async () => {
    setIsLoading(true); // Mostrar el modal de carga al instante
    setShowDesasignarBtn(true);
    localStorage.setItem('estadoAsignacion', 'asignado'); // Guarda el estado en localStorage
    setShowModal2(false); // Cierra el modal de asignar automáticamente
  
    try {
      const response = await fetch("http://localhost:7000/materia/asignar", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ semestre: selectedCuatrimestre }), // Envía el semestre seleccionado en el body
      });
  
      if (!response.ok) {
        throw new Error('Error en la respuesta del servidor');
      }
  
      const data = await response.json();
      console.log('Asignación automática realizada:', data);
  
      await fakeAsyncOperation(); // Simulación de asignación automática
  
      
    } catch (error) {
      console.error('Error en la asignación automática:', error);
    } finally {
      setIsLoading(false); // Ocultar el modal de carga al finalizar, incluso si hay un error
    }
  };
  

  const handleDesignarTodo = async () => {
    try {
      const response = await fetch('http://localhost:7000/materia/desasignarMaterias', {
        method: 'POST', // O GET dependiendo de cómo esté tu backend
      });

      if (!response.ok) {
        throw new Error('Error en la respuesta del servidor');
      }

      const data = await response.json();
      console.log('Designación completada:', data);
    } catch (error) {
      console.error('Error al designar todo:', error);
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

  const handleShowModalConfirmacion = () => setShowModalConfirmacion(true);
  const handleCloseModalConfirmacion = () => setShowModalConfirmacion(false);

  const handleConfirmarDesasignar = async () => {
    setIsLoading(true); // Mostrar el modal de carga
    handleCloseModalConfirmacion(); // Cierra el modal después de ejecutar la acción
    setShowDesasignarBtn(false); // Muestra el botón de asignar automáticamente de nuevo
    await handleDesignarTodo(); // Ejecuta la función de desasignar
    await fakeAsyncOperation(); // Simulación de desasignación
    setIsLoading(false); // Ocultar el modal de carga
    localStorage.setItem('estadoAsignacion', 'noAsignado'); // Actualiza el estado en localStorage
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

      <div className="d-flex justify-content-between" >
        <h6>Presionar aquí para ejecutar la acción</h6>
        <h6>Presionar aquí para ejecutar la acción</h6>
      </div>

      <div className="text-center">
      <div className="d-flex justify-content-between" >
      {!showDesasignarBtn && (
          <Button
            className="m-2"
            style={{
              backgroundColor: 'rgb(114, 16, 16)',
              color: '#FFF',
              borderColor: '#FFF'
            }}
            onClick={handleShow2}
          >
            Asignar Automáticamente
          </Button>
        )}

        {showDesasignarBtn && (
          <Button
            className="m-2"
            style={{
              backgroundColor: 'rgb(114, 16, 16)',
              color: '#FFF',
              borderColor: '#FFF'
            }}
            onClick={handleShowModalConfirmacion}
          >
            Desasignar Automáticamente
          </Button>
        )}

      <>
      <Button className="m-2" style={{ backgroundColor: 'rgb(114, 16, 16)', color: '#FFF', borderColor: '#FFF' }} onClick={handleShow}>
        Asignar Manualmente
      </Button>

      
      {/* Modal de Confirmación */}
      <ModalConfirmacion
        show={showModalConfirmacion}
        handleClose={handleCloseModalConfirmacion}
        handleConfirm={handleConfirmarDesasignar}
      />

      {/* Modal Asignar Automaticamente */}
      <Modal show={showModal2} onHide={handleClose2} >
            <ModalHeader closeButton >
              <ModalTitle>Elegir Cuatrimestre</ModalTitle>
            </ModalHeader>
            <ModalBody>
              <Form>
                <FormGroup className="mb-3" >
                     {/* Radio para Primer Cuatrimestre */}
              <Form.Check
                type="radio"
                label="Primer Cuatrimestre"
                name="cuatrimestre" // Asegurarse de que ambos radios pertenecen al mismo grupo
                value="Primer Cuatrimestre"
                checked={selectedCuatrimestre === 'Primer Cuatrimestre'}
                onChange={handleCheckboxChange}
              />
              {/* Radio para Segundo Cuatrimestre */}
              <Form.Check
                type="radio"
                label="Segundo Cuatrimestre"
                name="cuatrimestre" // Asegurarse de que ambos radios pertenecen al mismo grupo
                value="Segundo Cuatrimestre"
                checked={selectedCuatrimestre === 'Segundo Cuatrimestre'}
                onChange={handleCheckboxChange}
              />
                      </FormGroup>
                    </Form>
                  </ModalBody>
                  <Modal.Footer>
                <Button disabled={!selectedCuatrimestre} style={{ backgroundColor: 'rgb(114, 16, 16)', color: '#FFF', borderColor: '#FFF' }} onClick={handleAutomatico}>Asignar</Button>
                <Button variant="secondary" onClick={handleClose2}>Cancelar</Button>
              </Modal.Footer>
        </Modal>

        {/* Modal Cargando... */}
      <Modal show={isLoading} backdrop="static" keyboard={false} centered>
        <Modal.Body style={{ backgroundColor: 'rgb(114, 16, 16)'}}>
          <div className="text-center">
            <h5 className='text-light' >Cargando...</h5>
          </div>
        </Modal.Body>
      </Modal>

      {/* Modal Asignar Manual */}
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

            {/* Select de Plenes */}
            <Form.Group className="mb-3">
              <Form.Label>Plan de Estudio</Form.Label>
              <Form.Select value={selectedPlan} onChange={(e) => setSelectedPlan(e.target.value)}>
                <option value="">Seleccione un Plan de Estudio</option>
                {allPlanes.map((plan) => (
                  <option key={plan._id} value={plan._id}>{plan.nombre}</option>
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

            {/* Modal para mostrar información de la materia */}
            <Modal show={showMateriaModal} onHide={handleCloseMateriaModal}>
              <ModalHeader closeButton>
                <ModalTitle>Información de la Materia</ModalTitle>
              </ModalHeader>
              <ModalBody>
                {materiaInfo ? (
                  <div>
                    {console.log(materiaInfo)}
                    <p><strong>Nombre:</strong> {materiaInfo.nombre}</p>
                    <p><strong>Año:</strong> {materiaInfo.anio}</p>
                    <p><strong>Semestre:</strong> {materiaInfo.semestre}</p>
                    <p><strong>Profesor:</strong> {materiaInfo.profesor[0].nombre} {materiaInfo.profesor[0].apellido}</p>
                    <p><strong>Cantidad de Alumnos:</strong> {materiaInfo.cantidadAlumnos}</p>
                    <p><strong>Código:</strong> {materiaInfo.codigo}</p>
                  </div>
                ) : (
                  <p>No se ha seleccionado ninguna materia.</p>
                )}
              </ModalBody>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseMateriaModal}>
                  Cerrar
                </Button>
              </Modal.Footer>
            </Modal>

  
              {/* Tablas */ }
              <div className="mb-5 text-center">
                {/* Primera Tabla: Módulos 1 a 9 */}
                <Table className='mb-5' bordered>
                  <thead>
                    <tr>
                      <th>Espacio</th>
                      {Array.from({ length: 9 }).map((_, index) => (
                        <th key={index}>Módulo {index + 1}<br />{horariosModulos1a9[index]}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                      {espacios.map((espacio, rowIndex) => (
                        <tr key={rowIndex}>
                          <td>{espacio.nombre}</td>
                          {Array.from({ length: 9 }).map((_, colIndex) => {
                            const horario = espacio.horarios[colIndex];
                            const tieneMateria = horario?.materia?.length > 0;

                            return (
                              <td
                                key={colIndex}
                                onClick={() => tieneMateria && handleCellClick(horario.materia[0])}
                                className={tieneMateria ? styles.hoverMateria : ""}
                                style={{ cursor: tieneMateria ? "pointer" : "default" }}
                              >
                                {tieneMateria ? horario.materia[0].nombre : "Disponible"}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>

                </Table>

                {/* Segunda Tabla: Módulos 10 a 17 */}
                <Table bordered>
                  <thead>
                    <tr>
                      <th>Espacio</th>
                      {Array.from({ length: 8 }).map((_, index) => (
                        <th key={index}>Módulo {index + 10}<br />{horariosModulos10a17[index]}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {espacios.map((espacio, rowIndex) => {
                      return (
                        <tr key={rowIndex}>
                          <td>{espacio.nombre}</td>
                          {Array.from({ length: 8 }).map((_, colIndex) => {
                            const horario = espacio.horarios[colIndex + 9]; // Obtener el horario correspondiente
                            const tieneMateria = horario?.materia?.length > 0;
                            return (
                              <td
                                key={colIndex}
                                onClick={() =>
                                  horario?.materia?.length > 0 && handleCellClick(horario.materia[0])
                                }
                                className={tieneMateria ? styles.hoverMateria : ""}
                                style={{ cursor: horario?.materia?.length > 0 ? "pointer" : "default" }}
                              >
                                {horario?.materia?.length > 0 ? horario.materia[0].nombre : "Disponible"}
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </div>

            </div>

  );

}

export default Home;
