import React, { useEffect, useState } from "react";
import logo from "../assets/ISO_UNSTA.png";
import {
  Button,
  Table,
  Form,
  Modal,
  ModalHeader,
  ModalTitle,
  ModalBody,
  FormGroup,
} from "react-bootstrap";
import styles from "../styles/detalles.module.css";
import ModalConfirmacion from "../components/ModalConfirmacion.jsx";

function Home() {
  const [allEdificios, setAllEdificios] = useState([]);
  const [allCarreras, setAllCarreras] = useState([]);
  const [planes, setPlanes] = useState([]);
  const [materias, setMaterias] = useState([]);
  const [allMaterias, setAllMaterias] = useState([]);
  const [allPlanes, setAllPlanes] = useState([]);
  const [selectedEdificio, setSelectedEdificio] = useState("");
  const [selectedDia, setSelectedDia] = useState("Lunes");
  const [espacios, setEspacios] = useState([]);
  const [materiaInfo, setMateriaInfo] = useState(null);
  const [espaciosmodal, setEspaciosmodal] = useState([]);
  const [selectedPlan1,SetSelectedPlan1]=useState("")

  const [selectedCarrera, setSelectedCarrera] = useState("");
  const [selectedMateria, setSelectedMateria] = useState("");
  const [selectedPlan, setSelectedPlan] = useState("");
  const [selectedCuatrimestre, setSelectedCuatrimestre] = useState("");
  const [horarios, setHorarios] = useState([
    { dia: "Lunes", moduloInicio: 1, moduloFin: 1 },
  ]);
  const [showModal, setShowModal] = useState(false);
  const [showModal2, setShowModal2] = useState(false);
  const [showModal3, setShowModal3] = useState(false);
  const [showMateriaModal, setShowMateriaModal] = useState(false);
  const [showModalConfirmacion, setShowModalConfirmacion] = useState(false);
  const [showModalConfirmacion2, setShowModalConfirmacion2] = useState(false);
  const [showModalConfirmacion3, setShowModalConfirmacion3] = useState(false);
  const [showDesasignarBtn, setShowDesasignarBtn] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Estado de carga
  const [showEspacioModal, setShowEspacioModal] = useState(false);
  const [espacioInfo, setEspacioInfo] = useState(null);
  const [selectedEspacio, setSelectedEspacio] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showErrorModal, setShowErrorModal] = useState(false);

  const [formData, setFormData] = useState({
    espacioId: "",
    materiaId: "",
    dias: [],
  });

  useEffect(() => {
    const estadoAsignacion = localStorage.getItem("estadoAsignacion");
    if (estadoAsignacion === "asignado") {
      setShowDesasignarBtn(true); // Mostrar botón de desasignar si ya se asignaron materias
    }
  }, []);

  {
    /* Horarios correspondientes a cada módulo */
  }
  const horariosModulos1a9 = [
    "8:00 a 8:45",
    "8:50 a 9:35",
    "9:40 a 10:25",
    "10:30 a 11:15",
    "11:20 a 12:05",
    "12:10 a 12:55",
    "13:00 a 13:45",
    "13:50 a 14:35",
    "15:00 a 15:45",
  ];

  const horariosModulos10a17 = [
    "15:50 a 16:35",
    "16:40 a 17:25",
    "17:30 a 18:15",
    "18:20 a 19:05",
    "19:10 a 19:55",
    "20:00 a 20:45",
    "20:50 a 21:35",
    "21:40 a 22:25",
  ];

  const getEdificios = async () => {
    const requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    const response = await fetch(
      "http://localhost:7000/edificio/buscar",
      requestOptions
    );
    const result = await response.json();
    setAllEdificios(result);
  };

  const getallespacios = async () => {
    const requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    const response = await fetch(
      "http://localhost:7000/espacio/",
      requestOptions
    );
    const result = await response.json();
    setEspaciosmodal(result);
  };
  useEffect(() => {
    getallespacios();
  }, []);

  const fetchEspacios = async () => {
    if (selectedEdificio && selectedDia) {
      try {
        const response = await fetch(
          `http://localhost:7000/edificio/filtrar/${selectedDia}/${selectedEdificio}`
        );
        console.log("Aqui1", response);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setEspacios(data);
        console.log("Data fetched:", data); // Asegúrate de que los datos son los esperados
      } catch (error) {
        console.error("Error al obtener espacios:", error);
      }
    }
  };

  // useEffect para hacer fetch de los edificios al cargar la página
  useEffect(() => {
    const inicializarDatos = async () => {
      await getEdificios(); // Obtener la lista de edificios
    };

    inicializarDatos();
  }, []); // Se ejecuta solo al montar el componente

  // useEffect para seleccionar el primer edificio cuando allEdificios cambie
  useEffect(() => {
    if (allEdificios.length > 0 && !selectedEdificio) {
      // Si hay edificios y no hay uno seleccionado
      const primerEdificio = allEdificios[0]._id; // Selecciona el primer edificio
      setSelectedEdificio(primerEdificio);
    }
  }, [allEdificios]); // Se ejecuta cuando se obtienen los edificios

  // useEffect para cargar los espacios cada vez que cambie el edificio o el día
  useEffect(() => {
    if (selectedEdificio) {
      fetchEspacios(selectedEdificio, selectedDia); // Cargar espacios con el edificio y el día actualizados
    }
  }, [selectedEdificio, selectedDia]); // Se ejecuta cuando cambian el edificio o el día

  const getCarreras = async () => {
    const requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    const response = await fetch(
      "http://localhost:7000/carrera/",
      requestOptions
    );
    const result = await response.json();
    setAllCarreras(result);
  };

  useEffect(() => {
    getCarreras();
  }, []);

  // Manejar el cambio de carrera seleccionada
  const handleCarreraChange = async (e) => {
    const carreraId = e.target.value;
    setSelectedCarrera(carreraId);
    setPlanes([]); // Limpiar planes al cambiar carrera
    setMaterias([]); // Limpiar materias al cambiar carrera

    if (carreraId) {
      try {
        // Hacer fetch para obtener los planes de estudio y materias asociadas
        const response = await fetch(
          `http://localhost:7000/carrera/buscarplan/${carreraId}`
        );
        const data = await response.json();
        setPlanes(data); // Guardar planes de la carrera
        console.log(data);
      } catch (error) {
        console.error("Error al cargar planes y materias:", error);
      }
    }
  };
  // Manejar el cambio de plan de estudio seleccionado
  const handlePlanChange = (e) => {
    const planId = e.target.value;
    setSelectedPlan(planId);
   

    // Buscar las materias del plan seleccionado
    const selectedPlanObj = planes.find((plan) => plan._id === planId);
    if (selectedPlanObj) {
      setMaterias(selectedPlanObj.materia); // Guardar materias asociadas al plan
      
    }
  };

  const handleMateriaChange = (event) => {
    const materiaId = event.target.value; // Obtén el ID de la materia seleccionada
    setSelectedMateria(materiaId); // Actualiza el estado de selectedMateria

    // Actualiza formData con el materiaId seleccionado
    setFormData((prevState) => ({
      ...prevState,
      materiaId: materiaId, // Agrega materiaId a formData
    }));
  };

  const getMaterias = async () => {
    const requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    const response = await fetch(
      "http://localhost:7000/materia/",
      requestOptions
    );
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

    const response = await fetch(
      "http://localhost:7000/planDeEstudio/",
      requestOptions
    );
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
  const handleShow3 = () => setShowModal3(true);
  const handleClose3 = () => setShowModal3(false);

  const handleCheckboxChange = (e) => {
    // Actualiza el estado según el checkbox seleccionado
    setSelectedCuatrimestre(e.target.value);
  };

  const agregarDia = () => {
    setHorarios([...horarios, { dia: "Lunes", moduloInicio: 1, moduloFin: 1 }]);
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

  const handleEspacioCellClick = async (espacioId) => {
    try {
      const response = await fetch(
        `http://localhost:7000/espacio/${espacioId}`
      );

      if (!response.ok) {
        throw new Error("Error al obtener la información del espacio");
      }

      const data = await response.json();
      setEspacioInfo(data); // Guardar la información del espacio en el estado
      setShowEspacioModal(true); // Mostrar el modal con la información
    } catch (error) {
      console.error("Error al obtener el espacio:", error);
    }
  };

  const handleCloseEspacioModal = () => {
    setShowEspacioModal(false);
    setEspacioInfo(null); // Limpiar la información al cerrar el modal
  };

  // Simulación de una operación asíncrona
  const fakeAsyncOperation = () => {
    return new Promise((resolve) => {
      setTimeout(resolve, 2000); // Simular una espera de 2 segundos
    });
  };

  const handleAutomatico = async () => {
    try {
      setShowModal2(false);
      setIsLoading(true); // Mostrar el modal de carga
      const response = await fetch("http://localhost:7000/materia/asignar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ semestre: selectedCuatrimestre, carreraId: selectedCarrera, planEstudioId : selectedPlan,}), // Envía el semestre seleccionado en el body  
      });
      console.log(selectedCarrera,selectedPlan,selectedCuatrimestre)

      if (!response.ok) {
        throw new Error("Error en la respuesta del servidor");
      }

      const data = await response.json();
      console.log("Asignación automática realizada:", data);

      // Simulación de asignación automática (puedes eliminar esto si no es necesario)
      await fakeAsyncOperation();

      // Ocultar el modal de carga
      setIsLoading(false);

      // Actualizar las tablas con los espacios
      await fetchEspacios(selectedEdificio, selectedDia); // Llama a fetchEspacios para actualizar las celdas

      // Guardar el estado en localStorage
      localStorage.setItem("estadoAsignacion", "asignado");
    } catch (error) {
      console.error("Error en la asignación automática:", error);
      setIsLoading(false); // En caso de error, asegúrate de ocultar el modal de carga
    }
  };

  const handleDesignarTodo = async () => {
    try {
      setIsLoading(true); // Mostrar el modal de carga

      const response = await fetch(
        "http://localhost:7000/materia/desasignarMaterias",
        {
          method: "POST", // O GET dependiendo de cómo esté tu backend
        }
      );

      if (!response.ok) {
        throw new Error("Error en la respuesta del servidor");
      }

      const data = await response.json();
      console.log("Desasignación completa realizada:", data);

      // Simulación de desasignación (si es necesario, puedes eliminar esta línea)
      await fakeAsyncOperation();

      // Ocultar el modal de carga
      setIsLoading(false);

      // Actualizar las tablas con los espacios
      await fetchEspacios(selectedEdificio, selectedDia); // Llamar a fetchEspacios para actualizar las tablas

      setShowDesasignarBtn(false); // O actualizar el estado si lo necesitas para otros elementos de la UI
      setShowModal2(false); // Cerrar el modal en caso de que se esté utilizando
    } catch (error) {
      console.error("Error al desasignar todo:", error);
      setIsLoading(false); // Asegurarse de ocultar el modal de carga en caso de error
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
    fetchEspacios(); // Refresca los espacios cuando cambia el día
  };

  const handleShowModalConfirmacion = () => setShowModalConfirmacion(true);
  const handeCloseModalConfirmacion = () => setShowModalConfirmacion(false);

  const handleShowModalConfirmacion2 = () => {
    setShowMateriaModal(false);
    setShowModalConfirmacion2(true);
  };

  const handleCloseModalConfirmacion2 = () => setShowModalConfirmacion2(false);

  const handleShowModalConfirmacion3 = () => {
    setShowModal3(false);
    setShowModalConfirmacion2(true);
  };
  const handleCloseModalConfirmacion3 = () => setShowModalConfirmacion3(false);

  const handleConfirmarDesasignar = async () => {
    setIsLoading(true); // Mostrar el modal de carga
    handeCloseModalConfirmacion(); // Cierra el modal después de ejecutar la acción
    setShowDesasignarBtn(false); // Muestra el botón de asignar automáticamente de nuevo
    await handleDesignarTodo(); // Ejecuta la función de desasignar
    await fakeAsyncOperation(); // Simulación de desasignación
    setIsLoading(false); // Ocultar el modal de carga
    localStorage.setItem("estadoAsignacion", "noAsignado"); // Actualiza el estado en localStorage
  };

  const handleConfirmarDesasignar2 = async () => {
    
    setShowModalConfirmacion2(false); // Cierra el modal después de ejecutar la acción
    setIsLoading(true);
    await handleEliminar(); // Ejecuta la función de desasignar
    await fetchEspacios(selectedEdificio, selectedDia);
    setIsLoading(false);
  };

  // funcion para asignar una materia a un espacio
  const handlemanualsubmit = async () => {
    const horariosConvertidos = horarios.map((horario) => ({
      dia: horario.dia,
      moduloInicio: Number(horario.moduloInicio), // Convertir a número
      moduloFin: Number(horario.moduloFin), // Convertir a número
    }));
    const dataToSend = {
      espacioId: selectedEspacio, // ID del espacio seleccionado
      materiaId: selectedMateria, // ID de la materia seleccionada
      dias: horariosConvertidos, // Los horarios capturados
    };
    console.log("Datos a enviar:", dataToSend);

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dataToSend),
    };

    try {
      const response = await fetch(
        "http://localhost:7000/asignar/asignacion",
        requestOptions
      ); // Cambia el endpoint por el correcto
      const result = await response.json();
      console.log(result); // Maneja la respuesta de la API según necesites
      setShowModal(false);
      setIsLoading(true);
      await fetchEspacios(selectedEdificio, selectedDia);
      setIsLoading(false);

      if (response.ok) {
        setErrorMessage(result.mensaje)
        setShowErrorModal(true);

      } else {
        
        setErrorMessage(result.mensaje || "Hubo un error al asignar la materia."); // Personaliza el mensaje
        setShowErrorModal(true); // Mostrar el modal de error
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleEspacioChange = (event) => {
    const espacioId = event.target.value; // Guarda el valor seleccionado
    setSelectedEspacio(espacioId);

    // Actualiza formData con el espacioId seleccionado
    setFormData((prevState) => ({
      ...prevState,
      espacioId: espacioId, // Agrega espacioId a formData
    }));
  };

  /// funcion para eliminar la materia de un espacio
  const handleEliminar = async () => {
    const dataToSend = {
      espacioId: selectedEspacio, // ID del espacio seleccionado
      materiaId: selectedMateria, // ID de la materia seleccionada
      dias: horarios, // Los horarios capturados
    };

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dataToSend),
    };

    try {
      const response = await fetch(
        "http://localhost:7000/asignar/desasignarManual",
        requestOptions
      ); // Cambia el endpoint por el correcto
      const result = await response.json();
      console.log(result); // Maneja la respuesta de la API según necesites
      if (response.ok) {
        setErrorMessage(result.mensaje)
        setShowErrorModal(true);
      } else {
        
        setErrorMessage(result.mensaje || "Hubo un error al eliminar la materia."); // Personaliza el mensaje
        setShowErrorModal(true); // Mostrar el modal de error
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="container" style={{ marginBottom: "150px" }}>
      {/* Título y Logo */}
      <div className="d-flex align-items-center justify-content-center my-5">
        <img
          src={logo}
          alt="Logo"
          style={{ width: "70px", height: "70px", marginRight: "20px" }}
        />
        <h1 style={{ fontFamily: "Crimson Text, serif" }}>AulaSMART</h1>
      </div>
      <div>
        <h2 className="d-flex align-items-center justify-content-center my-4" style={{ fontFamily: "Crimson Text, serif" }} >Menú Principal</h2>
      </div>

      {/* Sección Edificios */}
      <div className="mb-3 text-center">
        <h6>
          Seleccione el edificio cuyos espacios quiera mostrar en la tabla
        </h6>
        <Form.Group controlId="selectEdificio">
          <Form.Control
            as="select"
            onChange={handleEdificioChange}
            value={selectedEdificio}
          >
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
      <div className="mb-3 text-center">
        <h6>Seleccione el día de la semana</h6>
        <Form.Group id="selectDias">
          <Form.Control
            as="select"
            onChange={handleDiaChange}
            value={selectedDia}
          >
            <option>Lunes</option>
            <option>Martes</option>
            <option>Miercoles</option>
            <option>Jueves</option>
            <option>Viernes</option>
          </Form.Control>
        </Form.Group>
      </div>
      {/* Sección Carreras */}
      <div className="mb-3 text-center">
        <h6>Seleccione la carrera</h6>
        <Form.Group id="selectCarreras">
          <Form.Control
            as="select"
            onChange={handleCarreraChange}
            value={selectedCarrera}
          >
            <option>Seleccione una carrera</option>
            {allCarreras.map((carrera, index) => (
              <option key={index} value={carrera._id}>
                {carrera.nombre}
              </option>
            ))}
          </Form.Control>
        </Form.Group>
      </div>
      {/* Sección Planes */}
      <div className="mb-5 text-center">
        <h6>Seleccione un Plan de Estudio</h6>
        <Form.Group id="selectPlan">
          <Form.Control
            as="select"
            onChange={handlePlanChange}
            value={selectedPlan}
            
          >
            <option>Seleccione un plan</option>
            {allPlanes.map((plan, index) => (
              <option key={index} value={plan._id}>
                {plan.nombre}
              </option>
            ))}
          </Form.Control>
        </Form.Group>
      </div>

      {/* Botones Asignación */}

      <div className="d-flex justify-content-between">
        <h6>Presionar aquí para ejecutar la acción</h6>
        <h6>Presionar aquí para ejecutar la acción</h6>
      </div>

      <div className="text-center">
        <div className="d-flex justify-content-between">
        
            <Button
              className="m-2"
              style={{
                backgroundColor: "rgb(114, 16, 16)",
                color: "#FFF",
                borderColor: "#FFF",
              }}
              onClick={handleShow2}
            >
              Asignar Automáticamente
            </Button>
          

          
            <Button
              className="m-2"
              style={{
                backgroundColor: "rgb(114, 16, 16)",
                color: "#FFF",
                borderColor: "#FFF",
              }}
              onClick={handleShowModalConfirmacion}
            >
              Desasignar Automáticamente
            </Button>
          

          <Button
            className="m-2"
            style={{
              backgroundColor: "rgb(114, 16, 16)",
              color: "#FFF",
              borderColor: "#FFF",
            }}
            onClick={handleShow3}
          >
            Eliminar Asignación
          </Button>

          <>
            <Button
              className="m-2"
              style={{
                backgroundColor: "rgb(114, 16, 16)",
                color: "#FFF",
                borderColor: "#FFF",
              }}
              onClick={handleShow}
            >
              Asignar Manualmente
            </Button>

              {/* Modal de Alert*/}
            <Modal show={showErrorModal} onHide={() => setShowErrorModal(false)}>
              <Modal.Header closeButton>
                <Modal.Title>Mensaje</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <h5>{errorMessage}</h5>

              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowErrorModal(false)}>
                  Cerrar
                </Button>
              </Modal.Footer>
            </Modal>


            {/* Modal de Confirmación 1*/}
            <ModalConfirmacion
              show={showModalConfirmacion}
              handleClose={handeCloseModalConfirmacion}
              handleConfirm={handleConfirmarDesasignar}
            />

            {/* Modal de Confirmación 2*/}
            <ModalConfirmacion
              show={showModalConfirmacion2}
              handleClose={handleCloseModalConfirmacion2}
              handleConfirm={handleConfirmarDesasignar2}
            />

            {/* Modal Asignar Automaticamente */}
            <Modal show={showModal2} onHide={handleClose2}>
              <ModalHeader closeButton>
                <ModalTitle>Elegir Cuatrimestre</ModalTitle>
              </ModalHeader>
              <ModalBody>
                <Form>
                  {/* Select de Carreras */}
                  <Form.Group className="mb-3">
                    <Form.Label>Carrera</Form.Label>
                    <Form.Select
                      value={selectedCarrera}
                      onChange={handleCarreraChange}
                    >
                      <option value="">Seleccione una carrera</option>
                      {allCarreras.map((carrera) => (
                        <option key={carrera._id} value={carrera._id}>
                          {carrera.nombre}
                        </option>
                      ))}
                      </Form.Select>
                    </Form.Group>

                  {/* Select de Planes */}
                  <Form.Group className="mb-3">
                    <Form.Label>Plan de Estudio</Form.Label>
                    <Form.Select
                      value={selectedPlan}
                      onChange={handlePlanChange}
                      disabled={!planes.length}
                    >
                      <option value="">Seleccione un Plan de Estudio</option>
                      {planes.map((plan) => (
                        <option key={plan._id} value={plan._id}>
                          {plan.nombre}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                  <FormGroup className="mb-3">
                    {/* Radio para Primer Cuatrimestre */}
                    <Form.Check
                      type="radio"
                      label="Primer Cuatrimestre"
                      name="cuatrimestre" // Asegurarse de que ambos radios pertenecen al mismo grupo
                      value="Primer Cuatrimestre"
                      checked={selectedCuatrimestre === "Primer Cuatrimestre"}
                      onChange={handleCheckboxChange}
                    />
                    {/* Radio para Segundo Cuatrimestre */}
                    <Form.Check
                      type="radio"
                      label="Segundo Cuatrimestre"
                      name="cuatrimestre" // Asegurarse de que ambos radios pertenecen al mismo grupo
                      value="Segundo Cuatrimestre"
                      checked={selectedCuatrimestre === "Segundo Cuatrimestre"}
                      onChange={handleCheckboxChange}
                    />
                  </FormGroup>
                </Form>
              </ModalBody>
              <Modal.Footer>
                <Button
                  disabled={!selectedCuatrimestre || !selectedPlan || !selectedCarrera}
                  style={{
                    backgroundColor: "rgb(114, 16, 16)",
                    color: "#FFF",
                    borderColor: "#FFF",
                  }}
                  onClick={handleAutomatico}
                >
                  Asignar
                </Button>
                <Button variant="secondary" onClick={handleClose2}>
                  Cancelar
                </Button>
              </Modal.Footer>
            </Modal>

            {/* Modal Cargando... */}
            <Modal show={isLoading} backdrop="static" keyboard={false} centered>
              <Modal.Body style={{ backgroundColor: "rgb(114, 16, 16)" }}>
                <div className="text-center">
                  <h5 className="text-light">Cargando...</h5>
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
                    <Form.Select
                      value={selectedCarrera}
                      onChange={handleCarreraChange}
                    >
                      <option value="">Seleccione una carrera</option>
                      {allCarreras.map((carrera) => (
                        <option key={carrera._id} value={carrera._id}>
                          {carrera.nombre}
                        </option>
                      ))}
                      </Form.Select>
                    </Form.Group>

                  {/* Select de Planes */}
                  <Form.Group className="mb-3">
                    <Form.Label>Plan de Estudio</Form.Label>
                    <Form.Select
                      value={selectedPlan}
                      onChange={handlePlanChange}
                      disabled={!planes.length}
                    >
                      <option value="">Seleccione un Plan de Estudio</option>
                      {planes.map((plan) => (
                        <option key={plan._id} value={plan._id}>
                          {plan.nombre}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>

                  {/* Select de Materias */}
                  <Form.Group className="mb-3">
                    <Form.Label>Materia</Form.Label>
                    <Form.Select
                      value={selectedMateria}
                      onChange={handleMateriaChange}
                      disabled={!materias.length}
                    >
                      <option value="">Seleccione una materia</option>
                      {materias.map((materia) => (
                        <option key={materia._id} value={materia._id}>
                          {materia.nombre}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>

                  {/*Espacios */}
                  <Form.Group className="mb-3">
                    <Form.Label>Espacios</Form.Label>
                    <Form.Select
                      value={selectedEspacio} // Usamos el estado seleccionado
                      onChange={handleEspacioChange} // Asignamos el manejador
                      disabled={espaciosmodal.length === 0} // Deshabilitar si no hay espacios
                    >
                      <option value="">Seleccione un espacio</option>
                      {espaciosmodal.map((espacio) => (
                        <option key={espacio._id} value={espacio._id}>
                          {espacio.nombre}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>

                  {/* Horarios */}
                  {horarios.map((horario, index) => (
                    <div key={index} className="mb-3">
                      <Form.Group className="mb-3">
                        <Form.Label>Día</Form.Label>
                        <Form.Select
                          value={horario.dia}
                          onChange={(e) =>
                            handleHorarioChange(index, "dia", e.target.value)
                          }
                        >
                          <option value="Lunes">Lunes</option>
                          <option value="Martes">Martes</option>
                          <option value="Miércoles">Miércoles</option>
                          <option value="Jueves">Jueves</option>
                          <option value="Viernes">Viernes</option>
                        </Form.Select>
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Módulo Inicio</Form.Label>
                        <Form.Select
                          value={horario.moduloInicio}
                          onChange={(e) =>
                            handleHorarioChange(
                              index,
                              "moduloInicio",
                              e.target.value
                            )
                          }
                        >
                          {Array.from({ length: 17 }, (_, i) => i + 1).map(
                            (modulo) => (
                              <option key={modulo} value={modulo}>
                                {modulo}
                              </option>
                            )
                          )}
                        </Form.Select>
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Módulo Fin</Form.Label>
                        <Form.Select
                          value={horario.moduloFin}
                          onChange={(e) =>
                            handleHorarioChange(
                              index,
                              "moduloFin",
                              e.target.value
                            )
                          }
                        >
                          {Array.from({ length: 17 }, (_, i) => i + 1).map(
                            (modulo) => (
                              <option key={modulo} value={modulo}>
                                {modulo}
                              </option>
                            )
                          )}
                        </Form.Select>
                      </Form.Group>
                    </div>
                  ))}

                  <Button
                    style={{
                      backgroundColor: "rgb(114, 16, 16)",
                      color: "#FFF",
                      borderColor: "#FFF",
                    }}
                    onClick={agregarDia}
                  >
                    Agregar Día
                  </Button>
                  {horarios.length > 1 && (
                    <Button
                      style={{
                        backgroundColor: "rgb(114, 16, 16)",
                        color: "#FFF",
                        borderColor: "#FFF",
                      }}
                      className="ms-3"
                      onClick={eliminarDia}
                    >
                      Eliminar Día
                    </Button>
                  )}
                </Form>
              </Modal.Body>
              <Modal.Footer>
                <Button
                  style={{
                    backgroundColor: "rgb(114, 16, 16)",
                    color: "#FFF",
                    borderColor: "#FFF",
                  }}
                  onClick={handlemanualsubmit}
                  disabled={
                    !selectedCarrera ||
                    !selectedEspacio ||
                    !selectedPlan ||
                    !selectedMateria
                  }
                >
                  Asignar
                </Button>
                <Button variant="secondary" onClick={handleClose}>
                  Cancelar
                </Button>
              </Modal.Footer>
            </Modal>

            {/* Modal Eliminar Asignación */}
            <Modal show={showModal3} onHide={handleClose3}>
              <Modal.Header closeButton>
                <Modal.Title>Complete los campos</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form>
                  {/* Select de Carreras */}
                  <Form.Group className="mb-3">
                    <Form.Label>Carrera</Form.Label>
                    <Form.Select
                      value={selectedCarrera}
                      onChange={handleCarreraChange}
                    >
                      <option value="">Seleccione una carrera</option>
                      {allCarreras.map((carrera) => (
                        <option key={carrera._id} value={carrera._id}>
                          {carrera.nombre}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>

                  {/* Select de Planes */}
                  <Form.Group className="mb-3">
                    <Form.Label>Plan de Estudio</Form.Label>
                    <Form.Select
                      value={selectedPlan}
                      onChange={handlePlanChange}
                      disabled={!planes.length}
                    >
                      <option value="">Seleccione un Plan de Estudio</option>
                      {planes.map((plan) => (
                        <option key={plan._id} value={plan._id}>
                          {plan.nombre}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>

                  {/* Select de Materias */}
                  <Form.Group className="mb-3">
                    <Form.Label>Materia</Form.Label>
                    <Form.Select
                      value={selectedMateria}
                      onChange={handleMateriaChange}
                      disabled={!materias.length}
                    >
                      <option value="">Seleccione una materia</option>
                      {materias.map((materia) => (
                        <option key={materia._id} value={materia._id}>
                          {materia.nombre}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>

                  {/*Espacios */}
                  <Form.Group className="mb-3">
                    <Form.Label>Espacios</Form.Label>
                    <Form.Select
                      value={selectedEspacio} // Usamos el estado seleccionado
                      onChange={handleEspacioChange} // Asignamos el manejador
                      disabled={espaciosmodal.length === 0} // Deshabilitar si no hay espacios
                    >
                      <option value="">Seleccione un espacio</option>
                      {espaciosmodal.map((espacio) => (
                        <option key={espacio._id} value={espacio._id}>
                          {espacio.nombre}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>

                  {/* Horarios */}
                  {horarios.map((horario, index) => (
                    <div key={index} className="mb-3">
                      <Form.Group className="mb-3">
                        <Form.Label>Día</Form.Label>
                        <Form.Select
                          value={horario.dia}
                          onChange={(e) =>
                            handleHorarioChange(index, "dia", e.target.value)
                          }
                        >
                          <option value="Lunes">Lunes</option>
                          <option value="Martes">Martes</option>
                          <option value="Miércoles">Miércoles</option>
                          <option value="Jueves">Jueves</option>
                          <option value="Viernes">Viernes</option>
                        </Form.Select>
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Módulo Inicio</Form.Label>
                        <Form.Select
                          value={horario.moduloInicio}
                          onChange={(e) =>
                            handleHorarioChange(
                              index,
                              "moduloInicio",
                              e.target.value
                            )
                          }
                        >
                          {Array.from({ length: 17 }, (_, i) => i + 1).map(
                            (modulo) => (
                              <option key={modulo} value={modulo}>
                                {modulo}
                              </option>
                            )
                          )}
                        </Form.Select>
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Módulo Fin</Form.Label>
                        <Form.Select
                          value={horario.moduloFin}
                          onChange={(e) =>
                            handleHorarioChange(
                              index,
                              "moduloFin",
                              e.target.value
                            )
                          }
                        >
                          {Array.from({ length: 17 }, (_, i) => i + 1).map(
                            (modulo) => (
                              <option key={modulo} value={modulo}>
                                {modulo}
                              </option>
                            )
                          )}
                        </Form.Select>
                      </Form.Group>
                    </div>
                  ))}

                  <Button
                    style={{
                      backgroundColor: "rgb(114, 16, 16)",
                      color: "#FFF",
                      borderColor: "#FFF",
                    }}
                    onClick={agregarDia}
                  >
                    Agregar Día
                  </Button>
                  {horarios.length > 1 && (
                    <Button
                      style={{
                        backgroundColor: "rgb(114, 16, 16)",
                        color: "#FFF",
                        borderColor: "#FFF",
                      }}
                      className="ms-3"
                      onClick={eliminarDia}
                    >
                      Eliminar Día
                    </Button>
                  )}
                </Form>
              </Modal.Body>
              <Modal.Footer>
                <Button
                  style={{
                    backgroundColor: "rgb(114, 16, 16)",
                    color: "#FFF",
                    borderColor: "#FFF",
                  }}
                  onClick={handleShowModalConfirmacion3}
                  disabled={
                    !selectedCarrera ||
                    !selectedEspacio ||
                    !selectedPlan ||
                    !selectedMateria
                  }
                >
                  Eliminar Asignación
                </Button>
                <Button variant="secondary" onClick={handleClose3}>
                  Cancelar
                </Button>
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
              <p>
                <strong>Nombre:</strong> {materiaInfo.nombre}
              </p>
              <p>
                <strong>Año:</strong> {materiaInfo.anio}
              </p>
              <p>
                <strong>Semestre:</strong> {materiaInfo.semestre}
              </p>
              <p>
                <strong>Profesor:</strong> {materiaInfo.profesor[0].nombre}{" "}
                {materiaInfo.profesor[0].apellido}
              </p>
              <p>
                <strong>Cantidad de Alumnos:</strong>{" "}
                {materiaInfo.cantidadAlumnos}
              </p>
              <p>
                <strong>Código:</strong> {materiaInfo.codigo}
              </p>
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

      {/* Modal para mostrar información del espacio */}
      <Modal show={showEspacioModal} onHide={handleCloseEspacioModal}>
        <ModalHeader closeButton>
          <ModalTitle>Información del Espacio</ModalTitle>
        </ModalHeader>
        <ModalBody>
          {espacioInfo ? (
            <div>
              {console.log("Espacio: ", espacioInfo)}
              <p>
                <strong>Nombre:</strong> {espacioInfo.nombre}
              </p>
              <p>
                <strong>Tipo:</strong> {espacioInfo.tipo}
              </p>
              <p>
                <strong>Capacidad:</strong> {espacioInfo.capacidad}
              </p>
              <p>
                <strong>Elementos:</strong>{" "}
                {espacioInfo.elemento?.map((el) => el.nombre).join(", ")}
              </p>
            </div>
          ) : (
            <p>No se ha seleccionado ningún espacio.</p>
          )}
        </ModalBody>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseEspacioModal}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>

      <div className="mb-5 text-center">
        {/* Primera Tabla: Módulos 1 a 9 */}
        <Table className="mb-5" bordered>
          <thead>
            <tr>
              <th>Espacio</th>
              {Array.from({ length: 9 }).map((_, index) => (
                <th key={index}>
                  Módulo {index + 1}
                  <br />
                  {horariosModulos1a9[index]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {espacios.map((espacio, rowIndex) => (
              <tr key={rowIndex}>
                {/* Hacer que el nombre del espacio sea clickable */}
                <td
                  className={styles.hoverMateria}
                  onClick={() => handleEspacioCellClick(espacio._id)}
                  style={{ cursor: "pointer" }}
                >
                  {espacio.nombre}
                </td>
                {Array.from({ length: 9 }).map((_, colIndex) => {
                  const horario = espacio.horarios[colIndex];
                  const tieneMateria = horario?.materia?.length > 0;

                  return (
                    <td
                      key={colIndex}
                      onClick={() =>
                        tieneMateria && handleCellClick(horario.materia[0])
                      }
                      className={tieneMateria ? styles.hoverMateria : ""}
                      style={{ cursor: tieneMateria ? "pointer" : "default" }}
                    >
                      {tieneMateria ? horario.materia[0].nombre : "-"}
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
                <th key={index}>
                  Módulo {index + 10}
                  <br />
                  {horariosModulos10a17[index]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {espacios.map((espacio, rowIndex) => (
              <tr key={rowIndex}>
                {/* Hacer que el nombre del espacio sea clickable */}
                <td
                  className={styles.hoverMateria}
                  onClick={() => handleEspacioCellClick(espacio._id)}
                  style={{ cursor: "pointer" }}
                >
                  {espacio.nombre}
                </td>
                {Array.from({ length: 8 }).map((_, colIndex) => {
                  const horario = espacio.horarios[colIndex + 9]; // Obtener el horario correspondiente
                  const tieneMateria = horario?.materia?.length > 0;

                  return (
                    <td
                      key={colIndex}
                      onClick={() =>
                        tieneMateria && handleCellClick(horario.materia[0])
                      }
                      className={tieneMateria ? styles.hoverMateria : ""}
                      style={{ cursor: tieneMateria ? "pointer" : "default" }}
                    >
                      {tieneMateria ? horario.materia[0].nombre : "-"}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
}

export default Home;
