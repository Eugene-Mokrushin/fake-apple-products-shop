import classes from '../../scss/Home.module.scss';
import otherAccessories_data from '../data/other_accessories.json'
import home_data from '../data/Home.json'
import { useMobileAndLang } from '../context/IsMobileLangContext';
import { MainStoreSection } from '../components/MainStoreSection';
import { useEffect, useState } from 'react';

export function Home() {

    const { lang, isMobile } = useMobileAndLang()

    const mainTitle = home_data.title[lang as keyof typeof home_data.title]
    const wireless = home_data.wireless[lang as keyof typeof home_data.wireless]
    const lightinig = home_data.lightning[lang as keyof typeof home_data.lightning]
    const lightinigCheker = home_data.lightning.en
    const jack = home_data.jack[lang as keyof typeof home_data.jack]
    const jackCheker = home_data.jack.en
    const overears = home_data.headset[lang as keyof typeof home_data.headset]
    const overearsChecker = home_data.headset.en
    const powerbanks = home_data.powerbanks[lang as keyof typeof home_data.powerbanks]

    const smallJack = home_data.smallNames.jack[lang as keyof typeof home_data.smallNames.jack]
    const smallLightning = home_data.smallNames.ligh[lang as keyof typeof home_data.smallNames.ligh]
    const smallHeadset = home_data.smallNames.set[lang as keyof typeof home_data.smallNames.set]
    const [cabelType, setCableType] = useState(lightinigCheker)
    function handleCableType(type: string) {
        setCableType(type)
    }

    return (
        <div className={`${classes.homeWrapper} ${!isMobile ? classes.desctopHomeWrapper : ""}`}>
            <div className={classes.mainWigetWrapper}>
                <div className={classes.title}>{mainTitle}</div>
                <img src="./wigets/mainWiget.png" alt="main wiget" className={classes.wiget} />
            </div>
            <MainStoreSection data={otherAccessories_data.headphones['wireless earbuds'].items} header={wireless} />
            <div className={`${classes.cabelType} ${!isMobile ? classes.desctopCabelType : ""}`}>
                <div className={`${classes.wrapperType} ${cabelType === lightinigCheker ? classes.active : ''}`} onClick={() => handleCableType(lightinigCheker)} >
                    <img src="./wigets/lightningWiget.png" alt="lightinig cables" />
                    <div className={classes.titleType}>{smallLightning}</div>
                </div>
                <div className={`${classes.wrapperType} ${cabelType === jackCheker ? classes.active : ''}`} onClick={() => handleCableType(jackCheker)} >
                    <img src="./wigets/jackWiget.png" alt="jack cables" />
                    <div className={classes.titleType}>{smallJack}</div>
                </div>
                <div className={`${classes.wrapperType} ${cabelType === overearsChecker ? classes.active : ''}`} onClick={() => handleCableType(overearsChecker)}>
                    <img src="./wigets/overearWiget.png" alt="jack cables" />
                    <div className={classes.titleType}>{smallHeadset}</div>
                </div>

            </div>
            <div className={`${cabelType === lightinigCheker ? classes.shown : classes.hidden}`}>
                <MainStoreSection data={otherAccessories_data.headphones['headphones lightning'].items} header={lightinig} flagSelector={jackCheker} />
            </div>
            <div className={`${cabelType === jackCheker ? classes.shown : classes.hidden}`}>
                <MainStoreSection data={otherAccessories_data.headphones["headphones 3.5mm"].items} header={jack} flagSelector={jackCheker} />
            </div>
            <div className={`${cabelType === overearsChecker ? classes.shown : classes.hidden}`}>
                <MainStoreSection data={otherAccessories_data.headphones["big headphones"].items} header={overears} flagSelector={jackCheker} />
            </div>
            <MainStoreSection data={otherAccessories_data.headphones["power bank for phone"].items} header={powerbanks} />
        </div>
    )
}
