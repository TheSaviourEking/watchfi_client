// FilterMenu.jsx
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { Link } from 'react-router';
import React, { useState, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import { ChevronDown } from 'lucide-react';
import { Search } from 'lucide-react';

const FilterMenu = ({ isOpen, setIsOpen = () => { }, filterOptions, selectedFilters, handleFilterChange, clearFilters }) => {
    const [dropdowns, setDropdowns] = useState({
        category: false,
        brand: false,
        concept: false,
        material: false,
        color: false,
    });

    const toggleDropdown = (key) => {
        setDropdowns((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));
    };

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

    // Close on escape key
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
                    className="fixed inset-0 z-[20000] w-full h-screen bg-black text-white"
                >
                    {/* Overlay */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4 }}
                        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
                        onClick={handleCloseMenu}
                    />

                    {/* Slide-in Filter Menu */}
                    <motion.div
                        initial={{ x: '-100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '-100%' }}
                        transition={{
                            type: 'tween',
                            duration: 0.4,
                            ease: [0.25, 0.46, 0.45, 0.94],
                        }}
                        className="relative z-10 bg-black h-full w-full shadow-2xl"
                    >
                        {/* Scrollable Content */}
                        <div className="h-full overflow-y-auto overflow-x-hidden">
                            {/* Close Button */}
                            {/* <div className="absolute bottom-6 right-6 z-20">
                                <button
                                    onClick={handleCloseMenu}
                                    className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white transition-all duration-300 hover:scale-110"
                                    aria-label="Close menu"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div> */}

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

                            {/* Content Container */}
                            <div className="container flex flex-col gap-10 min-h-full py-20 justify-between">
                                {/* Filter Categories */}
                                <motion.ul
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2, duration: 0.4 }}
                                    className="flex flex-col gap-3"
                                >
                                    {/* Category Filter */}
                                    <motion.li
                                        initial={{ opacity: 0, x: -30 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.3, duration: 0.4 }}
                                    >
                                        <button
                                            onClick={() => toggleDropdown('category')}
                                            className="flex items-center gap-20 capitalize py-3 px-2 rounded-lg transition-all duration-300 hover:bg-gray-900/50 hover:translate-x-2 hover:text-white w-full text-left"
                                        >
                                            <span className='text-heading-menu leading-none flex items-center'>Category</span>
                                            {dropdowns.category ? (
                                                <ChevronDown className="ml-aut w-10 h-10 transition-transform duration-200 self-center" />
                                            ) : (
                                                <ChevronRight className="ml-aut w-10 h-10 transition-transform duration-200 self-center" />
                                            )}
                                        </button>

                                        {dropdowns.category && (
                                            <ul className="mt-2 ml-6 space-y-2 text-subText text-gray-400">
                                                <li>
                                                    <label className="flex items-center space-x-2 cursor-pointer">
                                                        <input
                                                            type="radio"
                                                            name="category"
                                                            checked={!selectedFilters.category}
                                                            onChange={() => handleFilterChange('category', '')}
                                                        />
                                                        <span>All Categories</span>
                                                    </label>
                                                </li>
                                                <li>
                                                    <label className="flex items-center space-x-2 cursor-pointer">
                                                        <input
                                                            type="radio"
                                                            name="category"
                                                            checked={selectedFilters.category === 'new-release'}
                                                            onChange={() => handleFilterChange('category', 'new-release')}
                                                        />
                                                        <span>New Releases</span>
                                                    </label>
                                                </li>
                                                <li>
                                                    <label className="flex items-center space-x-2 cursor-pointer">
                                                        <input
                                                            type="radio"
                                                            name="category"
                                                            checked={selectedFilters.category === 'for-women'}
                                                            onChange={() => handleFilterChange('category', 'for-women')}
                                                        />
                                                        <span>For Women</span>
                                                    </label>
                                                </li>
                                                <li>
                                                    <label className="flex items-center space-x-2 cursor-pointer">
                                                        <input
                                                            type="radio"
                                                            name="category"
                                                            checked={selectedFilters.category === 'for-men'}
                                                            onChange={() => handleFilterChange('category', 'for-men')}
                                                        />
                                                        <span>For Men</span>
                                                    </label>
                                                </li>
                                                {filterOptions.categories.map((cat) => (
                                                    <li key={cat}>
                                                        <label className="flex items-center space-x-2 cursor-pointer">
                                                            <input
                                                                type="radio"
                                                                name="category"
                                                                checked={selectedFilters.category === cat}
                                                                onChange={() => handleFilterChange('category', cat)}
                                                            />
                                                            <span>{cat}</span>
                                                        </label>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </motion.li>

                                    {/* Brand Filter */}
                                    <motion.li
                                        initial={{ opacity: 0, x: -30 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.4, duration: 0.4 }}
                                    >
                                        <button
                                            onClick={() => toggleDropdown('brand')}
                                            className="flex items-center gap-20 capitalize py-3 px-2 rounded-lg transition-all duration-300 hover:bg-gray-900/50 hover:translate-x-2 hover:text-white w-full text-left"
                                        >
                                            <span className='text-heading-menu leading-none flex items-center'>Brand</span>
                                            {dropdowns.brand ? (
                                                <ChevronDown className="ml-aut w-10 h-10 transition-transform duration-200 self-center" />
                                            ) : (
                                                <ChevronRight className="ml-aut w-10 h-10 transition-transform duration-200 self-center" />
                                            )}
                                        </button>
                                        {dropdowns.brand && (
                                            <ul className="mt-2 ml-6 space-y-2 text-subText text-gray-400">
                                                <li>
                                                    <label className="flex items-center space-x-2 cursor-pointer">
                                                        <input
                                                            type="radio"
                                                            name="brand"
                                                            checked={!selectedFilters.brand}
                                                            onChange={() => handleFilterChange('brand', '')}
                                                        />
                                                        <span>All Brands</span>
                                                    </label>
                                                </li>
                                                {filterOptions.brands.map((brand) => (
                                                    <li key={brand}>
                                                        <label className="flex items-center space-x-2 cursor-pointer">
                                                            <input
                                                                type="radio"
                                                                name="brand"
                                                                checked={selectedFilters.brand === brand}
                                                                onChange={() => handleFilterChange('brand', brand)}
                                                            />
                                                            <span>{brand}</span>
                                                        </label>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </motion.li>

                                    {/* Concept Filter */}
                                    <motion.li
                                        initial={{ opacity: 0, x: -30 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.5, duration: 0.4 }}
                                    >
                                        <button
                                            onClick={() => toggleDropdown('concept')}
                                            className="flex items-center gap-20 capitalize py-3 px-2 rounded-lg transition-all duration-300 hover:bg-gray-900/50 hover:translate-x-2 hover:text-white w-full text-left"
                                        >
                                            <span className='text-heading-menu leading-none flex items-center'>Concept</span>
                                            {dropdowns.concept ? (
                                                <ChevronDown className="ml-aut w-10 h-10 transition-transform duration-200 self-center" />
                                            ) : (
                                                <ChevronRight className="ml-aut w-10 h-10 transition-transform duration-200 self-center" />
                                            )}
                                        </button>

                                        {dropdowns.concept && (
                                            <ul className="mt-2 ml-6 space-y-2 text-subText text-gray-400">
                                                <li>
                                                    <label className="flex items-center space-x-2 cursor-pointer">
                                                        <input
                                                            type="radio"
                                                            name="concept"
                                                            checked={!selectedFilters.concept}
                                                            onChange={() => handleFilterChange('concept', '')}
                                                        />
                                                        <span>All Concepts</span>
                                                    </label>
                                                </li>
                                                {filterOptions.concepts.map((concept) => (
                                                    <li key={concept}>
                                                        <label className="flex items-center space-x-2 cursor-pointer">
                                                            <input
                                                                type="radio"
                                                                name="concept"
                                                                checked={selectedFilters.concept === concept}
                                                                onChange={() => handleFilterChange('concept', concept)}
                                                            />
                                                            <span>{concept}</span>
                                                        </label>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </motion.li>

                                    {/* Material Filter */}
                                    <motion.li
                                        initial={{ opacity: 0, x: -30 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.6, duration: 0.4 }}
                                    >
                                        <button
                                            onClick={() => toggleDropdown('material')}
                                            className="flex items-center gap-20 capitalize py-3 px-2 rounded-lg transition-all duration-300 hover:bg-gray-900/50 hover:translate-x-2 hover:text-white w-full text-left"
                                        >
                                            <span className='text-heading-menu leading-none flex items-center'>Material</span>
                                            {dropdowns.material ? (
                                                <ChevronDown className="ml-aut w-10 h-10 transition-transform duration-200 self-center" />
                                            ) : (
                                                <ChevronRight className="ml-aut w-10 h-10 transition-transform duration-200 self-center" />
                                            )}
                                        </button>

                                        {dropdowns.material && (
                                            <ul className="mt-2 ml-6 space-y-2 text-subText text-gray-400">
                                                <li>
                                                    <label className="flex items-center space-x-2 cursor-pointer">
                                                        <input
                                                            type="radio"
                                                            name="material"
                                                            checked={!selectedFilters.material}
                                                            onChange={() => handleFilterChange('material', '')}
                                                        />
                                                        <span>All Materials</span>
                                                    </label>
                                                </li>
                                                {filterOptions.materials.map((material) => (
                                                    <li key={material}>
                                                        <label className="flex items-center space-x-2 cursor-pointer">
                                                            <input
                                                                type="radio"
                                                                name="material"
                                                                checked={selectedFilters.material === material}
                                                                onChange={() => handleFilterChange('material', material)}
                                                            />
                                                            <span>{material}</span>
                                                        </label>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </motion.li>

                                    {/* Color Filter */}
                                    <motion.li
                                        initial={{ opacity: 0, x: -30 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.7, duration: 0.4 }}
                                    >
                                        <button
                                            onClick={() => toggleDropdown('color')}
                                            className="flex items-center gap-20 capitalize py-3 px-2 rounded-lg transition-all duration-300 hover:bg-gray-900/50 hover:translate-x-2 hover:text-white w-full text-left"
                                        >
                                            <span className='text-heading-menu leading-none flex items-center'>Color</span>
                                            {dropdowns.color ? (
                                                <ChevronDown className="ml-aut w-10 h-10 transition-transform duration-200 self-center" />
                                            ) : (
                                                <ChevronRight className="ml-aut w-10 h-10 transition-transform duration-200 self-center" />
                                            )}
                                        </button>

                                        {dropdowns.color && (
                                            <ul className="mt-2 ml-6 space-y-2 text-subText text-gray-400">
                                                <li>
                                                    <label className="flex items-center space-x-2 cursor-pointer">
                                                        <input
                                                            type="radio"
                                                            name="color"
                                                            checked={!selectedFilters.color}
                                                            onChange={() => handleFilterChange('color', '')}
                                                        />
                                                        <span>All Colours</span>
                                                    </label>
                                                </li>
                                                {filterOptions.colors.map((color) => (
                                                    <li key={color}>
                                                        <label className="flex items-center space-x-2 cursor-pointer">
                                                            <input
                                                                type="radio"
                                                                name="color"
                                                                checked={selectedFilters.color === color}
                                                                onChange={() => handleFilterChange('color', color)}
                                                            />
                                                            <span>{color}</span>
                                                        </label>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </motion.li>
                                </motion.ul>

                                <motion.ul
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2, duration: 0.4 }}
                                    className='flex flex-col gap-3'
                                >
                                    {
                                        [
                                            {
                                                name: 'For Men',
                                                href: '/collections?categegory=for-men'
                                            },
                                            {
                                                name: 'For Women',
                                                href: '/collections?categegory=for-women'
                                            }
                                        ].map((category, index) => (
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
                                                    className='text-heading-menu capitalize block py-3 px-2 rounded-lg transition-all duration-300 hover:bg-gray-900/50 hover:translate-x-2 hover:text-white'
                                                    to={category.href}
                                                >
                                                    {category.name}
                                                </Link>
                                            </motion.li>
                                        ))}
                                </motion.ul>


                                <div className="flex gap-3 items-center justify-cente">
                                    {/* Clear Filters */}
                                    {Object.values(selectedFilters).some(Boolean) && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.8, duration: 0.4 }}
                                        >
                                            <button
                                                onClick={clearFilters}
                                                className="text-blue-400 hover:text-blue-300 text-sm font-medium"
                                            >
                                                Clear All Filters
                                            </button>
                                        </motion.div>
                                    )}

                                    {/* Close Button */}
                                    <div className="absolut bottom-6 right-6 z-20">
                                        <button
                                            onClick={handleCloseMenu}
                                            className="p-2 rounded-full flex gap-2 bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white transition-all duration-300 hover:scale-110"
                                            aria-label="Close menu"
                                        >
                                            <span>Search</span>
                                            <Search className="w-6 h-6" />
                                        </button>
                                    </div>
                                </div>

                                {/* Divider */}
                                <motion.div
                                    initial={{ scaleX: 0 }}
                                    animate={{ scaleX: 1 }}
                                    transition={{ delay: 0.9, duration: 0.4 }}
                                    className="border-t border-gray-600 max-w-xl origin-left"
                                />
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default FilterMenu;