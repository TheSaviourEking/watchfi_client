import { useState, useEffect } from 'react'
import HeroText from '../../components/HeroText'
import api from '../../config/apiConfig'
import { Link } from 'react-router'
import { Card } from '../../components/ui/apple-cards-carousel'
import useWishlistStore from '../../store/wishlist.store'

const WishlistPage = () => {
    const [data, setData] = useState([]);
    const wishlist = useWishlistStore((state) => state.wishlist);

    useEffect(() => {
        (async () => {
            try {
                const req = await fetch(api.getUrl('collections'));
                const response = await req.json();

                if (req.ok) {
                    const { data, pagination, success } = response;
                    setData(data);
                } else {
                    setData([]);
                }
            } catch (error) {
                console.error('Fetch error:', error);
                setData([]);
            }
        })();
    }, []);

    return (
        <section>
            {wishlist && wishlist.length > 0 ? (
                <div className="container relative py-24 px-4">
                    <div className="mx-auto text-center">
                        <HeroText
                            classname="max-w-3xl mx-auto"
                            header='Your Wishlist'
                            cta={{
                                variant: 'ghost',
                                ctaText: "Explore our collection",
                                href: '/home'
                            }}
                        />
                    </div>

                    <div className="lg:mt-16">
                        <div className="flex flex-col md:flex-row flex-wrap gap-5 justify-center items-center">
                            {wishlist.map((item, index) => (
                                <Link key={item.id || index} to={`/collections/${item.id}`}>
                                    <Card index={index} card={item} />
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="container relative py-24 px-4">
                    <div className="mx-auto text-center">
                        <HeroText
                            classname="max-w-3xl mx-auto"
                            header='Your Wishlist is Empty'
                            subheader='Start adding items to your wishlist to see them here'
                            cta={{
                                variant: 'primary',
                                ctaText: "Browse Collections",
                                href: '/collections'
                            }}
                        />
                    </div>

                    {/* Optional: Show some featured collections or recommendations */}
                    {data && data.length > 0 && (
                        <div className="lg:mt-16">
                            <h3 className="text-2xl font-semibold text-center mb-8">
                                You might like these collections
                            </h3>
                            <div className="flex flex-col md:flex-row flex-wrap gap-5 justify-center items-center">
                                {data.slice(0, 3).map((item, index) => (
                                    <Link key={item.id || index} to={`/collections/${item.id}`}>
                                        <Card index={index} card={item} />
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </section>
    )
}

export default WishlistPage;