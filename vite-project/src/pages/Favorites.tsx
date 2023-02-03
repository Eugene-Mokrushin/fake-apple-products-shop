import { ReactNode, useEffect, useState } from 'react'
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
    const routeChange = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, id: string) => {
        if ((e.target as HTMLElement).classList.contains('favIco')) return
        let path = `/item?asin=${id}`;
        navigate(path);
    }

    const { favItems, addRemoveItemToFav } = useShoppingCart()
    const { lang } = useMobileAndLang()
    const [cards, setCards] = useState<ReactNode[]>([])
    const re_img = /_AC_S[A-Z]\d*_/g

    function handleClickFav(e: React.MouseEvent<HTMLImageElement, MouseEvent>, id: string) {
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

    function handleParallax(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        const width = e.currentTarget.getBoundingClientRect().width
        const height = e.currentTarget.getBoundingClientRect().height
        if ((e.target as Element).classList.contains('favIco')) e.currentTarget.classList.add('is-out')
        if (!(e.target as Element).classList.contains('favIco')) e.currentTarget.classList.remove('is-out')
        const perspective = '800px',
            delta = 30,
            midWidth = width / 2,
            midHeight = height / 2;
        const mouseCoord = {
            x: e.nativeEvent.offsetX,
            y: e.nativeEvent.offsetY
        };
        const cursCenterX = midWidth - mouseCoord.x,
            cursCenterY = midHeight - mouseCoord.y;

        e.currentTarget.style.transform = 'perspective(' + perspective + ') rotateX(' + (cursCenterY / delta) + 'deg) rotateY(' + -(cursCenterX / delta) + 'deg) translateY(0)';
        (e.currentTarget.childNodes[1] as HTMLElement).style.transform = 'perspective(' + perspective + ') rotateX(' + -(cursCenterY / delta) + 'deg) rotateY(' + (cursCenterX / delta) + 'deg) translateZ(10px)';
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
                    <div className={`${classes.card} card`} id={String(index + 1)} key={index} onClick={(e) => routeChange(e, id)}>
                        <img src={favItems.includes(id) ? './imgs/heart_filled.svg' : './imgs/heart.svg'}
                            alt='added to favorite'
                            data-active={favItems.includes(id) ? true : false}
                            className={`${classes.favIco} favIco`}
                            onClick={(e) => handleClickFav(e, id)}
                        />
                        <div className={classes.swiperWrapper} id={id}>
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
            <div className={classes.cardsWrapper}>
                {cards}
            </div>
        </div>
    )
}
