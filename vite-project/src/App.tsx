import { IsMobileLangProvider, useMobile } from './context/IsMobileLangContext';
import { IsSectionSelectedProvider } from './context/IsSectionSelectedContext';
import { ShoppingCartProvider } from './context/ShoppingCartContext';
import { Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { Navbar } from './components/Navbar';
import { useEffect } from 'react';

function App() {
  const { setMenuStatus } = useMobile()
  useEffect(() => {
    window.addEventListener('click', () => {
      setMenuStatus(false)
    })
  }, [])
  return (
    <ShoppingCartProvider>
      <IsSectionSelectedProvider>
        <IsMobileLangProvider>
          <Navbar />
          <div className='conteiner'>
            <Routes>
              <Route path='/' element={<Home />} />
            </Routes>
          </div>
        </IsMobileLangProvider>
      </IsSectionSelectedProvider>
    </ShoppingCartProvider>
  )
}

export default App
