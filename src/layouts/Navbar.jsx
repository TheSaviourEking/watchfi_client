import NavMenu from '@/components/NavMenu';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { ShoppingCart } from 'lucide-react';
import { AlignJustify, ArrowRight, Search, X } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react';
import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router';
import useCartStore from '../store/cart.store';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const navigate = useNavigate();
    const { cart } = useCartStore();

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            setIsScrolled(scrollTop > 90); // Trigger after 100px of scroll
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <>
            <header className={`
                ${isScrolled ? 'fixed top-4 left-1/2 transform -translate-x-1/2 z-50' : 'bg-nav-dark relativ absolute z-[99999999999999999] w-full'}
                transition-all duration-300 ease-in-out
                ${isScrolled ? 'w-full max-w-7xl mx-auto' : ''}
            `}>
                <nav className={`flex items-center container text-white
                    ${isScrolled ? ' mx-auto px-6' : ''} 
                    flex
                    ${isScrolled ? 'bg-black/80 backdrop-blur-lg rounded-full py-3 shadow-lg border border-white/10' : ''}
                    transition-all duration-300 ease-in-out
                `}>
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="p-0 relative flex items-center justify-center w-6 h-6"
                    >
                        <AnimatePresence mode="wait" initial={false}>
                            {isOpen ? (
                                <motion.span
                                    key="x-icon"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    transition={{ duration: 0.2 }}
                                    className="flex items-center justify-center"
                                >
                                    <X className="w-6 h-6 aspect-square text-gray-400" />
                                </motion.span>
                            ) : (
                                <motion.span
                                    key="menu-icon"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    transition={{ duration: 0.2 }}
                                    className="flex items-center justify-center"
                                >
                                    <AlignJustify className="w-6 h-6 aspect-square text-gray-400" />
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </button>

                    <div className="flex-1 flex items-center justify-center">
                        <Link to={'/'}>
                            ddd
                        </Link>
                    </div>

                    <div className="flex items-center gap-3 ">
                        {/* <button onClick={() => navigate('/wishlist')}>
                            <Heart className='w-6 h-6 aspect-square' />
                        </button> */}

                        <button
                            onClick={() => navigate('/cart')}
                            className="relative p-2"
                        >
                            <ShoppingCart className="w-6 h-6 aspect-square" />

                            {/* Badge */}
                            {cart.length > 0 && (
                                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                                    {cart.length}
                                </span>
                            )}
                        </button>
                        <button>
                            <Search className='w-6 h-6 aspect-square' />
                        </button>

                        <Link to={'/collections'} className='hidden md:block transition-all duration-200'>
                            <Button className='gap2 group transition-all duration-300 hover:bg-black hover:border-white hover:border-2 hover:text-white'>
                                <span>Collections</span>
                                <span><ArrowRight className='w-6 h-6 aspect-square group-hover:translate-x-2 duration-150' /></span>
                            </Button>
                        </Link>
                    </div>
                </nav>

                {/* {
                    isOpen && (
                        <NavMenu isOpen={isOpen} setIsOpen={setIsOpen} />
                    )
                } */}
            </header>

            {/* After the header */}
            <AnimatePresence>
                {isOpen && <NavMenu isOpen={isOpen} setIsOpen={setIsOpen} />}
            </AnimatePresence>
        </>
    )
}

export default Navbar;