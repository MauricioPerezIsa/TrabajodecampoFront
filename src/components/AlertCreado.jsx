import { useState } from 'react';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';

function AlertCreado({ showAlert, message, onClose }) {

    const alertStyle = {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 9999,
        width: '400px',
        backgroundColor: '#155724', // Color de fondo suave#f8f9fa
        borderRadius: '10px', // Bordes redondeados
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Sombra para darle profundidad
        padding: '20px', // Espaciado interno
        textAlign: 'center', // Centrar el texto
        border: '1px solid #c3e6cb', // Borde de color similar al alert
        fontFamily: 'Arial, sans-serif', // Fuente limpia y moderna
        color: '#f8f9fa', // Color del texto en verde suave#155724
      };
      

  return (
    <Alert show={showAlert} variant="success" style={alertStyle} >
      <Alert.Heading>Operación Exitosa</Alert.Heading>
      <p>{message}</p>
      <div className="d-flex justify-content-end">
        <Button onClick={onClose} variant="light">
          Salir
        </Button>
      </div>
    </Alert>
  );
}

export default AlertCreado;