import { ReactNode, useState, MouseEvent, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import classes from '../../scss/MenuDesctop.module.scss'
import { useMobileAndLang } from '../context/IsMobileLangContext'
import { useSelectedSection } from '../context/IsSectionSelectedContext'
import menu_data from '../data/Menu.json'
import menuNames from '../data/Menu.json'
import allPhone from '../data/PhoneModels.json'

export function MenuDesctop() {
    const { lang, isMenuOpen } = useMobileAndLang()
    const [isModelsActive, setIsModelsActive] = useState<boolean>(false)
    const navigate = useNavigate();
    const { search } = useLocation();
    const location = useLocation();
    const parameters = new URLSearchParams(search);
    const chosenModel = parameters.get('model')
    const chosenBrand = parameters.get('brand')
    const title = menuNames.chose_model[lang as keyof typeof menuNames.chose_model]

    function handleSelectModel(modelName: string, brand: string): void {
        navigate(`store?model=${modelName}&brand=${brand}`);
        // setSection(modelName)
        setIsModelsActive(false)
    }

    useEffect(() => {

        window.addEventListener('scroll', () => {
            setIsModelsActive(false)
        })

    }, [])

    useEffect(() => {
        setIsModelsActive(false)
    }, [location]);


    let phoneBrandAndModels: Array<ReactNode> = [];
    for (const [key, value] of Object.entries(allPhone)) {
        phoneBrandAndModels.push(
            <div className={`${classes.model} brandNameWrapper`} data-brandactive={`${chosenBrand && chosenBrand === key ? 'true' : 'false'}`} key={crypto.randomUUID()}>
                <h4 className={`${classes.brandName} brandName`} onClick={(e) => handleBrandOpen(e)}>{key}</h4>
                <div className={classes.allModelBrand}>
                    {value.map((name: string) => (
                        <div className={`${classes.modelName} ${chosenModel && name === chosenModel ? classes.pickedModelName : ""}`} key={crypto.randomUUID()} onClick={() => handleSelectModel(name, key)}>{name}</div>
                    ))}
                </div>
            </div >
        )
    }

    return (
        <div className={`${classes.menu} ${isMenuOpen ? classes.active : ''}`}>
            <div className={`${classes.title} ${classes.menuItem}`}
                onClick={() => setIsModelsActive(prev => !prev)}
            >
                <div className={classes.menuWrapper}>
                    <svg width="15" height="21" viewBox="0 0 15 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2.14286 2.1V18.9H12.8571V2.1H2.14286ZM1.07143 0H13.9286C14.2127 0 14.4853 0.110625 14.6862 0.307538C14.8871 0.504451 15 0.771523 15 1.05V19.95C15 20.2285 14.8871 20.4955 14.6862 20.6925C14.4853 20.8894 14.2127 21 13.9286 21H1.07143C0.787268 21 0.514746 20.8894 0.313814 20.6925C0.112883 20.4955 0 20.2285 0 19.95V1.05C0 0.771523 0.112883 0.504451 0.313814 0.307538C0.514746 0.110625 0.787268 0 1.07143 0ZM7.5 15.75C7.78416 15.75 8.05668 15.8606 8.25761 16.0575C8.45855 16.2544 8.57143 16.5215 8.57143 16.8C8.57143 17.0785 8.45855 17.3455 8.25761 17.5425C8.05668 17.7394 7.78416 17.85 7.5 17.85C7.21584 17.85 6.94332 17.7394 6.74239 17.5425C6.54145 17.3455 6.42857 17.0785 6.42857 16.8C6.42857 16.5215 6.54145 16.2544 6.74239 16.0575C6.94332 15.8606 7.21584 15.75 7.5 15.75Z" fill="#101010" />
                    </svg>
                    <h3 className={`${classes.menuItemTitle}`} data-active={isModelsActive}>{title}</h3>
                </div>
            </div>
            <div className={`${classes.models}`} onMouseEnter={() => setIsModelsActive(true)} data-active={isModelsActive}>
                {phoneBrandAndModels}
            </div>
        </div>
    )
}

function handleBrandOpen(event: MouseEvent<HTMLHeadingElement, globalThis.MouseEvent>): void {
    const allBrands = document.getElementsByClassName('brandNameWrapper') as HTMLCollectionOf<HTMLElement>
    const targetElem = event.target as HTMLDivElement
    const parentOfTarget: HTMLElement | null = targetElem.parentElement
    if (typeof targetElem === null) return
    else if (typeof parentOfTarget === null) return
    else {
        if (parentOfTarget?.dataset.brandactive === "true") {
            parentOfTarget.dataset.brandactive = 'false'
        } else {
            for (let i = 0; i < allBrands.length; i++) {
                if (allBrands[i] !== targetElem?.parentNode) {
                    allBrands[i].dataset.brandactive = "false"
                } else {
                    allBrands[i].dataset.brandactive = "true"
                }
            }
        }
    }
}
