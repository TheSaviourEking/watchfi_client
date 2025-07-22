import { useState, useEffect, useRef, useCallback } from 'react';
import HeroText from '../../components/HeroText';
import { getDominantColorFromUrl } from '../../lib/getDominantColor';

export default function Hero() {
    const [dominantColors, setDominantColors] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isPlaying, setIsPlaying] = useState(true);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isVisible, setIsVisible] = useState(false);
    const intervalRef = useRef(null);
    const heroRef = useRef(null);

    const images = [
        "https://images.pexels.com/photos/190819/pexels-photo-190819.jpeg",
        "https://images.pexels.com/photos/277390/pexels-photo-277390.jpeg",
        "https://images.pexels.com/photos/1697214/pexels-photo-1697214.jpeg",
        "https://images.pexels.com/photos/1034063/pexels-photo-1034063.jpeg",
        "https://images.pexels.com/photos/1697215/pexels-photo-1697215.jpeg"
    ];

    // Mouse tracking for parallax effects
    const handleMouseMove = useCallback((e) => {
        if (heroRef.current) {
            const rect = heroRef.current.getBoundingClientRect();
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
            { threshold: 0.1 }
        );

        if (heroRef.current) {
            observer.observe(heroRef.current);
        }

        return () => observer.disconnect();
    }, []);

    // Auto-slide functionality
    useEffect(() => {
        if (isPlaying) {
            intervalRef.current = setInterval(() => {
                setCurrentSlide((prev) => (prev + 1) % images.length);
            }, 6000);
        } else {
            clearInterval(intervalRef.current);
        }

        return () => clearInterval(intervalRef.current);
    }, [isPlaying, images.length]);

    // Load dominant colors
    useEffect(() => {
        const loadDominantColors = async () => {
            try {
                const colors = await Promise.all(
                    images.map(async (imageUrl) => {
                        try {
                            const color = await getDominantColorFromUrl(imageUrl);
                            return { imageUrl, color };
                        } catch (error) {
                            return { imageUrl, color: { rgba: (alpha) => `rgba(0,0,0,${alpha})` } };
                        }
                    })
                );
                setDominantColors(colors);
            } catch (error) {
                setDominantColors(images.map(imageUrl => ({
                    imageUrl,
                    color: { rgba: (alpha) => `rgba(0,0,0,${alpha})` }
                })));
            } finally {
                setIsLoading(false);
            }
        };

        loadDominantColors();
    }, []);

    const goToSlide = (index) => {
        setCurrentSlide(index);
        setIsPlaying(false);
        setTimeout(() => setIsPlaying(true), 3000);
    };

    const togglePlayPause = () => {
        setIsPlaying(!isPlaying);
    };

    return (
        <section
            ref={heroRef}
            className="relative overflow-hidden bg-black"
            onMouseMove={handleMouseMove}
            style={{ height: '100vh', minHeight: '600px' }}
        >
            {/* Background Images with Advanced Transitions */}
            <div className="absolute inset-0">
                {images.map((imageUrl, index) => (
                    <div
                        key={imageUrl}
                        className={`absolute inset-0 transition-all duration-2000 ease-in-out ${index === currentSlide
                                ? 'opacity-100 scale-100'
                                : 'opacity-0 scale-110'
                            }`}
                        style={{
                            transform: `scale(${index === currentSlide ? 1 + mousePosition.x * 0.02 : 1.1}) 
                                       translate(${mousePosition.x * -10}px, ${mousePosition.y * -5}px)`,
                            transition: 'transform 0.3s ease-out, opacity 2s ease-in-out, scale 2s ease-in-out'
                        }}
                    >
                        <img
                            src={imageUrl}
                            alt={`Luxury Timepiece ${index + 1}`}
                            className="h-full w-full object-cover object-center"
                            loading={index === 0 ? "eager" : "lazy"}
                        />

                        {/* Advanced Overlay Effects */}
                        {!isLoading && dominantColors[index] && (
                            <div
                                className="absolute inset-0"
                                style={{
                                    background: `
                                        radial-gradient(circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, 
                                            transparent 0%, 
                                            ${dominantColors[index].color.rgba(0.3)} 60%,
                                            ${dominantColors[index].color.rgba(0.5)} 100%
                                        ),
                                        linear-gradient(135deg, 
                                            ${dominantColors[index].color.rgba(0.2)} 0%, 
                                            transparent 50%,
                                            ${dominantColors[index].color.rgba(0.3)} 100%
                                        )
                                    `
                                }}
                            />
                        )}
                    </div>
                ))}
            </div>

            {/* Cinematic Vignette with Dynamic Effects */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50" />

            {/* Dynamic Light Rays */}
            <div
                className="absolute inset-0 opacity-20 pointer-events-none"
                style={{
                    background: `
                        linear-gradient(${mousePosition.x * 360}deg, 
                            transparent 0%, 
                            rgba(255,255,255,0.1) 1%, 
                            transparent 2%
                        ),
                        linear-gradient(${(mousePosition.x * 360) + 90}deg, 
                            transparent 0%, 
                            rgba(255,255,255,0.05) 1%, 
                            transparent 2%
                        )
                    `
                }}
            />

            {/* Floating Particles */}
            <div className="absolute inset-0 pointer-events-none">
                {[...Array(12)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-1 h-1 bg-white/30 rounded-full animate-pulse"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${i * 0.5}s`,
                            animationDuration: `${3 + Math.random() * 2}s`,
                            transform: `translate(${mousePosition.x * (i % 2 === 0 ? 20 : -20)}px, ${mousePosition.y * (i % 2 === 0 ? -10 : 10)}px)`
                        }}
                    />
                ))}
            </div>

            {/* Main Content */}
            <div className="absolute inset-0 flex items-center justify-center lg:justify-start">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div
                        className={`
                            relative max-w-4xl transition-all duration-1500 ease-out
                            ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}
                        `}
                        style={{
                            transform: `translateY(${mousePosition.y * -20}px) translateX(${mousePosition.x * -10}px)`,
                            transition: 'transform 0.3s ease-out'
                        }}
                    >
                        {/* Glass Card Container */}
                        <div className="relative">
                            {/* Background Blur */}
                            <div
                                className="absolute inset-0 bg-black/20 backdrop-blur-md border border-white/10 rounded-3xl"
                                style={{
                                    background: `linear-gradient(135deg, 
                                        rgba(255,255,255,0.1) 0%, 
                                        rgba(255,255,255,0.05) 100%
                                    )`,
                                    boxShadow: `
                                        0 25px 50px -12px rgba(0, 0, 0, 0.5),
                                        0 0 0 1px rgba(255, 255, 255, 0.1),
                                        inset 0 1px 0 rgba(255, 255, 255, 0.2)
                                    `
                                }}
                            />

                            {/* Content */}
                            <div className="relative z-10 p-6 sm:p-8 lg:p-12">
                                <HeroText
                                    classname="max-w-3xl"
                                    header="Luxury Timepieces Secured on Chain"
                                    text="Bringing the worlds of luxury horology and blockchain technology together. Experience the future of authenticated luxury."
                                    cta={{
                                        ctaText: "START SHOPPING",
                                        href: '/collections'
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Enhanced Navigation Controls */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-6">
                {/* Progress Indicators */}
                <div className="flex gap-3">
                    {images.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={`
                                relative overflow-hidden rounded-full transition-all duration-500 ease-out
                                hover:scale-125 focus:outline-none focus:ring-2 focus:ring-white/50
                                ${index === currentSlide
                                    ? 'w-16 h-1.5 bg-white/90'
                                    : 'w-8 h-1.5 bg-white/40 hover:bg-white/60'
                                }
                            `}
                        >
                            {/* Progress Fill */}
                            {index === currentSlide && isPlaying && (
                                <div
                                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-white to-gray-200 origin-left animate-progress-fill"
                                    style={{
                                        animation: 'progressFill 6s linear infinite'
                                    }}
                                />
                            )}
                        </button>
                    ))}
                </div>

                {/* Play/Pause Control */}
                <button
                    onClick={togglePlayPause}
                    className="p-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/50 hover:scale-110"
                >
                    {isPlaying ? (
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                        </svg>
                    ) : (
                        <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                        </svg>
                    )}
                </button>

                {/* Slide Counter */}
                <div className="text-white/60 text-sm font-mono">
                    {String(currentSlide + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-8 right-8 flex flex-col items-center gap-2 text-white/60">
                <span className="text-xs font-light tracking-widest rotate-90 origin-center transform translate-y-6">
                    SCROLL
                </span>
                <div className="w-px h-12 bg-gradient-to-b from-white/60 to-transparent animate-pulse" />
            </div>

            <style jsx>{`
                @keyframes progressFill {
                    0% { transform: scaleX(0); }
                    100% { transform: scaleX(1); }
                }
                
                @media (max-width: 768px) {
                    .container {
                        padding-left: 1rem;
                        padding-right: 1rem;
                    }
                }
            `}</style>
        </section>
    );
}