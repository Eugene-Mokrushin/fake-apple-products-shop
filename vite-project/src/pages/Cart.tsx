import { useMobileAndLang } from "../context/IsMobileLangContext"
import { useShoppingCart } from "../context/ShoppingCartContext"
import { Link } from "react-router-dom"
import classes from '../../scss/Cart.module.scss'
import cart_data from '../data/Cart.json'
import { CartItem } from "../components/CartItem"
import { useEffect, useState } from "react"

type ItemData = {
  id: string,
  quantity: number
}

export function Cart() {

  const { cartItems } = useShoppingCart()
  const { lang } = useMobileAndLang()
  const emptyTitle = cart_data.empty.title[lang as keyof typeof cart_data.empty.title]
  const emptySubTitle = cart_data.empty.subtitle[lang as keyof typeof cart_data.empty.subtitle]
  const goToCatalogBtn = cart_data.empty.goTo[lang as keyof typeof cart_data.empty.goTo]
  const [currencyMultiplier, setCurrencyMultiplier] = useState<number>(1)

  const allCartItems = cartItems.map((item: ItemData) => {
    return (
      <CartItem item={item} multiplier={currencyMultiplier} key={crypto.randomUUID()} />
    )
  })

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
    <div className={classes.cartWrapper}>
      {cartItems.length === 0 ? (
        <div className={classes.emptyCart}>
          <div className={classes.emptyCartTitleAndImg}>
            <img src="./imgs/cartBG.svg" alt="Cart is empty" className={classes.emptyCartBG} />
            <div className={classes.titleCartEmpty}>{emptyTitle}</div>
            <div className={classes.subTitleCartEmpty}>{emptySubTitle}</div>
          </div>
          <Link to={'/'} className={classes.goToCatalog}>
            <div>{goToCatalogBtn}</div>
          </Link>
        </div>) : (
        <div className={classes.cartItems}>
          {allCartItems}
        </div>
      )}
    </div>
  )
}
