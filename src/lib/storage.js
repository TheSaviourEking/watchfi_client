export const saveToStorage = (key, data) => {
    try {
        if (typeof window !== 'undefined') {
            localStorage.setItem(key, JSON.stringify(data));
        }
    } catch (error) {
        console.error('Error saving to storage:', error);
    }
};

export const loadFromStorage = (key) => {
    try {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem(key);
            return saved ? JSON.parse(saved) : null;
        }
        return null;
    } catch (error) {
        console.error('Error loading from storage:', error);
        return null;
    }
};

export const clearStorage = (key) => {
    try {
        if (typeof window !== 'undefined') {
            localStorage.removeItem(key);
        }
    } catch (error) {
        console.error('Error clearing storage:', error);
    }
};