import React from "react";
import { useEffect, useState } from "react";
import { Table, Button, Modal, Dropdown,Row,Form } from "react-bootstrap";

function CrudPlanDeEstudio() {
  const [allPlanes, setAllPlanes] = useState([]);
  const [allMaterias, setAllMaterias] = useState([]);
  const [nombrePlan, setNombrePlan] = useState("");
  const [descripcionPlan, setDescipcionPlan] = useState("");
  const [materiasSeleccionadas, setMateriasSeleccionadas] = useState([]);

  const [showCreateForm, setShowCreateForm] = useState(false);
 
  const getplanes = async () => {
    const requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    const response = await fetch(
      "http://localhost:7000/planDeEstudio/",
      requestOptions
    );
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
      const response = await fetch(
        "http://localhost:7000/planDeEstudio/crear",
        requestOptions
      );
      if (!response.ok) throw new Error("No se pudo crear el plan");
      setNombrePlan("")
      setDescipcionPlan("");
      setMateriasSeleccionadas([]);
      getplanes();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getplanes(),
    getMaterias();
  }, []);

  return (
    <><Row>
    <Button onClick={() => setShowCreateForm(prevState => !prevState)}>
      {showCreateForm ? "Cancelar" : "Nuevo Plan de Estudio"}
    </Button>
    {showCreateForm && (
      <Form>
        <Form.Group controlId="formBasicNombrePlan">
          <Form.Label>Nombre</Form.Label>
          <Form.Control type="text" placeholder="Nombre" value={nombrePlan} onChange={(e) => setNombrePlan(e.target.value)} maxLength={25} />
        </Form.Group>
        <Form.Group controlId="formBasicDescripcionPlan">
          <Form.Label>Descripción</Form.Label>
          <Form.Control type="text" placeholder="Descripción" value={descripcionPlan} onChange={(e) => setDescipcionPlan(e.target.value)} maxLength={50} />
        </Form.Group>
        <Form.Group controlId="formBasicMaterias">
  <Form.Label>Materias</Form.Label>
  <div>
    {allMaterias.map((materia) => (
      <Form.Check
        key={materia._id}
        type="checkbox"
        id={`checkbox-${materia._id}`}
        label={`${materia.nombre} - Año: ${materia.anio}`}
        checked={materiasSeleccionadas.includes(materia._id)}
        onChange={(e) => {
          const materiaId = materia._id;
          if (materiasSeleccionadas.includes(materiaId)) {
            setMateriasSeleccionadas(materiasSeleccionadas.filter(id => id !== materiaId));
          } else {
            setMateriasSeleccionadas([...materiasSeleccionadas, materiaId]);
          }
        }}
      />
    ))}
  </div>
</Form.Group>
        <Button onClick={CrearPlanDeEstudio} disabled={!nombrePlan || !descripcionPlan || materiasSeleccionadas.length === 0}>Crear Plan de Estudio</Button>
      </Form>
    )}
  </Row>
    
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Materias</th>
          </tr>
        </thead>
        <tbody>
          {allPlanes.map((planesdeestudio) => (
            <tr key={planesdeestudio._id}>
              <td>{planesdeestudio.nombre}</td>
              <td>{planesdeestudio.descripcion}</td>
              <td>
                <ul>
                  {planesdeestudio.materia.map((materia) => (
                    <li key={materia._id}>
                      {materia.nombre}, Año: {materia.anio}
                    </li>
                  ))}
                </ul>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
}

export default CrudPlanDeEstudio;
