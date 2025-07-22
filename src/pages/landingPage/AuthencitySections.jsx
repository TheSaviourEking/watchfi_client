import { useState, useEffect, useRef, useCallback } from 'react';
import { getDominantColorFromUrl } from "@/lib/getDominantColor";
import HeroText from "../../components/HeroText";

export default function AuthenticitySection() {
    const [dominantColor, setDominantColor] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isVisible, setIsVisible] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const sectionRef = useRef(null);

    const imageUrl = "/section-1.png";

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
                    className="relative h-full w-full transition-transform duration-300 ease-out"
                    style={{
                        transform: `scale(${1 + mousePosition.x * 0.01}) translate(${mousePosition.x * -5}px, ${mousePosition.y * -3}px)`,
                    }}
                >
                    <img
                        src={imageUrl}
                        alt="Authenticated Luxury Timepiece"
                        className="h-full w-full object-cover object-center"
                        loading="lazy"
                    />
                </div>

                {/* Subtle Overlay with Dominant Color */}
                {!isLoading && dominantColor && (
                    <div
                        className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
                        style={{
                            background: `
                                radial-gradient(circle at center, 
                                    transparent 0%, 
                                    ${dominantColor.rgba(0.3)} 70%,
                                    ${dominantColor.rgba(0.5)} 100%
                                )
                            `,
                            opacity: isVisible ? 1 : 0,
                        }}
                    />
                )}

                {/* Soft Vignette */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/30" />
            </div>

            {/* Minimal Floating Particles */}
            <div className="absolute inset-0 pointer-events-none">
                {[...Array(6)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-1 h-1 bg-white/15 rounded-full animate-pulse"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${i * 0.6}s`,
                            animationDuration: `${3 + Math.random() * 2}s`,
                            transform: `translate(${mousePosition.x * (i % 2 === 0 ? 10 : -10)}px, ${mousePosition.y * (i % 2 === 0 ? -5 : 5)}px)`,
                        }}
                    />
                ))}
            </div>

            {/* Content Layer */}
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div
                        className={`
                            relative max-w-3xl transition-all duration-1200 ease-out
                            ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
                        `}
                        style={{
                            transform: `translateY(${mousePosition.y * -10}px) translateX(${mousePosition.x * -5}px)`,
                            transition: 'transform 0.3s ease-out',
                        }}
                    >
                        {/* Glass Card Container */}
                        <div
                            className="relative backdrop-blursm rounded-2xl p-6 sm:p-8 lg:p-10 borde borderwhite/10"
                            style={{
                                background: `linear-gradient(145deg, 
                                    ${dominantColor?.rgba ? dominantColor.rgba(0.15) : 'rgba(255,255,255,0.08)'} 0%, 
                                    ${dominantColor?.rgba ? dominantColor.rgba(0.03) : 'rgba(255,255,255,0.03)'} 100%
                                )`,
                                boxShadow: `
                                    0 15px 30px -10px rgba(0, 0, 0, 0.4),
                                    0 0 0 1px rgba(255, 255, 255, 0.08),
                                    inset 0 1px 0 rgba(255, 255, 255, 0.15)
                                `,
                            }}
                        >
                            <HeroText
                                classname="max-w-3xl"
                                header="Enjoy Authenticity"
                                text="Each timepiece is meticulously verified by our expert horologists and securely tokenized on the blockchain, guaranteeing trust and transparency."
                                cta={{
                                    variant: 'outline',
                                    ctaText: "Learn More",
                                    href: '/authenticity'
                                }}
                                animationDelay={300}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.4; }
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