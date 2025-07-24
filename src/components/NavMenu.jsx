import { FacebookIcon, LinkedinIcon, X, YoutubeIcon } from 'lucide-react';
import { Link } from 'react-router';
import { AnimatePresence, motion } from 'motion/react';
import { useEffect } from 'react';

const NavMenu = ({ isOpen, setIsOpen = () => { } }) => {
    const generalCategories = [
        {
            name: 'Our Collections',
            href: '/collections'
        },
        {
            name: 'New Releases',
            href: '/collections/new-releases'
        },
        {
            name: 'For Men',
            href: '/collections?categegory=for-men'
        },
        {
            name: 'For Women',
            href: '/collections?categegory=for-women'
        }
    ];

    const companyOptions = [
        {
            name: 'About Watchfi',
            href: '/about'
        },
        {
            name: 'Contact Us',
            href: '/contact'
        },
    ];

    const socialOptions = [
        {
            icon: YoutubeIcon,
            name: 'Youtube',
            href: 'https://youtube.com'
        },
        {
            icon: X,
            name: 'X',
            href: 'https://x.com'
        },
        {
            icon: FacebookIcon,
            name: 'Facebook',
            href: 'https://facebook.com'
        },
        {
            icon: LinkedinIcon,
            name: 'LinkedIn',
            href: 'https://linkedin.com'
        },
    ];

    const handleCloseMenu = () => {
        if (setIsOpen) setIsOpen(false);
    };

    // Prevent body scroll when menu is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    // Close menu on escape key
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && isOpen) {
                handleCloseMenu();
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className="fixed inset-0 z-[20000] w-full h-screen rounded-lg bg-black"
                >
                    {/* Background overlay */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4 }}
                        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
                        onClick={handleCloseMenu}
                    />

                    {/* Menu panel */}
                    <motion.div
                        initial={{ x: '-100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '-100%' }}
                        transition={{
                            type: 'tween',
                            duration: 0.4,
                            ease: [0.25, 0.46, 0.45, 0.94]
                        }}
                        className="relative z-10 bg-black h-full w-full shadow-2xl"
                    >
                        {/* Scrollable content container */}
                        <div className="h-full overflow-y-auto overflow-x-hidden">
                            {/* Close button */}
                            <div className="absolute top-6 right-6 z-20">
                                <button
                                    onClick={handleCloseMenu}
                                    className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white transition-all duration-300 hover:scale-110"
                                    aria-label="Close menu"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="container flex flex-col gap-10 min-h-full py-20 justify-between">

                                {/* Main categories */}
                                <motion.ul
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2, duration: 0.4 }}
                                    className='flex flex-col gap-3'
                                >
                                    {generalCategories.map((category, index) => (
                                        <motion.li
                                            key={index}
                                            initial={{ opacity: 0, x: -30 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{
                                                delay: 0.3 + index * 0.1,
                                                duration: 0.4,
                                                ease: [0.25, 0.46, 0.45, 0.94]
                                            }}
                                        >
                                            <Link
                                                onClick={handleCloseMenu}
                                                className='text-heading capitalize block py-3 px-2 rounded-lg transition-all duration-300 hover:bg-gray-900/50 hover:translate-x-2 hover:text-white'
                                                to={category.href}
                                            >
                                                {category.name}
                                            </Link>
                                        </motion.li>
                                    ))}
                                </motion.ul>

                                {/* Divider */}
                                <motion.div
                                    initial={{ scaleX: 0 }}
                                    animate={{ scaleX: 1 }}
                                    transition={{ delay: 0.6, duration: 0.4 }}
                                    className='border-t border-gray-600 max-w-xl origin-left'
                                />

                                {/* Company options */}
                                <motion.ul
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.7, duration: 0.4 }}
                                    className='flex flex-col gap-3'
                                >
                                    {companyOptions.map((companyOption, index) => (
                                        <motion.li
                                            key={index}
                                            initial={{ opacity: 0, x: -30 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{
                                                delay: 0.8 + index * 0.1,
                                                duration: 0.4,
                                                ease: [0.25, 0.46, 0.45, 0.94]
                                            }}
                                        >
                                            <Link
                                                onClick={handleCloseMenu}
                                                className='text-heading capitalize block py-3 px-2 rounded-lg transition-all duration-300 hover:bg-gray-900/50 hover:translate-x-2 hover:text-white'
                                                to={companyOption.href}
                                            >
                                                {companyOption.name}
                                            </Link>
                                        </motion.li>
                                    ))}
                                </motion.ul>

                                {/* Social links */}
                                <motion.ul
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 1.0, duration: 0.4 }}
                                    className="flex space-x-4 flex-wrap gap-y-4"
                                >
                                    {socialOptions.map((socialOption, index) => (
                                        <motion.li
                                            key={index}
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{
                                                delay: 1.1 + index * 0.1,
                                                duration: 0.3,
                                                ease: [0.25, 0.46, 0.45, 0.94]
                                            }}
                                        >
                                            <a
                                                href={socialOption.href}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center justify-center p-3 rounded-full text-gray-600 hover:text-white hover:bg-gray-800 transition-all duration-300 hover:scale-110 hover:shadow-lg"
                                                aria-label={socialOption.name}
                                            >
                                                <socialOption.icon className="w-5 h-5 transition-colors duration-300" />
                                                <span className="sr-only">{socialOption.name}</span>
                                            </a>
                                        </motion.li>
                                    ))}
                                </motion.ul>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default NavMenu;