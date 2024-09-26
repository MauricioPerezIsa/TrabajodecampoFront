import React from "react";
import { useEffect, useState } from "react";
import { Table, Button, Modal, Dropdown,Row,Form } from "react-bootstrap";
import AlertCreado from "./AlertCreado";
import ModalConfirmacion from "./ModalConfirmacion";


function CrudCarreras() {
  const [allCarreras, setAllCarreras] = useState([]);
  const [allPlanes, setAllPlanes] = useState([]);
  const [nombreCarrera, setNombreCarrera] = useState("");
  const [aniosCarrera, setAniosCarrera] = useState("");
  const [planesCarrera, setPlanesCarrera] = useState([]);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const [updateId, setUpdateId] = useState("");
  const [updateNombreCarrera, setUpdateNombreCarrera] = useState("");
  const [updateAniosCarrera, setUpdateAniosCarrera] = useState("");
  const [updatePlanesCarrera, setUpdatePlanesCarrera] = useState([]);

  const [Errores, setErrores] = useState({});
 
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
  const getPlanes = async () => {
    try {
      const response = await fetch("http://localhost:7000/planDeEstudio/");
      if (!response.ok) {
        throw new Error("Error al obtener los planes de estudio");
      }
      const result = await response.json();
      setAllPlanes(result);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const CrearCarrera = async () => {
    try {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const raw = JSON.stringify({
        nombre: nombreCarrera,
        anioDictado: aniosCarrera,
        plan: planesCarrera,
      });
      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };
      const response = await fetch(
        "http://localhost:7000/carrera/crear",
        requestOptions
      );
      if (!response.ok) throw new Error("No se pudo crear la carrera");
      setNombreCarrera("")
      setAniosCarrera("");
      setPlanesCarrera([]);

      getCarreras();

      setAlertMessage("La carrera fue creada y agregada exitosamente");
      setShowAlert(true);

    } catch (error) {
      console.error(error);
      setAlertMessage("Hubo un error al crear la carrera");
      setShowAlert(true);
    }
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setShowConfirmDeleteModal(true);
  };

  const DeleteCarrera = async (_id) => {
    try {
      let myHeaders = new Headers();
      let requestOptions = {
        method: "DELETE",
        headers: myHeaders,
        redirect: "follow",
      };

      const response = await fetch(
        "http://localhost:7000/carrera/" + _id,
        requestOptions
      );
      if (!response.ok) throw new Error("No se pudo eliminar la carrera");

      getCarreras();

      setAlertMessage("La carrera fue eliminada exitosamente");
      setShowAlert(true);
    
    } catch (error) {
      console.error(error);
      setAlertMessage("Hubo un error al eliminar la carrera");
      setShowAlert(true);
    } finally {
      setShowConfirmDeleteModal(false);
    }
  };

  const updateCarrera = async () => {
    try {
      let myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      let raw = JSON.stringify({
        nombre: updateNombreCarrera,
        anioDictado: updateAniosCarrera,
        plan: updatePlanesCarrera,
      });

      let requestOptions = {
        method: "PUT",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };

      const response = await fetch(
        "http://localhost:7000/carrera/" + updateId,
        requestOptions
      );
      if (!response.ok) throw new Error("No se pudo actualizar la carrera");

      setShowUpdateModal(false);

      getCarreras();

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
  
    if (!updateNombreCarrera) {
      newErrores.updateNombreCarrera = 'El nombre es obligatorio';
    } else if (updateNombreCarrera.length < 3) {
      newErrores.updateNombreCarrera = "El nombre debe contener al menos 3 caracteres";
    }
  
    if (!updateAniosCarrera) {
      newErrores.updateAniosCarrera = "El año es Obligatorio";
    }
  
    if (!updatePlanesCarrera || updatePlanesCarrera.length === 0) {
      newErrores.updatePlanesCarrera = "Debe seleccionar al menos un plan";
    }
  
    setErrores(newErrores);
  
    if (Object.keys(newErrores).length === 0) {
      try {
        await updateCarrera();
        setShowUpdateModal(false);
      } catch (error) {
        console.error("Error al actualizar la carrera:", error);
        alert("Hubo un error al actualizar la carrera");
      }
    }
  };

  useEffect(() => {
    getCarreras(),
    getPlanes();
  }, []);

  return (
    <><Row>
    <Button style={{marginTop: "20px", marginBottom: "20px", backgroundColor: 'rgb(114, 16, 16)', color: '#FFF', borderColor: '#FFF' }} onClick={() => setShowCreateForm(prevState => !prevState)}>
      {showCreateForm ? "Cancelar" : "Nueva Carrera"}
    </Button>
    {showCreateForm && (
      <Form>
        <Form.Group controlId="formBasicNombreCarrera">
          <Form.Label>Nombre</Form.Label>
          <Form.Control type="text" placeholder="Nombre" value={nombreCarrera} onChange={(e) => setNombreCarrera(e.target.value)} maxLength={50} />
        </Form.Group>
        <Form.Group controlId="formBasicAniosCarrera">
          <Form.Label>Años</Form.Label>
          <Form.Control type="text" placeholder="Años" value={aniosCarrera} onChange={(e) => setAniosCarrera(e.target.value)} maxLength={2} />
        </Form.Group>
        <Form.Group controlId="formBasicPlanes">
  <Form.Label>Planes</Form.Label>
  <Form.Control
    as="select"
    multiple
    value={planesCarrera}
    onChange={(e) => {
      const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
      setPlanesCarrera(selectedOptions);
    }}
  >
    {allPlanes.map((plan) => (
      <option key={plan._id} value={plan._id}>
        {plan.nombre}
      </option>
    ))}
  </Form.Control>
</Form.Group>

        <div style={{display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'}} >
          <Button style={{margin: "28px", backgroundColor: 'rgb(114, 16, 16)', color: '#FFF', borderColor: '#FFF'}} onClick={CrearCarrera} disabled={!nombreCarrera || !aniosCarrera || planesCarrera.length === 0}>Crear Carrera</Button>
        </div>
        
      </Form>
    )}
  </Row>

  <AlertCreado showAlert={showAlert} message={alertMessage} onClose={() => setShowAlert(false)} />

  <ModalConfirmacion
        show={showConfirmDeleteModal}
        handleClose={() => setShowConfirmDeleteModal(false)}
        handleConfirm={() => DeleteCarrera(deleteId)}
      />

    <Table striped bordered hover>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Años</th>
            <th>Planes</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {allCarreras.map((carrera) => (
            <tr key={carrera._id}>
              <td>{carrera.nombre}</td>
              <td>{carrera.anioDictado}</td>
              <td>
                <ul>
                  {carrera.plan.map((plan) => (
                    <li key={plan._id}>
                      {plan.nombre}
                    </li>
                  ))}
                </ul>
              </td>
              <td>
              <Button style={{ backgroundColor: 'rgb(114, 16, 16)', color: '#FFF', borderColor: '#FFF' }} onClick={() => {
                    setUpdateId(carrera._id);
                    setUpdateNombreCarrera(carrera.nombre);
                    setUpdateAniosCarrera(carrera.anios);
                    setUpdatePlanesCarrera(carrera.plan.map(p => p._id));
                    setShowUpdateModal(true);
                  }}>Modificar</Button>
              <Button style={{ marginLeft: '10px' , backgroundColor: 'rgb(114, 16, 16)', color: '#FFF', borderColor: '#FFF' }} onClick={() => handleDeleteClick(carrera._id)}>
                  Eliminar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Modal show={showUpdateModal} onHide={() => setShowUpdateModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Modificar Carrera</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="formUpdateCarrera">
                <Form.Label>Nombre</Form.Label>
                <Form.Control type="text" placeholder="Nombre" value={updateNombreCarrera} onChange={(e) => setUpdateNombreCarrera(e.target.value)} maxLength={50} />
              </Form.Group>
              <Form.Group controlId="formUpdateAniosCarrera">
                <Form.Label>Año</Form.Label>
                <Form.Control 
  type="number" 
  placeholder="Año" 
  value={updateAniosCarrera || ""} // Asegura un valor inicial
  onChange={(e) => setUpdateAniosCarrera(e.target.value ? Number(e.target.value) : "")} // Convierte el valor a número o vacío
  min={1} max={5}
/>
              </Form.Group>
              <Form.Group controlId="formUpdatePlanes">
  <Form.Label>Planes</Form.Label>
  <Form.Control
    as="select"
    multiple
    value={updatePlanesCarrera}
    onChange={(e) => {
      const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
      setUpdatePlanesCarrera(selectedOptions);
    }}
  >
    {allPlanes.map((plan) => (
      <option key={plan._id} value={plan._id}>
        {plan.nombre}
      </option>
    ))}
  </Form.Control>
</Form.Group>

            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowUpdateModal(false)}>Cancelar</Button>
            <Button style={{ backgroundColor: 'rgb(114, 16, 16)', color: '#FFF', borderColor: '#FFF' }} onClick={handleUpdateSubmit}>Guardar Cambios</Button>
          </Modal.Footer>
        </Modal>
        <AlertCreado showAlert={showAlert} message={alertMessage} onClose={() => setShowAlert(false)} />
    </>
  );
}

export default CrudCarreras;