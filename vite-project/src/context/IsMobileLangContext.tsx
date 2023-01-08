import { useContext, createContext, ReactNode, useState, useEffect } from "react";
import isMobile from "../utilities/isMobile";
type IsMobileLangProviderProps = {
    children: ReactNode
}
type IsMobileLangContext = {
    isMobile: boolean,
    lang: string
}

const IsMobileLangContext = createContext({} as IsMobileLangContext)

export function useMobile() {
    return useContext(IsMobileLangContext)
}

export function IsMobileLangProvider({ children }: IsMobileLangProviderProps) {
    const [lang, setLang] = useState('en')
    const [mobile, setMobile] = useState(false)
    useEffect(() => {
        if (isMobile.any()) setMobile(true)
        window.navigator.language.split('-')[0] !== 'en' ? setLang('ru') : null
    }, [])

    return (
        <IsMobileLangContext.Provider
            value={{
                isMobile: mobile,
                lang: lang
            }}
        >
            {children}
        </IsMobileLangContext.Provider>
    )
}
