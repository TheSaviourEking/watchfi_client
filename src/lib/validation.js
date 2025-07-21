export const validateBillingData = (data) => {
    return !!(
        data.name &&
        data.phone &&
        data.address &&
        data.country &&
        data.city
    );
};

export const validatePaymentMethod = (method) => {
    // return ['card', 'crypto'].includes(method);
    return ['crypto'].includes(method);
};

export const validateStep = (step, billingData, paymentMethod) => {
    switch (step) {
        case 1:
            return validateBillingData(billingData);
        case 2:
            return validatePaymentMethod(paymentMethod);
        case 3:
            return true;
        default:
            return false;
    }
};