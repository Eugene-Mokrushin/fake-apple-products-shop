import { ReactNode, useEffect, useState } from 'react'
import classes from '../../scss/Favorites.module.scss'
import { useMobileAndLang } from '../context/IsMobileLangContext'
import { useShoppingCart } from '../context/ShoppingCartContext'
import goods from '../data/individual_good.json'

export function Favorites() {

    const { favItems, addRemoveItemToFav } = useShoppingCart()
    const { lang } = useMobileAndLang()
    const [cards, setCards] = useState<ReactNode[]>([])
    const re_img = /_AC_S[A-Z]\d*_/g

    function handleClickFav(e: React.MouseEvent<HTMLImageElement, MouseEvent>, id: string) {
        addRemoveItemToFav(id);
        if (e.target && id) {
            (e.target as HTMLInputElement).src = (e.target as HTMLInputElement).src.split('/').pop() == "heart_filled.svg"
                ? './imgs/heart.svg'
                : './imgs/heart_filled.svg'
        }
    }

    useEffect(() => {
        async function createCards() {
            async function getRub() {
                const rub_exchange = await fetch('https://api.exchangerate.host/latest?base=USD', {
                    method: "GET"
                })
                    .then(res => res.json())
                return rub_exchange.rates.RUB
            }
            const currencyMultiplier = lang === "en" ? 1 : await getRub()

            const cards_data = favItems.map((id: string, index: number) => {
                const card_data = goods[id as keyof typeof goods]
                const small_card_title = (card_data['title'] as string).split(' ').slice(0, 6).join(' ')
                const realPrice = card_data['price'] ? card_data['price'] : '$10'
                const price = lang === "en" ? realPrice : (+realPrice.split("$")[1] * currencyMultiplier).toFixed(2) + "₽"

                const allImages = (card_data["images_url"] as []).map((image: string, index) => {
                    return (
                        <img
                            key={crypto.randomUUID()}
                            id={`${index + 1}`} src={String(image).replace(re_img, "_AC_SX300_")}
                            alt="Good preview"
                            className={`${classes.imgPreview} imgPreview ${id}`}
                        />
                    )
                })

                return (
                    <div className={`${classes.card} card`} id={String(index + 1)} key={index}>
                        <img src={favItems.includes(id) ? './imgs/heart_filled.svg' : './imgs/heart.svg'}
                            alt='added to favorite'
                            data-active={favItems.includes(id) ? true : false}
                            id={id}
                            className={classes.favIco}
                            onClick={(e) => handleClickFav(e, id)}
                        />
                        <div className={classes.allImagesWrapper}>
                            {allImages}
                            <div className={classes.dots}>
                                {allImages.map((img, index: number) => {
                                    return (
                                        <div
                                            className={`${classes.dot} ${index === 0 ? classes.highlighted : ''}`}
                                            key={crypto.randomUUID()}
                                            id={`${index + 1}`}
                                        >
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                        <div className={classes.titleAndPrice}>
                            <h5 className={classes.title}>{small_card_title}</h5>
                            <p className={classes.price}>{price}</p>
                        </div>
                    </div>
                )
            })
            setCards(cards_data)
        }
        createCards()

    }, [])

    return (
        <div className={classes.favWrapper}>
            <div className={classes.cardsWrapper}>
                {cards}
            </div>
        </div>
    )
}
