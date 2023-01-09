import { useContext, createContext, ReactNode, useState, useEffect } from "react";
import { ShopingCart } from "../components/ShopingCart";
import { useLocalStorage } from "../hooks/useLocalStorage";

type ShoppingCartProviderProps = {
    children: ReactNode
}

type CartItem = {
    id: number,
    quantity: number
}

type ShoppingCartContext = {
    openCart: () => void
    closeCart: () => void
    getItemQuantity: (id: number) => number
    increaseCartQuantity: (id: number) => void
    descreaseCartQuantity: (id: number) => void
    removeFromCart: (id: number) => void
    cartQuantity: number
    cartItems: CartItem[]
}

const ShoppingCartContext = createContext({} as ShoppingCartContext)

export function useShoppingCart() {
    return useContext(ShoppingCartContext)
}

export function ShoppingCartProvider({ children }: ShoppingCartProviderProps) {
    const [cartItems, setCartItems] = useLocalStorage<CartItem[]>("shoping-cart", [])
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

    function getItemQuantity(id: number) {
        return cartItems.find(item => item.id === id)?.quantity || 0
    }
    function increaseCartQuantity(id: number) {
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
    function descreaseCartQuantity(id: number) {
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
    function removeFromCart(id: number) {
        setCartItems(prev => {
            return prev.filter(item => item.id !== id)
        })
    }
    const openCart = () => { setIsOpen(true) }
    const closeCart = () => { setIsOpen(false) }

    return (
        <ShoppingCartContext.Provider value={{
            getItemQuantity,
            increaseCartQuantity,
            descreaseCartQuantity,
            removeFromCart,
            cartItems,
            cartQuantity,
            openCart,
            closeCart
        }}>
            {children}
            {/* <ShopingCart open={isOpen} /> */}
        </ShoppingCartContext.Provider>
    )
}
