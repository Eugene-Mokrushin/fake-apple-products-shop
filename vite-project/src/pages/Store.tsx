import { ReactNode, useState } from 'react'

import classes from '../../scss/Store.module.scss'
import store_data from '../data/Store.json'

import { useSearchParams } from 'react-router-dom'
import { useMobileAndLang } from '../context/IsMobileLangContext'

export function Store() {

    const { lang } = useMobileAndLang()
    const [chosenRubris, setChosenRubric] = useState({})

    const wiget_title = store_data.wiget[lang as keyof typeof store_data.wiget]
    const rubrics_titles = store_data.rubrics[lang as keyof typeof store_data.rubrics]
    const subrubrics_titles = store_data.subrubrics[lang as keyof typeof store_data.subrubrics]
    let subrubricsWigets: Array<ReactNode> = []
    store_data.subrubrics.en.forEach((subrubric, index) => {
        index === 0 ? setChosenRubric({"Cases": subrubric}) : null
        subrubricsWigets.push(
            <div className={classes.subrubric} key={index} onClick={() => setChosenRubric(chosenRubris)}>
                <img src={`./rubrics/cases/${subrubric}.png`} alt="widget for subrubric" className={classes.wigetSubrubric} />
                <span className={classes.title}>{subrubrics_titles[index]}</span>
            </div>
        )
    })

    const [searchParam] = useSearchParams()
    const model = searchParam.get("model")
    const brand = searchParam.get("brand")
    // console.log(subrubricsWigets)

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
        </div>
    )
}


function pickRoubrick(rubric: string): void {

}