import { MouseEvent, ReactNode, useEffect, useState } from 'react'
import classes from '../../scss/Favorites.module.scss'
import { useMobileAndLang } from '../context/IsMobileLangContext'
import { useShoppingCart } from '../context/ShoppingCartContext'
import { useNavigate } from "react-router-dom";
import goods from '../data/individual_good.json'

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper";

export function Favorites() {
    const navigate = useNavigate();
    const routeChange = (e: MouseEvent<HTMLDivElement, MouseEvent>, id: string) => {
        if ((e.target as HTMLElement).classList.contains('favIco')) return
        let path = `/item?asin=${id}`;
        navigate(path);
    }
    
    const { favItems, addRemoveItemToFav } = useShoppingCart()
    const { lang, isMobile } = useMobileAndLang()
    const [cards, setCards] = useState<ReactNode[]>([])
    const re_img = /_AC_S[A-Z]\d*_/g
    const nothing = lang === "en" ? "There are no favorite items :(" : "Нету избранных товаров :("

    function handleClickFav(e: MouseEvent, id: string) {
        addRemoveItemToFav(id);
        if (e.target && id) {
            (e.target as HTMLInputElement).src = (e.target as HTMLInputElement).src.split('/').pop() == "heart_filled.svg"
                ? './imgs/heart.svg'
                : './imgs/heart_filled.svg'
        }
    }

    let timeout: NodeJS.Timeout
    function revealPaginator(id: string) {
        clearTimeout(timeout)
        timeout = setTimeout(() => {
            document.querySelector(`#${id}`)?.querySelector('.swiper-pagination')?.classList.remove('visiblePaginator')
            document.querySelectorAll('.visiblePaginator').forEach(el => el.classList.remove('visiblePaginator'))
        }, 2000)
        document.querySelector(`#${id}`)?.querySelector('.swiper-pagination')?.classList.add('visiblePaginator')
    }

    function handleDemoHover(e: React.MouseEvent<HTMLDivElement, MouseEvent>, index: number) {
        if (e.target) {
            {/* 
        // @ts-ignore */}
            const swiper = e.target.parentNode.nextElementSibling?.swiper
            swiper.slideTo(index, 1000)
        }
    }

    useEffect(() => {
        async function createCards() {
            async function getRub() {
                const rub_exchange = await fetch('https://api.exchangerate.host/latest?base=USD', {
                    method: "GET"
                })
                    .then(res => res.json())
                return rub_exchange.rates.RUB
            }
            const currencyMultiplier = lang === "en" ? 1 : await getRub()

            const cards_data = favItems.map((id: string, index: number) => {
                const card_data = goods[id as keyof typeof goods]
                const small_card_title = (card_data['title'] as string).split(' ').slice(0, 4).join(' ')
                const realPrice = card_data['price'] ? card_data['price'] : '$10'
                const price = lang === "en" ? realPrice : (+realPrice.split("$")[1] * currencyMultiplier).toFixed(2) + "₽"

                const allImages = (card_data["images_url"] as []).map((image: string, index) => {
                    return (
                        <SwiperSlide key={crypto.randomUUID()}>
                            <img
                                src={String(image).replace(re_img, "_AC_SX300_")}
                                alt="Good preview"
                                className={`${classes.imgPreview} imgPreview ${id}`}
                            />
                        </SwiperSlide>
                    )
                })
                return (
                    /* @ts-ignore */
                    <div className={`${classes.card} card`} id={String(index + 1)} key={index} onClick={(e) => routeChange(e, id)}>
                        <img src={favItems.includes(id) ? './imgs/heart_filled.svg' : './imgs/heart.svg'}
                            alt='added to favorite'
                            data-active={favItems.includes(id) ? true : false}
                            className={`${classes.favIco} favIco`}
                            onClick={(e) => handleClickFav(e, id)}
                        />
                        <div className={classes.swiperWrapper} id={id}>
                            {!isMobile && <div className={classes.hoverers}>
                                {allImages.map((img, index) => <div
                                    key={crypto.randomUUID()}
                                    className={classes.slide}
                                    style={{ width: 100 / allImages.length + "%", left: 100 / allImages.length * index + "%" }}
                                    /* @ts-ignore */
                                    onMouseOver={(e) => { handleDemoHover(e, index) }}
                                >
                                </div>)}
                            </div>}
                            <Swiper onBeforeSlideChangeStart={() => { revealPaginator(id) }} pagination={true} modules={[Pagination]} spaceBetween={1} className={`${classes.allImagesWrapper} mySwiper`}>
                                {allImages}
                            </Swiper>
                        </div>
                        <div className={classes.titleAndPrice}>
                            <h5 className={classes.title}>{small_card_title}</h5>
                            <p className={classes.price}>{price}</p>
                        </div>
                    </div>
                )
            })
            setCards(cards_data)
        }
        createCards()

    }, [])

    return (
        <div className={classes.favWrapper}>
            {favItems.length === 0 &&
                <div className={classes.nothing}>
                    {nothing}
                </div>
            }
            <div className={classes.cardsWrapper}>
                {cards}
            </div>
        </div>
    )
}
