import classes from '../../scss/CheckoutDelivery.module.scss';
import checkout_data from '../data/Checkout.json';
import cart_data from '../data/Cart.json'
import { useState } from 'react';

type CheckoutDeliveryProps = {
    lang: string,
    deliveryMethod: string,
    currencyMultiplier: number
}

export function CheckoutDelivery({ lang, deliveryMethod, currencyMultiplier }: CheckoutDeliveryProps) {
    const deliveryOptionCourierChecker = cart_data.delivery.delivery_uptions.courier.en
    const deliveryOptionPickupChecker = cart_data.delivery.delivery_uptions.selfPickUp.en

    const mainTitle = deliveryMethod === deliveryOptionCourierChecker ? checkout_data.delivery.courier[lang as keyof typeof checkout_data.delivery.courier] : checkout_data.delivery.selfPickUp[lang as keyof typeof checkout_data.delivery.selfPickUp]
    const addresTitle = checkout_data.addresTitle[lang as keyof typeof checkout_data.addresTitle]
    const street = checkout_data.addresSubTitle.street[lang as keyof typeof checkout_data.addresSubTitle.street]
    const house = checkout_data.addresSubTitle.house[lang as keyof typeof checkout_data.addresSubTitle.house]
    const houseExtra = checkout_data.addresSubTitle.houseExtra[lang as keyof typeof checkout_data.addresSubTitle.houseExtra]
    const floor = checkout_data.addresSubTitle.floor[lang as keyof typeof checkout_data.addresSubTitle.floor]
    const flat = checkout_data.addresSubTitle.flat[lang as keyof typeof checkout_data.addresSubTitle.flat]

    const [city, setCity] = useState<string>(checkout_data.cities[lang as keyof typeof checkout_data.cities][0])
    const [cityState, setCityState] = useState<boolean>(false)

    function handlePickCity(city: string) {
        setCityState(false)
        setCity(city)
    }

    const allOtherCities = checkout_data.cities[lang as keyof typeof checkout_data.cities].map(cityOption => {
        if (city !== cityOption) {
            return (
                <div className={classes.cityOption} onClick={() => handlePickCity(cityOption)} key={crypto.randomUUID()}>{cityOption}</div>
            )
        }
    })

    return (
        <div className={classes.deliveryWrapper}>
            <div className={classes.titleAndPrice}>
                <div className={classes.mainTitle}>{mainTitle}</div>
                <div className={classes.price}>{deliveryMethod === deliveryOptionPickupChecker ? lang === "en" ? "$0.00" : "0 ₽" : lang === "en" ? "$10.99" : `${(10.99 * currencyMultiplier).toFixed(2)} ₽`}</div>
            </div>
            {deliveryMethod === deliveryOptionPickupChecker &&
                <div className={classes.selfWrapper}>
                    <a href="https://www.google.ru/maps/place/Louvre+Museum/@48.8595951,2.3374212,17z/data=!4m5!3m4!1s0x47e671d877937b0f:0xb975fcfa192f84d4!8m2!3d48.8606111!4d2.337644" target="_blank">
                        <img src="../imgs/map.jpg" alt="map" className={classes.map} />
                    </a>
                </div>
            }
            {deliveryMethod === deliveryOptionCourierChecker &&
                <div className={classes.courierDelivery}>
                    <div className={classes.courierTitle}>
                        <svg className={classes.pin} width="18" height="22" viewBox="0 0 18 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M8.97429 22L2.62847 15.5563C1.37341 14.2819 0.5187 12.6581 0.172434 10.8905C-0.173831 9.12277 0.00389568 7.29051 0.683141 5.62539C1.36239 3.96027 2.51264 2.53707 3.98845 1.53576C5.46426 0.534448 7.19935 0 8.97429 0C10.7492 0 12.4843 0.534448 13.9601 1.53576C15.4359 2.53707 16.5862 3.96027 17.2654 5.62539C17.9447 7.29051 18.1224 9.12277 17.7761 10.8905C17.4299 12.6581 16.5752 14.2819 15.3201 15.5563L8.97429 22ZM13.9101 14.1246C14.8862 13.1333 15.551 11.8704 15.8202 10.4956C16.0895 9.12075 15.9512 7.69569 15.4229 6.40064C14.8946 5.10558 13.9999 3.99868 12.8521 3.21991C11.7043 2.44114 10.3548 2.02548 8.97429 2.02548C7.5938 2.02548 6.24432 2.44114 5.09648 3.21991C3.94864 3.99868 3.054 5.10558 2.52568 6.40064C1.99736 7.69569 1.85909 9.12075 2.12836 10.4956C2.39762 11.8704 3.06233 13.1333 4.03843 14.1246L8.97429 19.1366L13.9101 14.1246ZM8.97429 11.1377C8.44537 11.1377 7.93812 10.9243 7.56411 10.5445C7.19011 10.1648 6.98 9.64969 6.98 9.11262C6.98 8.57554 7.19011 8.06047 7.56411 7.6807C7.93812 7.30093 8.44537 7.08757 8.97429 7.08757C9.5032 7.08757 10.0105 7.30093 10.3845 7.6807C10.7585 8.06047 10.9686 8.57554 10.9686 9.11262C10.9686 9.64969 10.7585 10.1648 10.3845 10.5445C10.0105 10.9243 9.5032 11.1377 8.97429 11.1377Z" fill="#101010" />
                        </svg>
                        <div className={classes.deliveryAddressTitle}>{addresTitle}</div>
                    </div>
                    <div className={classes.citiesWrapper}>
                        <div className={`${classes.selected} ${cityState ? classes.selectedClosed : ""}`} onClick={() => setCityState(prev => !prev)}>
                            <div className={classes.citySelcted}>{city}</div>
                            <svg className={classes.tick} width="14" height="8" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M7.17451 8L0.677368 1.99965L2.8441 0L7.17451 4.00071L11.5049 0L13.6717 1.99965L7.17451 8Z" fill="#8E8E8E" />
                            </svg>
                        </div>
                        <div className={`${classes.otherOptions} ${cityState ? classes.otherOprionsOpened : classes.otherOprionsClosed}`}>
                            {allOtherCities}
                        </div>
                    </div>
                    <input type="text" required={true} className={classes.street} placeholder={street}></input>
                    <div className={classes.houses}>
                        <input type="text" required={true} className={classes.house} placeholder={house}></input>
                        <input type="text" className={classes.houseAdd} placeholder={houseExtra}></input>
                    </div>
                    <div className={classes.floorAndApartment}>
                        <input type="text" className={classes.floor} placeholder={floor}></input>
                        <input type="text" required={true} className={classes.apartment} placeholder={flat}></input>
                    </div>
                </div>
            }
        </div>
    )
}
