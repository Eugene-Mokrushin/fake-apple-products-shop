import { IsMobileLangProvider } from './context/IsMobileLangContext';
import { IsSectionSelectedProvider } from './context/IsSectionSelectedContext';
import { Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { Navbar } from './pages/Navbar';

function App() {
  return (
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
  )
}

export default App
