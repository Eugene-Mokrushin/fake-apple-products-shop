import { useRef } from 'react'
import classes from '../../scss/CartItem.module.scss'
import { useMobileAndLang } from '../context/IsMobileLangContext'
import { useShoppingCart } from '../context/ShoppingCartContext'
import goods_data from '../data/individual_good.json'

type CartItemProps = {
    item: {
        id: string,
        quantity: number
    },
    multiplier: number
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

export function CartItem({ item, multiplier }: CartItemProps) {
    const { lang } = useMobileAndLang()
    const { increaseCartQuantity, descreaseCartQuantity, removeFromCart } = useShoppingCart()
    const itemRef = useRef(null)

    const re_img = /_AC_S[A-Z]\d*_/g

    const asin = item.id
    const product_data: GoodData = goods_data[asin as keyof typeof goods_data]
    const itemPrice = lang === "en" ? +product_data.price.split('$')[1] : +(+product_data.price.split('$')[1] * multiplier).toFixed(2)
    const itemPriceDisplay = lang === "en" ? product_data.price : `${itemPrice} ₽`
    const totalPrice = lang === "en" ? `$${(item.quantity * itemPrice).toFixed(2)}` : `${(item.quantity * itemPrice).toFixed(2)} ₽`
    const productTitle = product_data.title.split(' ').splice(1, 6).join(' ')
    const thumbImg = product_data.images_url[0].replace(re_img, "_AC_SX200_")

    function handleRemoveFromCart() {
        removeFromCart(asin)
    }

    return (
        <div className={classes.item} ref={itemRef}>
            <svg onClick={() => handleRemoveFromCart()} className={classes.bin} width="18" height="17" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.8454 3.4H17.0842V5.1H15.3886V16.15C15.3886 16.3754 15.2993 16.5916 15.1403 16.751C14.9814 16.9104 14.7657 17 14.5409 17H2.6722C2.44736 17 2.23172 16.9104 2.07274 16.751C1.91375 16.5916 1.82443 16.3754 1.82443 16.15V5.1H0.128906V3.4H4.36772V0.85C4.36772 0.624566 4.45704 0.408365 4.61603 0.248959C4.77501 0.0895533 4.99064 0 5.21549 0H11.9976C12.2224 0 12.4381 0.0895533 12.5971 0.248959C12.756 0.408365 12.8454 0.624566 12.8454 0.85V3.4ZM13.6931 5.1H3.51996V15.3H13.6931V5.1ZM9.80527 10.2L11.3041 11.7028L10.1054 12.9047L8.60654 11.4019L7.10769 12.9047L5.90896 11.7028L7.4078 10.2L5.90896 8.6972L7.10769 7.4953L8.60654 8.9981L10.1054 7.4953L11.3041 8.6972L9.80527 10.2ZM6.06325 1.7V3.4H11.1498V1.7H6.06325Z" fill="#DF6464" />
            </svg>
            <div className={classes.imgAndTitlePrice}>
                <img src={thumbImg} alt="Good thumbnail" />
                <div className={classes.titlePrice}>
                    <div className={classes.titleItem}>{productTitle}</div>
                    <div className={classes.priceItem}>{itemPriceDisplay}</div>
                </div>
            </div>
            <div className={classes.quantInCartAndTotal}>
                <div className={classes.quant}>
                    <div className={classes.decrease} onClick={() => descreaseCartQuantity(asin)}>-</div>
                    <div className={classes.quan}>{item.quantity}</div>
                    <div className={classes.increase} onClick={() => increaseCartQuantity(asin)}>+</div>
                </div>
                <div className={classes.total}>{totalPrice}</div>
            </div>
        </div>
    )
}
