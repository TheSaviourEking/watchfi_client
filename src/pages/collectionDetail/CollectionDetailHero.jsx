// import HeroText from "../../components/HeroText";

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Link } from "react-router";
import useCartStore from "../../store/cart.store";

const HeroText = ({ classname, reference, header, text, cta: { variant, ctaText, href } }) => {
    return (
        <div className={cn("text-white", classname)}>
            <h1 className="text-heading">
                {header}
            </h1>
            {
                reference && (
                    <p className="px0 my-4">Ref:{' ' + reference}</p>
                )
            }

            {
                text && (
                    // <p className="subText mt-4">{text}</p>
                    <p style={{ whiteSpace: 'pre-line', marginTop: '1rem' }}>{text}</p>
                )
            }
            <div className="flex gap-4">
                <Link to={href}>
                    <Button className="mt-8" variant={variant || 'default'}>
                        {ctaText}
                    </Button>
                </Link>

                {/* <Link to={href}> */}
                <Button className="mt-8" variant={variant || 'default'}>
                    {ctaText}
                </Button>
                {/* </Link> */}
            </div>
        </div>
    )
}


const CollectionsDetailsHero = (props) => {
    // console.log(props, 'DETAIL')
    const { name, description, image, referenceCode, detail } = props.collection;
    const addToCart = useCartStore(state => state.addToCart);

    const handleAddToCart = () => {
        addToCart(props.collection);
        console.log(props.collection)
    }
    return (
        <section className='bg-black/[58] bg-cover bg-center bg-no-repeat'
            style={{
                backgroundImage: `url(/WatchDetailsBackground.png)`
            }}
        >
            <div className="h-screen w-full">
                <div className="container flex flex-col lg:flex-row h-full w-full items-center gap-4">

                    <div className={cn("text-white", "max-w-3xl lg:basis-2/3")}>
                        <h1 className="text-heading">
                            {name}
                        </h1>
                        {
                            referenceCode && (
                                <p className="px0 my-4">Ref:{' ' + referenceCode}</p>
                            )
                        }

                        {
                            description || '' + '\n' + detail || '' && (
                                // <p className="subText mt-4">{text}</p>
                                <p style={{ whiteSpace: 'pre-line', marginTop: '1rem' }}>{description + '\n' + detail}</p>
                            )
                        }
                        <div className="flex gap-4">
                            <Link to={'/checkout'}>
                                <Button className="mt-8" variant={'default'}>
                                    {"Buy Now"}
                                </Button>
                            </Link>

                            <Button
                                onClick={handleAddToCart}
                                className="mt-8 invert" variant={'default'}>
                                {"Add To Cart"}
                            </Button>

                            {/* <Button
                                onClick={handleAddToCart}
                                className="mt-8 invert" variant={'default'}>
                                {"Add To wishlist"}
                            </Button> */}
                        </div>
                    </div>

                    {/* Watch image */}
                    <div className="lg:basis1/3 flex justifycenter h-full max-h-[700px]">
                        <img
                            className="h-full w-full object-contain"
                            src={image}
                            // width={1000}
                            // height={1000}
                            alt="Luxury titanium watch from Royal Oak Offshore collection"
                        />
                    </div>
                </div>
            </div>
        </section>
    )
}

export default CollectionsDetailsHero;