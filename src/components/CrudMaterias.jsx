import React, { useEffect, useState } from "react";
import { Container, Table, Button, Form, Row, Modal } from "react-bootstrap";
import AlertCreado from "./AlertCreado";
import ModalConfirmacion from "./ModalConfirmacion";

function CrudMaterias() {
  const [allPersonal, setAllPersonal] = useState([]);
  const [allMaterias, setAllMaterias] = useState([]);
  const [allElementos, setAllElementos] = useState([]);
  const [NombreMateria, setNombreMateria] = useState("");
  const [CodigoMateria, setCodigoMateria] = useState("");
  const [AnioMateria, setAnioMateria] = useState("");
  const [SemestreMateria, setSemestreMateria] = useState("");
  const [Elementos, setElementos] = useState([]);
  const [CantidadAlumnos, setCantidadAlumnos] = useState("");
  const [HorarioDia, setHorarioDia] = useState("");
  const [HorarioModuloInicio, setHorarioModuloInicio] = useState("");
  const [HorarioModuloFin, setHorarioModuloFin] = useState("");
  const [profesoresSeleccionados, setProfesoresSeleccionados] = useState([]);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const [updateId, setUpdateId] = useState("");
  const [updateNombreMateria, setUpdateNombreMateria] = useState("");
  const [updateCodigoMateria, setUpdateCodigoMateria] = useState("");
  const [updateAnioMateria, setUpdateAnioMateria] = useState("");
  const [updateSemestreMateria, setUpdateSemestreMateria] = useState("");
  const [updateElementos, setUpdateElementos] = useState([]);
  const [updateCantidadAlumnos, setUpdateCantidadAlumnos] = useState("");
  const [updateHorarioDia, setUpdateHorarioDia] = useState("");
  const [updateHorarioModuloInicio, setUpdateHorarioModuloInicio] = useState("");
  const [updateHorarioModuloFin, setUpdateHorarioModuloFin] = useState("");
  const [updateProfesoresSeleccionados, setUpdateProfesoresSeleccionados] = useState([]);

  const [Errores, setErrores] = useState({});

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
      alert("Hubo un error al obtener los elementos");
    }
  };

  

  const createMateria = async () => {
    const myHeaders = new Headers();
    try {
      myHeaders.append("Content-Type", "application/json");

      const raw = JSON.stringify({
        nombre: NombreMateria,
        codigo: CodigoMateria,
        anio: AnioMateria,
        semestre: SemestreMateria,
        elementos: Elementos,
        cantidadAlumnos: CantidadAlumnos,
        horarios: [
          { dia: HorarioDia, moduloInicio: HorarioModuloInicio, moduloFin: HorarioModuloFin }
        ],
        profesor: profesoresSeleccionados,
      });

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };

      const response = await fetch("http://localhost:7000/materia/crear", requestOptions);
      if (!response.ok) throw new Error("No se pudo crear la materia");

      setNombreMateria("");
      setCodigoMateria("");
      setAnioMateria("");
      setSemestreMateria("");
      setElementos([]);
      setCantidadAlumnos("");
      setHorarioDia("");
      setHorarioModuloInicio("");
      setHorarioModuloFin("");
      setProfesoresSeleccionados([]);

      getMaterias();

      setAlertMessage("La materia fue creada y agregada exitosamente");
      setShowAlert(true);

    } catch (error) {
      console.error(error);
      setAlertMessage("Hubo un error al crear la materia");
      setShowAlert(true);
    }
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setShowConfirmDeleteModal(true);
  };

  const DeleteMateria = async (_id) => {
    try {
      let myHeaders = new Headers();
      let requestOptions = {
        method: "DELETE",
        headers: myHeaders,
        redirect: "follow",
      };

      const response = await fetch(
        "http://localhost:7000/materia/" + _id,
        requestOptions
      );
      if (!response.ok) throw new Error("No se pudo eliminar la materia");

      getMaterias();

      setAlertMessage("La materia ha sido eliminada exitosamente");
      setShowAlert(true);

    } catch (error) {
      console.error(error);
      setAlertMessage("Hubo un error al eliminar la materia");
      setShowAlert(true);
    } finally {
      setShowConfirmDeleteModal(false);
    }
  };

  const handleSubmit = async () => {
    const newErrores = {};
    if (!NombreMateria) {
      newErrores.NombreMateria = 'El nombre es obligatorio';
    }
    if (!CodigoMateria) {
      newErrores.CodigoMateria = 'El código es obligatorio';
    }
    if (!AnioMateria) {
      newErrores.AnioMateria = "El año es obligatorio";
    }
    if (!HorarioDia || !HorarioModuloInicio || !HorarioModuloFin) {
      newErrores.Horario = "El horario es obligatorio";
    }
    if (Elementos.length === 0) {
      newErrores.Elementos = "Debe seleccionar al menos un elemento";
    }
    if (profesoresSeleccionados.length === 0) {
      newErrores.profesoresSeleccionados = "Debe seleccionar al menos un profesor";
    }

    setErrores(newErrores);
    if (Object.keys(newErrores).length === 0) {
      await createMateria();
      setShowCreateForm(false);
    }
  };

  const updateMateria = async () => {
    const myHeaders = new Headers();
    try {
      myHeaders.append("Content-Type", "application/json");

      const raw = JSON.stringify({
        nombre: updateNombreMateria,
        codigo: updateCodigoMateria,
        anio: updateAnioMateria,
        semestre: updateSemestreMateria,
        elementos: updateElementos,
        cantidadAlumnos: updateCantidadAlumnos,
        horarios: [
          { dia: updateHorarioDia, moduloInicio: updateHorarioModuloInicio, moduloFin: updateHorarioModuloFin }
        ],
        profesor: updateProfesoresSeleccionados,
      });

      const requestOptions = {
        method: "PUT",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };

      const response = await fetch(`http://localhost:7000/materia/${updateId}`, requestOptions);
      if (!response.ok) throw new Error("No se pudo actualizar la materia");

      setShowUpdateModal(false);

      getMaterias();

      setAlertMessage("Los cambios se han guardado correctamente");
      setShowAlert(true);

    } catch (error) {
      console.error(error);
      setAlertMessage("Hubo un error al guardar los cambios");
      setShowAlert(true);
    }
  };

  const handleUpdateSubmit = async () => {
    const newErrores = {};

    if (!updateNombreMateria) {
      newErrores.updateNombreMateria = 'El nombre es obligatorio';
    }
    if (!updateCodigoMateria) {
      newErrores.updateCodigoMateria = 'El código es obligatorio';
    }
    if (!updateAnioMateria) {
      newErrores.updateAnioMateria = "El año es obligatorio";
    }
    if (!updateHorarioDia || !updateHorarioModuloInicio || !updateHorarioModuloFin) {
      newErrores.updateHorario = "El horario es obligatorio";
    }
    if (updateElementos.length === 0) {
      newErrores.updateElementos = "Debe seleccionar al menos un elemento";
    }
    if (updateProfesoresSeleccionados.length === 0) {
      newErrores.updateProfesoresSeleccionados = "Debe seleccionar al menos un profesor";
    }

    setErrores(newErrores);
    if (Object.keys(newErrores).length === 0) {
      await updateMateria();
      setShowUpdateModal(false);
    }
  };

  const handleShowUpdateModal = (materia) => {
    setUpdateId(materia._id);
    setUpdateNombreMateria(materia.nombre);
    setUpdateCodigoMateria(materia.codigo);
    setUpdateAnioMateria(materia.anio);
    setUpdateSemestreMateria(materia.semestre);
    setUpdateElementos(materia.elementos);
    setUpdateCantidadAlumnos(materia.cantidadAlumnos);
    setUpdateHorarioDia(materia.horarios[0]?.dia || "");
    setUpdateHorarioModuloInicio(materia.horarios[0]?.moduloInicio || "");
    setUpdateHorarioModuloFin(materia.horarios[0]?.moduloFin || "");
    setUpdateProfesoresSeleccionados(materia.profesor.map(prof => prof._id));
    setShowUpdateModal(true);
  };

  useEffect(() => {
    getMaterias();
    getPersonal();
    getElementos();
  }, []);

  return (
    <>
      <Row>
        <Button onClick={() => setShowCreateForm(prevState => !prevState)}>
          {showCreateForm ? "Cancelar" : "Nueva Materia"}
        </Button>
        {showCreateForm && (
          <Form>
            <Form.Group controlId="formBasicNombreMateria">
              <Form.Label>Nombre</Form.Label>
              <Form.Control type="text" value={NombreMateria} onChange={(e) => setNombreMateria(e.target.value)} />
            </Form.Group>
            <Form.Group controlId="formBasicCodigoMateria">
              <Form.Label>Código</Form.Label>
              <Form.Control type="text" value={CodigoMateria} onChange={(e) => setCodigoMateria(e.target.value)} />
            </Form.Group>
            <Form.Group controlId="formBasicAnioMateria">
              <Form.Label>Año</Form.Label>
              <Form.Control type="text" value={AnioMateria} onChange={(e) => setAnioMateria(e.target.value)} />
            </Form.Group>
            <Form.Group controlId="formBasicSemestreMateria">
              <Form.Label>Semestre</Form.Label>
              <Form.Control as="select" value={SemestreMateria} onChange={(e) => setSemestreMateria(e.target.value)}>
                <option value="">Seleccionar Semestre</option>
                <option value="Anual">Anual</option>
                <option value="Primer Cuatrimestre">Primer Cuatrimestre</option>
                <option value="Segundo Cuatrimestre">Segundo Cuatrimestre</option>
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formBasicElementos">
              <Form.Label>Elementos</Form.Label>
              <Form.Control as="select" multiple value={Elementos} onChange={(e) => setElementos([...e.target.selectedOptions].map(option => option.value))}>
                {allElementos.map(elemento => (
                  <option key={elemento._id} value={elemento._id}>{elemento.nombre}</option>
                ))}
              </Form.Control>
              {Errores.Elementos && <Form.Text className="text-danger">{Errores.Elementos}</Form.Text>}
            </Form.Group>
            <Form.Group controlId="formBasicCantidadAlumnos">
              <Form.Label>Cantidad de Alumnos</Form.Label>
              <Form.Control type="number" value={CantidadAlumnos} onChange={(e) => setCantidadAlumnos(e.target.value)} />
            </Form.Group>
            <Form.Group controlId="formBasicHorarioDia">
              <Form.Label>Día</Form.Label>
              <Form.Control as="select" value={HorarioDia} onChange={(e) => setHorarioDia(e.target.value)}>
                <option value="">Seleccionar Día</option>
                {/* Aquí puedes agregar las opciones para los días de la semana */}
                <option value="Lunes">Lunes</option>
                <option value="Martes">Martes</option>
                <option value="Miércoles">Miércoles</option>
                <option value="Jueves">Jueves</option>
                <option value="Viernes">Viernes</option>
              </Form.Control>
              {Errores.Horario && <Form.Text className="text-danger">{Errores.Horario}</Form.Text>}
            </Form.Group>
            <Form.Group controlId="formBasicHorarioModuloInicio">
              <Form.Label>Módulo de Inicio</Form.Label>
              <Form.Control as="select" value={HorarioModuloInicio} onChange={(e) => setHorarioModuloInicio(e.target.value)}>
                <option value="">Seleccionar Módulo de Inicio</option>
                {[...Array(17).keys()].map(modulo => (
                  <option key={modulo + 1} value={modulo + 1}>{modulo + 1}</option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formBasicHorarioModuloFin">
              <Form.Label>Módulo de Fin</Form.Label>
              <Form.Control as="select" value={HorarioModuloFin} onChange={(e) => setHorarioModuloFin(e.target.value)}>
                <option value="">Seleccionar Módulo de Fin</option>
                {[...Array(17).keys()].map(modulo => (
                  <option key={modulo + 1} value={modulo + 1}>{modulo + 1}</option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formBasicProfesores">
              <Form.Label>Profesores</Form.Label>
              <Form.Control as="select" multiple value={profesoresSeleccionados} onChange={(e) => setProfesoresSeleccionados([...e.target.selectedOptions].map(option => option.value))}>
                {allPersonal.map(profesor => (
                  <option key={profesor._id} value={profesor._id}>{profesor.nombre}</option>
                ))}
              </Form.Control>
              {Errores.profesoresSeleccionados && <Form.Text className="text-danger">{Errores.profesoresSeleccionados}</Form.Text>}
            </Form.Group>
            <Button variant="primary" onClick={handleSubmit}>Crear Materia</Button>
          </Form>
        )}
        <AlertCreado showAlert={showAlert} message={alertMessage} onClose={() => setShowAlert(false)} />

        <ModalConfirmacion
        show={showConfirmDeleteModal}
        handleClose={() => setShowConfirmDeleteModal(false)}
        handleConfirm={() => DeleteMateria(deleteId)}
      />

        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Código</th>
              <th>Año</th>
              <th>Semestre</th>
              <th>Elementos</th>
              <th>Alumnos</th>
              <th>Profesores</th>
              <th>Horarios</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {allMaterias.map(materia => (
              <tr key={materia._id}>
                <td>{materia.nombre}</td>
                <td>{materia.codigo}</td>
                <td>{materia.anio}</td>
                <td>{materia.semestre}</td>
                <td>{materia.elementos.map(e => allElementos.find(el => el._id === e)?.nombre).join(', ')}</td>
                <td>{materia.cantidadAlumnos}</td>
                <td>{materia.profesor.map(prof => prof.nombre).join(", ")}</td>
                <td>| {materia.horarios.map(h => `Día: ${h.dia}, Módulo Inicio: ${h.moduloInicio}, Módulo Fin: ${h.moduloFin}`).join(' | ')} | </td>
                <td>
                  <Button style={{ marginBottom: '7px' }} variant="warning" onClick={() => handleShowUpdateModal(materia)}>Modificar</Button>
                  <Button style={{ marginLeft: '6px' }} variant="danger" onClick={() => handleDeleteClick(materia._id)}>Eliminar</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Row>

      <Modal show={showUpdateModal} onHide={() => setShowUpdateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Modificar Materia</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formUpdateNombreMateria">
              <Form.Label>Nombre</Form.Label>
              <Form.Control type="text" value={updateNombreMateria} onChange={(e) => setUpdateNombreMateria(e.target.value)} />
              {Errores.updateNombreMateria && <Form.Text className="text-danger">{Errores.updateNombreMateria}</Form.Text>}
            </Form.Group>
            <Form.Group controlId="formUpdateCodigoMateria">
              <Form.Label>Código</Form.Label>
              <Form.Control type="text" value={updateCodigoMateria} onChange={(e) => setUpdateCodigoMateria(e.target.value)} />
              {Errores.updateCodigoMateria && <Form.Text className="text-danger">{Errores.updateCodigoMateria}</Form.Text>}
            </Form.Group>
            <Form.Group controlId="formUpdateAnioMateria">
              <Form.Label>Año</Form.Label>
              <Form.Control type="text" value={updateAnioMateria} onChange={(e) => setUpdateAnioMateria(e.target.value)} />
              {Errores.updateAnioMateria && <Form.Text className="text-danger">{Errores.updateAnioMateria}</Form.Text>}
            </Form.Group>
            <Form.Group controlId="formUpdateSemestreMateria">
              <Form.Label>Semestre</Form.Label>
              <Form.Control as="select" value={updateSemestreMateria} onChange={(e) => setUpdateSemestreMateria(e.target.value)}>
                <option value="">Seleccionar</option>
                <option value="Anual">Anual</option>
                <option value="Primer Cuatrimestre">Primer Cuatrimestre</option>
                <option value="Segundo Cuatrimestre">Segundo Cuatrimestre</option>
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formUpdateElementos">
              <Form.Label>Elementos</Form.Label>
              <Form.Control as="select" multiple value={updateElementos} onChange={(e) => setUpdateElementos([...e.target.selectedOptions].map(option => option.value))}>
                {allElementos.map(elemento => (
                  <option key={elemento._id} value={elemento._id}>{elemento.nombre}</option>
                ))}
              </Form.Control>
              {Errores.updateElementos && <Form.Text className="text-danger">{Errores.updateElementos}</Form.Text>}
            </Form.Group>
            <Form.Group controlId="formUpdateCantidadAlumnos">
              <Form.Label>Cantidad de Alumnos</Form.Label>
              <Form.Control type="number" value={updateCantidadAlumnos} onChange={(e) => setUpdateCantidadAlumnos(e.target.value)} />
            </Form.Group>
            <Form.Group controlId="formUpdateHorarioDia">
              <Form.Label>Día</Form.Label>
              <Form.Control as="select" value={updateHorarioDia} onChange={(e) => setUpdateHorarioDia(e.target.value)}>
                <option value="">Seleccionar Día</option>
                <option value="Lunes">Lunes</option>
                <option value="Martes">Martes</option>
                <option value="Miércoles">Miércoles</option>
                <option value="Jueves">Jueves</option>
                <option value="Viernes">Viernes</option>
              </Form.Control>
              {Errores.updateHorario && <Form.Text className="text-danger">{Errores.updateHorario}</Form.Text>}
            </Form.Group>
            <Form.Group controlId="formUpdateHorarioModuloInicio">
              <Form.Label>Módulo de Inicio</Form.Label>
              <Form.Control as="select" value={updateHorarioModuloInicio} onChange={(e) => setUpdateHorarioModuloInicio(e.target.value)}>
                <option value="">Seleccionar Módulo de Inicio</option>
                {[...Array(17).keys()].map(modulo => (
                  <option key={modulo + 1} value={modulo + 1}>{modulo + 1}</option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formUpdateHorarioModuloFin">
              <Form.Label>Módulo de Fin</Form.Label>
              <Form.Control as="select" value={updateHorarioModuloFin} onChange={(e) => setUpdateHorarioModuloFin(e.target.value)}>
                <option value="">Seleccionar Módulo de Fin</option>
                {[...Array(17).keys()].map(modulo => (
                  <option key={modulo + 1} value={modulo + 1}>{modulo + 1}</option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formUpdateProfesores">
              <Form.Label>Profesores</Form.Label>
              <Form.Control as="select" multiple value={updateProfesoresSeleccionados} onChange={(e) => setUpdateProfesoresSeleccionados([...e.target.selectedOptions].map(option => option.value))}>
                {allPersonal.map(profesor => (
                  <option key={profesor._id} value={profesor._id}>{profesor.nombre}</option>
                ))}
              </Form.Control>
              {Errores.updateProfesoresSeleccionados && <Form.Text className="text-danger">{Errores.updateProfesoresSeleccionados}</Form.Text>}
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

export default CrudMaterias;
