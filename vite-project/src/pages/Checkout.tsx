import { useEffect, useState } from 'react'
import classes from '../../scss/Checkout.module.scss'
import { CheckoutDelivery } from '../components/CheckoutDelivery'
import { CheckoutGoods } from '../components/CheckoutGoods'
import { CheckoutPayment } from '../components/CheckoutPayment'
import { useMobileAndLang } from '../context/IsMobileLangContext'
import { useShoppingCart } from '../context/ShoppingCartContext'


export function Checkout() {
    const { lang } = useMobileAndLang()
    const { deliveryMethod, cartItems } = useShoppingCart()
    const [currencyMultiplier, setCurrencyMultiplier] = useState<number>(1)

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

    return (
        <div className={classes.checkoutWrapper}>
            <CheckoutGoods lang={lang} cartItems={cartItems} currencyMultiplier={currencyMultiplier} />
            <CheckoutDelivery lang={lang} deliveryMethod={deliveryMethod} currencyMultiplier={currencyMultiplier} />
            <CheckoutPayment lang={lang} />
        </div>
    )
}
