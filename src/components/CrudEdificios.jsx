import React from "react";
import { useEffect, useState } from "react";
import { Table, Button, Modal, Row, Form } from "react-bootstrap";
import AlertCreado from "./AlertCreado";
import ModalConfirmacion from "./ModalConfirmacion";
import logo from "../assets/ISO_UNSTA.png";

function CrudEdificio() {
  const [allEdificios, setAllEdificios] = useState([]);
  const [allEspacios, setAllEspacios] = useState([]);
  const [nombreEdificio, setNombreEdificio] = useState("");
  const [espaciosEdificio, setEspaciosEdificio] = useState([]);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  const [showEspaciosModal, setShowEspaciosModal] = useState(false);
  const [espaciosDelEdificio, setEspaciosDelEdificio] = useState([]);

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const [updateId, setUpdateId] = useState("");
  const [updateNombreEdificio, setUpdateNombreEdificio] = useState("");
  const [updateEspaciosEdificio, setUpdateEspaciosEdificio] = useState([]);

  const getEdificios = async () => {
    const requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    const response = await fetch("http://localhost:7000/edificio/buscar", requestOptions);
    const result = await response.json();
    setAllEdificios(result);
  };

  const getEspacios = async () => {
    try {
      const response = await fetch("http://localhost:7000/espacio/");
      if (!response.ok) {
        throw new Error("Error al obtener los espacios");
      }
      const result = await response.json();
      setAllEspacios(result);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const CrearEdificio = async () => {
    try {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const raw = JSON.stringify({
        nombre: nombreEdificio,
        espacio: espaciosEdificio,
      });

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };

      const response = await fetch("http://localhost:7000/edificio/crear", requestOptions);
      if (!response.ok) throw new Error("No se pudo crear el edificio");

      setNombreEdificio("");
      setEspaciosEdificio([]);

      getEdificios();

      setAlertMessage("El edificio fue creado y agregado exitosamente");
      setShowAlert(true);


    } catch (error) {
      console.error(error);
      setAlertMessage("Hubo un error al crear el edificio");
      setShowAlert(true);
    }
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setShowConfirmDeleteModal(true);
  };

  const DeleteEdificio = async (_id) => {
    try {
      let myHeaders = new Headers();
      let requestOptions = {
        method: "DELETE",
        headers: myHeaders,
        redirect: "follow",
      };

      const response = await fetch("http://localhost:7000/edificio/" + _id, requestOptions);
      if (!response.ok) throw new Error("No se pudo eliminar el edificio");

      getEdificios();

      setAlertMessage("El edificio ha sido eliminado exitosamente");
      setShowAlert(true);

    } catch (error) {
      console.error(error);
      setAlertMessage("Hubo un error al eliminar el edificio");
      setShowAlert(true);
    } finally {
      setShowConfirmDeleteModal(false);
    }
  };

  const updateEdificio = async () => {
    try {
      let myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      let raw = JSON.stringify({
        nombre: updateNombreEdificio,
        espacio: updateEspaciosEdificio,
      });

      let requestOptions = {
        method: "PUT",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };

      const response = await fetch("http://localhost:7000/edificio/" + updateId, requestOptions);
      if (!response.ok) throw new Error("No se pudo actualizar el edificio");

      setShowUpdateModal(false);

      getEdificios();

      setAlertMessage("Los cambios se han guardado correctamente");
      setShowAlert(true);

    } catch (error) {
      console.error(error);
      setAlertMessage("Hubo un error al guardar los cambios");
      setShowAlert(true);
    }
  };

  const handleUpdateSubmit = async () => {
    try {
      await updateEdificio();
    } catch (error) {
      console.error("Error al actualizar el edificio:", error);
      alert("Hubo un error al actualizar el edificio");
    }
  };

  const handleMostrarEspacios = (espacios) => {
    setEspaciosDelEdificio(espacios);
    setShowEspaciosModal(true);
  };

  useEffect(() => {
    getEdificios();
    getEspacios();
  }, []);

  return (
    <>

      <div className="d-flex align-items-center justify-content-center my-4" >
        <img
            src={logo}
            alt="Logo"
            style={{ width: "70px", height: "70px", marginRight: "20px" }}
          />
          <h1 style={{ fontFamily: "Crimson Text, serif" }}>AulaSMART - Edificios</h1>
      </div>

      <Row>
          <div className="d-flex justify-content-center">
            <Button style={{width: "600px",  marginTop: "10px", marginBottom: "10px", backgroundColor: 'rgb(114, 16, 16)', color: '#FFF', borderColor: '#FFF'}} onClick={() => setShowCreateForm(prevState => !prevState)}>
              {showCreateForm ? "Cancelar" : "Nuevo Edificio"}
            </Button>
          </div>
        {showCreateForm && (
          <Form>
            <Form.Group controlId="formBasicNombreEdificio">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nombre"
                value={nombreEdificio}
                onChange={(e) => setNombreEdificio(e.target.value)}
                maxLength={50}
              />
            </Form.Group>
            <div style={{display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'}} >
            <Button style={{margin: "28px", backgroundColor: 'rgb(114, 16, 16)', color: '#FFF', borderColor: '#FFF'}} onClick={CrearEdificio} disabled={!nombreEdificio}>
              Crear Edificio
            </Button>
            </div>
            
          </Form>
        )}
      </Row>

      <AlertCreado showAlert={showAlert} message={alertMessage} onClose={() => setShowAlert(false)} />

      <ModalConfirmacion
        show={showConfirmDeleteModal}
        handleClose={() => setShowConfirmDeleteModal(false)}
        handleConfirm={() => DeleteEdificio(deleteId)}              
      />
      
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Espacios</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {allEdificios.map((edificio) => (
            <tr key={edificio._id}>
              <td>{edificio.nombre}</td>
              <td>
                  <Button 
                    style={{ backgroundColor: 'rgb(114, 16, 16)', color: '#FFF', borderColor: '#FFF' }}
                    onClick={() => handleMostrarEspacios(edificio.espacio)}>
                    Mostrar Espacios
                  </Button>
                </td>
              <td>
                <Button
                  style={{ backgroundColor: 'rgb(114, 16, 16)', color: '#FFF', borderColor: '#FFF' }}
                  onClick={() => {
                    setUpdateId(edificio._id);
                    setUpdateNombreEdificio(edificio.nombre);
                    setUpdateEspaciosEdificio(edificio.espacio.map(e => e._id));
                    setShowUpdateModal(true);
                  }}
                >
                  Modificar
                </Button>
                <Button
                  style={{ marginLeft: '10px', backgroundColor: 'rgb(114, 16, 16)', color: '#FFF', borderColor: '#FFF' }}
                  variant="danger"
                  onClick={() => handleDeleteClick(edificio._id)}
                >
                  Eliminar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showEspaciosModal} onHide={() => setShowEspaciosModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Espacios del Edificio</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ul>
            {espaciosDelEdificio.map((espacio) => (
              <li key={espacio._id}>
                {espacio.nombre}
              </li>
            ))}
          </ul>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEspaciosModal(false)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showUpdateModal} onHide={() => setShowUpdateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Modificar Edificio</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formUpdateNombreEdificio">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nombre"
                value={updateNombreEdificio}
                onChange={(e) => setUpdateNombreEdificio(e.target.value)}
                maxLength={50}
              />
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

export default CrudEdificio;

