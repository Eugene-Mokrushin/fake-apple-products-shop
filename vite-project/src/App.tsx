import { useMobileAndLang } from './context/IsMobileLangContext';
import { Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { Navbar } from './components/Navbar';
import { Contacts } from './pages/Contacts';
import { Terms } from './pages/Terms';
import { Store } from './pages/Store';
import { Favorites } from './pages/Favorites';
import { StoreItem } from './pages/StoreItem';
import { Cart } from './pages/Cart';
import { Checkout } from './pages/Checkout';
import { OrderCreated } from './pages/OrderCreated';

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
                    <Route path='/fav' element={<Favorites />} />
                    <Route path='/item' element={<StoreItem />} />
                    <Route path='/cart' element={<Cart />} />
                    <Route path='/checkout' element={<Checkout />} />
                    <Route path='/order' element={<OrderCreated />} />
                </Routes>
            </div>
        </>
    )
}

export default App
