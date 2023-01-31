import classes from '../../scss/Home.module.scss';
import otherAccessories_data from '../data/other_accessories.json'
import home_data from '../data/Home.json'
import { useMobileAndLang } from '../context/IsMobileLangContext';
import MainStoreSection from '../components/MainStoreSection';

export function Home() {

    const { lang } = useMobileAndLang()

    const mainTitle = home_data.title[lang as keyof typeof home_data.title]
    const wireless = home_data.wireless[lang as keyof typeof home_data.wireless]
    const lightinig = home_data.lightning[lang as keyof typeof home_data.lightning]
    const jack = home_data.jack[lang as keyof typeof home_data.jack]
    const powerbanks = home_data.powerbanks[lang as keyof typeof home_data.powerbanks]
    const overears = home_data.headset[lang as keyof typeof home_data.headset]
    
    return (
        <div className={classes.homeWrapper}>
            <div className={classes.mainWigetWrapper}>
                <div className={classes.title}>{mainTitle}</div>
                <img src="./wigets/mainWiget.png" alt="main wiget" className={classes.wiget} />
            </div>
            <MainStoreSection data={otherAccessories_data.headphones['wireless earbuds'].items} header={wireless} />
            <MainStoreSection data={otherAccessories_data.headphones['headphones lightning'].items} header={lightinig} />
            <MainStoreSection data={otherAccessories_data.headphones["big headphones"].items} header={overears} />
        </div>
    )
}
