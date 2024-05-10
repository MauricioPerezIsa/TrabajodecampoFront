import React from "react";
import { useEffect, useState } from "react";
import { Container, Table, Button, Form, Row } from "react-bootstrap";

function CrudMaterias() {
    const [allPersonal, setAllPersonal] = useState([]);
  const [allMaterias, setAllMaterias] = useState([]);
  const [NombreMateria, setNombreMateria] = useState("");
  const [CargaHoraria, setCargaHoraria] = useState("");
  const [anioMateria, setAnioMateria] = useState("");
  const [semestreMateria, setSemestreMateria] = useState("");
  const [profesoresSeleccionados, setProfesoresSeleccionados] = useState([]);

  const [showCreateForm, setShowCreateForm] = useState(false);

  const [Errores, setErrores] = useState({});
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

  const createMateria = async()=>{
    const myHeaders = new Headers();
    try{
myHeaders.append("Content-Type", "application/json");

const raw = JSON.stringify({
  nombre: NombreMateria,
  anio:anioMateria,
  semestre: semestreMateria,
  horaDictado:CargaHoraria,
  profesor: profesoresSeleccionados,

});

const requestOptions = {
  method: "POST",
  headers: myHeaders,
  body: raw,
  redirect: "follow"
};

 const response =await fetch("http://localhost:7000/materia/crear", requestOptions)
  if(!response.ok) throw new Error("No se pudo crear la materia")
  setNombreMateria("");
setAnioMateria("")
setSemestreMateria("")
setCargaHoraria("")
setProfesoresSeleccionados([])
getMaterias()
  } catch(error){
    console.error(error)

  }}

  const handleSubmit = async () => {
    const newErrores = []
    if (!NombreMateria) {
        newErrores.NombreMateria = 'El nombre es obligatorio'
    } else if (NombrePersonal.length < 3) {
        newErrores.NombreMateria = "El nombre debe contener al menos 3 caracteres"

    }
    if (!anioMateria) {
        newErrores.anioMateria = "El año es Obligatorio"
    } else if (anioMateria.length !== 2) {
        newErrores.anioMateria = "El año debe contener un carater"
    }
    if (!CargaHoraria) {
        newErrores.CargaHoraria = "obligatorio"
    } else if (CargaHoraria.length > 1) {
        newErrores.CargaHoraria = "debe ser mayor a 1"
    }
    if(!semestreMateria){
        newErrores.semestreMateria ='El semestre es obligatorio'
    }else if(semestreMateria.length>20){
        newErrores.semestreMateria="El semestre es muy largo"
    }
    if(!profesoresSeleccionados){
        newErrores.profesoresSeleccionados="Este campo es obligatorio"
    }
    setErrores(newErrores)

    if (Object.keys(newErrores).length === 0) {

        await createMateria()
        setShowCreateForm(false)
    }
}
useEffect(()=>{getMaterias(),getPersonal()},[])

  return (
    <><Row>
    <Button onClick={() => setShowCreateForm(prevState => !prevState)}>
        {showCreateForm ? "Cancelar" : "Nueva Materia"}
    </Button>
    {showCreateForm && (
        <Form>
            <Form.Group controlId="formBasicNameMateria">
                <Form.Label>Nombre</Form.Label>
                <Form.Control type="text" placeholder="Nombre" value={NombreMateria} onChange={(e) => setNombreMateria(e.target.value)} maxLength={25} />
            </Form.Group>
            <Form.Group controlId="formBasicAnioMateria">
                <Form.Label>Año</Form.Label>
                <Form.Control type="number" placeholder="Año" value={anioMateria} onChange={(e) => setAnioMateria(e.target.value)} min={1} max={5} />
            </Form.Group>
            <Form.Group controlId="formBasicSemestreMateria">
                <Form.Label>Semestre</Form.Label>
                <Form.Control type="text" placeholder="Semestre" value={semestreMateria} onChange={(e) => setSemestreMateria(e.target.value)} maxLength={20} />
            </Form.Group>
            <Form.Group controlId="formBasicCargaHoraria">
                <Form.Label>Carga Horaria</Form.Label>
                <Form.Control type="number" placeholder="Carga Horaria" value={CargaHoraria} onChange={(e) => setCargaHoraria(e.target.value)} min={1} max={16} />
            </Form.Group>
            <Form.Group controlId="formBasicProfesores">
                <Form.Label>Profesor</Form.Label>
                <Form.Control as="select" value={profesoresSeleccionados} onChange={(e) => setProfesoresSeleccionados(e.target.value)}>
        <option value="">Seleccione un profesor</option>
        {allPersonal.map((profesor) => (
            <option key={profesor._id} value={profesor._id}>{profesor.nombre} {profesor.apellido}</option>
        ))}
    </Form.Control>
            </Form.Group>
            <Button onClick={createMateria} disabled={!NombreMateria || !anioMateria || !semestreMateria || !CargaHoraria || !profesoresSeleccionados.length}>Crear Materia</Button>
        </Form>
    )}
</Row>




    <Table striped bordered hover>
    <thead>
      <tr>
        <th>Nombre</th>
        <th>Año</th>
        <th>Semestre</th>
        <th>Modulos Semanales </th>
        <th>Profesor</th>
      </tr>
    </thead>
    <tbody>
      {allMaterias.map((materiass) => (
        <tr key={materiass._id}>
          <td>{materiass.nombre}</td>
          <td>{materiass.anio}</td>
          <td>{materiass.semestre}</td>
          <td>{materiass.horaDictado}</td>
          <td>
          {materiass.profesor.map((profesor) => (
            <div key={profesor._id}>{profesor.nombre} {profesor.apellido}</div>
          ))}
        </td>         
        </tr>
      ))}
    </tbody>
  </Table>
    </>
  );
}

export default CrudMaterias;
