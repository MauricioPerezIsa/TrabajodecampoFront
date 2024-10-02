import React, { useEffect, useState } from "react";
import { Container, Table, Button, Form, Row, Modal, Col, ModalFooter } from "react-bootstrap";
import AlertCreado from "./AlertCreado";
import ModalConfirmacion from "./ModalConfirmacion";
import logo from "../assets/ISO_UNSTA.png";

function CrudProfesores() {
  const [allPersonal, setAllPersonal] = useState([]);
  const [NombrePersonal, setNombrePersonal] = useState("");
  const [ApellidoPersonal, setApellidoPersonal] = useState("");
  const [DNIPersonal, setDNIPersonal] = useState("");
  const [updateId, setUpdateId] = useState("");
  const [updateNombrePersonal, setUpdateNombrePersonal] = useState("");
  const [updateApellido, setUpdateApellido] = useState("");
  const [updateDNIPersonal, setUpdateDNIPersonal] = useState("");
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [Errores, setErrores] = useState({});

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const getPersonal = async () => {
    try {
      const response = await fetch("http://localhost:7000/profesor/");
      if (!response.ok) {
        throw new Error("No se pudieron obtener los empleados");
      }
      const result = await response.json();
      setAllPersonal(result);
    } catch (error) {
      console.error(error);
      alert("Hubo un error al obtener los empleados");
    }
  };

  const CreatePersonal = async () => {
    try {
      let myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      let raw = JSON.stringify({
        nombre: NombrePersonal,
        apellido: ApellidoPersonal,
        dni: DNIPersonal,
      });

      let requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };

      const response = await fetch(
        "http://localhost:7000/profesor/crear",
        requestOptions
      );
      if (!response.ok) throw new Error("No se pudo crear el Profesor");

      setNombrePersonal("");
      setApellidoPersonal("");
      setDNIPersonal("");
      setShowCreateForm(false);

      getPersonal();

      setAlertMessage("El profesor ha sido creado y agregado exitosamente");
      setShowAlert(true);

    } catch (error) {
      console.error(error);
      setAlertMessage("Hubo un error al crear el profesor");
      setShowAlert(true);
    }
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setShowConfirmDeleteModal(true);
  };

  const DeletePersonal = async (_id) => {
    try {
      let myHeaders = new Headers();
      let requestOptions = {
        method: "DELETE",
        headers: myHeaders,
        redirect: "follow",
      };

      const response = await fetch(
        "http://localhost:7000/profesor/" + _id,
        requestOptions
      );
      if (!response.ok) throw new Error("No se pudo eliminar el personal");

      getPersonal();

      setAlertMessage("El profesor ha sido eliminado exitosamente");
      setShowAlert(true);

    } catch (error) {
      console.error(error);
      setAlertMessage("Hubo un error al eliminar el profesor");
      setShowAlert(true);
    } finally {
      setShowConfirmDeleteModal(false);
    }
  };

  const updatePersonal = async () => {
    try {
      let myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      let raw = JSON.stringify({
        nombre: updateNombrePersonal,
        apellido: updateApellido,
        dni: updateDNIPersonal,
      });

      let requestOptions = {
        method: "PUT",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };

      const response = await fetch(
        "http://localhost:7000/profesor/" + updateId,
        requestOptions
      );
      if (!response.ok) throw new Error("No se pudo actualizar el personal");

      setShowUpdateModal(false);

      getPersonal();

      setAlertMessage("Los cambios se han guardado correctamente");
      setShowAlert(true);

    } catch (error) {
      console.error(error);
      setAlertMessage("Hubo un error al guardar los cambios");
      setShowAlert(true);
    }
  };

  const handleUpdatePersonal = async () => {
    const newErrores = {};

    if (!updateNombrePersonal) {
      newErrores.updateNombrePersonal = "El nombre es obligatorio";
    } else if (updateNombrePersonal.length < 3) {
      newErrores.updateNombrePersonal = "El nombre debe contener al menos 3 caracteres";
    }

    if (!updateApellido) {
      newErrores.updateApellido = "El apellido es obligatorio";
    } else if (updateApellido.length < 2) {
      newErrores.updateApellido = "El apellido debe contener al menos 2 caracteres";
    }

    if (!updateDNIPersonal) {
      newErrores.updateDNIPersonal = "El DNI es obligatorio";
    } else if (updateDNIPersonal.length < 7) {
      newErrores.updateDNIPersonal = "El DNI debe contener al menos 7 caracteres";
    }

    setErrores(newErrores);

    if (Object.keys(newErrores).length === 0) {
      await updatePersonal();
    }
  };

  const handleSubmit = async () => {
    const newErrores = {};

    if (!NombrePersonal) {
      newErrores.NombrePersonal = "El nombre es obligatorio";
    } else if (NombrePersonal.length < 3) {
      newErrores.NombrePersonal = "El nombre debe contener al menos 3 caracteres";
    }

    if (!ApellidoPersonal) {
      newErrores.ApellidoPersonal = "El apellido es obligatorio";
    } else if (ApellidoPersonal.length < 2) {
      newErrores.ApellidoPersonal = "El apellido debe contener al menos 2 caracteres";
    }

    if (!DNIPersonal) {
      newErrores.DNIPersonal = "El DNI es obligatorio";
    } else if (DNIPersonal.length < 7) {
      newErrores.DNIPersonal = "El DNI debe contener al menos 7 caracteres";
    }

    setErrores(newErrores);

    if (Object.keys(newErrores).length === 0) {
      await CreatePersonal();
    }
  };

  useEffect(() => {
    getPersonal();
  }, []);

  return (
    <Container>

      <div className="d-flex align-items-center justify-content-center my-4" >
        <img
            src={logo}
            alt="Logo"
            style={{ width: "70px", height: "70px", marginRight: "20px" }}
          />
          <h1 style={{ fontFamily: "Crimson Text, serif" }}>AulaSMART - Profesores</h1>
      </div>

      <Row>
          <div className="d-flex justify-content-center">
            <Button style={{width: "600px",  marginTop: "10px", marginBottom: "10px", backgroundColor: 'rgb(114, 16, 16)', color: '#FFF', borderColor: '#FFF'}} onClick={() => setShowCreateForm(prevState => !prevState)}>
              {showCreateForm ? "Cancelar" : "Nuevo Profesor"}
            </Button>
          </div>
        {showCreateForm && (
          <Form>
            <Form.Group controlId="formBasicNameAlum">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nombre"
                value={NombrePersonal}
                onChange={(e) => setNombrePersonal(e.target.value)}
                maxLength={25}
                style={{
                  borderColor: Errores.NombrePersonal ? "red" : "",
                }}
              />
              {Errores.NombrePersonal && (
                <span className="text-danger">{Errores.NombrePersonal}</span>
              )}
            </Form.Group>
            <Form.Group controlId="formBasicLasNameAlum">
              <Form.Label>Apellido</Form.Label>
              <Form.Control
                type="text"
                placeholder="Apellido"
                value={ApellidoPersonal}
                onChange={(e) => setApellidoPersonal(e.target.value)}
                maxLength={25}
                style={{
                  borderColor: Errores.ApellidoPersonal ? "red" : "",
                }}
              />
              {Errores.ApellidoPersonal && (
                <span className="text-danger">{Errores.ApellidoPersonal}</span>
              )}
            </Form.Group>
            <Form.Group controlId="formBasicDniAlum">
              <Form.Label>N° DNI</Form.Label>
              <Form.Control
                type="text"
                placeholder="N° DNI"
                value={DNIPersonal}
                onChange={(e) => setDNIPersonal(e.target.value)}
                maxLength={8}
                minLength={7}
                style={{
                  borderColor: Errores.DNIPersonal ? "red" : "",
                }}
              />
              {Errores.DNIPersonal && (
                <span className="text-danger">{Errores.DNIPersonal}</span>
              )}
            </Form.Group>
            <div style={{display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'}} >
            <Button
              style={{margin: "28px", backgroundColor: 'rgb(114, 16, 16)', color: '#FFF', borderColor: '#FFF'}}
              onClick={handleSubmit}
              disabled={!NombrePersonal || !ApellidoPersonal || !DNIPersonal}
            >
              Crear Profesor
            </Button>
            </div>
          </Form>
        )}
      </Row>

      <AlertCreado showAlert={showAlert} message={alertMessage} onClose={() => setShowAlert(false)} />

      <ModalConfirmacion
        show={showConfirmDeleteModal}
        handleClose={() => setShowConfirmDeleteModal(false)}
        handleConfirm={() => DeletePersonal(deleteId)}              
      />

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>DNI</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {allPersonal.map((profesor) => (
            <tr key={profesor._id}>
              <td>{profesor.nombre}</td>
              <td>{profesor.apellido}</td>
              <td>{profesor.dni}</td>
              <td>
                <Button
                  style={{ marginLeft: '10px', backgroundColor: 'rgb(114, 16, 16)', color: '#FFF', borderColor: '#FFF' }}
                  onClick={() => {
                    setShowUpdateModal(true);
                    setUpdateNombrePersonal(profesor.nombre);
                    setUpdateApellido(profesor.apellido);
                    setUpdateDNIPersonal(profesor.dni);
                    setUpdateId(profesor._id);
                  }}
                >
                  Modificar
                </Button>
                <Button style={{ marginLeft: '10px', backgroundColor: 'rgb(114, 16, 16)', color: '#FFF', borderColor: '#FFF' }} onClick={() => handleDeleteClick(profesor._id)}>
                  Eliminar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showUpdateModal} onHide={() => setShowUpdateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Modificar Profesor</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formBasicNameAlum">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nombre"
                value={updateNombrePersonal}
                onChange={(e) => setUpdateNombrePersonal(e.target.value)}
                maxLength={25}
                style={{
                  borderColor: Errores.updateNombrePersonal ? "red" : "",
                }}
              />
              {Errores.updateNombrePersonal && (
                <span className="text-danger">{Errores.updateNombrePersonal}</span>
              )}
            </Form.Group>
            <Form.Group controlId="formBasicLasNameAlum">
              <Form.Label>Apellido</Form.Label>
              <Form.Control
                type="text"
                placeholder="Apellido"
                value={updateApellido}
                onChange={(e) => setUpdateApellido(e.target.value)}
                maxLength={25}
                style={{
                  borderColor: Errores.updateApellido ? "red" : "",
                }}
              />
              {Errores.updateApellido && (
                <span className="text-danger">{Errores.updateApellido}</span>
              )}
            </Form.Group>
            <Form.Group controlId="formBasicDniAlum">
              <Form.Label>N° DNI</Form.Label>
              <Form.Control
                type="text"
                placeholder="N° DNI"
                value={updateDNIPersonal}
                onChange={(e) => setUpdateDNIPersonal(e.target.value)}
                maxLength={8}
                minLength={7}
                style={{
                  borderColor: Errores.updateDNIPersonal ? "red" : "",
                }}
              />
              {Errores.updateDNIPersonal && (
                <span className="text-danger">{Errores.updateDNIPersonal}</span>
              )}
            </Form.Group>
            
          </Form>
        </Modal.Body>
        <ModalFooter>
        <Button variant="secondary" onClick={() => setShowUpdateModal(false)}>Cancelar</Button>
          <Button style={{ backgroundColor: 'rgb(114, 16, 16)', color: '#FFF', borderColor: '#FFF' }} onClick={handleUpdatePersonal}>Guardar Cambios</Button>
        </ModalFooter>
      </Modal>
      <AlertCreado showAlert={showAlert} message={alertMessage} onClose={() => setShowAlert(false)} />
    </Container>
  );
}

export default CrudProfesores;
