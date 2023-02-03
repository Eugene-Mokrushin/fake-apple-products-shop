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
import Footer from './components/Footer';
import { useEffect, useRef } from 'react';

function App() {
    const { isMenuOpen, closeMenu, isMobile } = useMobileAndLang()
    const scrollUpRef = useRef(null)

    useEffect(() => {
        if (scrollUpRef.current && !isMobile) {
            window.addEventListener('scroll', (e) => {
                if (window.scrollY > 300 && scrollUpRef.current) {
                    (scrollUpRef.current as HTMLElement).classList.add('scrolledEnough')
                } else if (window.screenY <= 300 && scrollUpRef.current) {
                    (scrollUpRef.current as HTMLElement).classList.remove('scrolledEnough')
                }
            })
        }
    }, [])

    return (
        <>
            <Navbar />
            {isMenuOpen && isMobile && <div className="cover" onClick={() => closeMenu()}></div>}
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
                {!isMobile && <div className={"scrollUp"} ref={scrollUpRef} onClick={() => window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })}>
                    <img src="./imgs/upScroll.svg" alt="scrollUp" /> </div>}
                {!isMobile && <Footer />}
            </div>
        </>
    )
}

export default App
