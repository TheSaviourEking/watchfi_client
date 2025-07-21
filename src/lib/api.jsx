const getApiBaseUrl = () => {
    return import.meta.env.PROD
        ? import.meta.env.VITE_API_BASE_URL_PRODUCTION
        : import.meta.env.VITE_API_BASE_URL_DEVELOPMENT || 'http://localhost:3000/api/v1/'

};

export class ApiClient {
    baseUrl;
    defaultHeaders;

    constructor(
        baseUrl = getApiBaseUrl()
    ) {
        this.baseUrl = baseUrl;
        this.defaultHeaders = {
            'Content-Type': 'application/json',
        };
    }

    // async request(
    //     endpoint,
    //     options = {}
    // ) {
    //     const url = `${this.baseUrl}${endpoint}`;

    //     try {
    //         const response = await fetch(url, {
    //             ...options,
    //             headers: {
    //                 ...this.defaultHeaders,
    //                 ...options.headers,
    //             },
    //         });

    //         const data = await response.json();

    //         if (!response.ok) {
    //             return {
    //                 success: false,
    //                 error: data.error || 'Request failed',
    //                 message: data.message || `HTTP ${response.status}: ${response.statusText}`,
    //                 statusCode: response.status,
    //             };
    //         }

    //         return data;
    //     } catch (error) {
    //         if (error instanceof Error && error.name === 'AbortError') {
    //             throw error; // Re-throw abort errors
    //         }

    //         return {
    //             success: false,
    //             error: 'Network error',
    //             message: error instanceof Error ? error.message : 'Unknown error occurred',
    //         };
    //     }
    // }

    // In your ApiClient class, within the request method
    async request(
        endpoint,
        options = {}
    ) {
        const url = `${this.baseUrl}${endpoint}`;
        console.log("Constructed API URL:", url); // <--- ADD THIS LINE
        console.log("Request options:", options); // <--- AND THIS LINE

        try {
            const response = await fetch(url, {
                ...options,
                headers: {
                    ...this.defaultHeaders,
                    ...options.headers,
                },
            });
            // ... rest of your code
        } catch (error) {
            console.error("API request failed:", error); // <--- IMPROVE THIS LOG
            // ...
        }
    }

    async get(endpoint, params, signal) {
        const queryString = params ? `?${new URLSearchParams(params).toString()}` : '';
        return this.request(`${endpoint}${queryString}`, {
            method: 'GET',
            signal
        });
    }

    async post(endpoint, data, signal) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(data),
            signal
        });
    }

    async put(endpoint, data, signal) {
        return this.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data),
            signal
        });
    }

    async delete(endpoint, signal) {
        return this.request(endpoint, {
            method: 'DELETE',
            signal
        });
    }
}

// Create a singleton instance
export const apiClient = new ApiClient();

// Custom hook for API calls with loading states
import { useState, useCallback } from 'react';

export function useApi(
    endpoint,
    options = {}
) {
    const [state, setState] = useState({
        data: null,
        isLoading: false,
        error: null,
        lastFetch: null,
    });

    const execute = useCallback(async (params) => {
        setState(prev => ({ ...prev, isLoading: true, error: null }));

        try {
            const response = await apiClient.get(endpoint, params);

            if (response.success) {
                setState(prev => ({
                    ...prev,
                    data: response.data,
                    isLoading: false,
                    lastFetch: new Date(),
                }));

                if (options.onSuccess) {
                    options.onSuccess(response.data);
                }

                return response.data;
            } else {
                setState(prev => ({
                    ...prev,
                    error: response.message,
                    isLoading: false,
                }));

                if (options.onError) {
                    options.onError(response.message);
                }

                return null;
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            setState(prev => ({
                ...prev,
                error: errorMessage,
                isLoading: false,
            }));

            if (options.onError) {
                options.onError(errorMessage);
            }

            return null;
        }
    }, [endpoint, options]);

    const reset = useCallback(() => {
        setState({
            data: null,
            isLoading: false,
            error: null,
            lastFetch: null,
        });
    }, []);

    const setData = useCallback((data) => {
        setState(prev => ({ ...prev, data }));
    }, []);

    return {
        ...state,
        execute,
        reset,
        setData,
    };
}

// Enhanced debounce hook
import { useEffect, useRef } from 'react';

export function useDebounce(
    callback,
    delay,
    deps = []
) {
    const timeoutRef = useRef(null);
    const callbackRef = useRef(callback);

    // Update callback ref when dependencies change
    useEffect(() => {
        callbackRef.current = callback;
    }, [callback, ...deps]);

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    const debouncedCallback = useCallback(
        ((...args) => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }

            timeoutRef.current = setTimeout(() => {
                callbackRef.current(...args);
            }, delay);
        }),
        [delay]
    );

    return debouncedCallback;
}

// URL parameter utilities
export function getUrlParams() {
    return new URLSearchParams(window.location.search);
}

export function setUrlParams(params) {
    const urlParams = getUrlParams();

    Object.entries(params).forEach(([key, value]) => {
        if (value === null) {
            urlParams.delete(key);
        } else {
            urlParams.set(key, value);
        }
    });

    const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
    window.history.pushState({}, '', newUrl);
}

// Validation utilities
export function validateSearchParams(params) {
    const validSortOptions = ['name', 'price', 'newest', 'oldest'];

    return {
        category: params.category && typeof params.category === 'string' ? params.category : undefined,
        sort: params.sort && validSortOptions.includes(params.sort) ? params.sort : undefined,
        search: params.search && typeof params.search === 'string' ? params.search.trim() : undefined,
        page: params.page && /^\d+$/.test(params.page) ? params.page : undefined,
        limit: params.limit && /^\d+$/.test(params.limit) ? params.limit : undefined,
    };
}

// Error boundary for React components
import React from 'react';

export class ApiErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('API Error Boundary caught an error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-8 max-w-md w-full mx-4">
                        <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full">
                            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-semibold text-red-800 mb-2 text-center">
                            Something went wrong
                        </h2>
                        <p className="text-red-600 text-center mb-4">
                            {this.state.error?.message || 'An unexpected error occurred'}
                        </p>
                        <button
                            onClick={() => window.location.reload()}
                            className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
                        >
                            Reload Page
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

// Local storage utilities with error handling
export const storage = {
    get(key, defaultValue) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.error(`Error reading from localStorage key "${key}":`, error);
            return defaultValue;
        }
    },

    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error(`Error writing to localStorage key "${key}":`, error);
            return false;
        }
    },

    remove(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error(`Error removing localStorage key "${key}":`, error);
            return false;
        }
    },

    clear() {
        try {
            localStorage.clear();
            return true;
        } catch (error) {
            console.error('Error clearing localStorage:', error);
            return false;
        }
    }
};

// Format utilities for display
export const formatters = {
    currency: (amount, currency = 'USD') => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency,
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    },

    date: (date) => {
        const d = typeof date === 'string' ? new Date(date) : date;
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        }).format(d);
    },

    relativeTime: (date) => {
        const d = typeof date === 'string' ? new Date(date) : date;
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000);

        if (diffInSeconds < 60) return 'Just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
        if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;

        return formatters.date(d);
    },

    truncate: (text, length = 100) => {
        if (text.length <= length) return text;
        return text.substring(0, length).trim() + '...';
    }
};
