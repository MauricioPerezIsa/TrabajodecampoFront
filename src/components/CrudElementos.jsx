import React, { useEffect, useState } from "react";
import { Container, Table, Button, Form, Row, Modal, Col } from "react-bootstrap";

function CrudElemento() {
  const [allElemento, setAllElemento] = useState([]);
  const [NombreElemento, setNombreElemento] = useState("");
  const [updateId, setUpdateId] = useState("");
  const [updateNombreElemento, setUpdateNombreElemento] = useState("");
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [Errores, setErrores] = useState({});

  const getElemento = async () => {
    try {
      const response = await fetch("http://localhost:7000/elemento/");
      if (!response.ok) {
        throw new Error("No se pudieron obtener los empleados");
      }
      const result = await response.json();
      setAllElemento(result);
    } catch (error) {
      console.error(error);
      alert("Hubo un error al obtener los empleados");
    }
  };

  const CreateElemento = async () => {
    try {
      let myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      let raw = JSON.stringify({
        nombre: NombreElemento,
      });

      let requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };

      const response = await fetch(
        "http://localhost:7000/elemento/crear",
        requestOptions
      );
      if (!response.ok) throw new Error("No se pudo crear el Profesor");

      setNombreElemento("");
      setShowCreateForm(false);
      getElemento();
    } catch (error) {
      console.error(error);
      alert("Hubo un error al crear el Profesor");
    }
  };

  const DeleteElemento = async (_id) => {
    try {
      let myHeaders = new Headers();
      let requestOptions = {
        method: "DELETE",
        headers: myHeaders,
        redirect: "follow",
      };

      const response = await fetch(
        "http://localhost:7000/elemento/" + _id,
        requestOptions
      );
      if (!response.ok) throw new Error("No se pudo eliminar el elemento");

      getElemento();
    } catch (error) {
      console.error(error);
      alert("Hubo un error al eliminar el elemento");
    }
  };

  const updateElemento = async () => {
    try {
      let myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      let raw = JSON.stringify({
        nombre: updateNombreElemento,
      });

      let requestOptions = {
        method: "PUT",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };

      const response = await fetch(
        "http://localhost:7000/elemento/" + updateId,
        requestOptions
      );
      if (!response.ok) throw new Error("No se pudo actualizar el elemento");

      setShowUpdateModal(false);
      getElemento();
    } catch (error) {
      console.error(error);
      alert("Hubo un error al actualizar el Elemento");
    }
  };

  const handleUpdateElemento = async () => {
    const newErrores = {};

    if (!updateNombreElemento) {
      newErrores.updateNombreElemento = "El nombre es obligatorio";
    } else if (updateNombreElemento.length < 3) {
      newErrores.updateNombreElemento = "El nombre debe contener al menos 3 caracteres";
    }


    setErrores(newErrores);

    if (Object.keys(newErrores).length === 0) {
      await updateElemento();
    }
  };

  const handleSubmit = async () => {
    const newErrores = {};

    if (!NombreElemento) {
      newErrores.NombreElemento = "El nombre es obligatorio";
    } else if (NombreElemento.length < 3) {
      newErrores.NombreElemento = "El nombre debe contener al menos 3 caracteres";
    }


    setErrores(newErrores);

    if (Object.keys(newErrores).length === 0) {
      await CreateElemento();
    }
  };

  useEffect(() => {
    getElemento();
  }, []);

  return (
    <Container>
      <Row>
        <Button onClick={() => setShowCreateForm((prevState) => !prevState)}>
          {showCreateForm ? "Cancelar" : "Nuevo Elemento"}
        </Button>
        {showCreateForm && (
          <Form>
            <Form.Group controlId="formBasicNameAlum">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nombre"
                value={NombreElemento}
                onChange={(e) => setNombreElemento(e.target.value)}
                maxLength={25}
                style={{
                  borderColor: Errores.NombreElemento ? "red" : "",
                }}
              />
              {Errores.NombreElemento && (
                <span className="text-danger">{Errores.NombreElemento}</span>
              )}
            </Form.Group>
            
            <Button
              onClick={handleSubmit}
              disabled={!NombreElemento}
            >
              Cargar Elemento
            </Button>
          </Form>
        )}
      </Row>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {allElemento.map((Elemento) => (
            <tr key={Elemento._id}>
              <td>{Elemento.nombre}</td>
              <td>
                <Button
                  
                  variant="warning"
                  onClick={() => {
                    setShowUpdateModal(true);
                    setUpdateNombreElemento(Elemento.nombre);
                    setUpdateId(Elemento._id);
                  }}
                >
                  Modificar
                </Button>
                <Button style={{ marginLeft: '10px' }} variant="danger" onClick={() => DeleteElemento(Elemento._id)}>
                  Eliminar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showUpdateModal} onHide={() => setShowUpdateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Modificar Elemento</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formBasicNameAlum">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nombre"
                value={updateNombreElemento}
                onChange={(e) => setUpdateNombreElemento(e.target.value)}
                maxLength={25}
                style={{
                  borderColor: Errores.updateNombreElemento ? "red" : "",
                }}
              />
              {Errores.updateNombreElemento && (
                <span className="text-danger">{Errores.updateNombreElemento}</span>
              )}
            </Form.Group>
            <Button onClick={handleUpdateElemento}>Modificar</Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
}

export default CrudElemento;