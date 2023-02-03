import { Link } from 'react-router-dom'
import { useMobileAndLang } from '../context/IsMobileLangContext'
import { useSelectedSection } from '../context/IsSectionSelectedContext'
import { useShoppingCart } from '../context/ShoppingCartContext'
import { MenuMobile } from './MenuMobile'
import classes from '../../scss/Navbar.module.scss'
import { MenuDesctop } from './MenuDesctop'

export function Navbar() {
    const { cartQuantity, favItems } = useShoppingCart()
    const { isMobile, openMenu, closeMenu, isMenuOpen, lang } = useMobileAndLang()
    const { section, setSection } = useSelectedSection()

    return (
        <>
            <div className={`${isMobile ? classes.mobile : classes.desctop} ${classes.navWrapper}`}>
                <Link to={'/'} className={`${classes.logoBack} ${section === "QPICK" ? classes.logo : classes.back}`} onClick={() => { setSection('QPICK'); closeMenu() }}>{section}</Link>
                {!isMobile && <MenuDesctop />}
                
                <div className={classes.wrapMenuAndCarts}>
                    {favItems.length > 0 &&
                        <div className={classes.favAndQuantity}>
                            <Link to={'/fav'} onClick={() => { setSection(lang === 'en' ? "Favorites" : "Избранное"); closeMenu() }}>
                                <svg width="23" height="20" viewBox="0 0 23 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M11.4867 1.65429C14.0706 -0.627558 18.0635 -0.551821 20.5528 1.90098C23.0409 4.35486 23.1267 8.2629 20.8124 10.812L11.4845 20L2.15892 10.812C-0.155442 8.2629 -0.0685429 4.34837 2.41851 1.90098C4.90996 -0.548575 8.89519 -0.630804 11.4867 1.65429ZM18.9952 3.42979C17.3452 1.80469 14.6833 1.73869 12.9563 3.26425L11.4878 4.56044L10.0183 3.26533C8.2858 1.73761 5.62935 1.80469 3.97498 3.43195C2.33601 5.04407 2.25351 7.62455 3.76379 9.32971L11.4856 16.937L19.2075 9.3308C20.7189 7.62455 20.6364 5.04732 18.9952 3.42979Z" fill="#838383" />
                                </svg>

                                <div className={classes.numFav}>
                                    {favItems.length}
                                </div>
                            </Link>

                        </div>
                    }
                    <div className={classes.cart}>
                        <Link to={'/cart'} onClick={() => { setSection(lang === "en" ? "Cart" : "Корзина"); closeMenu() }}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M3.72418 5.2614L0 1.59864L1.62495 0L5.34799 3.66389H22.8515C23.0305 3.66388 23.2071 3.70503 23.367 3.78406C23.527 3.86309 23.6659 3.97782 23.7728 4.11907C23.8797 4.26033 23.9515 4.42422 23.9826 4.59764C24.0136 4.77107 24.0031 4.94923 23.9517 5.11792L21.1956 14.1562C21.1247 14.389 20.9793 14.5931 20.7812 14.7383C20.583 14.8834 20.3425 14.9617 20.0954 14.9617H6.02094V17.2213H18.6531V19.4809H4.87256C4.56799 19.4809 4.2759 19.3618 4.06054 19.15C3.84517 18.9381 3.72418 18.6507 3.72418 18.3511V5.2614ZM6.02094 5.92346V12.7022H19.241L21.3081 5.92346H6.02094ZM5.44675 24C4.9899 24 4.55176 23.8215 4.22871 23.5036C3.90567 23.1858 3.72418 22.7548 3.72418 22.3053C3.72418 21.8559 3.90567 21.4248 4.22871 21.107C4.55176 20.7892 4.9899 20.6106 5.44675 20.6106C5.9036 20.6106 6.34174 20.7892 6.66479 21.107C6.98783 21.4248 7.16931 21.8559 7.16931 22.3053C7.16931 22.7548 6.98783 23.1858 6.66479 23.5036C6.34174 23.8215 5.9036 24 5.44675 24ZM19.2273 24C18.7704 24 18.3323 23.8215 18.0092 23.5036C17.6862 23.1858 17.5047 22.7548 17.5047 22.3053C17.5047 21.8559 17.6862 21.4248 18.0092 21.107C18.3323 20.7892 18.7704 20.6106 19.2273 20.6106C19.6841 20.6106 20.1223 20.7892 20.4453 21.107C20.7683 21.4248 20.9498 21.8559 20.9498 22.3053C20.9498 22.7548 20.7683 23.1858 20.4453 23.5036C20.1223 23.8215 19.6841 24 19.2273 24Z" fill="#838383" />
                            </svg>
                        </Link>
                        {cartQuantity !== 0 &&
                            <div className={classes.quantityInCart}>
                                {cartQuantity}
                            </div>
                        }
                    </div>
                    <div className={`${classes.burger} ${isMenuOpen ? classes.mnVisible : classes.mnHidden}`} onClick={() => { !isMenuOpen ? openMenu() : closeMenu() }}>
                        <span className={classes.top}></span>
                        <span className={classes.middle}></span>
                        <span className={classes.bottom}></span>
                    </div>
                </div>
            </div>

            {isMobile && <MenuMobile />}
        </>
    )
}
