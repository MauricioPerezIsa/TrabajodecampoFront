  import React from "react";
  import { useEffect, useState } from "react";
  import { Container, Table, Button, Form, Row, Modal } from "react-bootstrap";

  function CrudMaterias() {
    const [allPersonal, setAllPersonal] = useState([]);
    const [allMaterias, setAllMaterias] = useState([]);
    const [NombreMateria, setNombreMateria] = useState("");
    const [CargaHoraria, setCargaHoraria] = useState("");
    const [anioMateria, setAnioMateria] = useState("");
    const [semestreMateria, setSemestreMateria] = useState("");
    const [profesoresSeleccionados, setProfesoresSeleccionados] = useState([]);

    const [showCreateForm, setShowCreateForm] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);

    const [updateId, setUpdateId] = useState("");
    const [updateNombreMateria, setUpdateNombreMateria] = useState("");
    const [updateAnioMateria, setUpdateAnioMateria] = useState("");
    const [updateSemestreMateria, setUpdateSemestreMateria] = useState("");
    const [updateCargaHoraria, setUpdateCargaHoraria] = useState("");
    const [updateProfesoresSeleccionados, setUpdateProfesoresSeleccionados] = useState([]);

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

    const createMateria = async () => {
      const myHeaders = new Headers();
      try {
        myHeaders.append("Content-Type", "application/json");

        const raw = JSON.stringify({
          nombre: NombreMateria,
          anio: anioMateria,
          semestre: semestreMateria,
          horaDictado: CargaHoraria,
          profesor: profesoresSeleccionados,
        });

        console.log("Datos enviados para crear materia:", raw);

        const requestOptions = {
          method: "POST",
          headers: myHeaders,
          body: raw,
          redirect: "follow",
        };

        const response = await fetch("http://localhost:7000/materia/crear", requestOptions);
        console.log("Respuesta del servidor:", response);
        if (!response.ok) throw new Error("No se pudo crear la materia");
        setNombreMateria("");
        setAnioMateria("");
        setSemestreMateria("");
        setCargaHoraria("");
        setProfesoresSeleccionados([]);
        getMaterias();
      } catch (error) {
        console.error(error);
      }
    };

    const handleSubmit = async () => {
      const newErrores = [];
      if (!NombreMateria) {
        newErrores.NombreMateria = 'El nombre es obligatorio';
      } else if (NombreMateria.length < 3) {
        newErrores.NombreMateria = "El nombre debe contener al menos 3 caracteres";
      }
      if (!anioMateria) {
        newErrores.anioMateria = "El año es Obligatorio";
      } else if (anioMateria.length !== 2) {
        newErrores.anioMateria = "El año debe contener un carater";
      }
      if (!CargaHoraria) {
        newErrores.CargaHoraria = "obligatorio";
      } else if (CargaHoraria.length > 1) {
        newErrores.CargaHoraria = "debe ser mayor a 1";
      }
      if (!semestreMateria) {
        newErrores.semestreMateria = 'El semestre es obligatorio';
      } else if (semestreMateria.length > 20) {
        newErrores.semestreMateria = "El semestre es muy largo";
      }
      if (!profesoresSeleccionados) {
        newErrores.profesoresSeleccionados = "Este campo es obligatorio";
      }
      setErrores(newErrores);

      if (Object.keys(newErrores).length === 0) {
        await createMateria();
        setShowCreateForm(false);
      }
    };

    const deleteMateria = async (id) => {
      try {
        const response = await fetch(`http://localhost:7000/materia/${id}`, {
          method: "DELETE",
        });
        if (!response.ok) throw new Error("No se pudo eliminar la materia");
        getMaterias();
      } catch (error) {
        console.error(error);
        alert("Hubo un error al eliminar la materia");
      }
    };

    const updateMateria = async () => {
      const myHeaders = new Headers();
      try {
        myHeaders.append("Content-Type", "application/json");

        const raw = JSON.stringify({
          nombre: updateNombreMateria,
          anio: updateAnioMateria,
          semestre: updateSemestreMateria,
          horaDictado: updateCargaHoraria,
          profesor: updateProfesoresSeleccionados,
        });

        const requestOptions = {
          method: "PUT",
          headers: myHeaders,
          body: raw,
          redirect: "follow",
        };

        const response = await fetch(`http://localhost:7000/materia/`+updateId, requestOptions);
        if (!response.ok) throw new Error("No se pudo actualizar la materia");
        setShowUpdateModal(false);
        getMaterias();
      } catch (error) {
        console.error(error);
        alert("Hubo un error al actualizar la materia");
      }
    };
    const handleUpdateSubmit = async () => {
      const newErrores = {};
    
      if (!updateNombreMateria) {
        newErrores.updateNombreMateria = 'El nombre es obligatorio';
      } else if (updateNombreMateria.length < 3) {
        newErrores.updateNombreMateria = "El nombre debe contener al menos 3 caracteres";
      }
    
      if (!updateAnioMateria) {
        newErrores.updateAnioMateria = "El año es Obligatorio";
      }
    
      if (!updateCargaHoraria) {
        newErrores.updateCargaHoraria = "La carga horaria es obligatoria";
      } else if (updateCargaHoraria < 1) {
        newErrores.updateCargaHoraria = "La carga horaria debe ser mayor a 0";
      }
    
      if (!updateSemestreMateria) {
        newErrores.updateSemestreMateria = 'El semestre es obligatorio';
      } else if (updateSemestreMateria.length > 20) {
        newErrores.updateSemestreMateria = "El semestre es muy largo";
      }
    
      if (!updateProfesoresSeleccionados || updateProfesoresSeleccionados.length === 0) {
        newErrores.updateProfesoresSeleccionados = "Debe seleccionar al menos un profesor";
      }
    
      setErrores(newErrores);
    
      if (Object.keys(newErrores).length === 0) {
        try {
          await updateMateria();
          setShowUpdateModal(false);
        } catch (error) {
          console.error("Error al actualizar la materia:", error);
          alert("Hubo un error al actualizar la materia");
        }
      }
    };
    

    useEffect(() => {
      getMaterias();
      getPersonal();
    }, []);

    return (
      <>
        <Row>
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
          <Form.Label>Profesores</Form.Label>
          <Form.Control as="select" multiple value={profesoresSeleccionados} onChange={(e) => setProfesoresSeleccionados(Array.from(e.target.selectedOptions, option => option.value))}>
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
              <th>Modulos Semanales</th>
              <th>Profesor</th>
              <th>Acciones</th>
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
                <td>
                  <Button variant="warning" onClick={() => {
                    setUpdateId(materiass._id);
                    setUpdateNombreMateria(materiass.nombre);
                    setUpdateAnioMateria(materiass.anio);
                    setUpdateSemestreMateria(materiass.semestre);
                    setUpdateCargaHoraria(materiass.horaDictado);
                    setUpdateProfesoresSeleccionados(materiass.profesor.map(p => p._id));
                    setShowUpdateModal(true);
                  }}>Modificar</Button>
                  <Button style={{ marginLeft: '10px' }} variant="danger" onClick={() => deleteMateria(materiass._id)}>Eliminar</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        <Modal show={showUpdateModal} onHide={() => setShowUpdateModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Modificar Materia</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="formUpdateNameMateria">
                <Form.Label>Nombre</Form.Label>
                <Form.Control type="text" placeholder="Nombre" value={updateNombreMateria} onChange={(e) => setUpdateNombreMateria(e.target.value)} maxLength={25} />
              </Form.Group>
              <Form.Group controlId="formUpdateAnioMateria">
                <Form.Label>Año</Form.Label>
                <Form.Control type="number" placeholder="Año" value={updateAnioMateria} onChange={(e) => setUpdateAnioMateria(e.target.value)} min={1} max={5} />
              </Form.Group>
              <Form.Group controlId="formUpdateSemestreMateria">
                <Form.Label>Semestre</Form.Label>
                <Form.Control type="text" placeholder="Semestre" value={updateSemestreMateria} onChange={(e) => setUpdateSemestreMateria(e.target.value)} maxLength={20} />
              </Form.Group>
              <Form.Group controlId="formUpdateCargaHoraria">
                <Form.Label>Carga Horaria</Form.Label>
                <Form.Control type="number" placeholder="Carga Horaria" value={updateCargaHoraria} onChange={(e) => setUpdateCargaHoraria(e.target.value)} min={1} max={16} />
              </Form.Group>
              <Form.Group controlId="formUpdateProfesores">
          <Form.Label>Profesores</Form.Label>
          <Form.Control as="select" multiple value={updateProfesoresSeleccionados} onChange={(e) => setUpdateProfesoresSeleccionados(Array.from(e.target.selectedOptions, option => option.value))}>
            {allPersonal.map((profesor) => (
              <option key={profesor._id} value={profesor._id}>{profesor.nombre} {profesor.apellido}</option>
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
      </>
    );
  }

  export default CrudMaterias;
