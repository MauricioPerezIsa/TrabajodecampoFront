import React from 'react'
import { Link } from "react-router-dom";
import styles from '../styles/sidebarStyle.module.css'

function Sidebarlateral() {
  return (
    <div className={`d-none d-lg-block ${styles['sidebar-conteiner']}`}>
            <div className={`d-flex flex-column align-items-center ${styles['container-links']}`}>
                <div className={`m-1 ${styles['wrapper-link']}`}>
                    <Link to="/" >
                        <button className={`font-monospace text-decoration-none ${styles['links-custom']}`}>Home</button>
                    </Link>
                </div>
                <div className={`m-1 ${styles['wrapper-link']}`}>
                    <Link to="/Horarios" className={`text-decoration-none ${styles['']}`}>
                        <button className={`font-monospace text-decoration-none ${styles['links-custom']}`}>Horarios</button>
                    </Link>
                </div>
                <div className={`m-1 ${styles['wrapper-link']}`}>
                    <Link to="/Carreras" className={`text-decoration-none ${styles['']}`}>
                        <button className={`font-monospace text-decoration-none ${styles['links-custom']}`}>Carreras</button>
                    </Link>
                </div>
                <div className={`m-1 ${styles['wrapper-link']}`}>
                    <Link to="/Edificios" className={`text-decoration-none ${styles['']}`}>
                        <button className={`font-monospace text-decoration-none ${styles['links-custom']}`}>Edificios</button>
                    </Link>
                </div>
                <div className={`m-1 ${styles['wrapper-link']}`}>
                    <Link to="/Profesores" className={`text-decoration-none ${styles['']}`}>
                        <button className={`font-monospace text-decoration-none ${styles['links-custom']}`}>Profesores</button>
                    </Link>
                </div>
                <div className={`m-1 ${styles['wrapper-link']}`}>
                    <Link to="/PlanDeEstudio" className={`text-decoration-none ${styles['']}`}>
                        <button className={`font-monospace text-decoration-none ${styles['links-custom']}`}>Plan De Estudio</button>
                    </Link>
                </div>
                <div className={`m-1 ${styles['wrapper-link']}`}>
                    <Link to="/Materias" className={`text-decoration-none ${styles['']}`}>
                        <button className={`font-monospace text-decoration-none ${styles['links-custom']}`}>Materias</button>
                    </Link>
                </div>
                <div className={`m-1 ${styles['wrapper-link']}`}>
                    <Link to="/Elementos" className={`text-decoration-none ${styles['']}`}>
                        <button className={`font-monospace text-decoration-none ${styles['links-custom']}`}>Elementos</button>
                    </Link>
                </div>
                <div className={`m-1 ${styles['wrapper-link']}`}>
                    <Link to="/Espacios" className={`text-decoration-none ${styles['']}`}>
                        <button className={`font-monospace text-decoration-none ${styles['links-custom']}`}>Espacios</button>
                    </Link>
                </div>
            </div>
        </div>


  )
}

export default Sidebarlateral