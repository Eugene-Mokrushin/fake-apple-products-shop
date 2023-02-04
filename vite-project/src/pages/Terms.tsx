import terms_data from '../data/Terms.json';
import classes from '../../scss/Terms.module.scss';
import { useNavigate } from 'react-router-dom';
import { useSelectedSection } from '../context/IsSectionSelectedContext';
import { useMobileAndLang } from '../context/IsMobileLangContext';

export function Terms() {
    const { lang, isMobile } = useMobileAndLang()
    const navigate = useNavigate();
    const { setSection } = useSelectedSection()
    const serviceTitle = terms_data.service_title[lang as keyof typeof terms_data.service_title]
    const deliveryTitle = terms_data.delivery_title[lang as keyof typeof terms_data.delivery_title]
    const returnTitle = terms_data.return_title[lang as keyof typeof terms_data.return_title]
    const terms = terms_data.terms[lang as keyof typeof terms_data.terms]
    const btnTitle = terms_data.btn[lang as keyof typeof terms_data.btn]


    return (
        <div className={`${classes.allTermsWrapper} ${!isMobile ? classes.allTermsWrapperDesctop : ''}`}>
            <div className={classes.termWrapper}>
                <div className={classes.title}>{serviceTitle}</div>
                <div className={classes.descr}>{terms}</div>
            </div>
            <div className={classes.termWrapper}>
                <div className={classes.title}>{deliveryTitle}</div>
                <div className={classes.descr}>{terms}</div>
            </div>
            <div className={classes.termWrapper}>
                <div className={classes.title}>{returnTitle}</div>
                <div className={classes.descr}>{terms}</div>
            </div>
            <div className={classes.backToMain} onClick={() => { navigate('/'); setSection("QPICK") }}>
                {btnTitle}
            </div>
        </div>
    )
}
