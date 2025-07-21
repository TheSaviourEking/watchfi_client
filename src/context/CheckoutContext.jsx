import { createContext, useReducer, useEffect, ReactNode } from 'react';
import { CHECKOUT_ACTIONS } from '@/lib/constants';
import { saveToStorage, loadFromStorage } from '@/lib/storage';
import { validateStep } from '@/lib/validation';

const totalSteps = 4; // Define total steps here or import from a constants file

const initialState = {
    currentStep: 1,
    billingData: {
        name: '',
        phone: '',
        address: '',
        country: loadFromStorage('checkout-data')?.country || 'US',
        city: '',
    },
    paymentMethod: 'crypto',
    isValid: false,
};

const checkoutReducer = (state, action) => {
    switch (action.type) {
        case CHECKOUT_ACTIONS.SET_STEP:
            // Ensure step is within valid range
            return { ...state, currentStep: Math.max(1, Math.min(action.payload, totalSteps)) };
        case CHECKOUT_ACTIONS.SET_BILLING_DATA:
            return {
                ...state,
                billingData: { ...state.billingData, ...action.payload },
            };
        case CHECKOUT_ACTIONS.SET_PAYMENT_METHOD:
            return { ...state, paymentMethod: action.payload };
        case CHECKOUT_ACTIONS.LOAD_FROM_STORAGE:
            return { ...state, ...action.payload };
        case CHECKOUT_ACTIONS.RESET_FORM:
            return initialState;
        default:
            return state;
    }
};

export const CheckoutContext = createContext(null);

export const CheckoutProvider = ({ children }) => {
    const [state, dispatch] = useReducer(checkoutReducer, initialState);

    // Load data from localStorage on mount and validate step
    useEffect(() => {
        const savedData = loadFromStorage('checkout-data');
        if (savedData) {
            // Validate the restored step
            const step = Math.max(1, Math.min(savedData.currentStep || 1, totalSteps));
            const isValidStep = validateStep(step, savedData.billingData, savedData.paymentMethod);
            dispatch({
                type: CHECKOUT_ACTIONS.LOAD_FROM_STORAGE,
                payload: {
                    ...savedData,
                    currentStep: isValidStep ? step : 1, // Fallback to step 1 if invalid
                },
            });
        }
    }, []);

    // Save to localStorage whenever state changes
    useEffect(() => {
        saveToStorage('checkout-data', state);
    }, [state]);

    // Action creators
    const setCurrentStep = (step) => {
        dispatch({ type: CHECKOUT_ACTIONS.SET_STEP, payload: step });
    };

    const setBillingData = (data) => {
        dispatch({ type: CHECKOUT_ACTIONS.SET_BILLING_DATA, payload: data });
    };

    const setPaymentMethod = (method) => {
        dispatch({ type: CHECKOUT_ACTIONS.SET_PAYMENT_METHOD, payload: method });
    };

    const resetForm = () => {
        dispatch({ type: CHECKOUT_ACTIONS.RESET_FORM });
        saveToStorage('checkout-data', initialState);
    };

    const validateCurrentStep = (step) => {
        return validateStep(step, state.billingData, state.paymentMethod);
    };

    const value = {
        ...state,
        setCurrentStep,
        setBillingData,
        setPaymentMethod,
        resetForm,
        validateStep: validateCurrentStep,
    };

    return <CheckoutContext.Provider value={value}>{children}</CheckoutContext.Provider>;
};