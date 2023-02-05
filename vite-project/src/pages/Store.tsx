import { ReactNode, useEffect, useState } from 'react'

import classes from '../../scss/Store.module.scss'
import store_data from '../data/Store.json'
import products_data from '../data/cases_data.json'

import { useSearchParams } from 'react-router-dom'
import { useMobileAndLang } from '../context/IsMobileLangContext'
import { MainStoreSection } from '../components/MainStoreSection'
import { StoreSwiper } from '../components/StoreSwiper'



export function Store() {
    const { lang, isMobile } = useMobileAndLang()

    const [searchParam] = useSearchParams()
    const model = searchParam.get("model") || ""
    const brand = searchParam.get("brand") || ""
    const wiget_title = store_data.wiget[lang as keyof typeof store_data.wiget]
    const rubrics_titles = store_data.rubrics[lang as keyof typeof store_data.rubrics]
    const subrubrics_titles = store_data.subrubrics[lang as keyof typeof store_data.subrubrics]
    const subrubrics_titles_en = store_data.subrubrics.en
    const subrubrics_search = store_data.subrubrics_search
    const [chosenRubric, setChosenRubric] = useState([rubrics_titles, subrubrics_titles[0], subrubrics_search[0]])
    const [flag, setFlag] = useState(false)

    function pickRoubrick(subrubric: string): void {
        const idSubrubric = subrubrics_titles_en.indexOf(subrubric)
        setChosenRubric([rubrics_titles, subrubrics_titles[idSubrubric], subrubrics_search[idSubrubric]])
        setFlag(prev => !prev)
    }

    let subrubricsWigets: Array<ReactNode> = []
    store_data.subrubrics.en.forEach((subrubric, index) => {
        subrubricsWigets.push(
            <div className={`${classes.subrubric} subrucric`} data-i={index + 1} key={index} onClick={() => { pickRoubrick(subrubric) }}>
                <img src={`./rubrics/cases/${subrubric}.png`} alt="widget for subrubric" className={classes.wigetSubrubric} />
                <span className={classes.title}>{subrubrics_titles[index]}</span>
            </div>
        )
    })
    useEffect(() => {
        setFlag(prev => !prev)
    }, [model])

    useEffect(() => {
        if (isMobile) {
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
        }
    }, [model])

    return (
        <div className={isMobile ? classes.storeWrapper : classes.storeWrapperDesktop + ' ' + 'storeWrapperDesktop'}>
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
                {/* 
        // @ts-ignore */}
                {isMobile ? <StoreSwiper data={products_data[brand as keyof typeof products_data][model][chosenRubric[2]]} header={chosenRubric[0] + ' > ' + chosenRubric[1]} />
                    /* 
        // @ts-ignore */
                : <MainStoreSection data={products_data[brand as keyof typeof products_data][model][chosenRubric[2]]} header={chosenRubric[0] + ' > ' + chosenRubric[1]} flagStore={flag} />
                }
            </div>
        </div>
    )
}


