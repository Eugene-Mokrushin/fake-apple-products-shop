import { ReactElement, ReactNode, useEffect, useState } from 'react'

import classes from '../../scss/Store.module.scss'
import store_data from '../data/Store.json'
import products_data from '../data/cases_data.json'

import { useSearchParams } from 'react-router-dom'
import { useMobileAndLang } from '../context/IsMobileLangContext'
import { useCardsScroll } from "../hooks/useCardsScroll";

export function Store() {
    const { lang } = useMobileAndLang()

    const re_img = /_AC_S[A-Z]\d*_/g

    const [searchParam] = useSearchParams()
    const model = searchParam.get("model") || ""
    const brand = searchParam.get("brand") || ""

    const wiget_title = store_data.wiget[lang as keyof typeof store_data.wiget]
    const rubrics_titles = store_data.rubrics[lang as keyof typeof store_data.rubrics]
    const subrubrics_titles = store_data.subrubrics[lang as keyof typeof store_data.subrubrics]

    const [chosenRubric, setChosenRubric] = useState([rubrics_titles, subrubrics_titles[0]])
    let match: string = ""
    const allKeys = Object.keys(products_data[brand as keyof typeof products_data][model])
    allKeys.forEach(key => {
        if (key.includes(chosenRubric[1].toLowerCase())) {
            match = key
        }
    })
    let allCards = (products_data[brand as keyof typeof products_data][model][match] as []).map((card: { images_url: (string)[]; title: string }, index: number) => {
        const small_link_img = String(card.images_url[0]).replace(re_img, "_AC_SX300_")
        return (
            <div className={`${classes.card} card`} id={String(index + 1)} key={index}>
                <img src={small_link_img} alt="Good preview" className={classes.imgPreview} />
                <h5 className={classes.title}>{card.title}</h5>
            </div>
        )
    })
    allCards.length % 2 === 0 ? allCards.pop() : allCards
    const [cards, setCards] = useState<ReactElement[]>(allCards)

    function pickRoubrick(subrubric: string): void {
        setChosenRubric([rubrics_titles, subrubric])
    }
    let subrubricsWigets: Array<ReactNode> = []
    store_data.subrubrics.en.forEach((subrubric, index) => {
        subrubricsWigets.push(
            <div className={classes.subrubric} key={index} onClick={() => pickRoubrick(subrubric)}>
                <img src={`./rubrics/cases/${subrubric}.png`} alt="widget for subrubric" className={classes.wigetSubrubric} />
                <span className={classes.title}>{subrubrics_titles[index]}</span>
            </div>
        )
    })

    useEffect(() => {

        const allKeys = Object.keys(products_data[brand as keyof typeof products_data][model])
        let match = ''
        allKeys.forEach(key => {
            if (key.includes(chosenRubric[1].toLowerCase())) {
                match = key
            }
        })
        let allCards = (products_data[brand as keyof typeof products_data][model][match] as []).map((card: { images_url: (string)[]; title: string }, index: number) => {
            const small_link_img = String(card.images_url[0]).replace(re_img, "_AC_SX300_")
            return (
                <div className={`${classes.card} card`} id={String(index + 1)} key={index}>
                    <img src={small_link_img} alt="Good preview" className={classes.imgPreview} />
                    <h5 className={classes.title}>{card.title}</h5>
                </div>
            )
        })
        allCards.length % 2 === 0 ? allCards.pop() : allCards
        // var el = document.querySelector('.card-carousel'),
        //     elClone = el.cloneNode(true);

        // el.parentNode.replaceChild(elClone, el);
        
        setCards([])
        setCards(allCards)
        // document.querySelector('.card-carousel')?.classList.add('fading')
        setTimeout(() => {
            useCardsScroll()
            document.querySelector('.card-carousel')?.classList.remove('fading')
        }, 10)
        // useCardsScroll()
    }, [chosenRubric, model])



    return (
        <div className={classes.storeWrapper}>
            <div className={classes.wigetWrapper}>
                <div className={classes.title}>{wiget_title} {model}</div>
                <img src={`./wigets/${brand}/${model}/wiget.png`} alt="wiget for model" className={classes.wiget} />
            </div>
            <div className={classes.rubricsWrapper}>
                <div className={classes.titleAndCount}>
                    <span className={classes.title}>{rubrics_titles}</span>
                    <span className={classes.count}> {lang === "en" ? 'out of' : 'из'} {subrubrics_titles.length}</span>
                </div>
                <div className={classes.subrubricsWrapper}>
                    {subrubricsWigets}
                </div>
            </div>
            <div className={classes.subrubricChosen}>
                <div className={classes.titleAndCount}>
                    <div className={classes.title}>{chosenRubric[0]} {'>'} {chosenRubric[1]}</div>
                    {/* <div className={classes.count}> {lang === "en" ? 'out of' : 'из'} {cards.length}</div> */}
                </div>
                <div className={`${classes.carouselWrapper} container`}>
                    <div className={`${classes.cardCarousel} card-carousel`}>
                        {/* {cards.length % 2 === 0 ? cards.pop() : cards} */}
                        {cards}
                        {/* <div className={`${classes.card} card`} id="1">
                            <div className="image-container"></div>
                            <p>1 Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sapiente, explicabo!</p>
                        </div>
                        <div className={`${classes.card} card`} id="2">
                            <div className="image-container"></div>
                            <p>2 Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sapiente, explicabo!</p>
                        </div>
                        <div className={`${classes.card} card`} id="3">
                            <div className="image-container"></div>
                            <p>3 Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sapiente, explicabo!</p>
                        </div>
                        <div className={`${classes.card} card`} id="4">
                            <div className="image-container"></div>
                            <p>4 Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sapiente, explicabo!</p>
                        </div>
                        <div className={`${classes.card} card`} id="5">
                            <div className="image-container"></div>
                            <p>5 Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sapiente, explicabo!</p>
                        </div>
                        <div className={`${classes.card} card`} id="6">
                            <div className="image-container"></div>
                            <p>5 Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sapiente, explicabo!</p>
                        </div>
                        <div className={`${classes.card} card`} id="7">
                            <div className="image-container"></div>
                            <p>5 Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sapiente, explicabo!</p>
                        </div>
                        <div className={`${classes.card} card`} id="8">
                            <div className="image-container"></div>
                            <p>5 Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sapiente, explicabo!</p>
                        </div>
                        <div className={`${classes.card} card`} id="9">
                            <div className="image-container"></div>
                            <p>5 Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sapiente, explicabo!</p>
                        </div>
                        <div className={`${classes.card} card`} id="10">
                            <div className="image-container"></div>
                            <p>5 Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sapiente, explicabo!</p>
                        </div>
                        <div className={`${classes.card} card`} id="11">
                            <div className="image-container"></div>
                            <p>5 Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sapiente, explicabo!</p>
                        </div>
                        <div className={`${classes.card} card`} id="11">
                            <div className="image-container"></div>
                            <p>5 Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sapiente, explicabo!</p>
                        </div>
                        <div className={`${classes.card} card`} id="11">
                            <div className="image-container"></div>
                            <p>5 Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sapiente, explicabo!</p>
                        </div> */}
                    </div>
                    <a href="#" className={`${classes.visuallyhidden} ${classes.cardController} card-controller`}>Carousel controller</a>
                </div>
            </div>
        </div>
    )
}


