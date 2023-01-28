import { useContext, createContext, ReactNode, useState, useEffect } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";

type ShoppingCartProviderProps = {
    children: ReactNode
}

type CartItem = {
    id: string,
    quantity: number
}

type ShoppingCartContext = {
    addRemoveItemToFav: (id: string) => void
    getItemQuantity: (id: string) => number
    increaseCartQuantity: (id: string) => void
    descreaseCartQuantity: (id: string) => void
    removeFromCart: (id: string) => void,
    pickDeliveryMethod: (method: string) => void,
    cartQuantity: number,
    deliveryMethod: string,
    cartItems: CartItem[],
    favItems: string[]
}

const ShoppingCartContext = createContext({} as ShoppingCartContext)

export function useShoppingCart() {
    return useContext(ShoppingCartContext)
}

export function ShoppingCartProvider({ children }: ShoppingCartProviderProps) {
    const [cartItems, setCartItems] = useLocalStorage<CartItem[]>("shoping-cart", [])
    const [favItems, setFavItems] = useLocalStorage<string[]>("fav-items", [])
    const [deliveryMethod, setDeliveryMethod] = useLocalStorage<string>("deliveryMethod", "")
    const [isOpen, setIsOpen] = useState(false)
    const cartQuantity = cartItems.reduce((quantity, item) => item.quantity + quantity, 0)

    useEffect(() => {
        if (document.querySelector('body') === null) return
        else {
            if (isOpen) {
                document.querySelector('body')!.style.overflowY = "hidden";
            } else {
                document.querySelector('body')!.style.overflowY = "auto";
            }
        }
    }, [isOpen])

    function pickDeliveryMethod(method: string) {
        setDeliveryMethod(method)
    }

    function addRemoveItemToFav(id: string) {
        setFavItems((prev) => {
            if (prev.indexOf(id) !== -1) {
                return prev.filter(item => item !== id)
            } else {
                return [...prev, id]
            }
        })
    }

    function getItemQuantity(id: string) {
        return cartItems.find(item => item.id === id)?.quantity || 0
    }
    function increaseCartQuantity(id: string) {
        setCartItems(prev => {
            if (prev.find(item => item.id === id) == null) {
                return [...prev, { id: id, quantity: 1 }]
            } else {
                return prev.map(item => {
                    if (item.id === id) {
                        return { ...item, quantity: item.quantity + 1 }
                    } else {
                        return item
                    }
                })
            }
        })
    }
    function descreaseCartQuantity(id: string) {
        setCartItems(prev => {
            if (prev.find(item => item.id === id)?.quantity === 0) {
                return prev.filter(item => item.id !== id)
            } else {
                return prev.map(item => {
                    if (item.id === id) {
                        return { ...item, quantity: item.quantity - 1 }
                    } else {
                        return item
                    }
                })
            }
        })
    }
    function removeFromCart(id: string) {
        setCartItems(prev => {
            return prev.filter(item => item.id !== id)
        })
    }

    return (
        <ShoppingCartContext.Provider value={{
            addRemoveItemToFav,
            getItemQuantity,
            increaseCartQuantity,
            descreaseCartQuantity,
            removeFromCart,
            cartItems,
            deliveryMethod,
            cartQuantity,
            pickDeliveryMethod,
            favItems
        }}>
            {children}
        </ShoppingCartContext.Provider>
    )
}
