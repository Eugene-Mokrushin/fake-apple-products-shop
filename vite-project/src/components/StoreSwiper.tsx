import { useMobileAndLang } from "../context/IsMobileLangContext"
import { Swiper, SwiperSlide } from 'swiper/react';
import classes from '../../scss/MainStoreSection.module.scss'
import { useEffect, useRef, useState } from "react";
import { useShoppingCart } from "../context/ShoppingCartContext";
import { useNavigate } from "react-router-dom";
import React from "react";


type GoodData = {
    "asin": string
    "title": string,
    "price": string,
    "rating": string,
    "review": string,
    "feature": string[],
    "specific_name": string[] | string,
    "specific_value": string[] | string,
    "description": string,
    "images_url": string[]
}

type StoreSwiperProps = {
    data: GoodData[],
    header: string
}


export function StoreSwiper({ data, header }: StoreSwiperProps) {
    const navigate = useNavigate()
    const { lang, isMobile } = useMobileAndLang()
    const { favItems, addRemoveItemToFav } = useShoppingCart()
    const counterRef = useRef<HTMLDivElement>(null)
    const swiperRef = useRef<HTMLDivElement>(null)
    const re_img = /_AC_S[A-Z]\d*_/g
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

    function handleClickFav(e: React.MouseEvent<HTMLImageElement, MouseEvent>, id: string) {
        addRemoveItemToFav(id);
        if (e.target && id) {
            (e.target as HTMLInputElement).src = (e.target as HTMLInputElement).src.split('/').pop() == "heart_filled.svg"
                ? './imgs/heart.svg'
                : './imgs/heart_filled.svg'
        }
    }

    function handleOpenGood(e: React.MouseEvent<HTMLDivElement, MouseEvent>, id: string) {
        if ((e.target as HTMLElement).classList.contains('favIco')) return
        let path = `/item?asin=${id}`;
        navigate(path);
    }


    const generatedCards = data.map((item, index) => {
        const small_link_img = String(item.images_url[0]).replace(re_img, "_AC_SX300_")
        const small_card_title = item.title.split(' ').slice(0, 5).join(' ')
        const realPrice = item.price ? item.price : '$10'
        const price = lang === "en" ? realPrice : (+realPrice.split("$")[1] * currencyMultiplier).toFixed(2) + "₽"
        const favItems1 = favItems
        return (
            <SwiperSlide key={crypto.randomUUID()}>
                <div className={`${classes.card} card`} id={String(index + 1)} key={index} onClick={(e) => handleOpenGood(e, item.asin)}>
                    <img src={favItems1.includes(item.asin) ? './imgs/heart_filled.svg' : './imgs/heart.svg'}
                        alt='added to favorite'
                        data-active={favItems1.includes(item.asin) ? true : false}
                        id={item.asin}
                        className={`${classes.favIco} favIco`}
                        onClick={(e) => handleClickFav(e, item.asin)}
                    />
                    <img src={small_link_img} alt="Good preview" className={classes.imgPreview} />
                    <div className={classes.titleAndPrice}>
                        <h5 className={classes.title}>{small_card_title}</h5>
                        <p className={classes.price}>{price}</p>
                    </div>
                </div>
            </SwiperSlide>
        )
    }).filter(val => val !== undefined)

    if (counterRef.current) {
        counterRef.current.innerHTML = `${1}${lang === "en" ? ' out of ' : ' из '}${data.length}`
    }


    function handleCounter(e: { realIndex: string | number }) {
        if (!counterRef.current) return
        counterRef.current.innerHTML = `${+e.realIndex + 1}${lang === "en" ? ' out of ' : ' из '}${data.length}`
    }
    function handleLoad(e: { realIndex: string | number }) {
        if (!counterRef.current) return
        counterRef.current.innerHTML = `${1}${lang === "en" ? ' out of ' : ' из '}${data.length}`
        {/* 
        // @ts-ignore */}
        const swiper = document.querySelector('.swiper')?.swiper;
        if (swiper) swiper.slideTo(0, 1500)
    }


    return (
        <div className={classes.sectionWrapper}>
            <div className={classes.titleSectionAndCounter}>
                <div className={`${classes.sectionTitle} ${classes.storeTitle}`}>{header}</div>
                <div className={classes.counter} ref={counterRef}>1</div>
            </div>
            <div className={classes.cardsWrapper} ref={swiperRef}>
                <Swiper
                    spaceBetween={20}
                    onSlideChangeTransitionEnd={(e) => handleCounter(e)}
                    centeredSlides={true}
                    onUpdate={(e) => handleLoad(e)}
                    slidesPerView={"auto"}
                    loop={true}
                    className={`${classes.mySwiperSection} ${isMobile ? "mobileSwiperSection" : ""} mySwiperSection`}
                >

                    {generatedCards ? generatedCards : <SwiperSlide>Loading ...</SwiperSlide>}
                </Swiper>
            </div>
        </div>
    )
}
