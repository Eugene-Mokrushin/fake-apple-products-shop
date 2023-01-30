import { useRef, useState } from 'react';
import classes from '../../scss/CheckoutPayment.module.scss';
import checkout_data from '../data/Checkout.json';

type CheckoutPaymentProps = {
    lang: string,
    handlePromo: (value: string) => void
}

export function CheckoutPayment({ lang, handlePromo }: CheckoutPaymentProps) {
    const mainTitle = checkout_data.paymentMethodTitle[lang as keyof typeof checkout_data.paymentMethodTitle]
    const promo = checkout_data.promo[lang as keyof typeof checkout_data.promo]
    const uponDelivery = checkout_data.paymontMethods.delivered[lang as keyof typeof checkout_data.paymontMethods.delivered]
    const qiwi = checkout_data.paymontMethods.qiwi[lang as keyof typeof checkout_data.paymontMethods.qiwi]

    const [methodSelected, setMethodSelected] = useState(qiwi)
    const [paymontsState, setPaymontsState] = useState(false)
    const promoRef = useRef<HTMLInputElement | null>(null)

    function handleChengePayment() {
        setPaymontsState(false)

        const newSelect = methodSelected === qiwi ? uponDelivery : qiwi
        setMethodSelected(newSelect)
    }

    return (
        <div className={classes.paymentWrapper}>
            <div className={classes.mainTitle}>{mainTitle}</div>
            <div className={classes.methodsWrapper}>
                <div className={`${classes.selected} ${paymontsState ? classes.selectedClosed : ""}`} onClick={() => setPaymontsState(prev => !prev)}>
                    {methodSelected === qiwi ?
                        <svg className={classes.thumbImg} width="22" height="16" viewBox="0 0 22 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M0 0H22V2H0V0ZM0 14H22V16H0V14ZM18.622 10.914L18.448 10.044H16.499L16.189 10.907L14.627 10.91C15.632 8.504 16.377 6.72 16.863 5.562C16.99 5.259 17.216 5.105 17.548 5.107C17.802 5.109 18.217 5.109 18.793 5.107L20 10.912L18.622 10.915V10.914ZM16.938 8.852H18.194L17.724 6.672L16.938 8.852ZM6.872 5.106L8.442 5.108L6.015 10.914L4.425 10.913C3.888 8.843 3.493 7.307 3.241 6.308C3.164 6.001 3.011 5.787 2.715 5.686C2.452 5.596 2.014 5.456 1.4 5.267V5.107H3.909C4.343 5.107 4.596 5.317 4.678 5.747L5.298 9.036L6.872 5.106ZM10.599 5.108L9.359 10.913L7.864 10.911L9.104 5.106L10.599 5.108ZM13.631 5C14.077 5 14.641 5.138 14.965 5.267L14.703 6.471C14.41 6.353 13.928 6.194 13.523 6.201C12.933 6.21 12.569 6.457 12.569 6.694C12.569 7.078 13.201 7.272 13.853 7.693C14.596 8.173 14.693 8.603 14.684 9.071C14.674 10.042 13.853 11 12.12 11C11.329 10.988 11.044 10.922 10.4 10.694L10.672 9.438C11.328 9.712 11.607 9.799 12.167 9.799C12.682 9.799 13.123 9.592 13.127 9.231C13.129 8.974 12.972 8.847 12.395 8.529C11.818 8.212 11.01 7.773 11.02 6.889C11.033 5.759 12.107 5 13.63 5H13.631Z" fill="#101010" />
                        </svg>
                        :
                        <img className={classes.thumbImg} src="./imgs/walkinkingman.svg" alt="payment when delivered" />
                    }
                    <div className={classes.methodSelcted}>{methodSelected}</div>
                    <svg className={`${classes.tick} ${paymontsState ? classes.tickUp : classes.tickDown}`} width="14" height="8" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7.17451 8L0.677368 1.99965L2.8441 0L7.17451 4.00071L11.5049 0L13.6717 1.99965L7.17451 8Z" fill="#8E8E8E" />
                    </svg>
                </div>
                <div className={`${classes.otherOptions} ${paymontsState ? classes.otherOptionsOpened : classes.otherOptionsClosed}`}>
                    <div className={classes.option} onClick={() => handleChengePayment()}>
                        {methodSelected !== qiwi ?
                            <svg className={classes.thumbImg} width="22" height="16" viewBox="0 0 22 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M0 0H22V2H0V0ZM0 14H22V16H0V14ZM18.622 10.914L18.448 10.044H16.499L16.189 10.907L14.627 10.91C15.632 8.504 16.377 6.72 16.863 5.562C16.99 5.259 17.216 5.105 17.548 5.107C17.802 5.109 18.217 5.109 18.793 5.107L20 10.912L18.622 10.915V10.914ZM16.938 8.852H18.194L17.724 6.672L16.938 8.852ZM6.872 5.106L8.442 5.108L6.015 10.914L4.425 10.913C3.888 8.843 3.493 7.307 3.241 6.308C3.164 6.001 3.011 5.787 2.715 5.686C2.452 5.596 2.014 5.456 1.4 5.267V5.107H3.909C4.343 5.107 4.596 5.317 4.678 5.747L5.298 9.036L6.872 5.106ZM10.599 5.108L9.359 10.913L7.864 10.911L9.104 5.106L10.599 5.108ZM13.631 5C14.077 5 14.641 5.138 14.965 5.267L14.703 6.471C14.41 6.353 13.928 6.194 13.523 6.201C12.933 6.21 12.569 6.457 12.569 6.694C12.569 7.078 13.201 7.272 13.853 7.693C14.596 8.173 14.693 8.603 14.684 9.071C14.674 10.042 13.853 11 12.12 11C11.329 10.988 11.044 10.922 10.4 10.694L10.672 9.438C11.328 9.712 11.607 9.799 12.167 9.799C12.682 9.799 13.123 9.592 13.127 9.231C13.129 8.974 12.972 8.847 12.395 8.529C11.818 8.212 11.01 7.773 11.02 6.889C11.033 5.759 12.107 5 13.63 5H13.631Z" fill="#101010" />
                            </svg>
                            :
                            <img className={classes.thumbImg} src="./imgs/walkinkingman.svg" alt="payment when delivered" />
                        }
                        <div className={classes.methodSelcted}>{methodSelected === qiwi ? uponDelivery : qiwi}</div>
                    </div>
                </div>
            </div>
            <div className={classes.promoCode}>
                <svg width="18" height="16" viewBox="0 0 18 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 5.77778V0.888889C0 0.653141 0.0948211 0.427048 0.263604 0.260349C0.432387 0.0936505 0.661305 0 0.9 0H17.1C17.3387 0 17.5676 0.0936505 17.7364 0.260349C17.9052 0.427048 18 0.653141 18 0.888889V5.77778C17.4033 5.77778 16.831 6.0119 16.409 6.42865C15.9871 6.8454 15.75 7.41063 15.75 8C15.75 8.58937 15.9871 9.1546 16.409 9.57135C16.831 9.9881 17.4033 10.2222 18 10.2222V15.1111C18 15.3469 17.9052 15.573 17.7364 15.7397C17.5676 15.9064 17.3387 16 17.1 16H0.9C0.661305 16 0.432387 15.9064 0.263604 15.7397C0.0948211 15.573 0 15.3469 0 15.1111V10.2222C0.596737 10.2222 1.16903 9.9881 1.59099 9.57135C2.01295 9.1546 2.25 8.58937 2.25 8C2.25 7.41063 2.01295 6.8454 1.59099 6.42865C1.16903 6.0119 0.596737 5.77778 0 5.77778ZM10.8 1.77778H1.8V4.416C2.47609 4.74693 3.04513 5.25782 3.44295 5.89107C3.84078 6.52433 4.05158 7.25475 4.05158 8C4.05158 8.74525 3.84078 9.47567 3.44295 10.1089C3.04513 10.7422 2.47609 11.2531 1.8 11.584V14.2222H10.8V1.77778ZM12.6 1.77778V14.2222H16.2V11.584C15.5239 11.2531 14.9549 10.7422 14.557 10.1089C14.1592 9.47567 13.9484 8.74525 13.9484 8C13.9484 7.25475 14.1592 6.52433 14.557 5.89107C14.9549 5.25782 15.5239 4.74693 16.2 4.416V1.77778H12.6Z" fill="#101010" />
                </svg>
                <input type='text' ref={promoRef} className={classes.promoInput} placeholder={promo}/>
                <svg className={classes.tick} width="6" height="9" viewBox="0 0 6 9" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={() => {if (promoRef.current !== null && promoRef.current !== undefined) {handlePromo(promoRef.current.value)}}}>
                    <path d="M5.657 4.24284L1.414 8.48584L-6.18516e-08 7.07084L2.829 4.24284L-3.09083e-07 1.41484L1.414 -0.000160279L5.657 4.24284Z" fill="#838383" />
                </svg>
            </div>
        </div>
    )
}
