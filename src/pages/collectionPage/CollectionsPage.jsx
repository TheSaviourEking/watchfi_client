import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useSearchParams, useParams } from 'react-router';
import HeroText from '../../components/HeroText';
import api from '../../config/apiConfig';
import { Card } from '../../components/ui/apple-cards-carousel';
import FilterMenu from '../../components/FilterMenu';
import { AnimatePresence } from 'motion/react';

const CollectionsPage = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState(null);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    // Updated pagination state to use page and pageSize
    const [pagination, setPagination] = useState({ total: 0, pageSize: 10, page: 1, totalPages: 1 });
    const [hasMore, setHasMore] = useState(true);
    const observer = useRef();
    const [, setSearchParams] = useSearchParams();

    const [allFilterOptions, setAllFilterOptions] = useState({
        brands: [],
        categories: [],
        concepts: [],
        materials: [],
        colors: [],
    });

    useEffect(() => {
        fetchAllFilterOptions();
    }, []);

    const fetchAllFilterOptions = useCallback(async () => {
        try {
            const url = new URL(api.getUrl('filter'));
            const req = await fetch(url.toString());
            const response = await req.json();

            if (req.ok && response.data) {
                setAllFilterOptions(response.data);
            }
        } catch (error) {
            console.error('Failed to fetch filter options:', error);
        }
    }, []);

    const [searchParams] = useSearchParams();
    const params = useParams();

    const [selectedFilters, setSelectedFilters] = useState({
        brand: '',
        category: '',
        concept: '',
        material: '',
        color: '',
    });

    useEffect(() => {
        const urlCategory = searchParams.get('category');
        const collectionType = params['*'];

        let categoryValue = '';
        if (collectionType === 'new-release') {
            categoryValue = 'new-release';
        } else if (urlCategory) {
            categoryValue = urlCategory;
        }

        setSelectedFilters(prev => ({
            ...prev,
            category: categoryValue,
            brand: searchParams.get('brand') || '',
            concept: searchParams.get('concept') || '',
            material: searchParams.get('material') || '',
            color: searchParams.get('color') || '',
        }));

        const urlSearch = searchParams.get('search');
        if (urlSearch) {
            setSearchTerm(urlSearch);
        }
    }, [searchParams, params]);

    // Updated fetchCollections to use page and pageSize
    const fetchCollections = useCallback(async (page = 1, reset = false) => {
        try {
            if (reset) {
                setLoading(true);
                setError(null);
            } else {
                setLoadingMore(true);
            }

            const url = new URL(api.getUrl('collections'));
            url.searchParams.append('page', page.toString());
            url.searchParams.append('pageSize', pagination.pageSize.toString());

            if (searchTerm.trim()) {
                url.searchParams.append('search', searchTerm.trim());
            }

            Object.entries(selectedFilters).forEach(([key, value]) => {
                if (value) {
                    const paramName = key === 'category' ? 'category' : key;
                    url.searchParams.append(paramName, value);
                }
            });

            const req = await fetch(url.toString());

            const response = await req.json();

            if (req.ok && response.success) {
                const { data: newData, meta } = response;
                if (reset) {
                    setData(newData);
                } else {
                    setData(prev => [...prev, ...newData]);
                }
                setPagination({
                    total: meta.totalItems,
                    pageSize: meta.pageSize,
                    page: meta.currentPage,
                    totalPages: meta.totalPages,
                });
                setHasMore(newData.length === meta.pageSize && meta.currentPage < meta.totalPages);
            } else {
                throw new Error(response.message || 'Failed to fetch collections');
            }
        } catch (error) {
            console.error('Fetch error:', error);
            setError(error.message);
            if (reset) setData([]);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    }, [searchTerm, selectedFilters, pagination.pageSize]);

    // Initial load
    useEffect(() => {
        fetchCollections(1, true);
    }, [fetchCollections]);

    // Reset and reload when filters change
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchCollections(1, true);
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [searchTerm, selectedFilters, fetchCollections]);

    // Infinite scroll ref callback
    const lastWatchElementRef = useCallback(
        node => {
            if (loadingMore) return;
            if (observer.current) observer.current.disconnect();

            observer.current = new IntersectionObserver(entries => {
                if (entries[0].isIntersecting && hasMore) {
                    fetchCollections(pagination.page + 1, false);
                }
            });

            if (node) observer.current.observe(node);
        },
        [loadingMore, hasMore, pagination.page, fetchCollections]
    );

    const filteredData = useMemo(() => {
        return data; // Data is filtered server-side
    }, [data]);

    // const handleSearch = (value) => {
    //     setSearchTerm(value);
    // };

    // const handleFilterChange = (filterType, value) => {
    //     setSelectedFilters(prev => ({
    //         ...prev,
    //         [filterType]: value,
    //     }));
    // };

    const handleFilterChange = (filterType, value) => {
        setSelectedFilters(prev => {
            const newFilters = { ...prev, [filterType]: value };
            // Filter out empty values (empty string, null, or undefined)
            const filteredParams = Object.entries({ ...newFilters, search: searchTerm })
                .filter(([_, val]) => val !== '' && val !== null && val !== undefined)
                .reduce((obj, [key, val]) => ({ ...obj, [key]: val }), {});
            setSearchParams(filteredParams);
            return newFilters;
        });
    };

    const handleSearch = (value) => {
        setSearchTerm(value);
        // Filter out empty values (empty string, null, or undefined)
        const filteredParams = Object.entries({ ...selectedFilters, search: value })
            .filter(([_, val]) => val !== '' && val !== null && val !== undefined)
            .reduce((obj, [key, val]) => ({ ...obj, [key]: val }), {});
        setSearchParams(filteredParams);
    };

    const clearFilters = () => {
        setSelectedFilters({
            brand: '',
            category: '',
            concept: '',
            material: '',
            color: '',
        });
        setSearchTerm('');
    };

    const filterOptions = useMemo(() => {
        if (
            allFilterOptions.categories.length > 0 ||
            allFilterOptions.brands.length > 0 ||
            allFilterOptions.concepts.length > 0 ||
            allFilterOptions.materials.length > 0 ||
            allFilterOptions.colors.length > 0
        ) {
            return allFilterOptions;
        }

        return {
            brands: [...new Set(data.map(item => item.brand?.name).filter(Boolean))],
            categories: [...new Set(data.flatMap(item => item.categories?.map(c => c.category?.name) || []).filter(Boolean))],
            concepts: [...new Set(data.flatMap(item => item.concepts?.map(c => c.concept?.name) || []).filter(Boolean))],
            materials: [...new Set(data.flatMap(item => item.materials?.map(m => m.material?.name) || []).filter(Boolean))],
            colors: [...new Set(data.flatMap(item => item.colors?.map(c => c.color?.name) || []).filter(Boolean))],
        };
    }, [data, allFilterOptions]);

    const getHeroContent = () => {
        const collectionType = params['*'];
        const categoryParam = searchParams.get('category');

        if (collectionType === 'new-release') {
            return {
                header: 'New Release Collections',
                subheader: 'Discover the latest timepieces from our newest arrivals',
            };
        } else if (categoryParam === 'for-women') {
            return {
                header: "Women's Collections",
                subheader: 'Elegant timepieces designed for the modern woman',
            };
        } else if (categoryParam === 'for-men') {
            return {
                header: "Men's Collections",
                subheader: 'Distinguished timepieces crafted for gentlemen',
            };
        } else {
            return {
                header: 'Curated Collections',
                subheader: "Discover exceptional timepieces from the world's finest manufacturers",
            };
        }
    };

    const heroContent = getHeroContent();

    if (error) {
        return (
            <section className="container mx-auto py-24 px-4">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-red-600 mb-4">Unable to Load Collections</h2>
                    <p className="text-gray-600 mb-8">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
                    >
                        Try Again
                    </button>
                </div>
            </section>
        );
    }

    return (
        <>
            <section>
                <div className="container mx-auto py-24 px-4">
                    <div className="mx-auto text-center">
                        <HeroText
                            classname="max-w-3xl mx-auto flex flex-col items-center justify-center"
                            header={heroContent.header}
                            subheader={heroContent.subheader}
                            cta={{
                                variant: 'ghost',
                                ctaText: 'Explore our collection',
                                href: '/collections',
                            }}
                        />
                    </div>

                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-16">
                        <button
                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                            className="flex items-center text-gray-700 hover:text-gray-900 transition-colors"
                            aria-expanded={isFilterOpen}
                            aria-controls="filter-panel"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                            <span>
                                Filters{' '}
                                {Object.values(selectedFilters).filter(Boolean).length > 0 &&
                                    `(${Object.values(selectedFilters).filter(Boolean).length})`}
                            </span>
                        </button>

                        <div className="relative flex items-center bg-transparent max-w-[600px] w-full sm:w-auto">
                            <span className="absolute text-gray-500 pointer-events-none">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                    />
                                </svg>
                            </span>
                            <input
                                type="text"
                                placeholder="Search watches, brands, models..."
                                className="pl-7 pr-4 py-2 w-full border-b-2 rounded-none focus:outline-none focus:ring-blue-500 bg-transparent focus:border-slate-600 text-white"
                                value={searchTerm}
                                onChange={e => handleSearch(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="mt-8 text-sm text-gray-400">
                        {loading ? (
                            'Loading collections...'
                        ) : (
                            `Showing ${filteredData.length} of ${pagination.total} collections`
                        )}
                    </div>

                    <div className="mt-8">
                        {loading ? (
                            <div className="flex justify-center items-center py-20">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                            </div>
                        ) : filteredData.length === 0 ? (
                            <div className="text-center py-20">
                                <h3 className="text-xl font-semibold text-gray-300 mb-2">No collections found</h3>
                                <p className="text-gray-500 mb-4">
                                    {searchTerm || Object.values(selectedFilters).some(Boolean)
                                        ? 'Try adjusting your search or filters'
                                        : 'Collections will appear here once available'}
                                </p>
                                {(searchTerm || Object.values(selectedFilters).some(Boolean)) && (
                                    <button
                                        onClick={clearFilters}
                                        className="text-blue-400 hover:text-blue-300 font-medium"
                                    >
                                        Clear all filters
                                    </button>
                                )}
                            </div>
                        ) : (
                            <>
                                <div className="lg:mt-16">
                                    <div className="flex flex-col md:flex-row flex-wrap gap-5 justify-center items-center">
                                        {filteredData.map((item, index) => {
                                            const isLast = index === filteredData.length - 1;
                                            return (
                                                <div
                                                    key={item.id}
                                                    ref={isLast ? lastWatchElementRef : null}
                                                    className="transform hover:scale-105 transition-transform duration-200"
                                                >
                                                    <Card index={index} card={item} />
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {loadingMore && (
                                    <div className="flex justify-center items-center py-8">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                        <span className="ml-3 text-gray-400">Loading more watches...</span>
                                    </div>
                                )}

                                {!hasMore && filteredData.length > 0 && (
                                    <div className="text-center py-8">
                                        <p className="text-gray-500">You've seen all available watches</p>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </section>

            <AnimatePresence>
                {isFilterOpen && (
                    <FilterMenu
                        isOpen={isFilterOpen}
                        setIsOpen={setIsFilterOpen}
                        filterOptions={filterOptions}
                        selectedFilters={selectedFilters}
                        handleFilterChange={handleFilterChange}
                        clearFilters={clearFilters}
                    />
                )}
            </AnimatePresence>
        </>
    );
};

export default CollectionsPage;