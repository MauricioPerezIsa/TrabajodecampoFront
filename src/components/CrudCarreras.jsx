import React from "react";
import { useEffect, useState } from "react";
import { Table, Button, Modal, Dropdown,Row,Form } from "react-bootstrap";

function CrudCarreras() {
  const [allCarreras, setAllCarreras] = useState([]);
  const [allPlanes, setAllPlanes] = useState([]);
  const [nombreCarrera, setNombreCarrera] = useState("");
  const [aniosCarrera, setAniosCarrera] = useState("");
  const [planesCarrera, setPlanesCarrera] = useState([]);

  const [showCreateForm, setShowCreateForm] = useState(false);
 
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
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getCarreras(),
    getPlanes();
  }, []);

  return (
    <><Row>
    <Button onClick={() => setShowCreateForm(prevState => !prevState)}>
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
  <div>
    {allPlanes.map((plan) => (
      <Form.Check
        key={plan._id}
        type="checkbox"
        id={`checkbox-${plan._id}`}
        label={`${plan.nombre}`}
        checked={planesCarrera.includes(plan._id)}
        onChange={(e) => {
          const planId = plan._id;
          if (planesCarrera.includes(planId)) {
            setPlanesCarrera(planesCarrera.filter(id => id !== planId));
          } else {
            setPlanesCarrera([...planesCarrera, planId]);
          }
        }}
      />
    ))}
  </div>
</Form.Group>
        <Button onClick={CrearCarrera} disabled={!nombreCarrera || !aniosCarrera || planesCarrera.length === 0}>Crear Carrera</Button>
      </Form>
    )}
  </Row>
    <div className="d-flex mb-5">
    <Table striped bordered hover>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Años</th>
            <th>Planes</th>
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
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
      
    </>
  );
}

export default CrudCarreras;