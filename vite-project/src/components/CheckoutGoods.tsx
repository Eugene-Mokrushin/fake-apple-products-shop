import checkout_data from '../data/Checkout.json';
import goods_data from '../data/individual_good.json';
import classes from '../../scss/CheckoutGood.module.scss'
import { useMobileAndLang } from '../context/IsMobileLangContext';

type CartItemProps = {
    id: string,
    quantity: number
}
type CheckoutGoodsProps = {
    lang: string,
    cartItems: CartItemProps[],
    currencyMultiplier: number
}

type GoodData = {
    "title": string,
    "price": string,
    "rating": string,
    "feature"?: string[] | string,
    "specific_name": string[] | string,
    "specific_value": string[] | string,
    "description": string,
    "images_url": string[]
}

export function CheckoutGoods({ lang, cartItems, currencyMultiplier }: CheckoutGoodsProps) {
    const mainTitle = checkout_data.goodsTotal[lang as keyof typeof checkout_data.goodsTotal]
    const re_img = /_AC_S[A-Z]\d*_/g
    const { isMobile } = useMobileAndLang()
    const allItems = cartItems.map(item => {
        const product_data: GoodData = goods_data[item.id as keyof typeof goods_data]
        const existingPrice = product_data.price === "" ? 10 : +product_data.price.split('$')[1]
        const realPrice = lang === "en" ? existingPrice : +(existingPrice * currencyMultiplier).toFixed(2)
        return (
            <div className={classes.item} key={crypto.randomUUID()}>
                <img className={classes.miniPhoto} src={product_data.images_url[0].replace(re_img, "_AC_SX100_")} />
                <div className={classes.titleAndSubPrice}>
                    <div className={classes.title}>{item.quantity} x {product_data.title.split(' ').splice(0, 4).join(' ')}</div>
                    <div className={classes.subPrice}>{lang === "en" ? `$${realPrice}` : `${realPrice} ₽`}</div>
                </div>
                <div className={classes.totalGoodPrice}>{lang === "en" ? `$${(realPrice * item.quantity).toFixed(2)}` : `${(realPrice * item.quantity).toFixed(2)} ₽`}</div>
            </div>
        )
    })

    return (
        <div className={isMobile ? classes.goodsTotalWrapper : classes.goodsTotalWrapperDesctop}>
            <div className={classes.minTitle}>{mainTitle}</div>
            <div className={classes.allItemsWrapper}>
                {allItems}
            </div>
        </div>
    )
}
