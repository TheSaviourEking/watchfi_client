const getApiBaseUrl = () => {
    return import.meta.env.PROD
        ? import.meta.env.VITE_API_BASE_URL_PRODUCTION || 'http://204.236.211.44'
        : import.meta.env.VITE_API_BASE_URL_DEVELOPMENT || 'http://localhost:5000';
};

const api = {
    baseURL: getApiBaseUrl(),

    endpoints: {
        collections: '/api/v1/collections',
        collectionDetails: '/api/v1/collections/',
        filter: '/api/v1/filter',
        customers: '/api/v1/customers',
        bookings: '/api/v1/bookings', // Fixed typo: 'vi' → 'v1'
        verifyBookings: '/api/v1/bookings/verify',
    },

    getUrl: function (endpoint, param = '') {
        // Ensure no double slashes
        const cleanBaseURL = this.baseURL.replace(/\/+$/, '');
        const cleanEndpoint = this.endpoints[endpoint].replace(/^\/+/, '');
        return `${cleanBaseURL}/${cleanEndpoint}${param}`;
    },
};

export default api;