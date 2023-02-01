import { ReactElement, ReactNode, useEffect, useState } from 'react'

import classes from '../../scss/Store.module.scss'
import store_data from '../data/Store.json'
import products_data from '../data/cases_data.json'

import { useNavigate, useSearchParams } from 'react-router-dom'
import { useMobileAndLang } from '../context/IsMobileLangContext'
import { useCardsScroll } from "../hooks/useCardsScroll";
import { useShoppingCart } from '../context/ShoppingCartContext'
import { MainStoreSection } from '../components/MainStoreSection'
import { StoreSwiper } from '../components/StoreSwiper'



export function Store() {
    const { lang } = useMobileAndLang()
    const { favItems, addRemoveItemToFav } = useShoppingCart()
    const navigate = useNavigate();
    const re_img = /_AC_S[A-Z]\d*_/g

    const [searchParam] = useSearchParams()
    const model = searchParam.get("model") || ""
    const brand = searchParam.get("brand") || ""

    const wiget_title = store_data.wiget[lang as keyof typeof store_data.wiget]
    const rubrics_titles = store_data.rubrics[lang as keyof typeof store_data.rubrics]
    const subrubrics_titles = store_data.subrubrics[lang as keyof typeof store_data.subrubrics]
    const subrubrics_titles_en = store_data.subrubrics.en
    const subrubrics_search = store_data.subrubrics_search

    const [chosenRubric, setChosenRubric] = useState([rubrics_titles, subrubrics_titles[0], subrubrics_search[0]])

    function pickRoubrick(subrubric: string): void {
        const idSubrubric = subrubrics_titles_en.indexOf(subrubric)
        setChosenRubric([rubrics_titles, subrubrics_titles[idSubrubric], subrubrics_search[idSubrubric]])
    }

    // function handleClickFav(e: React.MouseEvent<HTMLImageElement, MouseEvent>, id: string) {
    //     addRemoveItemToFav(id);
    //     if (e.target && id) {
    //         (e.target as HTMLInputElement).src = (e.target as HTMLInputElement).src.split('/').pop() == "heart_filled.svg"
    //             ? './imgs/heart.svg'
    //             : './imgs/heart_filled.svg'
    //     }
    // }

    let subrubricsWigets: Array<ReactNode> = []
    store_data.subrubrics.en.forEach((subrubric, index) => {
        subrubricsWigets.push(
            <div className={`${classes.subrubric} subrucric`} data-i={index + 1} key={index} onClick={() => pickRoubrick(subrubric)}>
                <img src={`./rubrics/cases/${subrubric}.png`} alt="widget for subrubric" className={classes.wigetSubrubric} />
                <span className={classes.title}>{subrubrics_titles[index]}</span>
            </div>
        )
    })

    // Counts rubrics on scroll i.e. "Cases"
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('rubrVisible')
                } else {
                    entry.target.classList.remove('rubrVisible')
                }
                const allVisElement = document.querySelectorAll('.rubrVisible')
                let i = 0;
                allVisElement.forEach((element) => {
                    if (element instanceof HTMLElement) {
                        if (element.dataset['i'] && +element.dataset['i'] > i) i = +element.dataset['i']
                    }
                });
                if (document.getElementById("rubricCount") !== null) {
                    document.getElementById("rubricCount")!.innerHTML = "";
                    document.getElementById("rubricCount")!.innerHTML = i + (lang === "en" ? ' out of ' : ' из ') + subrubrics_titles.length;
                }
            })
        })
        const rubricElems = document.querySelectorAll(".subrucric")
        rubricElems.forEach((el) => observer.observe(el))
    }, [])
    // function handleOpenGood(e: React.MouseEvent<HTMLDivElement, MouseEvent>, id:string) {
    //     if ((e.target as HTMLElement).classList.contains('favIco')) return
    //     let path = `/item?asin=${id}`;
    //     navigate(path);
    // }

    // Generates cards and assigns currency to them
    // useEffect(() => {
    //     async function makeCards() {
    //         async function getRub() {
    //             const rub_exchange = await fetch('https://api.exchangerate.host/latest?base=USD', {
    //                 method: "GET"
    //             })
    //                 .then(res => res.json())
    //             return rub_exchange.rates.RUB
    //         }
    //         const currencyMultiplier = lang === "en" ? 1 : await getRub()
    //         const allKeys = Object.keys(products_data[brand as keyof typeof products_data][model])
    //         let match = ''
    //         allKeys.forEach(key => {
    //             if (key.includes(chosenRubric[2].toLowerCase())) {
    //                 match = key
    //             }
    //         })


    //         let allCards = (products_data[brand as keyof typeof products_data][model][match] as []).map((card: { images_url: (string)[]; title: string, price: string, asin: string }, index: number) => {
    //             const small_link_img = String(card.images_url[0]).replace(re_img, "_AC_SX300_")
    //             const small_card_title = card.title.split(' ').slice(0, 6).join(' ')
    //             const realPrice = card.price ? card.price : '$10'
    //             const price = lang === "en" ? realPrice : (+realPrice.split("$")[1] * currencyMultiplier).toFixed(2) + "₽"
    //             return (
    //                 <div className={`${classes.card} card`} id={String(index + 1)} key={index}>
    //                     <img src={favItems.includes(card.asin) ? './imgs/heart_filled.svg' : './imgs/heart.svg'}
    //                         alt='added to favorite'
    //                         data-active={favItems.includes(card.asin) ? true : false}
    //                         id={card.asin}
    //                         className={classes.favIco}
    //                         onClick={(e) => handleClickFav(e, card.asin)}
    //                     />
    //                     <img src={small_link_img} alt="Good preview" className={classes.imgPreview} />
    //                     <div className={classes.titleAndPrice}>
    //                         <h5 className={classes.title}>{small_card_title}</h5>
    //                         <p className={classes.price}>{price}</p>
    //                     </div>
    //                 </div>
    //             )
    //         })
    //         allCards.length % 2 === 0 ? allCards.pop() : allCards
    //         setCards([])
    //         setCards(allCards)
    //         setTimeout(() => {
    //             useCardsScroll()
    //             document.querySelector('.card-carousel')?.classList.remove('fading')
    //         }, 10)
    //     }
    //     makeCards()

    // }, [chosenRubric, model])

    // useEffect(() => {
    //     async function makeCards() {
    //         async function getRub() {
    //             const rub_exchange = await fetch('https://api.exchangerate.host/latest?base=USD', {
    //                 method: "GET"
    //             })
    //                 .then(res => res.json())
    //             return rub_exchange.rates.RUB
    //         }
    //         const currencyMultiplier = lang === "en" ? 1 : await getRub()
    //         const allKeys = Object.keys(products_data[brand as keyof typeof products_data][model])
    //         let match = ''
    //         allKeys.forEach(key => {
    //             if (key.includes(chosenRubric[2].toLowerCase())) {
    //                 match = key
    //             }
    //         })

    //         let allCards = (products_data[brand as keyof typeof products_data][model][match] as []).map((card: { images_url: (string)[]; title: string, price: string, asin: string }, index: number) => {
    //             const small_link_img = String(card.images_url[0]).replace(re_img, "_AC_SX300_")
    //             const small_card_title = card.title.split(' ').slice(0, 6).join(' ')
    //             const realPrice = card.price ? card.price : '$10'
    //             const price = lang === "en" ? realPrice : (+realPrice.split("$")[1] * currencyMultiplier).toFixed(2) + "₽"
    //             const favItems1 = favItems
    //             return (
    //                 <div className={`${classes.card} card`} id={String(index + 1)} key={index} onClick={(e) => handleOpenGood(e, card.asin)}>
    //                     <img src={favItems1.includes(card.asin) ? './imgs/heart_filled.svg' : './imgs/heart.svg'}
    //                         alt='added to favorite'
    //                         data-active={favItems1.includes(card.asin) ? true : false}
    //                         id={card.asin}
    //                         className={`${classes.favIco} favIco`}
    //                         onClick={(e) => handleClickFav(e, card.asin)}
    //                     />
    //                     <img src={small_link_img} alt="Good preview" className={classes.imgPreview} />
    //                     <div className={classes.titleAndPrice}>
    //                         <h5 className={classes.title}>{small_card_title}</h5>
    //                         <p className={classes.price}>{price}</p>
    //                     </div>
    //                 </div>
    //             )
    //         })
    //         allCards.length % 2 === 0 ? allCards.pop() : allCards
    //         setCards([])
    //         setCards(allCards)
    //     }
    //     makeCards()
    // }, [chosenRubric, favItems])

    return (
        <div className={classes.storeWrapper}>
            <div className={classes.wigetWrapper}>
                <div className={classes.title}>{wiget_title} {model}</div>
                <img src={`./wigets/${brand}/${model}/wiget.png`} alt="wiget for model" className={classes.wiget} />
            </div>
            <div className={classes.rubricsWrapper}>
                <div className={classes.titleAndCount}>
                    <span className={classes.title}>{rubrics_titles}</span>
                    <span className={classes.count} id="rubricCount"></span>
                </div>
                <div className={classes.subrubricsWrapper}>
                    {subrubricsWigets}
                </div>
            </div>
            <div className={classes.subrubricChosen}>
                {/* <div className={classes.titleAndCount}>
                    <div className={classes.title}>{chosenRubric[0]} {'>'} {chosenRubric[1]}</div>
                    <div className={classes.count} id="subrubricCount"><div id='number_of_card'></div> {lang === "en" ? ' out of' : ' из'} {cards.length}</div>
                </div> */}
                <StoreSwiper data={products_data[brand as keyof typeof products_data][model][chosenRubric[2]]} header={chosenRubric[0] + ' > ' + chosenRubric[1]} />
                {/* <div className={`${classes.carouselWrapper} container`}>
                    <div className={`${classes.cardCarousel} card-carousel`}>
                        {cards}
                    </div>
                    <a href="#" className={`${classes.visuallyhidden} ${classes.cardController} card-controller`}>Carousel controller</a>
                </div> */}
            </div>
        </div>
    )
}


