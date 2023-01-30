import { useEffect, useRef, useState } from 'react'
import classes from '../../scss/Checkout.module.scss'
import checkout_data from '../data/Checkout.json';
import goods_data from '../data/individual_good.json';
import cart_data from '../data/Cart.json'
import { CheckoutDelivery } from '../components/CheckoutDelivery'
import { CheckoutGoods } from '../components/CheckoutGoods'
import { CheckoutPayment } from '../components/CheckoutPayment'
import { useMobileAndLang } from '../context/IsMobileLangContext'
import { useShoppingCart } from '../context/ShoppingCartContext'


export function Checkout() {
    const { lang } = useMobileAndLang()
    const { deliveryMethod, cartItems } = useShoppingCart()
    const [currencyMultiplier, setCurrencyMultiplier] = useState<number>(1)
    const [ribbon, setRibbon] = useState<JSX.Element[]>()
    const [totalPrice, setTotalPrice] = useState<number>()
    const [discount, setDiscount] = useState<number>(0)
    const totalRef = useRef(null)
    const total = checkout_data.total[lang as keyof typeof checkout_data.total]
    const placeOrder = checkout_data.ctaBtn[lang as keyof typeof checkout_data.ctaBtn]
    const deliveryOptionPickupChecker = cart_data.delivery.delivery_uptions.selfPickUp.en
    const allPromocodes = cart_data.allPromocodes

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

    }, [])

    useEffect(() => {
        if (totalRef.current !== null) {
            const widthTotal = (totalRef.current as HTMLElement).getBoundingClientRect().width;
            let ribbon = []
            for (let index = 0; index < widthTotal / 10; index++) {
                ribbon.push(<div key={crypto.randomUUID()} className={classes.ribbonTriangle}></div>)
            }
            setRibbon(ribbon)
        }
        let total = 0
        for (let index = 0; index < cartItems.length; index++) {
            const product_data: GoodData = goods_data[cartItems[index].id as keyof typeof goods_data]
            total += (+product_data.price.split('$')[1] * cartItems[index].quantity) * currencyMultiplier
        }
        total += deliveryMethod === deliveryOptionPickupChecker ? 0 * currencyMultiplier : 10.99 * currencyMultiplier
        setTotalPrice(+total.toFixed(2))
    }, [currencyMultiplier])

    function handlePromo(promocode: string) {
        if (allPromocodes.includes(promocode)) {
            setDiscount(cart_data.promocodes[promocode as keyof typeof cart_data.promocodes])
        } else {
            setDiscount(0)
        }
    }

    return (
        <div className={classes.container}>
            <div className={classes.checkoutWrapper}>
                <div className={classes.blocks}>
                    <CheckoutGoods lang={lang} cartItems={cartItems} currencyMultiplier={currencyMultiplier} />
                    <CheckoutDelivery lang={lang} deliveryMethod={deliveryMethod} currencyMultiplier={currencyMultiplier} />
                    <CheckoutPayment lang={lang} handlePromo={handlePromo} />
                </div>
            </div>
            <div className={classes.totalWrapperPlaceOrder}>
                <div className={classes.total}>
                    <div className={classes.title}>{total.toUpperCase()}</div>
                    <div className={classes.priceAndDiscaout}>
                        <div className={`${classes.sum} ${discount !== 0 ? classes.oldPrice : ""}`}>{lang === "en" ? "$" + totalPrice : totalPrice + " ₽"}</div>
                        {discount !== 0 && totalPrice &&
                            <div className={classes.newPrice}>
                                {lang === "en" ? "$" + (totalPrice * (100 - discount) / 100).toFixed(2) : (totalPrice * (100 - discount) / 100).toFixed(2) + " ₽"}
                            </div>
                        }
                    </div>
                </div>
                <div className={classes.placeOrderWrapper} ref={totalRef}>
                    {ribbon}
                    <div className={classes.button}>{placeOrder}</div>
                </div>
            </div>
        </div>
    )
}
