import { useState, useEffect, useRef } from 'react';
import { AnimatePresence } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Heart, ShoppingCart, AlignJustify, ArrowRight, Search, X } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router';
import useCartStore from '../store/cart.store';
import NavMenu from '../components/NavMenu';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [searchActive, setSearchActive] = useState(false);
    const [cartHover, setCartHover] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { cart } = useCartStore();
    const searchInputRef = useRef(null);

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            setIsScrolled(scrollTop > 90);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

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

    const handleSearchToggle = () => {
        setSearchActive(!searchActive);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
            setSearchActive(false);
            setIsOpen(false);
        }
    };

    return (
        <>
            {/* Backdrop for mobile menu */}
            <div
                className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-all duration-300 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
                    } md:hidden`}
                onClick={() => setIsOpen(false)}
            />

            <header
                className={`
                    ${isScrolled
                        ? 'fixed top-4 left-1/2 transform -translate-x-1/2 z-50'
                        : `'bg-nav-dark relativ absolut z-[999999999999999999999999999999] w-full ${location.pathname === '/' ? "absolute" : "relative"}`
                    }
                    transition-all duration-500 ease-out
                    ${isScrolled ? 'w-full max-w-7xl mx-auto px-4' : ''}
                `}
                onKeyDown={handleKeyDown}
            >
                <nav className={`
                    flex items-center text-white relative
                    ${isScrolled ? 'mx-auto px-6' : 'container'} 
                    ${isScrolled
                        ? 'bg-black/80 backdrop-blur-lg rounded-full py-3 shadow-2xl border border-white/10'
                        : 'py-4'
                    }
                    transition-all duration-500 ease-out
                    ${searchActive ? 'bg-black/95' : ''}
                `}>

                    {/* Menu Button */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className={`
                            p-2 relative flex items-center justify-center rounded-full
                            transition-all duration-300 ease-out
                            hover:bg-white/10 hover:scale-110 active:scale-95
                            focus:outline-none focus:ring-2 focus:ring-white/20
                            ${isOpen ? 'bg-white/10' : ''}
                        `}
                    >
                        <div className="relative w-6 h-6">
                            {isOpen ? (
                                <div
                                    className="absolute inset-0 flex items-center justify-center transition-all duration-300 ease-out transform rotate-0 scale-100"
                                    style={{ animation: 'fadeInRotate 0.3s ease-out' }}
                                >
                                    <X className="w-6 h-6 text-gray-300" />
                                </div>
                            ) : (
                                <div
                                    className="absolute inset-0 flex items-center justify-center transition-all duration-300 ease-out transform rotate-0 scale-100"
                                    style={{ animation: 'fadeInRotate 0.3s ease-out' }}
                                >
                                    <AlignJustify className="w-6 h-6 text-gray-300" />
                                </div>
                            )}
                        </div>
                    </button>

                    {/* Logo/Brand */}
                    <div className={`
                        flex-1 flex items-center justify-center transition-all duration-500 ease-out
                        ${searchActive ? 'opacity-0 pointer-events-none' : 'opacity-100'}
                    `}>
                        <Link
                            to="/"
                            className="text-2xl font-bold tracking-wider hover:scale-105 transition-transform duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-white/20 rounded px-2 py-1"
                        >
                            <span className="bg-gradient-to-r from-white via-gray-200 to-gray-300 bg-clip-text text-transparent">
                                <img src='/logo.svg' />
                            </span>
                        </Link>
                    </div>

                    {/* Search Overlay */}
                    <div className={`
                        absolute inset-0 flex items-center px-4 transition-all duration-500 ease-out
                        ${searchActive ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}
                        ${isScrolled ? 'rounded-full' : ''}
                    `}>
                        <div className="flex-1 flex items-center gap-3">
                            <Search className="w-5 h-5 text-gray-400 flex-shrink-0" />
                            <input
                                ref={searchInputRef}
                                type="text"
                                placeholder="Search products..."
                                className="flex-1 bg-transparent border-none outline-none text-white placeholder-gray-400 text-lg"
                            />
                            <button
                                onClick={() => setSearchActive(false)}
                                className="p-2 hover:bg-white/10 rounded-full transition-colors duration-200"
                            >
                                <X className="w-5 h-5 text-gray-400" />
                            </button>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className={`
                        flex items-center gap-1 sm:gap-3 transition-all duration-500 ease-out
                        ${searchActive ? 'opacity-0 pointer-events-none' : 'opacity-100'}
                    `}>
                        {/* Wishlist Button - Hidden on small screens */}
                        <button
                            onClick={() => navigate('/wishlist')}
                            className="hidden sm:flex p-2 rounded-full hover:bg-white/10 hover:scale-110 active:scale-95 transition-all duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-white/20"
                        >
                            <Heart className="w-5 h-5 text-gray-300 hover:text-red-400 transition-colors duration-300" />
                        </button>

                        {/* Cart Button */}
                        <button
                            onClick={() => navigate('/cart')}
                            onMouseEnter={() => setCartHover(true)}
                            onMouseLeave={() => setCartHover(false)}
                            className={`
                                relative p-2 rounded-full transition-all duration-300 ease-out
                                hover:bg-white/10 hover:scale-110 active:scale-95
                                focus:outline-none focus:ring-2 focus:ring-white/20
                                ${cartHover ? 'bg-white/5' : ''}
                            `}
                        >
                            <ShoppingCart className={`
                                w-5 h-5 text-gray-300 transition-all duration-300 ease-out
                                ${cartHover ? 'text-white scale-110' : ''}
                            `} />

                            {/* Animated Badge */}
                            {cart.length > 0 && (
                                <div className="absolute -top-1 -right-1">
                                    <span className={`
                                        flex h-5 w-5 items-center justify-center rounded-full 
                                        bg-gradient-to-r from-red-500 to-red-600 
                                        text-[10px] font-bold text-white
                                        transition-all duration-300 ease-out
                                        shadow-lg
                                        ${cartHover ? 'scale-110 shadow-red-500/30' : 'scale-100'}
                                    `}>
                                        {cart.length}
                                    </span>
                                    {/* Pulse animation for new items */}
                                    <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-400 opacity-75 animate-ping"></span>
                                </div>
                            )}
                        </button>

                        {/* Search Button */}
                        <button
                            onClick={handleSearchToggle}
                            className={`
                                p-2 rounded-full transition-all duration-300 ease-out
                                hover:bg-white/10 hover:scale-110 active:scale-95
                                focus:outline-none focus:ring-2 focus:ring-white/20
                                ${searchActive ? 'bg-white/10 text-white' : 'text-gray-300'}
                            `}
                        >
                            <Search className="w-5 h-5" />
                        </button>

                        {/* Collections CTA */}
                        <Link
                            to="/collections"
                            className="hidden md:block ml-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/20 rounded-full"
                        >
                            <Button className={`
                                group relative overflow-hidden px-6 py-2.5 rounded-full
                                bg-transparent border-2 border-white/20 text-white
                                hover:bg-white hover:text-black hover:border-white
                                transition-all duration-300 ease-out
                                hover:scale-105 active:scale-95
                                hover:shadow-lg hover:shadow-white/20
                                focus:outline-none focus:ring-2 focus:ring-white/20
                            `}>
                                {/* Animated background */}
                                <div className="absolute inset-0 bg-gradient-to-r from-white to-gray-100 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out origin-left -z-10" />

                                <span className="flex items-center gap-2 relative z-10">
                                    <span className="font-medium">Collections</span>
                                    <ArrowRight className={`
                                        w-4 h-4 transition-all duration-300 ease-out
                                        group-hover:translate-x-1 group-hover:scale-110
                                    `} />
                                </span>
                            </Button>
                        </Link>
                    </div>
                </nav>

                {/* Mobile Collections Button */}
                <div className={`
                    md:hidden px-4 pb-3 transition-all duration-500 ease-out
                    ${isScrolled ? 'opacity-0 invisible h-0' : 'opacity-100 visible'}
                `}>
                    <Link
                        to="/collections"
                        className="block w-full"
                    >
                        <Button className="w-full group bg-transparent border-2 border-white/20 text-white hover:bg-white hover:text-black transition-all duration-300 rounded-full py-3">
                            <span className="flex items-center justify-center gap-2">
                                <span>Collections</span>
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                            </span>
                        </Button>
                    </Link>
                </div>
            </header>

            {/* Navigation Menu - Assuming you have this component */}
            <AnimatePresence>
                {isOpen && <NavMenu isOpen={isOpen} setIsOpen={setIsOpen} />}
            </AnimatePresence>

            <style jsx>{`
                @keyframes fadeInRotate {
                    from {
                        opacity: 0;
                        transform: rotate(-90deg) scale(0.8);
                    }
                    to {
                        opacity: 1;
                        transform: rotate(0deg) scale(1);
                    }
                }
                
                @keyframes pulse {
                    0%, 100% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.1); opacity: 0.8; }
                }
            `}</style>
        </>
    );
};

export default Navbar;