import { useContext, createContext, ReactNode, useState, useEffect, Dispatch } from "react";
import isMobile from "../utilities/isMobile";
type IsMobileLangProviderProps = {
    children: ReactNode
}
type IsMobileLangContext = {
    isMobile: boolean,
    isMenuOpen: boolean,
    openMenu(): void,
    closeMenu(): void,
    lang: string,
    setLang: Dispatch<React.SetStateAction<string>>
}

const IsMobileLangContext = createContext({} as IsMobileLangContext)

export function useMobileAndLang() {
    return useContext(IsMobileLangContext)
}

export function IsMobileLangProvider({ children }: IsMobileLangProviderProps) {
    const [lang, setLang] = useState('en')
    const [mobile, setMobile] = useState(false)
    const [isActive, setIsActive] = useState<boolean>(false)
    useEffect(() => {
        if (isMobile.any()) setMobile(true)
        window.navigator.language.split('-')[0] !== 'en' ? setLang('ru') : null
    }, [])

    const openMenu = () => { setIsActive(true) }
    const closeMenu = () => { setIsActive(false) }

    return (
        <IsMobileLangContext.Provider
            value={{
                isMobile: mobile,
                isMenuOpen: isActive,
                openMenu: openMenu,
                closeMenu: closeMenu,
                lang: lang,
                setLang: setLang
            }}
        >
            {children}
        </IsMobileLangContext.Provider>
    )
}
