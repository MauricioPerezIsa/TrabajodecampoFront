import React from "react";
import { useEffect, useState } from "react";
import { Table, Button, Modal, Row, Form } from "react-bootstrap";
import AlertCreado from "./AlertCreado";
import ModalConfirmacion from "./ModalConfirmacion";
import logo from "../assets/ISO_UNSTA.png";

function CrudPlanDeEstudio() {
  const [allPlanes, setAllPlanes] = useState([]);
  const [allMaterias, setAllMaterias] = useState([]);
  const [nombrePlan, setNombrePlan] = useState("");
  const [descripcionPlan, setDescipcionPlan] = useState("");
  const [materiasSeleccionadas, setMateriasSeleccionadas] = useState([]);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  const [showMateriasModal, setShowMateriasModal] = useState(false);
  const [materiasDelPlan, setMateriasDelPlan] = useState([]); // Para almacenar las materias seleccionadas de un plan

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const [updateId, setUpdateId] = useState("");
  const [updateNombrePlan, setUpdateNombrePlan] = useState("");
  const [updateDescripcionPlan, setUpdateDescripcionPlan] = useState("");
  const [updateMateriasSeleccionadas, setUpdateMateriasSeleccionadas] = useState([]);

  const getplanes = async () => {
    const requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    const response = await fetch("http://localhost:7000/planDeEstudio/", requestOptions);
    const result = await response.json();
    setAllPlanes(result);
  };

  const getMaterias = async () => {
    try {
      const response = await fetch("http://localhost:7000/materia/");
      if (!response.ok) {
        throw new Error("Error al obtener las materias");
      }
      const result = await response.json();
      setAllMaterias(result);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const CrearPlanDeEstudio = async () => {
    try {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const raw = JSON.stringify({
        nombre: nombrePlan,
        descripcion: descripcionPlan,
        materia: materiasSeleccionadas,
      });
      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };
      const response = await fetch("http://localhost:7000/planDeEstudio/crear", requestOptions);
      if (!response.ok) throw new Error("No se pudo crear el plan");
      setNombrePlan("");
      setDescipcionPlan("");
      setMateriasSeleccionadas([]);

      getplanes();

      setAlertMessage("El plan de estudio ha sido creado y agregado exitosamente");
      setShowAlert(true);


    } catch (error) {
      console.error(error);
      setAlertMessage("Hubo un error al crear el plan");
      setShowAlert(true);
    }
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setShowConfirmDeleteModal(true);
  };

  const DeletePlanDeEstudio = async (id) => {
    try {
      const response = await fetch(`http://localhost:7000/planDeEstudio/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("No se pudo eliminar el plan");

      getplanes();

      setAlertMessage("El plan ha sido eliminado exitosamente");
      setShowAlert(true);

    } catch (error) {
      console.error(error);
      setAlertMessage("Hubo un error al eliminar el plan");
      setShowAlert(true);
    } finally {
          setShowConfirmDeleteModal(false);
        }
  };

  const updatePlanDeEstudio = async () => {
    try {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const raw = JSON.stringify({
        nombre: updateNombrePlan,
        descripcion: updateDescripcionPlan,
        materia: updateMateriasSeleccionadas,
      });

      const response = await fetch(`http://localhost:7000/planDeEstudio/${updateId}`, {
        method: "PUT",
        headers: myHeaders,
        body: raw,
      });

      if (!response.ok) throw new Error("No se pudo actualizar el plan");
      setShowUpdateModal(false);

      getplanes();

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
      await updatePlanDeEstudio();
    } catch (error) {
      console.error("Error al actualizar el plan:", error);
      alert("Hubo un error al actualizar el plan");
    }
  };

  const handleMostrarMaterias = (materias) => {
    setMateriasDelPlan(materias); // Establecemos las materias del plan seleccionado
    setShowMateriasModal(true); // Mostramos el modal
  };
  

  useEffect(() => {
    getplanes();
    getMaterias();
  }, []);

  return (
    <>

      <div className="d-flex align-items-center justify-content-center my-4" >
        <img
            src={logo}
            alt="Logo"
            style={{ width: "70px", height: "70px", marginRight: "20px" }}
          />
          <h1 style={{ fontFamily: "Crimson Text, serif" }}>AulaSMART - Plan de Estudio</h1>
      </div>

      <Row>
          <div className="d-flex justify-content-center">
            <Button style={{width: "600px",  marginTop: "10px", marginBottom: "10px", backgroundColor: 'rgb(114, 16, 16)', color: '#FFF', borderColor: '#FFF'}} onClick={() => setShowCreateForm(prevState => !prevState)}>
              {showCreateForm ? "Cancelar" : "Nuevo Plan de Estudio"}
            </Button>
          </div>
        {showCreateForm && (
          <Form>
            <Form.Group controlId="formBasicNombrePlan">
              <Form.Label>Nombre</Form.Label>
              <Form.Control type="text" placeholder="Nombre" value={nombrePlan} onChange={(e) => setNombrePlan(e.target.value)} maxLength={50} />
            </Form.Group>
            <Form.Group controlId="formBasicDescripcionPlan">
              <Form.Label>Descripción</Form.Label>
              <Form.Control type="text" placeholder="Descripción" value={descripcionPlan} onChange={(e) => setDescipcionPlan(e.target.value)} maxLength={500} />
            </Form.Group>
            <div style={{display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'}} >
            <Button style={{margin: "28px", backgroundColor: 'rgb(114, 16, 16)', color: '#FFF', borderColor: '#FFF'}} onClick={CrearPlanDeEstudio} disabled={!nombrePlan || !descripcionPlan}>Crear Plan de Estudio</Button>
            </div>
          </Form>
        )}
      </Row>

      <AlertCreado showAlert={showAlert} message={alertMessage} onClose={() => setShowAlert(false)} />

      <ModalConfirmacion
        show={showConfirmDeleteModal}
        handleClose={() => setShowConfirmDeleteModal(false)}
        handleConfirm={() => DeletePlanDeEstudio(deleteId)}              
      />
      
      <Table striped bordered hover>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Materias</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {allPlanes.map((plan) => (
              <tr key={plan._id}>
                <td>{plan.nombre}</td>
                <td>{plan.descripcion}</td>
                <td>
                  <Button 
                    style={{ marginTop: '10px', backgroundColor: 'rgb(114, 16, 16)', color: '#FFF', borderColor: '#FFF' }}
                    onClick={() => handleMostrarMaterias(plan.materia)}>
                    Mostrar Materias
                  </Button>
                </td>
                <td>
                  <Button 
                    style={{ backgroundColor: 'rgb(114, 16, 16)', color: '#FFF', borderColor: '#FFF' }}
                    onClick={() => {
                      setUpdateId(plan._id);
                      setUpdateNombrePlan(plan.nombre);
                      setUpdateDescripcionPlan(plan.descripcion);
                      setUpdateMateriasSeleccionadas(plan.materia.map(m => m._id));
                      setShowUpdateModal(true);
                    }}>
                    Modificar
                  </Button>
                  <Button 
                    style={{ margin: '10px', backgroundColor: 'rgb(114, 16, 16)', color: '#FFF', borderColor: '#FFF' }}
                    onClick={() => handleDeleteClick(plan._id)}>
                    Eliminar
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
      </Table>


      <Modal show={showMateriasModal} onHide={() => setShowMateriasModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Materias del Plan</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ul>
            {materiasDelPlan.map((materia) => (
              <li key={materia._id}>
                {materia.nombre}, Año: {materia.anio}
              </li>
            ))}
          </ul>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowMateriasModal(false)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>


      <Modal show={showUpdateModal} onHide={() => setShowUpdateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Modificar Plan de Estudio</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formUpdateNombrePlan">
              <Form.Label>Nombre</Form.Label>
              <Form.Control type="text" placeholder="Nombre" value={updateNombrePlan} onChange={(e) => setUpdateNombrePlan(e.target.value)} maxLength={50} />
            </Form.Group>
            <Form.Group controlId="formUpdateDescripcionPlan">
              <Form.Label>Descripción</Form.Label>
              <Form.Control type="text" placeholder="Descripción" value={updateDescripcionPlan} onChange={(e) => setUpdateDescripcionPlan(e.target.value)} maxLength={500} />
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

export default CrudPlanDeEstudio;

