// import HeroText from "../../components/HeroText";

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Link } from "react-router";
import { Share2, Copy, Check } from "lucide-react";
import { useState } from "react";
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
    const { name, description, image, referenceCode, detail, primaryPhotoUrl } = props.collection;
    const addToCart = useCartStore(state => state.addToCart);
    const [copied, setCopied] = useState(false);

    const handleAddToCart = () => {
        addToCart(props.collection);
        console.log(props.collection)
    }

    const handleShare = async () => {
        const currentUrl = window.location.href;

        // Check if the Web Share API is supported
        if (navigator.share) {
            try {
                await navigator.share({
                    title: name,
                    text: `Check out this ${name} watch - ${description}`,
                    url: currentUrl,
                });
            } catch (error) {
                // If sharing is cancelled or fails, fall back to copy
                handleCopyUrl();
            }
        } else {
            // Fallback to copying URL to clipboard
            handleCopyUrl();
        }
    };

    const handleCopyUrl = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            console.error('Failed to copy URL:', error);
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = window.location.href;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };
    console.log(detail, 'divider', description)

    return (
        <section className='bg-black/[58] bg-cover bg-center bg-no-repeat'
            style={{
                backgroundImage: `url(/WatchDetailsBackground.png)`
            }}
        >
            <div className="py-20 lg:py-0"></div>
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
                            description && (
                                // <p className="subText mt-4">{text}</p>
                                <p style={{ whiteSpace: 'pre-line', marginTop: '1rem' }}>{description}</p>
                            )
                        }

                        {
                            detail && (
                                // <p className="subText mt-4">{text}</p>
                                <p style={{ whiteSpace: 'pre-line', marginTop: '.5rem' }}>{detail}</p>
                            )
                        }



                        {/* {
                            description || '' + '\n' + detail || '' && (
                                // <p className="subText mt-4">{text}</p>
                                <p style={{ whiteSpace: 'pre-line', marginTop: '1rem' }}>{description + '\n' + detail}</p>
                            )
                        } */}
                        <div className="flex gap-4 flex-wrap">
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

                            <Button
                                onClick={handleShare}
                                className="mt-8 bg-transparent border border-white text-white hover:bg-white hover:text-black transition-colors"
                                variant={'outline'}>
                                {copied ? (
                                    <>
                                        <Check className="w-4 h-4 mr-2" />
                                        {"Copied!"}
                                    </>
                                ) : (
                                    <>
                                        <Share2 className="w-4 h-4 mr-2" />
                                        {"Share"}
                                    </>
                                )}
                            </Button>

                            {/* <Button
                                onClick={handleAddToCart}
                                className="mt-8 invert" variant={'default'}>
                                {"Add To wishlist"}
                            </Button> */}
                        </div>
                    </div>

                    {/* Watch image */}
                    <div className="lex justifycenter h-full lg:max-h-[700px]">
                        <img
                            className="h-full w-full object-contain"
                            src={primaryPhotoUrl}
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