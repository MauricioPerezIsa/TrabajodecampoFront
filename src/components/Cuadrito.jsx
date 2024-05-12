import React from 'react'
import styles from '../styles/gridLoyout.module.css'
import Sidebarlateral from './Sidebarlateral'
import FooterCustom from './FooterCustom'


function Cuadrito() {
  return (
    <div className={styles["grid-container"]}>
    <div className={styles["container-center"]}>
        <div className={styles["sidebar-grid"]}>
            <Sidebarlateral/>
        </div>

    </div>

    <div className={styles["footer-grid"]}>
        <FooterCustom/>
    </div>
</div>
  )
}

export default Cuadrito