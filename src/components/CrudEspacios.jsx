import React from "react";
import { useEffect, useState } from "react";
import { Table, Button, Modal, Dropdown,Row,Form } from "react-bootstrap";

function CrudEspacio() {
  const [allEspacio, setAllEspacio] = useState([]);
  const [allElementos, setAllElementos] = useState([]);
  const [nombreEspacio, setNombreEspacio] = useState("");
  const [tipoEspacio, setTipoEspacio] = useState("");
  const [capacidadEspacio, setCapacidadEspacio] = useState("");
  const [elementosEspacio, setElementosEspacio] = useState([]);

  const [showCreateForm, setShowCreateForm] = useState(false);
 
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
      setNombreEspacio("")
      setTipoEspacio("");
      setCapacidadEspacio("");
      setElementosEspacio([]);
      getEspacio();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getEspacio(),
    getElementos();
  }, []);

  return (
    <><Row>
    <Button onClick={() => setShowCreateForm(prevState => !prevState)}>
      {showCreateForm ? "Cancelar" : "Nuevo Espacio"}
    </Button>
    {showCreateForm && (
      <Form>
        <Form.Group controlId="formBasicNombreEspacio">
          <Form.Label>Nombre</Form.Label>
          <Form.Control type="text" placeholder="Nombre" value={nombreEspacio} onChange={(e) => setNombreEspacio(e.target.value)} maxLength={50} />
        </Form.Group>
        <Form.Group controlId="formBasicTipoEspacio">
          <Form.Label>Tipo</Form.Label>
          <Form.Control type="text" placeholder="Tipo" value={tipoEspacio} onChange={(e) => setTipoEspacio(e.target.value)} maxLength={50} />
        </Form.Group>
        <Form.Group controlId="formBasicCapacidadEspacio">
          <Form.Label>Capacidad</Form.Label>
          <Form.Control type="text" placeholder="Capacidad" value={capacidadEspacio} onChange={(e) => setCapacidadEspacio(e.target.value)} maxLength={10} />
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
            setElementosEspacio(elementosEspacio.filter(id => id !== elementoId));
          } else {
            setElementosEspacio([...elementosEspacio, elementoId]);
          }
        }}
      />
    ))}
  </div>
</Form.Group>
        <Button onClick={CrearEspacio} disabled={!nombreEspacio || !tipoEspacio || !capacidadEspacio || elementosEspacio.length === 0}>Crear Espacio</Button>
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
                    <li key={elemento._id}>
                        {elemento.nombre}
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

export default CrudEspacio;