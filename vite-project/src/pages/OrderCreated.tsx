import { useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"

import classes from '../../scss/OrderCreated.module.scss'
import data from '../data/OrderCreated.json'
import { useMobileAndLang } from "../context/IsMobileLangContext";

export function OrderCreated() {

    const navigate = useNavigate();
    const [searchParam] = useSearchParams()
    const orderNo = searchParam.get("no") || ""
    const { lang, closeMenu, isMobile } = useMobileAndLang()


    const info = data.info[lang as keyof typeof data.info]
    const btn = data.btn[lang as keyof typeof data.btn]

    const infoBlocks = (info + orderNo).split('<br>').map(info => {
        return (
            <div key={crypto.randomUUID()} className={classes.infoRow}>{info}</div>
        )
    })

    useEffect(() => {
        if (orderNo === "") {
            navigate('/');
        }
    }, [])

    return (
        <div className={isMobile ? classes.orderCreatedWrapper : classes.orderCreatedWrapperDesctop}>
            <div className={classes.info}>{infoBlocks}</div>
            <div className={classes.btn} onClick={() => {navigate('/'); closeMenu()}}>{btn}</div>
        </div>
    )
}
