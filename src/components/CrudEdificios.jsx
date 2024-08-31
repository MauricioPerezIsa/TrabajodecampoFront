import React from "react";
import { useEffect, useState } from "react";
import { Table, Button, Modal, Dropdown,Row,Form } from "react-bootstrap";

function CrudEdificio() {
  const [allEdificios, setAllEdificios] = useState([]);
  const [allEspacios, setAllEspacios] = useState([]);
  const [nombreEdificio, setNombreEdificio] = useState("");
  const [espaciosEdificio, setEspaciosEdificio] = useState([]);

  const [showCreateForm, setShowCreateForm] = useState(false);
 
  const getEdificios = async () => {
    const requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    const response = await fetch(
      "http://localhost:7000/edificio/",
      requestOptions
    );
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
      const response = await fetch(
        "http://localhost:7000/edificio/crear",
        requestOptions
      );
      if (!response.ok) throw new Error("No se pudo crear el edificio");
      setNombreEdificio("")
      setEspaciosEdificio([]);
      getEdificios();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getEdificios(),
    getEspacios();
  }, []);

  return (
    <><Row>
    <Button onClick={() => setShowCreateForm(prevState => !prevState)}>
      {showCreateForm ? "Cancelar" : "Nuevo Edificio"}
    </Button>
    {showCreateForm && (
      <Form>
        <Form.Group controlId="formBasicNombreEdificio">
          <Form.Label>Nombre</Form.Label>
          <Form.Control type="text" placeholder="Nombre" value={nombreEdificio} onChange={(e) => setNombreEdificio(e.target.value)} maxLength={50} />
        </Form.Group>
        <Form.Group controlId="formBasicEspacios">
  <Form.Label>Espacios</Form.Label>
  <div>
    {allEspacios.map((espacio) => (
      <Form.Check
        key={espacio._id}
        type="checkbox"
        id={`checkbox-${espacio._id}`}
        label={`${espacio.nombre}`}
        checked={espaciosEdificio.includes(espacio._id)}
        onChange={(e) => {
          const espacioId = espacio._id;
          if (espaciosEdificio.includes(espacioId)) {
            setEspaciosEdificio(espaciosEdificio.filter(id => id !== espacioId));
          } else {
            setEspaciosEdificio([...espaciosEdificio, espacioId]);
          }
        }}
      />
    ))}
  </div>
</Form.Group>
        <Button onClick={CrearEdificio} disabled={!nombreEdificio || espaciosEdificio.length === 0}>Crear Edificio</Button>
      </Form>
    )}
  </Row>
    
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Espacios</th>
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
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
}

export default CrudEdificio;