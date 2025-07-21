import { useState, useEffect } from 'react';
import { getDominantColorFromUrl } from "@/lib/getDominantColor";
import HeroText from "../../components/HeroText";

export default function Hero() {
    const [dominantColors, setDominantColors] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const images = [
        "https://images.pexels.com/photos/190819/pexels-photo-190819.jpeg",
        "https://images.pexels.com/photos/277390/pexels-photo-277390.jpeg",
        "https://images.pexels.com/photos/1697214/pexels-photo-1697214.jpeg",
        "https://images.pexels.com/photos/1034063/pexels-photo-1034063.jpeg",
        "https://images.pexels.com/photos/1697215/pexels-photo-1697215.jpeg"
    ];

    useEffect(() => {
        // Load dominant colors client-side
        const loadDominantColors = async () => {
            try {
                const colors = await Promise.all(
                    images.map(async (imageUrl) => {
                        try {
                            const color = await getDominantColorFromUrl(imageUrl);
                            return { imageUrl, color };
                        } catch (error) {
                            console.error("Error getting dominant color for", imageUrl, error);
                            return { imageUrl, color: null };
                        }
                    })
                );
                setDominantColors(colors);
            } catch (error) {
                console.error("Error loading dominant colors:", error);
                // Set fallback colors
                setDominantColors(images.map(imageUrl => ({ imageUrl, color: null })));
            } finally {
                setIsLoading(false);
            }
        };

        loadDominantColors();
    }, []);

    // Generate inline styles
    const heroStyles = `
        @keyframes hero-slide {
            0%, 20% { opacity: 1; transform: scale(1); }
            25%, 95% { opacity: 0; transform: scale(1.05); }
            100% { opacity: 1; transform: scale(1); }
        }

        @keyframes hero-overlay {
            0%, 20% { opacity: 1; }
            25%, 95% { opacity: 0; }
            100% { opacity: 1; }
        }

        @keyframes hero-content {
            0%, 18% { opacity: 1; transform: translateY(0px); }
            22%, 93% { opacity: 0.7; transform: translateY(-10px); }
            97%, 100% { opacity: 1; transform: translateY(0px); }
        }

        @keyframes progress-fill {
            0% { transform: translateX(-100%); }
            20% { transform: translateX(100%); }
            100% { transform: translateX(100%); }
        }

        @keyframes hero-particles {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(180deg); }
        }

        @keyframes shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
        }

        .hero-image {
            animation: hero-slide 25s infinite;
            animation-fill-mode: both;
        }

        .hero-overlay {
            animation: hero-overlay 25s infinite;
            animation-fill-mode: both;
        }

        .hero-content {
            animation: hero-content 25s infinite;
            animation-fill-mode: both;
        }

        ${images.map((_, index) => `
            .hero-image:nth-child(${index + 1}) {
                animation-delay: ${index * 5}s;
            }
            .hero-overlay:nth-child(${index + 1}) {
                animation-delay: ${index * 5}s;
            }
        `).join('')}

        .hero-progress {
            position: relative;
            overflow: hidden;
        }

        .hero-progress::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent);
            animation: progress-fill 25s infinite;
        }

        ${images.map((_, index) => `
            .hero-indicator:nth-child(${index + 1}) .hero-progress::after {
                animation-delay: ${index * 5}s;
            }
        `).join('')}

        .hero-particles {
            position: absolute;
            inset: 0;
            pointer-events: none;
            background: 
                radial-gradient(circle at 20% 20%, rgba(255,255,255,0.1) 0%, transparent 50%),
                radial-gradient(circle at 80% 30%, rgba(255,255,255,0.05) 0%, transparent 50%),
                radial-gradient(circle at 40% 80%, rgba(255,255,255,0.08) 0%, transparent 50%);
            animation: hero-particles 30s ease-in-out infinite;
        }

        .hero-text-shimmer {
            background: linear-gradient(
                110deg,
                transparent 40%,
                rgba(255,255,255,0.3) 50%,
                transparent 60%
            );
            background-size: 200% 100%;
            animation: shimmer 3s ease-in-out infinite;
        }

        .hero-glass {
            backdrop-filter: blur(4px) saturate(180%);
            -webkit-backdrop-filter: blur(4px) saturate(180%);
            box-shadow: 
                0 25px 50px -12px rgba(0, 0, 0, 0.25),
                0 0 0 1px rgba(255, 255, 255, 0.1),
                inset 0 1px 0 rgba(255, 255, 255, 0.1);
        }
    `;

    return (
        <>
            <style dangerouslySetInnerHTML={{ __html: heroStyles }} />

            <section className="relative overflow-hidden">
                {/* Background Images with Staggered Animation */}
                <div className="relative h-screen">
                    {images.map((imageUrl, index) => (
                        <div key={imageUrl} className="absolute inset-0 hero-image">
                            <img
                                src={imageUrl}
                                alt={`Luxury Timepiece ${index + 1}`}
                                className="h-full w-full object-cover object-center"
                            />
                        </div>
                    ))}

                    {/* Dynamic Overlays */}
                    {!isLoading && dominantColors.map(({ color }, index) => (
                        <div
                            key={index}
                            className="absolute inset-0 hero-overlay"
                            style={{
                                background: `
                                    linear-gradient(45deg, ${color?.rgba ? color.rgba(0.2) : 'rgba(0,0,0,0.2)'} 0%, ${color?.rgba ? color.rgba(0.3) : 'rgba(0,0,0,0.3)'} 100%),
                                    radial-gradient(circle at center, transparent 0%, ${color?.rgba ? color.rgba(0.1) : 'rgba(0,0,0,0.1)'} 100%)
                                `
                            }}
                        />
                    ))}

                    {/* Fallback overlays while loading */}
                    {isLoading && images.map((_, index) => (
                        <div
                            key={index}
                            className="absolute inset-0 hero-overlay"
                            style={{
                                background: `
                                    linear-gradient(45deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.3) 100%),
                                    radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.1) 100%)
                                `
                            }}
                        />
                    ))}

                    {/* Cinematic Vignette */}
                    <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30" />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40" />

                    {/* Floating Particles */}
                    <div className="hero-particles" />
                </div>

                {/* Content Layer - Single Instance */}
                <div className="absolute inset-0 h-full w-full flex items-center">
                    <div className="container mx-auto px-4">
                        <div className="w-fit rounded-3xl p-8 border border-white/10 shadow-2xl hero-content hero-glass bg-black/10">
                            <div className="hero-text-shimmer">
                                <HeroText
                                    classname="max-w-3xl"
                                    header={'Luxury Timepieces Secured on Chain'}
                                    text="Bringing the worlds of luxury horology and blockchain technology together."
                                    cta={{
                                        ctaText: "START SHOPPING",
                                        href: '/collections'
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Premium Progress Indicators */}
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-3">
                    {images.map((_, index) => (
                        <div key={index} className="w-12 h-0.5 bg-white/30 rounded-full overflow-hidden hover:bg-white/50 transition-all duration-300 cursor-pointer hover:scale-y-150">
                            <div className="hero-progress" />
                        </div>
                    ))}
                </div>
            </section>
        </>
    );
}