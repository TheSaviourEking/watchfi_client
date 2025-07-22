import { useState, useEffect, useRef, useCallback } from 'react';
import { getDominantColorFromUrl } from "@/lib/getDominantColor";
import HeroText from "../../components/HeroText";

export default function Provenance() {
    const [dominantColor, setDominantColor] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isVisible, setIsVisible] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const sectionRef = useRef(null);

    const imageUrl = "/section-3.png";

    // Mouse tracking for subtle parallax
    const handleMouseMove = useCallback((e) => {
        if (sectionRef.current) {
            const rect = sectionRef.current.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width;
            const y = (e.clientY - rect.top) / rect.height;
            setMousePosition({ x, y });
        }
    }, []);

    // Intersection observer for entrance animations
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsVisible(entry.isIntersecting);
            },
            { threshold: 0.2 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => observer.disconnect();
    }, []);

    // Load dominant color
    useEffect(() => {
        const loadDominantColor = async () => {
            try {
                const color = await getDominantColorFromUrl(imageUrl);
                setDominantColor(color);
            } catch (error) {
                setDominantColor({ rgba: (alpha) => `rgba(0,0,0,${alpha})`, contrast: 'white' });
            } finally {
                setIsLoading(false);
            }
        };

        loadDominantColor();
    }, [imageUrl]);

    return (
        <section
            ref={sectionRef}
            className="relative overflow-hidden bg-black"
            onMouseMove={handleMouseMove}
            style={{ minHeight: '100vh', height: 'auto' }}
        >
            {/* Background Gradient for Depth */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/20" />

            {/* Content Container */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col-reverse lg:flex-row w-full min-h-screen items-center justify-center gap-6 lg:gap-12 py-12 lg:py-16">
                    {/* Image Section */}
                    <div
                        className="lg:basis-8/12 relative transition-all duration-1200 ease-out"
                        style={{
                            transform: `translate(${mousePosition.x * -8}px, ${mousePosition.y * -4}px)`,
                            opacity: isVisible ? 1 : 0,
                            transition: 'transform 0.3s ease-out, opacity 1.2s ease-out',
                        }}
                    >
                        <div className="relative rounded-2xl overflow-hidden border border-white/10">
                            <img
                                src={imageUrl}
                                alt="Certified Provenance Timepiece"
                                className="h-full w-full object-cover object-center"
                                loading="lazy"
                            />
                            {/* Image Overlay */}
                            {/* {!isLoading && dominantColor && (
                                <div
                                    className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
                                    style={{
                                        background: `
                                            linear-gradient(180deg, 
                                                transparent 0%, 
                                                ${dominantColor.rgba(0.2)} 70%,
                                                ${dominantColor.rgba(0.4)} 100%
                                            )
                                        `,
                                        opacity: isVisible ? 0.8 : 0,
                                    }}
                                />
                            )} */}
                        </div>
                    </div>

                    {/* Text Section */}
                    <div
                        className="max-w-xl transition-all duration-1200 ease-out"
                        style={{
                            transform: `translate(${mousePosition.x * 6}px, ${mousePosition.y * 3}px)`,
                            opacity: isVisible ? 1 : 0,
                            transition: 'transform 0.3s ease-out, opacity 1.2s ease-out',
                        }}
                    >
                        <div
                            className="relative backdrop-blur-sm rounded-2xl p-6 sm:p-8 lg:p-10"
                            style={{
                                background: `linear-gradient(170deg, 
                                    ${dominantColor?.rgba ? dominantColor.rgba(0.1) : 'rgba(255,255,255,0.05)'} 0%, 
                                    ${dominantColor?.rgba ? dominantColor.rgba(0.02) : 'rgba(255,255,255,0.02)'} 100%
                                )`,
                                // boxShadow: `
                                //     0 12px 24px -8px rgba(0, 0, 0, 0.3),
                                //     0 0 0 1px rgba(255, 255, 255, 0.1),
                                //     inset 0 1px 0 rgba(255, 255, 255, 0.12)
                                // `,
                            }}
                        >
                            <HeroText
                                classname="max-w-3xl"
                                header="Certified Provenance"
                                text="Each timepiece is paired with a unique NFT, securely storing ownership details, certification, and provenance on the blockchain for unmatched authenticity."
                                cta={{
                                    variant: 'outline',
                                    ctaText: "Discover Provenance",
                                    href: '/provenance'
                                }}
                                animationDelay={500}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Subtle Floating Particles */}
            <div className="absolute inset-0 pointer-events-none">
                {[...Array(5)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-1 h-1 bg-white/10 rounded-full animate-pulse"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${i * 0.7}s`,
                            animationDuration: `${3 + Math.random() * 2}s`,
                            transform: `translate(${mousePosition.x * (i % 2 === 0 ? 8 : -8)}px, ${mousePosition.y * (i % 2 === 0 ? -4 : 4)}px)`,
                        }}
                    />
                ))}
            </div>

            <style jsx>{`
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.2; }
                }

                @media (max-width: 768px) {
                    .container {
                        padding-left: 1rem;
                        padding-right: 1rem;
                    }
                }

                @media (max-width: 640px) {
                    .container {
                        padding-left: 0.75rem;
                        padding-right: 0.75rem;
                    }
                }
            `}</style>
        </section>
    );
}