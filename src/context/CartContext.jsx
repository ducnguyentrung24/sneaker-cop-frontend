import { useAuth } from "./AuthContext";

import { createContext, useContext, useState, useEffect } from 'react';
import {
    getCart,
    addToCart,
    updateCartItem,
    deleteCartItem,
    deleteManyCartItems,
} from '../services/cart.service';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const { user } = useAuth();

    const [cart, setCart] = useState({
        items: [],
        total_price: 0,
    });

    const fetchCart = async () => {
        try {
            const res = await getCart();
            setCart(res.data);
        } catch(error) {
            console.error("Failed to fetch cart:", error);
        }
    };

    useEffect(() => {
        if (!user) return;
        fetchCart();
    }, [user]);

    const add = async (variant_id, quantity) => {
        try {
            const res = await addToCart({ variant_id, quantity });
            await fetchCart();
        } catch(error) {
            console.error("Failed to add to cart:", error);
        }
    };

    const update = async (id, quantity) => {
        if (quantity < 1) return;

        try {
            await updateCartItem(id, { quantity });
            setCart(prev => ({
                ...prev,
                items: prev.items.map(i =>
                    i.id === id
                        ? { ...i, quantity, total: i.price * quantity }
                        : i
                ),
            }));

        } catch(error) {
            console.error("Failed to update cart item:", error);
            
            const message = error.response?.data?.message || "Vượt quá số lượng tồn kho";
            alert(message);
        }
    };

    const remove = async (id) => {
        try {
            await deleteCartItem(id);
            setCart(prev => ({
                ...prev,
                items: prev.items.filter(i => i.id !== id),
            }));
        } catch(error) {
            console.error("Failed to remove from cart:", error);
        }
    };

    const removeMany = async (ids) => {
        try {
            await deleteManyCartItems(ids);
            setCart(prev => ({
                ...prev,
                items: prev.items.filter(i => !ids.includes(i.id)),
            }));
        } catch(error) {
            console.error("Failed to remove from cart:", error);
        }
    };

    return (
        <CartContext.Provider value = {{
            cart,
            fetchCart,
            addToCart: add,
            updateQuantity: update,
            removeItem: remove,
            removeManyItems: removeMany,
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);