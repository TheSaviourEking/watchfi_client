import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useCustomerStore = create(
    persist(
        (set, get) => ({
            customer: {},
        }),
        {
            name: 'user-storage', // unique name for localStorage key
            // Only persist the cart array, not the functions
            partialize: (state) => ({ customer: state.customer }),
        }
    )
)

// customer would have a name, 