import React from "react";
import { useEffect, useState } from "react";
import { Table, Button, Modal, Row, Form } from "react-bootstrap";
import AlertCreado from "./AlertCreado";

function CrudEdificio() {
  const [allEdificios, setAllEdificios] = useState([]);
  const [allEspacios, setAllEspacios] = useState([]);
  const [nombreEdificio, setNombreEdificio] = useState("");
  const [espaciosEdificio, setEspaciosEdificio] = useState([]);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const [updateId, setUpdateId] = useState("");
  const [updateNombreEdificio, setUpdateNombreEdificio] = useState("");
  const [updateEspaciosEdificio, setUpdateEspaciosEdificio] = useState([]);

  const getEdificios = async () => {
    const requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    const response = await fetch("http://localhost:7000/edificio/", requestOptions);
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

  useEffect(() => {
    getEdificios();
    getEspacios();
  }, []);

  return (
    <>
      <Row>
        <Button onClick={() => setShowCreateForm(prevState => !prevState)}>
          {showCreateForm ? "Cancelar" : "Nuevo Edificio"}
        </Button>
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
            <Form.Group controlId="formBasicEspacios">
              <Form.Label>Espacios</Form.Label>
              <Form.Control
                as="select"
                multiple
                value={espaciosEdificio}
                onChange={(e) => setEspaciosEdificio(Array.from(e.target.selectedOptions, option => option.value))}
              >
                {allEspacios.map((espacio) => (
                  <option key={espacio._id} value={espacio._id}>
                    {espacio.nombre}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Button onClick={CrearEdificio} disabled={!nombreEdificio || espaciosEdificio.length === 0}>
              Crear Edificio
            </Button>
          </Form>
        )}
      </Row>

      <AlertCreado showAlert={showAlert} message={alertMessage} onClose={() => setShowAlert(false)} />
      
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
                <ul>
                  {edificio.espacio.map((espacio) => (
                    <li key={espacio._id}>
                      {espacio.nombre}
                    </li>
                  ))}
                </ul>
              </td>
              <td>
                <Button
                  variant="warning"
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
                  style={{ marginLeft: '10px' }}
                  variant="danger"
                  onClick={() => DeleteEdificio(edificio._id)}
                >
                  Eliminar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

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
            <Form.Group controlId="formUpdateEspacios">
              <Form.Label>Espacios</Form.Label>
              <Form.Control
                as="select"
                multiple
                value={updateEspaciosEdificio}
                onChange={(e) => setUpdateEspaciosEdificio(Array.from(e.target.selectedOptions, option => option.value))}
              >
                {allEspacios.map((espacio) => (
                  <option key={espacio._id} value={espacio._id}>
                    {espacio.nombre}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowUpdateModal(false)}>Cancelar</Button>
          <Button variant="primary" onClick={handleUpdateSubmit}>Guardar Cambios</Button>
        </Modal.Footer>
      </Modal>
      <AlertCreado showAlert={showAlert} message={alertMessage} onClose={() => setShowAlert(false)} />
    </>
  );
}

export default CrudEdificio;

