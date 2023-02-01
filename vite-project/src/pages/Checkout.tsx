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
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelectedSection } from '../context/IsSectionSelectedContext';

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

export function Checkout() {
    const { lang } = useMobileAndLang()
    const { deliveryMethod, cartItems, removeFromCart } = useShoppingCart()

    const total = checkout_data.total[lang as keyof typeof checkout_data.total]
    const placeOrder = checkout_data.ctaBtn[lang as keyof typeof checkout_data.ctaBtn]
    const uponDelivery = checkout_data.paymontMethods.delivered[lang as keyof typeof checkout_data.paymontMethods.delivered]
    const qiwi = checkout_data.paymontMethods.qiwi[lang as keyof typeof checkout_data.paymontMethods.qiwi]

    const [currencyMultiplier, setCurrencyMultiplier] = useState<number>(1)
    const [ribbon, setRibbon] = useState<JSX.Element[]>()
    const [totalPrice, setTotalPrice] = useState<number>()
    const [discount, setDiscount] = useState<number>(0)
    const [methodSelected, setMethodSelected] = useState<string>(qiwi)
    const [deliveryInfo, setDeliveryInfo] = useState({ "city": "Paris", "street": '', "house": "", "houseAdd": "", "floor": "", "appertment": "" })

    const totalRef = useRef(null)
    const navigate = useNavigate();
    const { setSection } = useSelectedSection()

    const deliveryOptionPickupChecker = cart_data.delivery.delivery_uptions.selfPickUp.en
    const allPromocodes = cart_data.allPromocodes

    const { search } = useLocation();
    const parameters = new URLSearchParams(search);
    const instantBuy = parameters.get('instant');
    let newCartItems = cartItems
    if (instantBuy !== null) {
        newCartItems = [{ "id": instantBuy.split("$")[0], "quantity": +instantBuy.split("$")[1] }]
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
        for (let index = 0; index < newCartItems.length; index++) {
            const product_data: GoodData = goods_data[newCartItems[index].id as keyof typeof goods_data]
            const price = product_data.price === "" ? 10.99 : +product_data.price.split('$')[1]
            total += (price * newCartItems[index].quantity) * currencyMultiplier
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

    function handleChengePayment() {
        const newSelect = methodSelected === qiwi ? uponDelivery : qiwi
        setMethodSelected(newSelect)
    }

    function handleDeliveryInfo(e: React.ChangeEvent<HTMLInputElement> | null, city = "") {
        if (city !== '' || e === null) {
            setDeliveryInfo(prev => {
                return {
                    ...prev,
                    city: city
                }
            })
        } else {
            setDeliveryInfo(prev => {
                return {
                    ...prev,
                    [e?.target.name]: e?.target.value
                }
            })
        }
    }

    async function handleMakeOrder() {
        async function getRub() {
            const rub_exchange = await fetch('https://api.exchangerate.host/latest?base=USD', {
                method: "GET"
            })
                .then(res => res.json())
            return +rub_exchange.rates.RUB
        }
        const multiplier = await getRub()
        const orderNumber = parseInt(`${Math.random() * 1000000}`)


        if (deliveryMethod === "Courier delivery") {
            if (deliveryInfo.house === "") {
                document.getElementsByName("house")[0].style.borderColor = "#DF6464"
            } else {
                document.getElementsByName("house")[0].style.borderColor = "transparent"
            }
            if (deliveryInfo.street === "") {
                document.getElementsByName("street")[0].style.borderColor = "#DF6464"
            } else {
                document.getElementsByName("street")[0].style.borderColor = "transparent"
            }
            if (deliveryInfo.appertment === "") {
                document.getElementsByName("appertment")[0].style.borderColor = "#DF6464"
            } else {
                document.getElementsByName("appertment")[0].style.borderColor = "transparent"
            }

            if (deliveryInfo.street === "" && deliveryInfo.house === "" && deliveryInfo.appertment === "") return
        }
        if (methodSelected === qiwi && totalPrice) {
            const payload = {
                "currency": lang === "en" ? "USD" : "RUB",
                "amount": lang === "en" ? (totalPrice * (100 - discount) / 100) * multiplier : totalPrice * (100 - discount) / 100,
                "text": lang === "en" ? "Order no.: " + orderNumber : "Номер заказа: " + orderNumber
            }
            fetch('http://18.158.255.66:3013/qiwi', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            })
                .then(res => res.json())
                .then(data => {
                    if (data.payUrl) {
                        window.open(data.payUrl, '_blank')!.focus()
                    }
                })
        }
        if (!instantBuy) {
            cartItems.forEach((item) => {
                removeFromCart(item.id)
            })
        }
        navigate(`/order?no=${orderNumber}`);
        setSection("QPICK")
    }

    return (
        <div className={classes.container}>
            <div className={classes.checkoutWrapper}>
                <div className={classes.blocks}>
                    <CheckoutGoods lang={lang} cartItems={newCartItems} currencyMultiplier={currencyMultiplier} />
                    <CheckoutDelivery lang={lang} deliveryMethod={deliveryMethod} currencyMultiplier={currencyMultiplier} handleDeliveryInfo={handleDeliveryInfo} />
                    <CheckoutPayment lang={lang} handlePromo={handlePromo} methodSelected={methodSelected} handleChengePayment={handleChengePayment} />
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
                    <div className={classes.button} onClick={() => handleMakeOrder()}>{placeOrder}</div>
                </div>
            </div>
        </div>
    )
}
