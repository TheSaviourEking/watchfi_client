import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router";

const HeroText = ({
    classname,
    reference,
    header,
    text,
    cta: { variant, ctaText, href } = {},
    animationDelay = 0
}) => {
    const [isVisible, setIsVisible] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const heroRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setTimeout(() => setIsVisible(true), animationDelay);
                }
            },
            { threshold: 0.1 }
        );

        if (heroRef.current) {
            observer.observe(heroRef.current);
        }

        return () => observer.disconnect();
    }, [animationDelay]);

    return (
        <div
            ref={heroRef}
            className={`!text-white transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                } ${classname || ''}`}
        >
            {/* Header with staggered animation */}
            <h1
                className={`text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight tracking-tight transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                    }`}
                style={{
                    background: 'linear-gradient(135deg, #ffffff 0%, #e5e7eb 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    transitionDelay: '200ms'
                }}
            >
                {header?.split(" ").map((word, index, array) => (
                    <span
                        key={index}
                        className={`inline-block transition-all duration-800 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                            }`}
                        style={{
                            transitionDelay: `${300 + index * 100}ms`
                        }}
                    >
                        {word}
                        {/* {index < array.length - 1 ? " " : ""} */}
                        {index < array.length - 1 && '\u00A0'}
                    </span>
                ))}
            </h1>

            {/* Reference with subtle animation */}
            {reference && (
                <p
                    className={`text-sm md:text-base text-gray-300 font-mono my-4 px-0 transition-all duration-800 ease-out ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
                        }`}
                    style={{ transitionDelay: '600ms' }}
                >
                    <span className="text-gray-500">Ref:</span>{' '}
                    <span className="relative">
                        {reference}
                        <div className="absolute -bottom-1 left-0 h-px bg-gradient-to-r from-blue-400 to-transparent w-full transform scale-x-0 transition-transform duration-300 origin-left group-hover:scale-x-100"></div>
                    </span>
                </p>
            )}

            {/* Text content with typewriter-like reveal */}
            {text && (
                <div
                    className={`mt-6 text-base md:text-lg lg:text-xl text-gray-200 leading-relaxed max-w-4xl transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                        }`}
                    style={{
                        whiteSpace: 'pre-line',
                        transitionDelay: '800ms'
                    }}
                >
                    {isVisible && (
                        <span className="block overflow-hidden">
                            <span
                                className="block animate-fade-in-up"
                                style={{
                                    animation: 'fadeInUp 0.8s ease-out forwards',
                                    animationDelay: '800ms',
                                    opacity: 0
                                }}
                            >
                                {text}
                            </span>
                        </span>
                    )}
                </div>
            )}

            {/* Enhanced CTA Button */}
            {ctaText && (
                <div
                    className={`mt-8 transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                        }`}
                    style={{ transitionDelay: '1000ms' }}
                >
                    <Link
                        to={href}
                        className="inline-block"
                    >
                        <button
                            onMouseEnter={() => setIsHovered(true)}
                            onMouseLeave={() => setIsHovered(false)}
                            className={`
                group relative overflow-hidden px-8 py-4 rounded-full font-semibold text-sm md:text-base
                transition-all duration-300 ease-out transform hover:scale-105 active:scale-95
                ${variant === 'outline'
                                    ? 'border-2 border-white text-white hover:bg-white hover:text-black'
                                    : 'bg-white text-black hover:bg-gray-100'
                                }
                focus:outline-none focus:ring-4 focus:ring-white/20
                shadow-lg hover:shadow-xl
              `}
                        >
                            {/* Animated background effect */}
                            <div className={`
                absolute inset-0 -z-10 bg-gradient-to-r from-blue-500 to-purple-600 
                transition-all duration-300 ease-out
                ${isHovered ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}
              `} />

                            {/* Button text with icon animation */}
                            <span className="relative z-10 flex items-center gap-2">
                                {ctaText}
                                <svg
                                    className={`w-4 h-4 transition-transform duration-300 ease-out ${isHovered ? 'translate-x-1' : 'translate-x-0'
                                        }`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                                    />
                                </svg>
                            </span>

                            {/* Ripple effect */}
                            <div className={`
                absolute inset-0 rounded-full bg-white/20 
                transition-all duration-300 ease-out pointer-events-none
                ${isHovered ? 'scale-110 opacity-0' : 'scale-0 opacity-100'}
              `} />
                        </button>
                    </Link>
                </div>
            )}

            <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
        </div>
    );
};

export default HeroText;