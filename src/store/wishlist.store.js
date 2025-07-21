import { create } from "zustand";

const useWishlistStore = create(set => ({
    wishlist: [],

    addToWishlist: (item) => set(state => ({
        wishlist: [...state.wishlist, item]
    })),

    removeFromWishlist: (item => set(state => ({
        wishlist: state.wishlist.filter(wishlistItem => wishlistItem !== item)
    }))),

    emptyWishlist: () => set(() => ({
        wishlist: []
    }))
}));

export default useWishlistStore;