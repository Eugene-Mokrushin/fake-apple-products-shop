import { useMobileAndLang } from "../context/IsMobileLangContext"
import { useShoppingCart } from "../context/ShoppingCartContext"
import { Link } from "react-router-dom"
import classes from '../../scss/Cart.module.scss'
import cart_data from '../data/Cart.json'
import { CartItem } from "../components/CartItem"
import { useEffect, useState } from "react"
import allgoods_data from '../data/individual_good.json';
import { useSelectedSection } from "../context/IsSectionSelectedContext"

type ItemData = {
    id: string,
    quantity: number
}

type GoodData = {
    "title": string,
    "price": string,
    "rating": string,
    "feature": string[],
    "specific_name": string[],
    "specific_value": string[],
    "description": string,
    "images_url": string[]
}


export function Cart() {
    const { setSection } = useSelectedSection()
    const { cartItems, deliveryMethod, pickDeliveryMethod } = useShoppingCart()
    const { lang } = useMobileAndLang()

    const emptyTitle = cart_data.empty.title[lang as keyof typeof cart_data.empty.title]
    const emptySubTitle = cart_data.empty.subtitle[lang as keyof typeof cart_data.empty.subtitle]
    const goToCatalogBtn = cart_data.empty.goTo[lang as keyof typeof cart_data.empty.goTo]
    const deliveryTitle = cart_data.delivery.title[lang as keyof typeof cart_data.delivery.title]
    const deliveryOptionCourier = cart_data.delivery.delivery_uptions.courier[lang as keyof typeof cart_data.delivery.delivery_uptions.courier]
    const deliveryOptionPickup = cart_data.delivery.delivery_uptions.selfPickUp[lang as keyof typeof cart_data.delivery.delivery_uptions.selfPickUp]
    const totalTitle = cart_data.total.title[lang as keyof typeof cart_data.total.title]
    const totalCta = cart_data.total.cta[lang as keyof typeof cart_data.total.cta]
    const [currencyMultiplier, setCurrencyMultiplier] = useState<number>(1)
    const [deliveryMenuState, setDeliveryMenuState] = useState<boolean>(false)

    const allCartItems = cartItems.map((item: ItemData) => {
        return (
            <CartItem item={item} multiplier={currencyMultiplier} key={crypto.randomUUID()} />
        )
    })

    const calculatedTotal = (+cartItems.reduce((acc, curentValue) => {
        return acc + curentValue.quantity * ((allgoods_data[curentValue.id as keyof {}] as GoodData).price !== '' ? +(allgoods_data[curentValue.id as keyof {}] as GoodData).price.split('$')[1] : 10)
    }, 0) * currencyMultiplier + (deliveryMethod === deliveryOptionCourier ? lang === "en" ? 10.99 : 10.99 * currencyMultiplier : 0)).toFixed(2)


    useEffect(() => {
        async function changePriceCurrency() {
            if (lang === 'en') return
            async function getRub() {
                const rub_exchange = await fetch('https://api.exchangerate.host/latest?base=USD', {
                    method: "GET"
                })
                    .then(res => res.json())
                return +rub_exchange.rates.RUB
            }
            const multiplier = await getRub()
            setCurrencyMultiplier(multiplier)
        }
        changePriceCurrency()
        if (deliveryMethod === "") pickDeliveryMethod(deliveryOptionCourier)
    }, [])

    return (
        <div className={classes.cartWrapper}>
            {cartItems.length === 0 ? (
                <div className={classes.emptyCart}>
                    <div className={classes.emptyCartTitleAndImg}>
                        <img src="./imgs/cartBG.svg" alt="Cart is empty" className={classes.emptyCartBG} />
                        <div className={classes.titleCartEmpty}>{emptyTitle}</div>
                        <div className={classes.subTitleCartEmpty}>{emptySubTitle}</div>
                    </div>
                    <Link to={'/'} className={classes.goToCatalog} onClick={() => setSection("QPICK")}>
                        <div>{goToCatalogBtn}</div>
                    </Link>
                </div>) : (
                <div className={classes.filledCart}>
                    <div className={classes.goodsInCartInfo}>
                        <div className={classes.cartItems}>
                            {allCartItems}
                        </div>
                        <div className={classes.deliveryWrapper}>
                            <div className={classes.delivery}>
                                <div className={classes.titleAndPrice}>
                                    <div className={classes.deliveryTitle}>{deliveryTitle}</div>
                                    <div className={classes.price}>{deliveryMethod === deliveryOptionPickup ? lang === "en" ? "$0.00" : "0 ₽" : lang === "en" ? "$10.99" : `${(10.99 * currencyMultiplier).toFixed(2)} ₽`}</div>
                                </div>
                                {deliveryMethod === deliveryOptionPickup &&
                                    <a href="https://www.google.ru/maps/place/Louvre+Museum/@48.8595951,2.3374212,17z/data=!4m5!3m4!1s0x47e671d877937b0f:0xb975fcfa192f84d4!8m2!3d48.8606111!4d2.337644" target="_blank">
                                        <img src="../imgs/map.jpg" alt="map" className={classes.map} />
                                    </a>
                                }
                                <div className={classes.deliveryMethodsWrapper}>
                                    <div className={classes.selected} onClick={() => setDeliveryMenuState(prev => !prev)}>
                                        {deliveryMethod === deliveryOptionCourier ?
                                            <svg className={classes.methodThumb} width="20" height="13" viewBox="0 0 20 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M7.29708 10.5584C7.19175 11.236 6.82327 11.856 6.25932 12.3045C5.69536 12.7531 4.9738 13 4.22718 13C3.48055 13 2.75899 12.7531 2.19504 12.3045C1.63108 11.856 1.2626 11.236 1.15728 10.5584H0.240295V0.812182C0.240295 0.596778 0.333639 0.390196 0.499791 0.237883C0.665944 0.0855691 0.891294 0 1.12627 0H13.5299C13.7649 0 13.9902 0.0855691 14.1564 0.237883C14.3225 0.390196 14.4159 0.596778 14.4159 0.812182V2.43655H17.0738L19.7317 5.73076V10.5584H17.9288C17.8234 11.236 17.455 11.856 16.891 12.3045C16.3271 12.7531 15.6055 13 14.8589 13C14.1122 13 13.3907 12.7531 12.8267 12.3045C12.2628 11.856 11.8943 11.236 11.789 10.5584H7.29708ZM12.6439 1.62436H2.01224V8.16243C2.36182 7.83528 2.79243 7.59039 3.26745 7.44862C3.74247 7.30684 4.24782 7.27236 4.74049 7.34813C5.23317 7.42389 5.69858 7.60766 6.09712 7.88377C6.49567 8.15989 6.81554 8.52019 7.02951 8.934H12.0565C12.2054 8.6473 12.4047 8.38659 12.6439 8.16243V1.62436ZM14.4159 6.49746H17.9598V6.26599L16.1807 4.06091H14.4159V6.49746ZM14.8589 11.3705C15.2114 11.3705 15.5496 11.2422 15.7989 11.0136C16.0482 10.7851 16.1883 10.4751 16.1883 10.1519C16.1883 9.82866 16.0482 9.51868 15.7989 9.29013C15.5496 9.06159 15.2114 8.93319 14.8589 8.93319C14.5063 8.93319 14.1681 9.06159 13.9188 9.29013C13.6695 9.51868 13.5295 9.82866 13.5295 10.1519C13.5295 10.4751 13.6695 10.7851 13.9188 11.0136C14.1681 11.2422 14.5063 11.3705 14.8589 11.3705ZM5.55614 10.1523C5.55614 9.99229 5.52176 9.83387 5.45498 9.68606C5.38819 9.53825 5.2903 9.40395 5.1669 9.29083C5.04349 9.1777 4.89699 9.08796 4.73575 9.02674C4.57451 8.96552 4.4017 8.934 4.22718 8.934C4.05266 8.934 3.87984 8.96552 3.71861 9.02674C3.55737 9.08796 3.41087 9.1777 3.28746 9.29083C3.16406 9.40395 3.06616 9.53825 2.99938 9.68606C2.93259 9.83387 2.89822 9.99229 2.89822 10.1523C2.89822 10.4754 3.03823 10.7853 3.28746 11.0137C3.53669 11.2422 3.87472 11.3705 4.22718 11.3705C4.57964 11.3705 4.91767 11.2422 5.1669 11.0137C5.41612 10.7853 5.55614 10.4754 5.55614 10.1523Z" fill="#101010" />
                                            </svg>
                                            :
                                            <img className={classes.methodThumb} src="./imgs/walkinkingman.svg" alt="Pickup" />
                                        }
                                        <div className={classes.nameOption}>{deliveryMethod}</div>
                                        <svg className={`${classes.tick} ${!deliveryMenuState ? classes.tickDown : classes.tickUp}`} width="14" height="8" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M7.17451 8L0.677368 1.99965L2.8441 0L7.17451 4.00071L11.5049 0L13.6717 1.99965L7.17451 8Z" fill="#101010" />
                                        </svg>
                                    </div>
                                    <div className={`${classes.otherOptions} ${deliveryMenuState ? classes.otherOprionsOpened : classes.otherOprionsClosed}`}>
                                        <div className={classes.option} onClick={() => { (deliveryMethod === deliveryOptionCourier ? pickDeliveryMethod(deliveryOptionPickup) : pickDeliveryMethod(deliveryOptionCourier)); setDeliveryMenuState(false) }}>
                                            {deliveryMethod === deliveryOptionPickup ?
                                                <svg className={classes.methodThumb} width="20" height="13" viewBox="0 0 20 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M7.29708 10.5584C7.19175 11.236 6.82327 11.856 6.25932 12.3045C5.69536 12.7531 4.9738 13 4.22718 13C3.48055 13 2.75899 12.7531 2.19504 12.3045C1.63108 11.856 1.2626 11.236 1.15728 10.5584H0.240295V0.812182C0.240295 0.596778 0.333639 0.390196 0.499791 0.237883C0.665944 0.0855691 0.891294 0 1.12627 0H13.5299C13.7649 0 13.9902 0.0855691 14.1564 0.237883C14.3225 0.390196 14.4159 0.596778 14.4159 0.812182V2.43655H17.0738L19.7317 5.73076V10.5584H17.9288C17.8234 11.236 17.455 11.856 16.891 12.3045C16.3271 12.7531 15.6055 13 14.8589 13C14.1122 13 13.3907 12.7531 12.8267 12.3045C12.2628 11.856 11.8943 11.236 11.789 10.5584H7.29708ZM12.6439 1.62436H2.01224V8.16243C2.36182 7.83528 2.79243 7.59039 3.26745 7.44862C3.74247 7.30684 4.24782 7.27236 4.74049 7.34813C5.23317 7.42389 5.69858 7.60766 6.09712 7.88377C6.49567 8.15989 6.81554 8.52019 7.02951 8.934H12.0565C12.2054 8.6473 12.4047 8.38659 12.6439 8.16243V1.62436ZM14.4159 6.49746H17.9598V6.26599L16.1807 4.06091H14.4159V6.49746ZM14.8589 11.3705C15.2114 11.3705 15.5496 11.2422 15.7989 11.0136C16.0482 10.7851 16.1883 10.4751 16.1883 10.1519C16.1883 9.82866 16.0482 9.51868 15.7989 9.29013C15.5496 9.06159 15.2114 8.93319 14.8589 8.93319C14.5063 8.93319 14.1681 9.06159 13.9188 9.29013C13.6695 9.51868 13.5295 9.82866 13.5295 10.1519C13.5295 10.4751 13.6695 10.7851 13.9188 11.0136C14.1681 11.2422 14.5063 11.3705 14.8589 11.3705ZM5.55614 10.1523C5.55614 9.99229 5.52176 9.83387 5.45498 9.68606C5.38819 9.53825 5.2903 9.40395 5.1669 9.29083C5.04349 9.1777 4.89699 9.08796 4.73575 9.02674C4.57451 8.96552 4.4017 8.934 4.22718 8.934C4.05266 8.934 3.87984 8.96552 3.71861 9.02674C3.55737 9.08796 3.41087 9.1777 3.28746 9.29083C3.16406 9.40395 3.06616 9.53825 2.99938 9.68606C2.93259 9.83387 2.89822 9.99229 2.89822 10.1523C2.89822 10.4754 3.03823 10.7853 3.28746 11.0137C3.53669 11.2422 3.87472 11.3705 4.22718 11.3705C4.57964 11.3705 4.91767 11.2422 5.1669 11.0137C5.41612 10.7853 5.55614 10.4754 5.55614 10.1523Z" fill="#101010" />
                                                </svg>
                                                :
                                                <img className={classes.methodThumb} src="./imgs/walkinkingman.svg" alt="Pickup" />
                                            }
                                            <div className={classes.nameOption}>{deliveryMethod === deliveryOptionCourier ? deliveryOptionPickup : deliveryOptionCourier}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={classes.goToPaymentWrapper}>
                        <div className={classes.titleAndPrice}>
                            <div className={classes.title}>{totalTitle.toUpperCase()}</div>
                            <div className={classes.price}>{lang === "en" ? `$${calculatedTotal}` : `${calculatedTotal} ₽`}</div>
                        </div>
                        <Link to={`/checkout`} onClick={() => {setSection(lang === "en" ? "Checkout" : "Оформление заказа")}} style={{textDecoration: "none"}}>
                            <div className={classes.btn}>{totalCta}</div>
                        </Link>
                    </div>
                </div>
            )}
        </div>
    )
}
