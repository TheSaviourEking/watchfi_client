import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useNavigate, useLocation } from 'react-router';
import { Heart, ShoppingCart, AlignJustify, ArrowRight, Search, X } from 'lucide-react';
import useCartStore from '../store/cart.store';
import api from '../config/apiConfig';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/apple-cards-carousel';
import NavMenu from '../components/NavMenu';

// Simple focus trap implementation
const FocusTrap = ({ children }) => {
    const trapRef = useRef(null);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Tab') {
                const focusable = trapRef.current.querySelectorAll('button, [href], input, select, textarea');
                const first = focusable[0];
                const last = focusable[focusable.length - 1];
                if (e.shiftKey && document.activeElement === first) {
                    last.focus();
                    e.preventDefault();
                } else if (!e.shiftKey && document.activeElement === last) {
                    first.focus();
                    e.preventDefault();
                }
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, []);

    return <div ref={trapRef}>{children}</div>;
};

// Error Boundary Component
class ErrorBoundary extends React.Component {
    state = { hasError: false };

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    render() {
        if (this.state.hasError) {
            return this.props.fallback;
        }
        return this.props.children;
    }
}

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [searchActive, setSearchActive] = useState(false);
    const [cartHover, setCartHover] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { cart = [] } = useCartStore();
    const searchInputRef = useRef(null);

    // Search state
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [searchLoading, setSearchLoading] = useState(false);
    const [searchError, setSearchError] = useState(null);
    const [recentSearches, setRecentSearches] = useState([]);

    // Handle scroll for navbar styling
    useEffect(() => {
        const handleScroll = () => {
            if (searchActive) return;
            const scrollTop = window.scrollY;
            setIsScrolled(scrollTop > 90);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [searchActive]);

    // Close menu on route change
    useEffect(() => {
        setIsOpen(false);
        setSearchActive(false);
    }, [location.pathname]);

    // Focus search input when activated
    useEffect(() => {
        if (searchActive && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [searchActive]);

    // Load recent searches from localStorage
    useEffect(() => {
        const storedSearches = localStorage.getItem('recentSearches');
        if (storedSearches) {
            setRecentSearches(JSON.parse(storedSearches));
        } else {
            setRecentSearches(['Rolex', 'Omega', 'Patek Philippe', 'Audemars Piguet']);
        }
    }, []);

    const handleSearchToggle = () => {
        setSearchActive(!searchActive);
        if (!searchActive) {
            setSearchTerm('');
            setSearchResults([]);
            setSearchError(null);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
            setSearchActive(false);
            setIsOpen(false);
        }
    };

    // Search function using Fastify API
    const performSearch = useCallback(async (query) => {
        if (!query.trim()) {
            setSearchResults([]);
            return;
        }

        try {
            setSearchLoading(true);
            setSearchError(null);

            // Fetch watches from Fastify API
            const response = await api.get('/watches', {
                params: {
                    search: query,
                    isAvailable: true,
                    deletedAt: null,
                },
            });

            setSearchResults(response.data.map(watch => ({
                id: watch.id,
                title: watch.name,
                brand: watch.brand.name,
                price: watch.priceInCents / 100,
                image: watch.primaryPhotoUrl || '/images/fallback-watch.jpg',
            })));
        } catch (error) {
            console.error('Search error:', error);
            setSearchError('Failed to load search results');
            setSearchResults([]);
        } finally {
            setSearchLoading(false);
        }
    }, []);

    // Debounced search
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (searchActive) {
                performSearch(searchTerm);
            }
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [searchTerm, searchActive, performSearch]);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            setRecentSearches((prev) => {
                const updated = [searchTerm, ...prev.filter((item) => item !== searchTerm)].slice(0, 4);
                localStorage.setItem('recentSearches', JSON.stringify(updated));
                return updated;
            });

            navigate(`/collections?search=${encodeURIComponent(searchTerm)}`);
            setSearchActive(false);
        }
    };

    const handleRecentSearch = (query) => {
        setSearchTerm(query);
        navigate(`/collections?search=${encodeURIComponent(query)}`);
        setSearchActive(false);
    };

    const clearRecentSearches = () => {
        setRecentSearches([]);
        localStorage.removeItem('recentSearches');
    };

    const shouldShowRoundedNavbar = isScrolled && !searchActive;

    return (
        <ErrorBoundary fallback={<div className="text-white text-center py-4">Something went wrong in the navbar. Please refresh.</div>}>
            <>
                {/* Backdrop for mobile menu */}
                <div
                    className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-all duration-300 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'} md:hidden lg:hidden`}
                    onClick={() => setIsOpen(false)}
                />

                <header
                    className={`
            ${shouldShowRoundedNavbar ? 'fixed top-4 left-1/2 transform -translate-x-1/2 z-50' : 'absolute w-full z-[9999]'}
            transition-all duration-500 ease-out
            ${shouldShowRoundedNavbar ? 'w-full max-w-7xl mx-auto px-4' : ''}
          `}
                    onKeyDown={handleKeyDown}
                >
                    <nav
                        className={`
              relative grid grid-cols-3 items-center text-white
              ${shouldShowRoundedNavbar ? 'mx-auto px-6' : 'container mx-auto'}
              ${shouldShowRoundedNavbar ? 'bg-black/80 backdrop-blur-lg rounded-full py-3 shadow-2xl border border-white/10' : 'py-4'}
              transition-all duration-500 ease-out
            `}
                    >
                        {/* Left Section - Menu Button */}
                        <div className="flex items-center justify-start">
                            <button
                                onClick={() => setIsOpen(!isOpen)}
                                aria-label={isOpen ? 'Close menu' : 'Open menu'}
                                aria-expanded={isOpen}
                                className={`
                  p-2 relative flex items-center justify-center rounded-full
                  transition-all duration-300 ease-out
                  hover:bg-white/10 hover:scale-110 active:scale-95
                  focus:outline-none focus:ring-2 focus:ring-white/20
                  ${isOpen ? 'bg-white/10' : ''}
                `}
                            >
                                <div className="relative w-6 h-6">
                                    <AnimatePresence mode="wait">
                                        {isOpen ? (
                                            <motion.div
                                                key="close"
                                                initial={{ opacity: 0, rotate: -90, scale: 0.8 }}
                                                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                                                exit={{ opacity: 0, rotate: -90, scale: 0.8 }}
                                                transition={{ duration: 0.3 }}
                                                className="absolute inset-0 flex items-center justify-center"
                                            >
                                                <X className="w-6 h-6 text-gray-300" />
                                            </motion.div>
                                        ) : (
                                            <motion.div
                                                key="menu"
                                                initial={{ opacity: 0, rotate: -90, scale: 0.8 }}
                                                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                                                exit={{ opacity: 0, rotate: -90, scale: 0.8 }}
                                                transition={{ duration: 0.3 }}
                                                className="absolute inset-0 flex items-center justify-center"
                                            >
                                                <AlignJustify className="w-6 h-6 text-gray-300" />
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </button>
                        </div>

                        {/* Center Section - Logo */}
                        <div className="flex items-center justify-center transition-all duration-500 ease-out">
                            <Link
                                to="/"
                                className="text-2xl font-bold tracking-wider hover:scale-105 transition-transform duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-white/20 rounded px-2 py-1"
                            >
                                <span className="bg-gradient-to-r from-white via-gray-200 to-gray-300 bg-clip-text text-transparent">
                                    <img
                                        src="/logo.svg"
                                        alt="WatchFi Logo"
                                        className="h-8 inline"
                                        onError={(e) => (e.currentTarget.src = '/images/fallback-logo.jpg')}
                                    />
                                </span>
                            </Link>
                        </div>

                        {/* Right Section - Action Buttons */}
                        <div className="flex items-center justify-end gap-1 sm:gap-3">
                            <button
                                onClick={() => navigate('/wishlist')}
                                aria-label="View wishlist"
                                className="hidden sm:flex p-2 rounded-full hover:bg-white/10 hover:scale-110 active:scale-95 transition-all duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-white/20"
                            >
                                <Heart className="w-5 h-5 text-gray-300 hover:text-red-400 transition-colors duration-300" />
                            </button>

                            <button
                                onClick={() => navigate('/cart')}
                                onMouseEnter={() => setCartHover(true)}
                                onMouseLeave={() => setCartHover(false)}
                                aria-label={`View cart with ${cart.length} items`}
                                className={`
                  relative p-2 rounded-full transition-all duration-300 ease-out
                  hover:bg-white/10 hover:scale-110 active:scale-95
                  focus:outline-none focus:ring-2 focus:ring-white/20
                  ${cartHover ? 'bg-white/5' : ''}
                `}
                            >
                                <ShoppingCart
                                    className={`
                    w-5 h-5 text-gray-300 transition-all duration-300 ease-out
                    ${cartHover ? 'text-white scale-110' : ''}
                  `}
                                />
                                {cart.length > 0 && (
                                    <div className="absolute -top-1 -right-1">
                                        <span
                                            className={`
                        flex h-5 w-5 items-center justify-center rounded-full
                        bg-gradient-to-r from-red-500 to-red-600
                        text-[10px] font-bold text-white
                        transition-all duration-300 ease-out
                        shadow-lg animate-pulse
                        ${cartHover ? 'scale-110 shadow-red-500/30' : 'scale-100'}
                      `}
                                        >
                                            {cart.length}
                                        </span>
                                        <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-400 opacity-75 animate-ping" />
                                    </div>
                                )}
                            </button>

                            <button
                                onClick={handleSearchToggle}
                                aria-label={searchActive ? 'Close search' : 'Open search'}
                                className={`
                  p-2 rounded-full transition-all duration-300 ease-out
                  hover:bg-white/10 hover:scale-110 active:scale-95
                  focus:outline-none focus:ring-2 focus:ring-white/20
                  ${searchActive ? 'bg-white/10 text-white' : 'text-gray-300'}
                `}
                            >
                                <Search className="w-5 h-5" />
                            </button>

                            <Link
                                to="/collections"
                                className="hidden md:block ml-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/20 rounded-full"
                            >
                                <Button
                                    className={`
                    group relative overflow-hidden px-6 py-2.5 rounded-full
                    bg-transparent border-2 border-white/20 text-white
                    hover:bg-white hover:text-black hover:border-white
                    transition-all duration-300 ease-out
                    hover:scale-105 active:scale-95
                    hover:shadow-lg hover:shadow-white/20
                    focus:outline-none focus:ring-2 focus:ring-white/20
                  `}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-white to-gray-100 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out origin-left -z-10" />
                                    <span className="flex items-center gap-2 relative z-10">
                                        <span className="font-medium">Collections</span>
                                        <ArrowRight
                                            className={`
                        w-4 h-4 transition-all duration-300 ease-out
                        group-hover:translate-x-1 group-hover:scale-110
                      `}
                                        />
                                    </span>
                                </Button>
                            </Link>
                        </div>
                    </nav>

                    <div
                        className={`
              md:hidden px-4 pb-3 transition-all duration-500 ease-out
              ${shouldShowRoundedNavbar ? 'opacity-0 invisible h-0' : 'opacity-100 visible'}
            `}
                    >
                        <Link to="/collections" className="block w-full">
                            <Button className="w-full group bg-transparent border-2 border-white/20 text-white hover:bg-white hover:text-black transition-all duration-300 rounded-full py-3">
                                <span className="flex items-center justify-center gap-2">
                                    <span>Collections</span>
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                                </span>
                            </Button>
                        </Link>
                    </div>
                </header>

                <AnimatePresence>
                    {searchActive && (
                        <FocusTrap>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="fixed inset-0 bg-black/95 backdrop-blur-lg z-[9999] overflow-hidden flex items-center justify-center"
                                onClick={(e) => e.target === e.currentTarget && setSearchActive(false)}
                            >
                                <div className="w-full max-w-4xl flex flex-col max-h-[80vh] sm:max-h-[90vh] px-4 sm:px-0">
                                    <div className="flex-shrink-0 border-b border-white/10">
                                        <div className="container mx-auto px-4 py-6">
                                            <div className="relative">
                                                <div className="flex items-center gap-4">
                                                    <div className="flex-1 relative">
                                                        <label htmlFor="search-input" className="sr-only">
                                                            Search watches
                                                        </label>
                                                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" />
                                                        <input
                                                            id="search-input"
                                                            ref={searchInputRef}
                                                            type="text"
                                                            placeholder="Search for watches, brands, models..."
                                                            className="w-full bg-white/5 border border-white/20 rounded-full py-4 pl-14 pr-6 text-white placeholder-gray-400 text-lg focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/30 transition-all duration-300"
                                                            value={searchTerm}
                                                            onChange={handleSearchChange}
                                                            onKeyPress={(e) => e.key === 'Enter' && handleSearchSubmit(e)}
                                                            autoComplete="off"
                                                        />
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => setSearchActive(false)}
                                                        aria-label="Close search"
                                                        className="p-3 hover:bg-white/10 rounded-full transition-colors duration-200 text-gray-400 hover:text-white"
                                                    >
                                                        <X className="w-6 h-6" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex-1 overflow-y-auto">
                                        <div className="container mx-auto px-4 py-8">
                                            {searchLoading && (
                                                <div className="flex items-center justify-center py-12">
                                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                                                    <span className="ml-3 text-gray-400">Searching...</span>
                                                </div>
                                            )}

                                            {searchError && (
                                                <div className="text-center py-12">
                                                    <p className="text-red-400 mb-4">{searchError}</p>
                                                    <button
                                                        onClick={() => performSearch(searchTerm)}
                                                        className="text-white hover:text-gray-300 underline"
                                                    >
                                                        Try again
                                                    </button>
                                                </div>
                                            )}

                                            {!searchTerm && recentSearches.length > 0 && (
                                                <div className="mb-8">
                                                    <div className="flex items-center justify-between mb-4">
                                                        <h3 className="text-lg font-semibold text-white">Recent Searches</h3>
                                                        <button
                                                            onClick={clearRecentSearches}
                                                            className="text-sm text-gray-400 hover:text-white transition-colors"
                                                        >
                                                            Clear all
                                                        </button>
                                                    </div>
                                                    <div className="flex flex-wrap gap-2">
                                                        {recentSearches.map((query, index) => (
                                                            <button
                                                                key={index}
                                                                onClick={() => handleRecentSearch(query)}
                                                                className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full text-white text-sm transition-colors duration-200"
                                                            >
                                                                {query}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {searchTerm && !searchLoading && !searchError && (
                                                <>
                                                    {searchResults.length > 0 ? (
                                                        <div>
                                                            <div className="flex items-center justify-between mb-6">
                                                                <h3 className="text-lg font-semibold text-white">
                                                                    Search Results ({searchResults.length})
                                                                </h3>
                                                                <Link
                                                                    to={`/collections?search=${encodeURIComponent(searchTerm)}`}
                                                                    onClick={() => setSearchActive(false)}
                                                                    className="text-blue-400 hover:text-blue-300 text-sm font-medium flex items-center gap-1"
                                                                >
                                                                    View all results
                                                                    <ArrowRight className="w-4 h-4" />
                                                                </Link>
                                                            </div>

                                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                                                {searchResults.map((item, index) => (
                                                                    <div
                                                                        key={item.id}
                                                                        onClick={() => {
                                                                            setSearchActive(false);
                                                                            navigate(`/product/${item.id}`);
                                                                        }}
                                                                        className="transform hover:scale-105 transition-transform duration-200 cursor-pointer"
                                                                    >
                                                                        <Card
                                                                            index={index}
                                                                            card={{
                                                                                id: item.id,
                                                                                title: item.title,
                                                                                brand: item.brand,
                                                                                price: item.price,
                                                                                image: item.image,
                                                                            }}
                                                                        />
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="text-center py-12">
                                                            <h3 className="text-xl font-semibold text-gray-300 mb-2">
                                                                No results found for "{searchTerm}"
                                                            </h3>
                                                            <p className="text-gray-500 mb-4">
                                                                Try different keywords or browse our collections
                                                            </p>
                                                            <Link
                                                                to="/collections"
                                                                onClick={() => setSearchActive(false)}
                                                                className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 font-medium"
                                                            >
                                                                Browse Collections
                                                                <ArrowRight className="w-4 h-4" />
                                                            </Link>
                                                        </div>
                                                    )}
                                                </>
                                            )}

                                            {!searchTerm && recentSearches.length === 0 && (
                                                <div className="text-center py-12">
                                                    <Search className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                                                    <h3 className="text-xl font-semibold text-gray-300 mb-2">
                                                        Discover Amazing Timepieces
                                                    </h3>
                                                    <p className="text-gray-500 mb-6 max-w-md mx-auto">
                                                        Search for specific watches, brands, or explore our curated collections
                                                    </p>
                                                    <div className="flex flex-wrap justify-center gap-2">
                                                        {['Rolex', 'Omega', 'Luxury Watches', 'Sport Watches'].map((suggestion) => (
                                                            <button
                                                                key={suggestion}
                                                                onClick={() => setSearchTerm(suggestion)}
                                                                className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-full text-gray-300 text-sm transition-colors duration-200"
                                                            >
                                                                {suggestion}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </FocusTrap>
                    )}
                </AnimatePresence>

                <AnimatePresence>
                    {isOpen && <NavMenu isOpen={isOpen} setIsOpen={setIsOpen} />}
                </AnimatePresence>
            </>
        </ErrorBoundary>
    );
};

export default Navbar;