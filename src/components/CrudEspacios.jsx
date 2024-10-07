import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Row, Form } from "react-bootstrap";
import AlertCreado from "./AlertCreado";
import ModalConfirmacion from "./ModalConfirmacion";
import logo from "../assets/ISO_UNSTA.png";

function CrudEspacio() {
  const [allEspacio, setAllEspacio] = useState([]);
  const [allElementos, setAllElementos] = useState([]);
  const [allEdificios, setAllEdificios] = useState([])
  const [nombreEspacio, setNombreEspacio] = useState("");
  const [tipoEspacio, setTipoEspacio] = useState("");
  const [capacidadEspacio, setCapacidadEspacio] = useState("");
  const [elementosEspacio, setElementosEspacio] = useState([]);
  const [selectedEdificio, setSelectedEdificio] = useState("")
  const [edificioFiltro, setEdificioFiltro] = useState("");

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const [updateId, setUpdateId] = useState("");
  const [updateNombreEspacio, setUpdateNombreEspacio] = useState("");
  const [updateTipoEspacio, setUpdateTipoEspacio] = useState("");
  const [updateCapacidadEspacio, setUpdateCapacidadEspacio] = useState("");
  const [updateElementosEspacio, setUpdateElementosEspacio] = useState([]);
  const [updateSelectedEdificio, setUpdateSelectedEdificio] = useState("");

  const [Errores, setErrores] = useState({});

  const edificioSeleccionado = allEdificios.find(edificio => edificio._id === edificioFiltro);

  const espaciosFiltrados = edificioSeleccionado ? edificioSeleccionado.espacio : allEspacio;

  const getEspacio = async () => {
    try {
      const response = await fetch("http://localhost:7000/espacio/");
      const result = await response.json();

      if (Array.isArray(result)) {
        setAllEspacio(result);
      } else {
        console.error("La respuesta no es un array:", result);
        setAllEspacio([]);
      }
    } catch (error) {
      console.error("Error al obtener los espacios:", error);
    }
  };

  const getEdificios = async () => {
    try {
      const response = await fetch("http://localhost:7000/edificio/buscar");
      const result = await response.json();

      if (Array.isArray(result)) {
        setAllEdificios(result);
      } else {
        console.error("La respuesta no es un array:", result);
        setAllEdificios([]);
      }
    } catch (error) {
      console.error("Error al obtener los espacios:", error);
    }
  };

  const getElementos = async () => {
    try {
      const response = await fetch("http://localhost:7000/elemento/");
      if (!response.ok) {
        throw new Error("Error al obtener los elementos");
      }
      const result = await response.json();
      setAllElementos(result);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleEdificioChange = (e) => {
    setSelectedEdificio(e.target.value);
  };

  const CrearEspacio = async () => {
    try {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const raw = JSON.stringify({
        nombre: nombreEspacio,
        tipo: tipoEspacio,
        capacidad: capacidadEspacio,
        elemento: elementosEspacio,
        edificioId: selectedEdificio
      });

      const response = await fetch("http://localhost:7000/espacio/crear", {
        method: "POST",
        headers: myHeaders,
        body: raw,
      });

      const data = await response.json();

      if (!response.ok) throw new Error("No se pudo crear el espacio");
      setNombreEspacio("");
      setTipoEspacio("");
      setCapacidadEspacio("");
      setElementosEspacio([]);
      setSelectedEdificio("")

      await getEspacio();
      await getEdificios();

      setAlertMessage("El espacio ha sido creado y agregado exitosamente");
      setShowAlert(true);

    } catch (error) {
      console.error(error);
      setAlertMessage("Hubo un error al crear el espacio");
      setShowAlert(true);
    }
  };

  
  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setShowConfirmDeleteModal(true);
  };

  const DeleteEspacio = async (_id) => {
    try {
      const response = await fetch(`http://localhost:7000/espacio/${_id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("No se pudo eliminar el espacio");

      await getEspacio();
      await getEdificios();

      setAlertMessage("El espacio ha sido eliminado exitosamente");
      setShowAlert(true);

    } catch (error) {
      console.error(error);
      setAlertMessage("Hubo un error al eliminar el espacio");
      setShowAlert(true);
    } finally {
      setShowConfirmDeleteModal(false);
    }
  };

  const updateEspacio = async () => {
    try {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const raw = JSON.stringify({
        nombre: updateNombreEspacio,
        tipo: updateTipoEspacio,
        capacidad: updateCapacidadEspacio,
        elemento: updateElementosEspacio,
        edificioId: updateSelectedEdificio
      });

      const response = await fetch(`http://localhost:7000/espacio/${updateId}`, {
        method: "PUT",
        headers: myHeaders,
        body: raw,
      });

      if (!response.ok) throw new Error("No se pudo actualizar el espacio");

      setShowUpdateModal(false);

      await getEspacio();
      await getEdificios();

      setAlertMessage("Los cambios se han guardado correctamente");
      setShowAlert(true);

    } catch (error) {
      console.error(error);
      setAlertMessage("Hubo un error al guardar los cambios");
      setShowAlert(true);
    }
  };

  const handleUpdateSubmit = async () => {
    const newErrores = {};

    if (!updateNombreEspacio) {
      newErrores.updateNombreEspacio = "El nombre es obligatorio";
    }

    if (!updateTipoEspacio) {
      newErrores.updateTipoEspacio = "El tipo es obligatorio";
    }

    if (!updateCapacidadEspacio) {
      newErrores.updateCapacidadEspacio = "La capacidad es obligatoria";
    }

    if (!updateElementosEspacio || updateElementosEspacio.length === 0) {
      newErrores.updateElementosEspacio = "Debe seleccionar al menos un elemento";
    }

    setErrores(newErrores);

    if (Object.keys(newErrores).length === 0) {
      try {
        await updateEspacio();
        setShowUpdateModal(false);
      } catch (error) {
        console.error("Error al actualizar el espacio:", error);
        alert("Hubo un error al actualizar el espacio");
      }
    }
  };

  const handleShowUpdateModal = async (espacio) => {
                           setUpdateId(espacio._id);
                    setUpdateNombreEspacio(espacio.nombre);
                    setUpdateTipoEspacio(espacio.tipo);
                    setUpdateCapacidadEspacio(espacio.capacidad);
                     setUpdateSelectedEdificio("");
                    let elementosIds;
                    if (Array.isArray(espacio.elemento)) {
                        // Si es un array de objetos
                        if (typeof espacio.elemento[0] === 'object' && espacio.elemento[0] !== null) {
                          elementosIds = espacio.elemento.map(el => el._id); // Extraer IDs
                        } else {
                            // Si es un array de IDs
                            elementosIds = espacio.elemento;
                        }
                    } else {
                        // Si no es un array, pero existe
                        elementosIds = espacio.elemento ? [espacio.elemento] : [];
                    }
                
                    setUpdateElementosEspacio(elementosIds.length > 0 ? elementosIds : []); // Asegurarse de que no sea undefined
                    //cosnulta a la base de datos
                    try{
                      const response = await fetch(`http://localhost:7000/edificio/espacioDelEdificio/${espacio._id}`);
      const edificio = await response.json();
      console.log("edificio:",edificio);
      if (edificio && edificio) {
          // Setear el plan de estudio actual si existe
          setUpdateSelectedEdificio(edificio._id);
      }
  } catch (error) {
      console.error("Error al obtener el plan de estudio:", error);
                    }

                    setShowUpdateModal(true);
  }

    

  useEffect(() => {
    getEspacio();
    getElementos();
    getEdificios();
  }, []);

  return (
    <>

      <div className="d-flex align-items-center justify-content-center my-4" >
        <img
            src={logo}
            alt="Logo"
            style={{ width: "70px", height: "70px", marginRight: "20px" }}
          />
          <h1 style={{ fontFamily: "Crimson Text, serif" }}>AulaSMART - Espacios</h1>
      </div>

      <div className="mb-3 text-center">
        <Form.Group controlId="selectEdificio">
          <Form.Control
            as="select"
            value={edificioFiltro}
            onChange={(e) => setEdificioFiltro(e.target.value)}
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

      <Row>
          <div className="d-flex justify-content-center">
            <Button style={{width: "600px",  marginTop: "10px", marginBottom: "10px", backgroundColor: 'rgb(114, 16, 16)', color: '#FFF', borderColor: '#FFF'}} onClick={() => setShowCreateForm(prevState => !prevState)}>
              {showCreateForm ? "Cancelar" : "Nuevo Espacio"}
            </Button>
          </div>
        {showCreateForm && (
          <Form>
            <Form.Group controlId="formBasicEdificio">
              <Form.Label>Edificio</Form.Label>
              <Form.Control
                as="select"
                value={selectedEdificio}
                onChange={(e) => setSelectedEdificio(e.target.value)}
              >
                <option value="">Seleccionar edificio</option>
                {allEdificios.map((edificio) => (
                  <option key={edificio._id} value={edificio._id}>
                    {edificio.nombre}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="formBasicNombreEspacio">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nombre"
                value={nombreEspacio}
                onChange={(e) => setNombreEspacio(e.target.value)}
                maxLength={50}
              />
            </Form.Group>
            <Form.Group controlId="formBasicTipoEspacio">
              <Form.Label>Tipo</Form.Label>
              <Form.Control
                type="text"
                placeholder="Tipo"
                value={tipoEspacio}
                onChange={(e) => setTipoEspacio(e.target.value)}
                maxLength={50}
              />
            </Form.Group>
            <Form.Group controlId="formBasicCapacidadEspacio">
              <Form.Label>Capacidad</Form.Label>
              <Form.Control
                type="text"
                placeholder="Capacidad"
                value={capacidadEspacio}
                onChange={(e) => setCapacidadEspacio(e.target.value)}
                maxLength={10}
              />
            </Form.Group>
            <Form.Group controlId="formBasicElementos">
              <Form.Label>Elementos</Form.Label>
              <Form.Control
                as="select"
                multiple
                value={elementosEspacio}
                onChange={(e) => setElementosEspacio(Array.from(e.target.selectedOptions, option => option.value))}
              >
                {allElementos.map((elemento) => (
                  <option key={elemento._id} value={elemento._id}>
                    {elemento.nombre}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <div style={{display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'}} >
            <Button
              style={{margin: "28px", backgroundColor: 'rgb(114, 16, 16)', color: '#FFF', borderColor: '#FFF'}}
              onClick={CrearEspacio}
              disabled={
                !nombreEspacio ||
                !tipoEspacio ||
                !capacidadEspacio ||
                elementosEspacio.length === 0 ||
                !selectedEdificio
              }
            >
              Crear Espacio
            </Button>
            </div>
            
          </Form>
        )}
      </Row>

      <AlertCreado showAlert={showAlert} message={alertMessage} onClose={() => setShowAlert(false)} />

      <ModalConfirmacion
        show={showConfirmDeleteModal}
        handleClose={() => setShowConfirmDeleteModal(false)}
        handleConfirm={() => DeleteEspacio(deleteId)}              
      />

      <Table striped bordered hover style={{marginBottom: "150px"}}>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Tipo</th>
            <th>Capacidad</th>
            <th>Elementos</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {espaciosFiltrados.map((espacio) => (
            <tr key={espacio._id}>
              <td>{espacio.nombre}</td>
              <td>{espacio.tipo}</td>
              <td>{espacio.capacidad}</td>
              <td>
                  {espacio.elemento && espacio.elemento.length > 0 ? (
                    espacio.elemento
                      .map((elemento) => {
                        // Si 'elemento' ya es un objeto completo con el nombre, lo usamos directamente
                        if (elemento.nombre) {
                          return elemento.nombre;
                        } 
                        // Si 'elemento' es solo un ID, buscamos el nombre en 'allElementos'
                        const elementoEncontrado = allElementos.find((el) => el._id === elemento);
                        return elementoEncontrado ? elementoEncontrado.nombre : "Elemento no encontrado";
                      })
                      .join(", ") // Unimos los nombres con una coma
                  ) : (
                    "No hay elementos disponibles"
                  )}
              </td>
              <td>
                <Button
                  style={{ backgroundColor: 'rgb(114, 16, 16)', color: '#FFF', borderColor: '#FFF' }}
                  onClick={() => handleShowUpdateModal(espacio)}   
                  
                >
                  Modificar
                </Button>{" "}
                <Button style={{ backgroundColor: 'rgb(114, 16, 16)', color: '#FFF', borderColor: '#FFF' }} onClick={() => handleDeleteClick(espacio._id)}>
                  Eliminar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal para modificar */}
      <Modal show={showUpdateModal} onHide={() => setShowUpdateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Modificar Espacio</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Form.Group controlId="formUpdateEdificio">
              <Form.Label>Edificio</Form.Label>
              <Form.Control
                as="select"
                value={updateSelectedEdificio}
                onChange={(e) => setUpdateSelectedEdificio(e.target.value)}
              >
                <option value="">Seleccionar edificio</option>
                {allEdificios.map((edificio) => (
                  <option key={edificio._id} value={edificio._id}>
                    {edificio.nombre}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          <Form.Group controlId="formUpdateNombreEspacio">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="text"
              placeholder="Nombre"
              value={updateNombreEspacio}
              onChange={(e) => setUpdateNombreEspacio(e.target.value)}
              maxLength={50}
              isInvalid={Errores.updateNombreEspacio}
            />
            <Form.Control.Feedback type="invalid">
              {Errores.updateNombreEspacio}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="formUpdateTipoEspacio">
            <Form.Label>Tipo</Form.Label>
            <Form.Control
              type="text"
              placeholder="Tipo"
              value={updateTipoEspacio}
              onChange={(e) => setUpdateTipoEspacio(e.target.value)}
              maxLength={50}
              isInvalid={Errores.updateTipoEspacio}
            />
            <Form.Control.Feedback type="invalid">
              {Errores.updateTipoEspacio}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="formUpdateCapacidadEspacio">
            <Form.Label>Capacidad</Form.Label>
            <Form.Control
              type="text"
              placeholder="Capacidad"
              value={updateCapacidadEspacio}
              onChange={(e) => setUpdateCapacidadEspacio(e.target.value)}
              maxLength={10}
              isInvalid={Errores.updateCapacidadEspacio}
            />
            <Form.Control.Feedback type="invalid">
              {Errores.updateCapacidadEspacio}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="formUpdateElementosEspacio">
            <Form.Label>Elementos</Form.Label>
            <Form.Control
              as="select"
              multiple
              value={updateElementosEspacio}
              onChange={(e) => setUpdateElementosEspacio(Array.from(e.target.selectedOptions, option => option.value))}
              isInvalid={Errores.updateElementosEspacio}
            >
              {allElementos.map((elemento) => (
                <option key={elemento._id} value={elemento._id}>
                  {elemento.nombre}
                </option>
              ))}
            </Form.Control>
            <Form.Control.Feedback type="invalid">
              {Errores.updateElementosEspacio}
            </Form.Control.Feedback>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowUpdateModal(false)}>
            Cancelar
          </Button>
          <Button style={{ backgroundColor: 'rgb(114, 16, 16)', color: '#FFF', borderColor: '#FFF' }} onClick={handleUpdateSubmit}>
            Guardar Cambios
          </Button>
        </Modal.Footer>
      </Modal>
      <AlertCreado showAlert={showAlert} message={alertMessage} onClose={() => setShowAlert(false)} />
    </>
  );
}

export default CrudEspacio;

