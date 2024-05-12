import Style from '../styles/footerStyle.module.css'


function FooterCustom() {
  return (
    <div className={`d-flex text-center ${Style['footerCustom']}`}>
    <div className={`d-flex align-items-center justify-content-center my-4 ${Style['container-Custom']}`}>
      <p className="text-white font-monospace h5">Todo malarado</p>
    </div>
  </div>

  )
}

export default FooterCustom