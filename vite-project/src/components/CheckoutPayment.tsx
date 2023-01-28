import classes from '../../scss/CheckoutPayment.module.scss';
import checkout_data from '../data/Checkout.json';

type CheckoutPaymentProps = {
    lang: string
}

export function CheckoutPayment({ lang }: CheckoutPaymentProps) {
    const mainTitle = checkout_data.paymentMethodTitle[lang as keyof typeof checkout_data.paymentMethodTitle]

    return (
        <div className='paymentWrapper'>
            <div className="mainTitle">{mainTitle}</div>
            <select className="paymontMethods">
                <option value=""></option>
            </select>
        </div>
    )
}
