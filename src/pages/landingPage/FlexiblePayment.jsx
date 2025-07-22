import { useState, useEffect, useRef, useCallback } from 'react';
import { getDominantColorFromUrl } from "@/lib/getDominantColor";
import HeroText from "../../components/HeroText";

export default function FlexiblePayment() {
    const [dominantColor, setDominantColor] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isVisible, setIsVisible] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const sectionRef = useRef(null);

    const imageUrl = "/section-2.png";

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
            { threshold: 0.3 }
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
            {/* Background Image with Subtle Parallax */}
            <div className="absolute inset-0">
                <div
                    className="relative h-screen w-full transition-transform duration-300 ease-out"
                    style={{
                        transform: `scale(${1 + mousePosition.x * 0.015}) translate(${mousePosition.x * -7}px, ${mousePosition.y * -4}px)`,
                    }}
                >
                    <img
                        src={imageUrl}
                        alt="Luxury Timepiece Payment Options"
                        className="h-full w-full object-cover object-center"
                        loading="lazy"
                    />
                </div>

                {/* Dynamic Overlay with Soft Gradient */}
                {!isLoading && dominantColor && (
                    <div
                        className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
                        style={{
                            background: `
                                radial-gradient(ellipse at ${mousePosition.x * 100}% 30%, 
                                    transparent 0%, 
                                    ${dominantColor.rgba(0.25)} 65%,
                                    ${dominantColor.rgba(0.45)} 100%
                                )
                            `,
                            opacity: isVisible ? 1 : 0,
                        }}
                    />
                )}

                {/* Soft Vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-black/15" />
            </div>

            {/* Subtle Floating Particles */}
            <div className="absolute inset-0 pointer-events-none">
                {[...Array(8)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-1 h-1 bg-white/20 rounded-full animate-pulse"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${i * 0.5}s`,
                            animationDuration: `${2.5 + Math.random() * 2}s`,
                            transform: `translate(${mousePosition.x * (i % 2 === 0 ? 12 : -12)}px, ${mousePosition.y * (i % 2 === 0 ? -6 : 6)}px)`,
                        }}
                    />
                ))}
            </div>

            {/* Content Layer */}
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div
                        className={`
                            relative max-w-3xl transition-all duration-1200 ease-out mx-auto
                            ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
                        `}
                        style={{
                            transform: `translateY(${mousePosition.y * -12}px) translateX(${mousePosition.x * -6}px)`,
                            transition: 'transform 0.3s ease-out',
                        }}
                    >
                        {/* Glass Card Container */}
                        <div
                            className="relative backdrop-blur-sm rounded-2xl p-6 sm:p-8 lg:p-10 borde borderwhite/15"
                            style={{
                                background: `linear-gradient(160deg, 
                                    ${dominantColor?.rgba ? dominantColor.rgba(0.12) : 'rgba(255,255,255,0.06)'} 0%, 
                                    ${dominantColor?.rgba ? dominantColor.rgba(0.02) : 'rgba(255,255,255,0.02)'} 100%
                                )`,
                                boxShadow: `
                                    0 10px 20px -8px rgba(0, 0, 0, 0.3),
                                    0 0 0 1px rgba(255, 255, 255, 0.1),
                                    inset 0 1px 0 rgba(255, 255, 255, 0.12)
                                `,
                            }}
                        >
                            <HeroText
                                classname="max-w-3xl text-center"
                                header="Flexible Payment Options"
                                text="Unlock your dream timepiece with our tailored payment plans, offering seamless financing and cryptocurrency options for ultimate convenience."
                                cta={{
                                    variant: 'outline',
                                    ctaText: "Explore Plans",
                                    href: '/payment-options'
                                }}
                                animationDelay={400}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.3; }
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