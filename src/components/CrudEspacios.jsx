import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Row, Form } from "react-bootstrap";
import AlertCreado from "./AlertCreado";

function CrudEspacio() {
  const [allEspacio, setAllEspacio] = useState([]);
  const [allElementos, setAllElementos] = useState([]);
  const [nombreEspacio, setNombreEspacio] = useState("");
  const [tipoEspacio, setTipoEspacio] = useState("");
  const [capacidadEspacio, setCapacidadEspacio] = useState("");
  const [elementosEspacio, setElementosEspacio] = useState([]);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const [updateId, setUpdateId] = useState("");
  const [updateNombreEspacio, setUpdateNombreEspacio] = useState("");
  const [updateTipoEspacio, setUpdateTipoEspacio] = useState("");
  const [updateCapacidadEspacio, setUpdateCapacidadEspacio] = useState("");
  const [updateElementosEspacio, setUpdateElementosEspacio] = useState([]);

  const [Errores, setErrores] = useState({});

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

  const CrearEspacio = async () => {
    try {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const raw = JSON.stringify({
        nombre: nombreEspacio,
        tipo: tipoEspacio,
        capacidad: capacidadEspacio,
        elemento: elementosEspacio,
      });

      const response = await fetch("http://localhost:7000/espacio/crear", {
        method: "POST",
        headers: myHeaders,
        body: raw,
      });

      if (!response.ok) throw new Error("No se pudo crear el espacio");
      setNombreEspacio("");
      setTipoEspacio("");
      setCapacidadEspacio("");
      setElementosEspacio([]);

      getEspacio();

      setAlertMessage("El espacio ha sido creado y agregado exitosamente");
      setShowAlert(true);

    } catch (error) {
      console.error(error);
      setAlertMessage("Hubo un error al crear el espacio");
      setShowAlert(true);
    }
  };

  const DeleteEspacio = async (_id) => {
    try {
      const response = await fetch(`http://localhost:7000/espacio/${_id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("No se pudo eliminar el espacio");

      getEspacio();
    } catch (error) {
      console.error(error);
      alert("Hubo un error al eliminar el espacio");
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
      });

      const response = await fetch(`http://localhost:7000/espacio/${updateId}`, {
        method: "PUT",
        headers: myHeaders,
        body: raw,
      });

      if (!response.ok) throw new Error("No se pudo actualizar el espacio");

      setShowUpdateModal(false);

      getEspacio();

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

  useEffect(() => {
    getEspacio();
    getElementos();
  }, []);

  return (
    <>
      <Row>
        <Button onClick={() => setShowCreateForm((prevState) => !prevState)}>
          {showCreateForm ? "Cancelar" : "Nuevo Espacio"}
        </Button>
        {showCreateForm && (
          <Form>
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
            <Button
              onClick={CrearEspacio}
              disabled={
                !nombreEspacio ||
                !tipoEspacio ||
                !capacidadEspacio ||
                elementosEspacio.length === 0
              }
            >
              Crear Espacio
            </Button>
          </Form>
        )}
      </Row>

      <AlertCreado showAlert={showAlert} message={alertMessage} onClose={() => setShowAlert(false)} />

      <Table striped bordered hover>
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
          {allEspacio.map((espacio) => (
            <tr key={espacio._id}>
              <td>{espacio.nombre}</td>
              <td>{espacio.tipo}</td>
              <td>{espacio.capacidad}</td>
              <td>
                <ul>
                  {espacio.elemento.map((elemento) => (
                    <li key={elemento._id}>{elemento.nombre}</li>
                  ))}
                </ul>
              </td>
              <td>
                <Button
                  variant="warning"
                  onClick={() => {
                    setUpdateId(espacio._id);
                    setUpdateNombreEspacio(espacio.nombre);
                    setUpdateTipoEspacio(espacio.tipo);
                    setUpdateCapacidadEspacio(espacio.capacidad);
                    setUpdateElementosEspacio(
                      espacio.elemento.map((el) => el._id)
                    );
                    setShowUpdateModal(true);
                  }}
                >
                  Modificar
                </Button>{" "}
                <Button variant="danger" onClick={() => DeleteEspacio(espacio._id)}>
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
          <Button variant="primary" onClick={handleUpdateSubmit}>
            Guardar Cambios
          </Button>
        </Modal.Footer>
      </Modal>
      <AlertCreado showAlert={showAlert} message={alertMessage} onClose={() => setShowAlert(false)} />
    </>
  );
}

export default CrudEspacio;

