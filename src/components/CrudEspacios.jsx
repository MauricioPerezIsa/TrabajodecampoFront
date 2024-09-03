import React from "react";
import { useEffect, useState } from "react";
import { Table, Button, Modal, Dropdown, Row, Form } from "react-bootstrap";

function CrudEspacio() {
  const [allEspacio, setAllEspacio] = useState([]);
  const [allElementos, setAllElementos] = useState([]);
  const [nombreEspacio, setNombreEspacio] = useState("");
  const [tipoEspacio, setTipoEspacio] = useState("");
  const [capacidadEspacio, setCapacidadEspacio] = useState("");
  const [elementosEspacio, setElementosEspacio] = useState([]);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  const [updateId, setUpdateId] = useState("");
  const [updateNombreEspacio, setUpdateNombreEspacio] = useState("");
  const [updateTipoEspacio, setUpdateTipoEspacio] = useState("");
  const [updateCapacidadEspacio, setUpdateCapacidadEspacio] = useState("");
  const [updateElementosEspacio, setUpdateElementosEspacio] = useState([]);

  const [Errores, setErrores] = useState({});

  const getEspacio = async () => {
    const requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    const response = await fetch("http://localhost:7000/espacio/", requestOptions);
    const result = await response.json();

    if (Array.isArray(result)) {
      setAllEspacio(result);
    } else {
      console.error("La respuesta no es un array:", result);
      setAllEspacio([]); // O establece un valor por defecto
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
      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };
      const response = await fetch(
        "http://localhost:7000/espacio/crear",
        requestOptions
      );

      if (!response.ok) throw new Error("No se pudo crear el espacio");
      setNombreEspacio("");
      setTipoEspacio("");
      setCapacidadEspacio("");
      setElementosEspacio([]);
      getEspacio();
    } catch (error) {
      console.error(error);
    }
  };

  const DeleteEspacio = async (_id) => {
    try {
      let myHeaders = new Headers();
      let requestOptions = {
        method: "DELETE",
        headers: myHeaders,
        redirect: "follow",
      };

      const response = await fetch(
        "http://localhost:7000/espacio/" + _id,
        requestOptions
      );
      if (!response.ok) throw new Error("No se pudo eliminar el espacio");

      getEspacio();
    } catch (error) {
      console.error(error);
      alert("Hubo un error al eliminar el espacio");
    }
  };

  const updateEspacio = async () => {
    try {
      let myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      let raw = JSON.stringify({
        nombre: updateNombreEspacio,
        tipo: updateTipoEspacio,
        capacidad: updateCapacidadEspacio,
        elemento: updateElementosEspacio,
      });

      let requestOptions = {
        method: "PUT",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };

      const response = await fetch(
        "http://localhost:7000/espacio/" + updateId,
        requestOptions
      );

      if (!response.ok) throw new Error("No se pudo actualizar el espacio");

      setShowUpdateModal(false);
      getEspacio();
    } catch (error) {
      console.error(error);
      alert("Hubo un error al actualizar el espacio");
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
              <div>
                {allElementos.map((elemento) => (
                  <Form.Check
                    key={elemento._id}
                    type="checkbox"
                    id={`checkbox-${elemento._id}`}
                    label={`${elemento.nombre}`}
                    checked={elementosEspacio.includes(elemento._id)}
                    onChange={(e) => {
                      const elementoId = elemento._id;
                      if (elementosEspacio.includes(elementoId)) {
                        setElementosEspacio(
                          elementosEspacio.filter((id) => id !== elementoId)
                        );
                      } else {
                        setElementosEspacio([...elementosEspacio, elementoId]);
                      }
                    }}
                  />
                ))}
              </div>
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
          {allEspacio.map((espacios) => (
            <tr key={espacios._id}>
              <td>{espacios.nombre}</td>
              <td>{espacios.tipo}</td>
              <td>{espacios.capacidad}</td>
              <td>
                <ul>
                  {espacios.elemento.map((elemento) => (
                    <li key={elemento._id}>{elemento.nombre}</li>
                  ))}
                </ul>
              </td>
              <td>
                <Button
                  variant="warning"
                  onClick={() => {
                    setUpdateId(espacios._id);
                    setUpdateNombreEspacio(espacios.nombre);
                    setUpdateTipoEspacio(espacios.tipo);
                    setUpdateCapacidadEspacio(espacios.capacidad);
                    setUpdateElementosEspacio(
                      espacios.elemento.map((el) => el._id)
                    );
                    setShowUpdateModal(true);
                  }}
                >
                  Modificar
                </Button>{" "}
                <Button variant="danger" onClick={() => DeleteEspacio(espacios._id)}>
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
            <div>
              {allElementos.map((elemento) => (
                <Form.Check
                  key={elemento._id}
                  type="checkbox"
                  id={`update-checkbox-${elemento._id}`}
                  label={`${elemento.nombre}`}
                  checked={updateElementosEspacio.includes(elemento._id)}
                  onChange={(e) => {
                    const elementoId = elemento._id;
                    if (updateElementosEspacio.includes(elementoId)) {
                      setUpdateElementosEspacio(
                        updateElementosEspacio.filter((id) => id !== elementoId)
                      );
                    } else {
                      setUpdateElementosEspacio([
                        ...updateElementosEspacio,
                        elementoId,
                      ]);
                    }
                  }}
                  isInvalid={Errores.updateElementosEspacio}
                />
              ))}
            </div>
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
    </>
  );
}

export default CrudEspacio;
