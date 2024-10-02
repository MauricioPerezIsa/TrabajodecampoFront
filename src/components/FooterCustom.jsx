import Style from '../styles/footerStyle.module.css'
import logo from "../assets/ISO_UNSTA.png";


function FooterCustom() {
  return (
    <div className={`d-flex text-center ${Style['footerCustom']}`}>
      <div className={`d-flex flex-row align-items-center justify-content-center my-4 ${Style['container-Custom']}`}>
        <img
          src={logo}
          alt="Logo"
          style={{ width: "70px", height: "70px", marginBottom: "10px", marginRight: "20px" }} // Agregamos margen inferior al img
        />
        <h2 className='text-white' style={{ fontFamily: "Crimson Text, serif", marginBottom: "10px", marginRight: "40px"  }}>
          A u l a S M A R T
        </h2>
        <p className="text-white font-monospace h5 ">© Todos los derechos reservados</p>
      </div>
    </div>


  )
}

export default FooterCustom