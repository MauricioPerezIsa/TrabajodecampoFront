import React from "react";
import { useEffect, useState } from "react";
import { Table, Button, Modal, Row, Form } from "react-bootstrap";
import AlertCreado from "./AlertCreado";

function CrudPlanDeEstudio() {
  const [allPlanes, setAllPlanes] = useState([]);
  const [allMaterias, setAllMaterias] = useState([]);
  const [nombrePlan, setNombrePlan] = useState("");
  const [descripcionPlan, setDescipcionPlan] = useState("");
  const [materiasSeleccionadas, setMateriasSeleccionadas] = useState([]);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

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

  const DeletePlanDeEstudio = async (id) => {
    try {
      const response = await fetch(`http://localhost:7000/planDeEstudio/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("No se pudo eliminar el plan");
      getplanes();
    } catch (error) {
      console.error(error);
      alert("Hubo un error al eliminar el plan");
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

  useEffect(() => {
    getplanes();
    getMaterias();
  }, []);

  return (
    <>
      <Row>
        <Button onClick={() => setShowCreateForm(prevState => !prevState)}>
          {showCreateForm ? "Cancelar" : "Nuevo Plan de Estudio"}
        </Button>
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
            <Form.Group controlId="formBasicMaterias">
              <Form.Label>Materias</Form.Label>
              <Form.Control
                as="select"
                multiple
                value={materiasSeleccionadas}
                onChange={(e) => setMateriasSeleccionadas(Array.from(e.target.selectedOptions, option => option.value))}
              >
                {allMaterias.map((materia) => (
                  <option key={materia._id} value={materia._id}>
                    {materia.nombre} - Año: {materia.anio}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Button onClick={CrearPlanDeEstudio} disabled={!nombrePlan || !descripcionPlan || materiasSeleccionadas.length === 0}>Crear Plan de Estudio</Button>
          </Form>
        )}
      </Row>

      <AlertCreado showAlert={showAlert} message={alertMessage} onClose={() => setShowAlert(false)} />
      
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
                <ul>
                  {plan.materia.map((materia) => (
                    <li key={materia._id}>
                      {materia.nombre}, Año: {materia.anio}
                    </li>
                  ))}
                </ul>
              </td>
              <td>
                <Button variant="warning" onClick={() => {
                  setUpdateId(plan._id);
                  setUpdateNombrePlan(plan.nombre);
                  setUpdateDescripcionPlan(plan.descripcion);
                  setUpdateMateriasSeleccionadas(plan.materia.map(m => m._id));
                  setShowUpdateModal(true);
                }}>Modificar</Button>
                <Button style={{ margin: '10px' }} variant="danger" onClick={() => DeletePlanDeEstudio(plan._id)}>Eliminar</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

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
            <Form.Group controlId="formUpdateMaterias">
              <Form.Label>Materias</Form.Label>
              <Form.Control
                as="select"
                multiple
                value={updateMateriasSeleccionadas}
                onChange={(e) => setUpdateMateriasSeleccionadas(Array.from(e.target.selectedOptions, option => option.value))}
              >
                {allMaterias.map((materia) => (
                  <option key={materia._id} value={materia._id}>
                    {materia.nombre} - Año: {materia.anio}
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

export default CrudPlanDeEstudio;

