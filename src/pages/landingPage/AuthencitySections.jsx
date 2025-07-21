import { useState, useEffect } from 'react';
import { getDominantColorFromUrl } from "@/lib/getDominantColor";
import HeroText from "../../components/HeroText";

export default function AuthenticitySection() {
    const [dominantColor, setDominantColor] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const imageUrl = "https://images.pexels.com/photos/277390/pexels-photo-277390.jpeg";

    useEffect(() => {
        const loadDominantColor = async () => {
            try {
                const color = await getDominantColorFromUrl(imageUrl);
                // console.log(color, "dominant color");
                setDominantColor(color);
            } catch (error) {
                // console.error("Error getting dominant color:", error);
                setDominantColor(null);
            } finally {
                setIsLoading(false);
            }
        };

        loadDominantColor();
    }, [imageUrl]);

    return (
        <section className="relative h-scree ">
            {/* Background Image */}
            <div className="relative h-screen">
                <img
                    src={imageUrl}
                    alt="Watch"
                    className="h-full w-full object-cover object-center"
                />

                {/* Overlay with dominant color */}
                <div
                    className="absolute inset-0 bg-black/30"
                    style={{
                        backgroundColor: dominantColor?.rgba ? dominantColor.rgba(0.3) : 'rgba(0,0,0,0.3)'
                    }}
                />
            </div>

            {/* Content Layer */}
            <div className="absolute inset-0 h-full min-h-screen w-full flex items-center">
                <div className="container mx-auto px-4">
                    <div
                        className="w-fit backdrop-blur-sm rounded-lg p-6"
                        style={{
                            // backgroundColor: dominantColor?.rgba ? dominantColor.rgba(0.2) : 'rgba(0,0,0,0.2)',
                            color: dominantColor?.contrast || 'white'
                        }}
                    >
                        <HeroText
                            classname="max-w-3xl"
                            header={'Enjoy Authenticity'}
                            text="Every watch is meticulously authenticated by our team of certified horologists before being tokenized."
                            cta={{
                                variant: 'ghost',
                                ctaText: "Learn More",
                                href: '/home'
                            }}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}