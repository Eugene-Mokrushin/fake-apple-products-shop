import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import classes from '../../scss/CartItem.module.scss'
import { useMobileAndLang } from '../context/IsMobileLangContext'
import { useSelectedSection } from '../context/IsSectionSelectedContext'
import { useShoppingCart } from '../context/ShoppingCartContext'
import goods_data from '../data/individual_good.json'

type CartItemProps = {
    item: {
        id: string,
        quantity: number
    },
    multiplier: number,
    instaQuan: number | null
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

export function CartItem({ item, multiplier, instaQuan=null }: CartItemProps) {
    const { lang, isMobile } = useMobileAndLang()
    const { search } = useLocation();
    const { increaseCartQuantity, descreaseCartQuantity, removeFromCart, cartItems } = useShoppingCart()
    const { setSection } = useSelectedSection()
    const itemRef = useRef(null)
    const navigate = useNavigate()
    const parameters = new URLSearchParams(search);
    const instantBuy = parameters.get('instant');
    
    const re_img = /_AC_S[A-Z]\d*_/g
    const asin = item.id
    const product_data: GoodData = goods_data[asin as keyof typeof goods_data]
    const newPrice = product_data.price !== "" ? product_data.price : '$10'
    const itemPrice = lang === "en" ? +newPrice.split('$')[1] : +(+newPrice.split('$')[1] * multiplier).toFixed(2)
    const itemPriceDisplay = lang === "en" ? newPrice : `${itemPrice} ₽`
    const totalPrice = lang === "en" ? `$${(item.quantity * itemPrice).toFixed(2)}` : `${(item.quantity * itemPrice).toFixed(2)} ₽`
    const productTitle = product_data.title.split(' ').splice(1, 6).join(' ')
    const thumbImg = product_data.images_url[0].replace(re_img, "_AC_SX200_")
    
    function handleGoToStoreItem(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        if ((e.target as HTMLElement).classList.contains('bin')) return
        let path = `/item?asin=${asin}`;
        navigate(path);
    }

    function handleRemoveFromCart() {
        if (instantBuy) {
            navigate('/cart')
            setSection(lang === "en" ? "Cart" : "Корзина")
            return
        }
        if (itemRef.current !== null) {
            const width = (itemRef.current as HTMLElement).getBoundingClientRect().width;
            const placeholder = document.createElement("div")
            placeholder.classList.add("replacer")
            placeholder.style.height = (itemRef.current as HTMLElement).getBoundingClientRect().height + "px";
            if (cartItems[0].id === asin) {
                ((itemRef.current as HTMLElement).children[0] as HTMLElement).style.marginTop = "0px";
            }
            placeholder.style.marginTop = "20px";
            
            
            (itemRef.current as HTMLElement).parentNode?.insertBefore(placeholder, (itemRef.current as HTMLElement).nextSibling);
            (itemRef.current as HTMLElement).style.position = "absolute";
            (itemRef.current as HTMLElement).style.width = width + "px";
            (itemRef.current as HTMLElement).style.transitionDuration = '0.2s';
            (itemRef.current as HTMLElement).style.transform = 'scale(1.05)';

            setTimeout(() => {
                if (itemRef.current !== null) {
                    (itemRef.current as HTMLElement).style.transitionDuration = '0.07s';
                    (itemRef.current as HTMLElement).style.transform = 'scale(0)';
                }
            }, 200)
            setTimeout(() => {
                placeholder.style.transitionDuration = '0.4s';
                placeholder.style.height = "0px"
                placeholder.style.marginTop = "0px"
            }, 275)
            setTimeout(() => {
                placeholder.remove()
                removeFromCart(asin)
            }, 575)
        }
    }

    return (
        <div className={isMobile ? classes.wrapper : classes.wrapperDesctop} ref={itemRef}>
            <div className={classes.item}>
                <svg onClick={() => handleRemoveFromCart()} className={`${classes.bin} bin`} width="18" height="17" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12.8454 3.4H17.0842V5.1H15.3886V16.15C15.3886 16.3754 15.2993 16.5916 15.1403 16.751C14.9814 16.9104 14.7657 17 14.5409 17H2.6722C2.44736 17 2.23172 16.9104 2.07274 16.751C1.91375 16.5916 1.82443 16.3754 1.82443 16.15V5.1H0.128906V3.4H4.36772V0.85C4.36772 0.624566 4.45704 0.408365 4.61603 0.248959C4.77501 0.0895533 4.99064 0 5.21549 0H11.9976C12.2224 0 12.4381 0.0895533 12.5971 0.248959C12.756 0.408365 12.8454 0.624566 12.8454 0.85V3.4ZM13.6931 5.1H3.51996V15.3H13.6931V5.1ZM9.80527 10.2L11.3041 11.7028L10.1054 12.9047L8.60654 11.4019L7.10769 12.9047L5.90896 11.7028L7.4078 10.2L5.90896 8.6972L7.10769 7.4953L8.60654 8.9981L10.1054 7.4953L11.3041 8.6972L9.80527 10.2ZM6.06325 1.7V3.4H11.1498V1.7H6.06325Z" fill="#DF6464" />
                </svg>
                <div className={classes.imgAndTitlePrice} onClick={(e) => handleGoToStoreItem(e)}>
                    <img src={thumbImg} alt="Good thumbnail" />
                    <div className={classes.titlePrice}>
                        <div className={classes.titleItem}>{productTitle}</div>
                        <div className={classes.priceItem}>{itemPriceDisplay}</div>
                    </div>
                </div>
                <div className={classes.quantInCartAndTotal}>
                    <div className={classes.quant}>
                        <div className={classes.decrease} onClick={() => { instantBuy && instaQuan ? instaQuan <= 0 ? null : navigate(`/cart?instant=${asin}$${instaQuan - 1}`) : descreaseCartQuantity(asin) }}>-</div>
                        <div className={classes.quan}>{instantBuy ? instaQuan : item.quantity}</div>
                        <div className={classes.increase} onClick={() => { instantBuy && instaQuan ? navigate(`/cart?instant=${asin}$${instaQuan + 1}`) : increaseCartQuantity(asin) }}>+</div>
                    </div>
                    <div className={`${classes.total} `}>{totalPrice}</div>
                </div>
            </div>
        </div>
    )
}
