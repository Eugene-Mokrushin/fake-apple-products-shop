import { useMobileAndLang } from './context/IsMobileLangContext';
import { Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { Navbar } from './components/Navbar';
import { Contacts } from './pages/Contacts';
import { Terms } from './pages/Terms';
import { Store } from './pages/Store';

function App() {
  const { isMenuOpen, closeMenu } = useMobileAndLang()
  return (
    <>
      <Navbar />
      {isMenuOpen && <div className="cover" onClick={() => closeMenu()}></div>}
      <div className='conteiner'>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/contacts' element={<Contacts />} />
          <Route path='/terms' element={<Terms />} />
          <Route path='/store' element={<Store />} />
        </Routes>
      </div>
    </>
  )
}

export default App
