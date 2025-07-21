import { useState, useEffect, useMemo } from "react";
import HeroText from "../../components/HeroText";
import api from "../../config/apiConfig";
import { Card, Carousel } from "../../components/ui/apple-cards-carousel";

const TopPicks = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCollections = async () => {
            try {
                setLoading(true);
                setError(null);

                const req = await fetch(api.getUrl('collections'));
                const response = await req.json();

                if (req.ok) {
                    const { data: responseData = [] } = response;
                    setData(Array.isArray(responseData) ? responseData : []);
                } else {
                    setError(response.message || 'Failed to fetch collections');
                    setData([]);
                }
            } catch (error) {
                setError('Network error occurred. Please try again.');
                setData([]);
                console.error('Fetch error:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCollections();
    }, []);

    const slides = useMemo(() =>
        data.map((collection, index) => (
            <Card key={collection.id || index} card={collection} index={index} />
        )),
        [data]
    );

    if (loading) {
        return (
            <section className='py-12'>
                <div className='text-center'>
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4"></div>
                        <div className="h-4 bg-gray-200 rounded w-32 mx-auto"></div>
                    </div>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className='py-12'>
                <div className='text-center'>
                    <div className="text-red-500 mb-4">{error}</div>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Retry
                    </button>
                </div>
            </section>
        );
    }

    if (data.length === 0) {
        return (
            <section className='py-12'>
                <div className='text-center'>
                    <p className="text-gray-500">No collections available at the moment.</p>
                </div>
            </section>
        );
    }

    return (
        <section className='py-12'>
            <div className='text-center mb-8'>
                <HeroText
                    classname="max-w-xl w-fit mx-auto"
                    header={'Our top picks for 2025'}
                    cta={{
                        variant: 'ghost',
                        ctaText: "Explore our collection",
                        href: '/collections'
                    }}
                />
            </div>

            {/* <div className="containe mx-auto relative p-0">
                <div className="relative left1/2 right-0 -mr[50vw] w-[90vw] bg-blue500 text-white p-6 pl-0">
                    <Carousel items={slides} />
                </div>
            </div> */}

            <div className="container">
                <div className="mx-auto relative p-0">
                    <div className="relative w-[90vw] text-white py-6 pl-0 px-6 md:px-0">
                        <Carousel items={slides} />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default TopPicks;