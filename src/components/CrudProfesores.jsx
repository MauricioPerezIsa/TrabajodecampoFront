import React from "react";
import { useEffect, useState } from "react";
import { Container, Table,Button, Form, Row } from "react-bootstrap";

function CrudProfesores() {
  const [allPersonal, setAllPersonal] = useState([]);
  const [NombrePersonal, setNombrePersonal] = useState("");
  const [ApellidoPersonal, setApellidoPersonal] = useState("");
  const [DNIPersonal, setDNIPersonal] = useState("");

  const [showCreateForm, setShowCreateForm] = useState(false)
  



  const [Errores, setErrores] = useState({})

  const getPersonal = async () => {
    try {
      const response = await fetch("http://localhost:7000/profesor/");
      if (!response.ok) {
        throw new Error("No se pudieron obtener los empleados");
      }
      const result = await response.json();
      console.log(result); // Verificar los datos recibidos en la consola
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
      if (!response.ok) throw new Error("no se pudo crear el Profesor");
      setNombrePersonal("");
      setApellidoPersonal("");
      setDNIPersonal("");
      setShowCreateForm(false)
      getPersonal()
    } catch (error){
        console.error(error)
    }
  };
  const handleSubmit = async () => {
    const newErrores = []
    if (!NombrePersonal) {
        newErrores.NombrePersonal = 'El nombre es obligatorio'
    } else if (NombrePersonal.length < 3) {
        newErrores.NombrePersonal = "El nombre debe contener al menos 3 caracteres"

    }
    if (!ApellidoPersonal) {
        newErrores.ApellidoPersonal = "El apellido es obligatorio"
    } else if (ApellidoPersonal.length < 2) {
        newErrores.ApellidoPersonal = "El apellido debe contener al menos 2 caracteres"
    }
    if (!DNIPersonal) {
        newErrores.DNIPersonal = "El Dni es obligatorio"
    } else if (DNIPersonal.length < 7) {
        newErrores.DNIPersonal = "El dni debe contener al menos 7 caracteres"

    }
    setErrores(newErrores)

    if (Object.keys(newErrores).length === 0) {

        await CreatePersonal()
        setShowCreateForm(false)
    }
}

  useEffect(() => {
    getPersonal();
  }, []);
  return (
    <><Container>
        <Row>
    <Button onClick={() => setShowCreateForm(prevState => !prevState)}>
        {showCreateForm ? "Cancelar" : "Nuevo Estudiante"}
    </Button>
    {showCreateForm && (
        <Form>
            <Form.Group controlId="formBasicNameAlum">
                <Form.Label>Nombre</Form.Label>
                <Form.Control type="text" placeholder="Nombre" value={NombrePersonal} onChange={(e) => setNombrePersonal(e.target.value)} maxLength={25} />
            </Form.Group>
            <Form.Group controlId="formBasicLasNameAlum">
                <Form.Label>Apellido</Form.Label>
                <Form.Control type="text" placeholder="Apellido" value={ApellidoPersonal} onChange={(e) => setApellidoPersonal(e.target.value)} maxLength={25} />
            </Form.Group>
            <Form.Group controlId="formBasicDniAlum">
                <Form.Label>N° DNI</Form.Label>
                <Form.Control type="text" placeholder="N° DNI" value={DNIPersonal} onChange={(e) => setDNIPersonal(e.target.value)} maxLength={8} minLength={7} />
            </Form.Group>
            <Button onClick={handleSubmit} disabled={!NombrePersonal || !ApellidoPersonal || !DNIPersonal}>Cargar Personal</Button>
        </Form>
    )}
</Row>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>DNI</th>
          </tr>
        </thead>
        <tbody>
          {allPersonal.map((profesor) => (
            <tr key={profesor._id}>
              <td>{profesor.nombre}</td>
              <td>{profesor.apellido}</td>
              <td>{profesor.dni}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>

    </>
  );
}

export default CrudProfesores;
