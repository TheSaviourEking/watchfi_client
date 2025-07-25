const getApiBaseUrl = () => {
    return import.meta.env.PROD
        ? import.meta.env.VITE_API_BASE_URL_PRODUCTION || 'https://watchfi-prod.onrender.com/'
        : import.meta.env.VITE_API_BASE_URL_DEVELOPMENT || 'http://localhost:5000/';
};

const api = {
    baseURL: getApiBaseUrl(),
    
    endpoints: {
        collections: '/api/v1/collections',
        collectionDetails: '/api/v1/collections/',
        filter: '/api/v1/filter',
        customers: '/api/v1/customers',
        bookings: '/api/vi/bookings',
        verifyBookings: '/api/v1/bookings/verify'
    },

    getUrl: function (endpoint, param = '') {
        // console.log(`${this.baseURL}${this.endpoints[endpoint]}${param}`);
        return `${this.baseURL}${this.endpoints[endpoint]}${param}`;
    }
};

export default api;