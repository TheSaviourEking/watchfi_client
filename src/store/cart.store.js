import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useCartStore = create(
    persist(
        (set, get) => ({
            cart: [],

            addToCart: (item) =>
                set((state) => {
                    const existingItem = state.cart.find((cartItem) => cartItem.id === item.id);

                    if (existingItem) {
                        // If item exists, increase quantity
                        const newQuantity = existingItem.quantity + 1;
                        return {
                            cart: state.cart.map((cartItem) =>
                                cartItem.id === item.id
                                    ? {
                                        ...cartItem,
                                        quantity: newQuantity,
                                        totalPrice: parseFloat(cartItem.price) * newQuantity
                                    }
                                    : cartItem
                            ),
                        };
                    } else {
                        // If item doesn't exist, add with quantity 1
                        return {
                            cart: [...state.cart, {
                                ...item,
                                quantity: 1,
                                totalPrice: parseFloat(item.price) * 1
                            }],
                        };
                    }
                }),

            removeFromCart: (item) =>
                set((state) => {
                    const existingItem = state.cart.find((cartItem) => cartItem.id === item.id);

                    if (existingItem && existingItem.quantity > 1) {
                        // If quantity > 1, decrease quantity
                        const newQuantity = existingItem.quantity - 1;
                        return {
                            cart: state.cart.map((cartItem) =>
                                cartItem.id === item.id
                                    ? {
                                        ...cartItem,
                                        quantity: newQuantity,
                                        totalPrice: parseFloat(cartItem.price) * newQuantity
                                    }
                                    : cartItem
                            ),
                        };
                    } else {
                        // If quantity = 1, remove item completely
                        return {
                            cart: state.cart.filter((cartItem) => cartItem.id !== item.id),
                        };
                    }
                }),

            clearCart: () =>
                set(() => ({
                    cart: [],
                })),

            getTotalItems: () => {
                return get().cart.reduce((total, item) => total + item.quantity, 0);
            },

            getTotalPrice: () => {
                return get().cart.reduce((total, item) => total + item.totalPrice, 0);
            },

            showCart: () => {
                return get().cart;
            },

            // ✅ Check if item is already in the cart
            itemInCart: (item) => {
                const cart = get().cart;
                return cart.some((cartItem) => cartItem.id === item.id);
            },
        }),
        {
            name: 'cart-storage', // unique name for localStorage key
            // Only persist the cart array, not the functions
            partialize: (state) => ({ cart: state.cart }),
        }
    )
);

export default useCartStore;