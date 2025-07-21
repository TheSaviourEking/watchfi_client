export const COUNTRIES = [
    { value: 'US', label: 'United States' },
    { value: 'CA', label: 'Canada' },
    { value: 'UK', label: 'United Kingdom' },
    { value: 'DE', label: 'Germany' },
];

export const CITIES = {
    US: ['New York', 'Los Angeles', 'San Francisco', 'Chicago'],
    CA: ['Toronto', 'Vancouver', 'Montreal', 'Calgary'],
    UK: ['London', 'Manchester', 'Birmingham', 'Edinburgh'],
    DE: ['Berlin', 'Munich', 'Hamburg', 'Frankfurt'],
};

export const PRODUCT_DATA = {
    name: 'Audemars Piguet Royal Oak Offshore',
    ref: 'Ref. 26238TI.OO.2000TI.01',
    price: 67000,
    image: '/api/placeholder/400/400'
};

export const CHECKOUT_ACTIONS = {
    SET_STEP: 'SET_STEP',
    SET_BILLING_DATA: 'SET_BILLING_DATA',
    SET_PAYMENT_METHOD: 'SET_PAYMENT_METHOD',
    LOAD_FROM_STORAGE: 'LOAD_FROM_STORAGE',
    RESET_FORM: 'RESET_FORM'
};