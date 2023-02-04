import { useNavigate, useSearchParams } from 'react-router-dom';
import { useMobileAndLang } from '../context/IsMobileLangContext';
import { useShoppingCart } from '../context/ShoppingCartContext';
import main_data from '../data/StoreItem.json';
import feedback_data from '../data/feedbacks.json'
import goods_data from '../data/individual_good.json';
import classes from '../../scss/StoreItem.module.scss';

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper";
import "swiper/css";
import "swiper/css/pagination";
import { ImgHTMLAttributes, ReactNode, useEffect, useRef, useState } from 'react';
import { useSelectedSection } from '../context/IsSectionSelectedContext';
import ImageMagnifier from '../utilities/magnifier';

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

export function StoreItem() {
    const re_img = /_AC_S[A-Z]\d*_/g
    const navigate = useNavigate()
    const { lang, isMobile } = useMobileAndLang()
    const { setSection } = useSelectedSection()
    const { favItems, addRemoveItemToFav, increaseCartQuantity } = useShoppingCart()
    const [searchParam] = useSearchParams()
    const asin = searchParam.get("asin") || ""
    const cartNotif = useRef<HTMLDivElement | null>(null)

    const product_cat = main_data.good.case[lang as keyof typeof main_data.good.case]
    const buy_action = main_data.buy_action[lang as keyof typeof main_data.buy_action]
    const dscr_title = main_data.dscr[lang as keyof typeof main_data.dscr]
    const feedbacks_title = main_data.feedback[lang as keyof typeof main_data.feedback]
    const buyNow_btn = main_data.buy_now[lang as keyof typeof main_data.buy_now]
    const added_to_cart = main_data.added[lang as keyof typeof main_data.added]
    const instaBuy = main_data.insta_buy[lang as keyof typeof main_data.insta_buy]
    const whatsAppMessage = lang === "en" ? "https://api.whatsapp.com/send?phone=79150759312&text=" + "Hello!\n" + " I want to know more about " + asin + "." + "\n Can you tell me about it?" : "https://api.whatsapp.com/send?phone=79104917900&text=" + "Здравствуйте!\n" + " Я хочу узнать о " + asin + "." + "\n Можете ли вы рассказать мне об этом продукте?"

    const product_data: GoodData = goods_data[asin as keyof typeof goods_data]
    const [price, setPrice] = useState(product_data.price !== "" ? product_data.price : '$10')
    const [dscrState, setDscrSteta] = useState(isMobile ? false : true)
    const [feedbackState, setFeedbackState] = useState(false)
    const [feedbacks, setFeedbacks] = useState<ReactNode[]>([])
    const [score, setScore] = useState<number>(0)
    const [fullImg, setFullImg] = useState(false)
    const fullImgRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        async function changePriceCurrency() {
            if (lang === 'en') return

            async function getRub() {
                const rub_exchange = await fetch('https://api.exchangerate.host/latest?base=USD', {
                    method: "GET"
                })
                    .then(res => res.json())
                return rub_exchange.rates.RUB
            }
            const multiplier = await getRub()
            const newPrice = product_data.price !== "" ? product_data.price : '$10'
            setPrice((+newPrice.split("$")[1] * multiplier).toFixed(2) + "₽")
        }
        changePriceCurrency()
    }, [])

    useEffect(() => {
        let allFeedbacks = []
        let allScores: number[] = []
        for (let index = 0; index < Math.random() * (10 - 1) + 1; index++) {
            const personData = feedback_data[Math.floor(Math.random() * feedback_data.length)]
            allScores.push(+personData.score)
            allFeedbacks.push(
                <div className={classes.feedback} key={crypto.randomUUID()}>
                    <div className={classes.feedbackDcr}>
                        {personData.feedback}
                    </div>
                    <div className={classes.scoreAndName}>
                        <div className={classes.personData}>
                            {personData.name}
                        </div>
                        <div className={classes.score}>
                            {personData.score} / 5
                        </div>
                    </div>
                </div>
            )
        }
        setFeedbacks(allFeedbacks)
        let sumScores: number = 0
        allScores.forEach(score => sumScores += score)
        const finalScore = +(sumScores / allFeedbacks.length).toFixed(1)
        setScore(finalScore)
    }, [])

    function handleEnlargeImg(img: string) {
        if (fullImgRef.current && fullImgRef.current.children) {
            ((fullImgRef.current.children as HTMLCollection)[0] as HTMLImageElement).src = img;
            ((fullImgRef.current.children as HTMLCollection)[1] as HTMLDivElement).style.backgroundImage = `url(${img})`
            setFullImg(true)
        }
    }

    let bigImages = product_data.images_url.map((img: string, index: number) => {
        if (isMobile) {
            if (img == "null") return
            return (
                <SwiperSlide key={crypto.randomUUID()}>
                    <img id={`${index + 1}`} src={String(img).replace(re_img, "_AC_SX1000_")} className={classes.bigImg} alt="Good image" />
                </SwiperSlide>
            )
        } else {
            return (
                <img key={crypto.randomUUID()} id={`${index + 1}`} onClick={() => handleEnlargeImg(img)} src={String(img).replace(re_img, "_AC_SX500_")} className={classes.bigImg} alt="Good image" />
            )
        }
    })
    const smallImages = product_data.images_url.map((img: string, index: number) => {
        if (!isMobile) return
        if (img == "null") return
        return (
            <div
                key={crypto.randomUUID()}
                id={`${index + 1}`}
                style={{ background: `url(${String(img).replace(re_img, "_AC_SX100_")})` }}
                className={`${classes.smallImg} smallImg`}
                onClick={(e) => selectImg(e)}
            />
        )
    })
    const featuresTable = product_data.specific_name.map((feature: string, index: number) => {
        return (
            <div className={classes.feature} key={crypto.randomUUID()}>
                <div className={classes.name}>{feature.split(' ').splice(0, 2).join(' ')}:</div>
                <div className={classes.value}>{product_data.specific_value[index]}</div>
            </div>
        )
    })
    const additionalFeatures = product_data.feature.map((feature: string) => {
        return (
            <div className={classes.addFeature} key={crypto.randomUUID()}>
                {feature}
            </div>
        )
    })

    function highlightDemoImg(): void {
        const selectedId = document.querySelector('.swiper-slide-active')?.children[0].id || -1
        const smallImagesWrapper = document.querySelector('#smallImagesWrapper')
        smallImagesWrapper?.querySelectorAll('.smallImg').forEach(el => {
            if (+el.id !== +selectedId) {
                el.classList.remove('selected')
            } else {
                el.classList.add('selected')
                el.scrollIntoView({ behavior: "smooth", block: 'nearest', inline: 'nearest' })
            }
        })
    }

    function selectImg(e: React.MouseEvent<HTMLDivElement>): void {
        const idClicked = +(e.target as HTMLElement).id - 1
        {/* 
        // @ts-ignore */}
        const swiper = document.querySelector('.swiper')?.swiper;
        if (swiper) swiper.slideTo(idClicked)
    }

    function handleClickFav(e: React.MouseEvent<HTMLDivElement>, id: string) {
        addRemoveItemToFav(id);
        if (e.target && id) {
            (e.target as HTMLInputElement).src = (e.target as HTMLInputElement).src.split('/').pop() == "heart_filled.svg"
                ? './imgs/heart.svg'
                : './imgs/heart_filled.svg'
        }
    }

    let timeout: NodeJS.Timeout
    function revealPaginator() {
        clearTimeout(timeout)
        timeout = setTimeout(() => {
            document.querySelector('.swiper-pagination')?.classList.remove('visiblePaginator')
            document.querySelectorAll('.visiblePaginator').forEach(el => el.classList.remove('visiblePaginator'))
        }, 2000)
        document.querySelector('.swiper-pagination')?.classList.add('visiblePaginator')
    }

    function handleDescription() {
        setDscrSteta(prev => !prev)
        if (!isMobile) setFeedbackState(false)
    }

    function handleFeedback() {
        setFeedbackState(prev => !prev)
        if (!isMobile) setDscrSteta(false)
    }

    function handleAddToCart() {
        increaseCartQuantity(asin)
        if (cartNotif.current !== null) {
            if (isMobile) cartNotif.current.style.transform = "translateY(0px)"
            else cartNotif.current.style.transform = "translateX(0px)"
        }
        setTimeout(() => {
            if (cartNotif.current !== null) {
                if (isMobile) cartNotif.current.style.transform = "translateY(-200px)"
                else cartNotif.current.style.transform = "translateX(600px)"
            }
        }, 2000)
    }

    return (
        <div className={isMobile ? classes.detailedGoodWrapper : classes.detailedGoodWrapperDesctop}>
            {!isMobile &&
                <div className={`${classes.fullImageWrapper} ${fullImg ? classes.fullImageShown : ""}`} onClick={() => setFullImg(false)}>
                    <ImageMagnifier ref={fullImgRef} height={"100%"} />
                </div>
            }
            <div className={classes.addedToCart} ref={cartNotif}>{added_to_cart}</div>
            <div className={classes.title}>{product_cat}</div>
            <div className={classes.imagesAndTitleWrapper}>
                <img src={favItems.includes(asin) ? './imgs/heart_filled.svg' : './imgs/heart.svg'}
                    alt='added to favorite'
                    data-active={favItems.includes(asin) ? true : false}
                    className={`${classes.favIco} favIco`}
                    onClick={(e) => handleClickFav(e, asin)}
                />
                <div className={classes.mainImgs}>
                    {isMobile ?
                        <Swiper onSlideChangeTransitionEnd={() => { highlightDemoImg(); revealPaginator() }} id="swiper" pagination={true} modules={[Pagination]} spaceBetween={5} className={`${classes.allImagesWrapper} mySwiper allImagesWrapper`}>
                            {bigImages}
                        </Swiper>
                        :
                        bigImages.splice(0, 8)
                    }
                </div>
                <div className={classes.titleAndPrice}>
                    <div className={classes.goodTitle}>{isMobile ? product_data.title.split(' ').slice(0, 3).join(' ') : product_data.title.split(' ').slice(0, 6).join(' ')}</div>
                    <div className={classes.price}>{price}</div>
                </div>
                {isMobile &&
                    <div className={classes.smallImages} id="smallImagesWrapper">
                        {smallImages}
                    </div>
                }
            </div>
            <div className={classes.addInfo}>
                <div className={classes.descriptionAndFeaturesWrapper}>
                    <div className={classes.titleDescr} id="titleDescr" onClick={() => handleDescription()}>
                        {dscr_title}
                        <svg className={!dscrState ? classes.tickDown : classes.tickUp} width="20" height="10" viewBox="0 0 20 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9.95531 6.36418L17.0767 -8.2554e-08L19.111 1.81797L9.95531 10.0001L0.799593 1.81797L2.83388 -6.60549e-07L9.95531 6.36418Z" fill="#101010" />
                        </svg>
                    </div>
                    <div className={`${!dscrState ? classes.descrInfoClosed : classes.descrInfoOpened} ${classes.descrInfo}`}>
                        <div className={classes.featuresTableWrapper}>
                            {featuresTable}
                        </div>
                        <div className={classes.addFeatures}>
                            {additionalFeatures}
                        </div>
                    </div>
                </div>
                <div className={classes.feedbacksWrapper}>
                    <div className={classes.titleFeedback} onClick={() => handleFeedback()}>
                        {feedbacks_title}
                        <div className={classes.scoreAndToggleWrapper}>
                            <svg width="26" height="23" viewBox="0 0 26 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M13.2756 17.9555L5.46751 22.3136L7.59022 14.1801L0.642914 8.7415L9.76208 8.07382L13.2756 0.353027L16.7891 8.07382L25.9096 8.7415L18.961 14.1801L21.0837 22.3136L13.2756 17.9555Z" fill="#FFCE7F" />
                            </svg>
                            <div className={classes.score}>{score}</div>
                            <svg className={!feedbackState ? classes.tickDown : classes.tickUp} width="20" height="10" viewBox="0 0 20 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M9.95531 6.36418L17.0767 -8.2554e-08L19.111 1.81797L9.95531 10.0001L0.799593 1.81797L2.83388 -6.60549e-07L9.95531 6.36418Z" fill="#101010" />
                            </svg>
                        </div>
                    </div>
                    <div className={`${!feedbackState ? classes.feedbacksClosed : classes.feedbacksOpened} ${classes.feedbacks}`}>
                        {feedbacks}
                    </div>
                </div>
            </div>
            <div className={classes.cta}>
                <div className={classes.addToCart} onClick={() => handleAddToCart()}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3.72418 5.2614L0 1.59864L1.62495 0L5.34799 3.66389H22.8515C23.0305 3.66388 23.2071 3.70503 23.367 3.78406C23.527 3.86309 23.6659 3.97782 23.7728 4.11907C23.8797 4.26033 23.9515 4.42422 23.9826 4.59764C24.0136 4.77107 24.0031 4.94923 23.9517 5.11792L21.1956 14.1562C21.1247 14.389 20.9793 14.5931 20.7812 14.7383C20.583 14.8834 20.3425 14.9617 20.0954 14.9617H6.02094V17.2213H18.6531V19.4809H4.87256C4.56799 19.4809 4.2759 19.3618 4.06054 19.15C3.84517 18.9381 3.72418 18.6507 3.72418 18.3511V5.2614ZM6.02094 5.92346V12.7022H19.241L21.3081 5.92346H6.02094ZM5.44675 24C4.9899 24 4.55176 23.8215 4.22871 23.5036C3.90567 23.1858 3.72418 22.7548 3.72418 22.3053C3.72418 21.8559 3.90567 21.4248 4.22871 21.107C4.55176 20.7892 4.9899 20.6106 5.44675 20.6106C5.9036 20.6106 6.34174 20.7892 6.66479 21.107C6.98783 21.4248 7.16931 21.8559 7.16931 22.3053C7.16931 22.7548 6.98783 23.1858 6.66479 23.5036C6.34174 23.8215 5.9036 24 5.44675 24ZM19.2273 24C18.7704 24 18.3323 23.8215 18.0092 23.5036C17.6862 23.1858 17.5047 22.7548 17.5047 22.3053C17.5047 21.8559 17.6862 21.4248 18.0092 21.107C18.3323 20.7892 18.7704 20.6106 19.2273 20.6106C19.6841 20.6106 20.1223 20.7892 20.4453 21.107C20.7683 21.4248 20.9498 21.8559 20.9498 22.3053C20.9498 22.7548 20.7683 23.1858 20.4453 23.5036C20.1223 23.8215 19.6841 24 19.2273 24Z" fill="#fff" />
                    </svg>
                    {!isMobile && <span>{buy_action}</span>}
                </div>
                <div className={classes.buyNow} onClick={() => { setSection(instaBuy); navigate(`/cart?instant=${asin}$1`) }}>{buyNow_btn}</div>
                {isMobile && <div className={classes.whatsApp} onClick={() => { window.open(whatsAppMessage, '_blank')!.focus() }}>
                    <img src="./imgs/WhatsAppItem.png" alt="WhatsApp Logo" />
                </div>
                }
            </div>
        </div>
    )
}
