import { useState, ReactNode, MouseEvent } from 'react'
import { useNavigate, useLocation } from "react-router-dom";
import classes from '../../scss/MenuMobile.module.scss'
import { useMobileAndLang } from '../context/IsMobileLangContext'
import { useSelectedSection } from '../context/IsSectionSelectedContext';
import menuNames from '../data/Menu.json'
import allPhone from '../data/PhoneModels.json'

export function MenuMobile() {
    const navigate = useNavigate();
    const { setSection } = useSelectedSection()
    const { lang, isMenuOpen, closeMenu, setLang } = useMobileAndLang()
    const [isModelsActive, setIsModelsActive] = useState<boolean>(false)

    const { search } = useLocation();
    const parameters = new URLSearchParams(search);
    const chosenModel = parameters.get('model')?.split('$');

    const title = menuNames.chose_model[lang as keyof typeof menuNames.chose_model]
    const favorite = menuNames.fav[lang as keyof typeof menuNames.fav]
    const terms = menuNames.terms[lang as keyof typeof menuNames.terms]
    const contacts = menuNames.contacts[lang as keyof typeof menuNames.contacts]

    function handleSelectModel(modelName: string, brand: string): void {
        navigate(`store?model=${modelName}&brand=${brand}`);
        setSection(modelName)
        closeMenu()
    }

    function handleSelectSection(section: string, navTarget: string): void {
        navigate(navTarget);
        setSection(section)
        closeMenu()
    }

    let phoneBrandAndModels: Array<ReactNode> = [];
    for (const [key, value] of Object.entries(allPhone)) {
        phoneBrandAndModels.push(
            <div className={`${classes.model} brandNameWrapper`} data-brandactive={`${chosenModel && chosenModel[1] === key ? 'true' : 'false'}`} key={crypto.randomUUID()}>
                <h4 className={`${classes.brandName} brandName`} onClick={(e) => handleBrandOpen(e)}>{key}</h4>
                <div className={classes.allModelBrand}>
                    {value.map((name: string) => (
                        <div className={`${classes.modelName} ${chosenModel && name === chosenModel[0] ? classes.pickedModelName : ""}`} key={crypto.randomUUID()} onClick={() => handleSelectModel(name, key)}>{name}</div>
                    ))}
                </div>
            </div >
        )
    }

    return (
        <div className={`${classes.menu} ${isMenuOpen ? classes.active : ''}`}>
            <div className={`${classes.title} ${classes.menuItem}`}>
                <svg width="15" height="21" viewBox="0 0 15 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2.14286 2.1V18.9H12.8571V2.1H2.14286ZM1.07143 0H13.9286C14.2127 0 14.4853 0.110625 14.6862 0.307538C14.8871 0.504451 15 0.771523 15 1.05V19.95C15 20.2285 14.8871 20.4955 14.6862 20.6925C14.4853 20.8894 14.2127 21 13.9286 21H1.07143C0.787268 21 0.514746 20.8894 0.313814 20.6925C0.112883 20.4955 0 20.2285 0 19.95V1.05C0 0.771523 0.112883 0.504451 0.313814 0.307538C0.514746 0.110625 0.787268 0 1.07143 0ZM7.5 15.75C7.78416 15.75 8.05668 15.8606 8.25761 16.0575C8.45855 16.2544 8.57143 16.5215 8.57143 16.8C8.57143 17.0785 8.45855 17.3455 8.25761 17.5425C8.05668 17.7394 7.78416 17.85 7.5 17.85C7.21584 17.85 6.94332 17.7394 6.74239 17.5425C6.54145 17.3455 6.42857 17.0785 6.42857 16.8C6.42857 16.5215 6.54145 16.2544 6.74239 16.0575C6.94332 15.8606 7.21584 15.75 7.5 15.75Z" fill="#101010" />
                </svg>
                <h3 className={classes.menuItemTitle} data-active={isModelsActive} onClick={() => setIsModelsActive(prev => !prev)}>{title}</h3>
            </div>
            <div className={`${classes.models}`} data-active={isModelsActive}>
                {phoneBrandAndModels}
            </div>
            <div className={`${classes.favourites} ${classes.menuItem}`} onClick={() => handleSelectSection(favorite, '/fav')}>
                <svg width="15" height="14" viewBox="0 0 15 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7.50061 1.15801C9.26233 -0.439291 11.9848 -0.386275 13.682 1.33069C15.3785 3.04841 15.437 5.78403 13.859 7.5684L7.49911 14L1.14073 7.5684C-0.437237 5.78403 -0.377988 3.04386 1.31773 1.33069C3.01645 -0.384003 5.73365 -0.441563 7.50061 1.15801ZM12.62 2.40085C11.495 1.26328 9.68007 1.21708 8.50259 2.28498L7.50136 3.19231L6.49938 2.28573C5.31816 1.21632 3.50694 1.26328 2.37896 2.40237C1.26148 3.53085 1.20523 5.33718 2.23496 6.5308L7.49986 11.8559L12.7648 6.53156C13.7952 5.33718 13.739 3.53312 12.62 2.40085Z" fill="#101010" />
                </svg>
                <h3 className={classes.menuItemTitle}>{favorite}</h3>
            </div>
            <div className={`${classes.terms} ${classes.menuItem}`} onClick={() => handleSelectSection(terms, "/terms")}>
                <svg width="15" height="17" viewBox="0 0 15 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14.1667 17H0.833333C0.61232 17 0.400358 16.9104 0.244078 16.751C0.0877973 16.5916 0 16.3754 0 16.15V0.85C0 0.624566 0.0877973 0.408365 0.244078 0.248959C0.400358 0.0895533 0.61232 0 0.833333 0H14.1667C14.3877 0 14.5996 0.0895533 14.7559 0.248959C14.9122 0.408365 15 0.624566 15 0.85V16.15C15 16.3754 14.9122 16.5916 14.7559 16.751C14.5996 16.9104 14.3877 17 14.1667 17ZM13.3333 15.3V1.7H1.66667V15.3H13.3333ZM3.33333 3.4H6.66667V6.8H3.33333V3.4ZM3.33333 8.5H11.6667V10.2H3.33333V8.5ZM3.33333 11.9H11.6667V13.6H3.33333V11.9ZM8.33333 4.25H11.6667V5.95H8.33333V4.25Z" fill="#101010" />
                </svg>
                <h3 className={classes.menuItemTitle}>{terms}</h3>
            </div>
            <div className={`${classes.contacts} ${classes.menuItem}`} onClick={() => handleSelectSection(contacts, "/contacts")}>
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5.305 6.40167C6.08695 7.7754 7.2246 8.91305 8.59833 9.695L9.335 8.66333C9.45346 8.49745 9.62862 8.38073 9.82734 8.33528C10.026 8.28982 10.2345 8.31878 10.4133 8.41667C11.5919 9.06077 12.8935 9.44815 14.2325 9.55333C14.4415 9.56989 14.6365 9.66461 14.7788 9.8186C14.921 9.97259 15 10.1745 15 10.3842V14.1025C15 14.3088 14.9235 14.5078 14.7853 14.661C14.6471 14.8142 14.4569 14.9106 14.2517 14.9317C13.81 14.9775 13.365 15 12.9167 15C5.78333 15 0 9.21667 0 2.08333C0 1.635 0.0225 1.19 0.0683333 0.748333C0.0893788 0.543081 0.18582 0.352934 0.338991 0.214695C0.492163 0.076456 0.691172 -4.44648e-05 0.8975 1.93894e-08H4.61583C4.82547 -2.62654e-05 5.02741 0.0789596 5.1814 0.221209C5.33539 0.363458 5.43011 0.55852 5.44667 0.7675C5.55185 2.10649 5.93923 3.40807 6.58333 4.58667C6.68122 4.76547 6.71018 4.97395 6.66472 5.17266C6.61927 5.37137 6.50255 5.54654 6.33667 5.665L5.305 6.40167ZM3.20333 5.85417L4.78667 4.72333C4.33732 3.75341 4.02946 2.72403 3.8725 1.66667H1.675C1.67 1.805 1.6675 1.94417 1.6675 2.08333C1.66667 8.29667 6.70333 13.3333 12.9167 13.3333C13.0558 13.3333 13.195 13.3308 13.3333 13.325V11.1275C12.276 10.9705 11.2466 10.6627 10.2767 10.2133L9.14583 11.7967C8.69055 11.6198 8.24834 11.4109 7.8225 11.1717L7.77417 11.1442C6.13965 10.2139 4.78607 8.86035 3.85583 7.22583L3.82833 7.1775C3.58909 6.75166 3.38024 6.30945 3.20333 5.85417Z" fill="#101010" />
                </svg>
                <h3 className={classes.menuItemTitle}>{contacts}</h3>
            </div>
            <div className={`${classes.langChose} ${classes.menuItem}`}>
                <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8.4915 0C3.7995 0 0 3.808 0 8.5C0 13.192 3.7995 17 8.4915 17C13.192 17 17 13.192 17 8.5C17 3.808 13.192 0 8.4915 0ZM14.382 5.1H11.8745C11.6025 4.0375 11.2115 3.0175 10.7015 2.074C12.2655 2.6095 13.566 3.6975 14.382 5.1ZM8.5 1.734C9.2055 2.754 9.758 3.8845 10.1235 5.1H6.8765C7.242 3.8845 7.7945 2.754 8.5 1.734ZM1.921 10.2C1.785 9.656 1.7 9.0865 1.7 8.5C1.7 7.9135 1.785 7.344 1.921 6.8H4.794C4.726 7.361 4.675 7.922 4.675 8.5C4.675 9.078 4.726 9.639 4.794 10.2H1.921ZM2.618 11.9H5.1255C5.3975 12.9625 5.7885 13.9825 6.2985 14.926C4.7345 14.3905 3.434 13.311 2.618 11.9ZM5.1255 5.1H2.618C3.434 3.689 4.7345 2.6095 6.2985 2.074C5.7885 3.0175 5.3975 4.0375 5.1255 5.1ZM8.5 15.266C7.7945 14.246 7.242 13.1155 6.8765 11.9H10.1235C9.758 13.1155 9.2055 14.246 8.5 15.266ZM10.489 10.2H6.511C6.4345 9.639 6.375 9.078 6.375 8.5C6.375 7.922 6.4345 7.3525 6.511 6.8H10.489C10.5655 7.3525 10.625 7.922 10.625 8.5C10.625 9.078 10.5655 9.639 10.489 10.2ZM10.7015 14.926C11.2115 13.9825 11.6025 12.9625 11.8745 11.9H14.382C13.566 13.3025 12.2655 14.3905 10.7015 14.926ZM12.206 10.2C12.274 9.639 12.325 9.078 12.325 8.5C12.325 7.922 12.274 7.361 12.206 6.8H15.079C15.215 7.344 15.3 7.9135 15.3 8.5C15.3 9.0865 15.215 9.656 15.079 10.2H12.206Z" fill="#101010" />
                </svg>

                <div className={`${lang === 'en' ? classes.active : classes.lang}`} onClick={() => { lang === "en" ? null : setLang('en'); navigate('/'); setSection('QPICK') }}>Eng</div>
                <div className={`${lang === 'ru' ? classes.active : classes.lang}`} onClick={() => { lang === "ru" ? null : setLang('ru'); navigate('/'); setSection('QPICK') }}>Рус</div>
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
