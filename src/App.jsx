import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Convidados from './convidados'
import Presentes from './presentes'
import Comidas from './comidas'


function App() {
  const [marcado, setMarcado] = useState(1)

  window.addEventListener('beforeunload', (event) => {
    const confirm = confirm('Tem certeza que deseja sair? As alterações não salvas serão perdidas.');
    if (!confirm) {
      event.preventDefault();
    }
  })

return (
  <>
    <h1>MEU CASAMENTO</h1>
    <ul className='menu'>
      <li className={'menu-item ' + (marcado === 1 ? 'marcado' : '')} onClick={() => setMarcado(1)}>Convidados</li>
      <li className={'menu-item ' + (marcado === 2 ? 'marcado' : '')} onClick={() => setMarcado(2)}>Presentes</li>
      <li className={'menu-item ' + (marcado === 3 ? 'marcado' : '')} onClick={() => setMarcado(3)}>Comidas</li>
    </ul>

    {/* <h2>Lista</h2> */}

    {
      marcado == 1 && <Convidados />
    }
    {
      marcado == 2 &&
      <Presentes />
    }
    {
      marcado == 3 &&
      <Comidas />
    }

  </>
)
}

export default App
