import React, { useState, useRef, useEffect } from 'react';

const Carousel = ({ children, defaultVisibleSlides = 1, gap = 16 }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [containerWidth, setContainerWidth] = useState(0);
    const [visibleSlides, setVisibleSlides] = useState(defaultVisibleSlides);
    const slidesCount = React.Children.count(children);
    const containerRef = useRef(null);

    // Touch swipe refs
    const touchStartX = useRef(0);
    const touchEndX = useRef(0);

    // Mouse drag refs
    const isDragging = useRef(false);
    const dragStartX = useRef(0);
    const dragCurrentX = useRef(0);

    // Update container width and visible slides on mount and resize
    useEffect(() => {
        const updateWidthAndSlides = () => {
            if (containerRef.current) {
                const width = containerRef.current.offsetWidth;
                setContainerWidth(width);

                // Adjust visibleSlides based on screen width
                if (width < 640) {
                    setVisibleSlides(1); // Mobile: 1 slide
                } else if (width < 1024) {
                    setVisibleSlides(2); // Tablet: 2 slides
                } else {
                    setVisibleSlides(3); // Desktop: 3 slides
                }
            }
        };

        updateWidthAndSlides();
        window.addEventListener('resize', updateWidthAndSlides);

        return () => window.removeEventListener('resize', updateWidthAndSlides);
    }, []);

    // Move to previous slide
    const prevSlide = () => {
        setCurrentIndex((prev) => (prev === 0 ? slidesCount - visibleSlides : prev - 1));
    };

    // Move to next slide
    const nextSlide = () => {
        setCurrentIndex((prev) =>
            prev >= slidesCount - visibleSlides ? 0 : prev + 1
        );
    };

    // Keyboard navigation
    useEffect(() => {
        const handleKey = (e) => {
            if (e.key === 'ArrowLeft') prevSlide();
            if (e.key === 'ArrowRight') nextSlide();
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [slidesCount, visibleSlides]);

    // Touch handlers
    const onTouchStart = (e) => {
        touchStartX.current = e.changedTouches[0].screenX;
        touchEndX.current = touchStartX.current;
    };

    const onTouchEnd = (e) => {
        touchEndX.current = e.changedTouches[0].screenX;
        const distance = touchStartX.current - touchEndX.current;
        const swipeThreshold = 50;

        if (Math.abs(distance) > swipeThreshold) {
            e.preventDefault();
            handleSwipe(touchStartX.current, touchEndX.current);
        }
    };

    // Mouse handlers
    const onMouseDown = (e) => {
        isDragging.current = true;
        dragStartX.current = e.clientX;
        dragCurrentX.current = e.clientX;
    };

    const onMouseMove = (e) => {
        if (!isDragging.current) return;
        dragCurrentX.current = e.clientX;
    };

    const onMouseUp = (e) => {
        if (!isDragging.current) return;
        isDragging.current = false;
        const distance = dragStartX.current - dragCurrentX.current;
        const swipeThreshold = 50;

        if (Math.abs(distance) > swipeThreshold) {
            e.preventDefault();
            handleSwipe(dragStartX.current, dragCurrentX.current);
        }
    };

    const onMouseLeave = () => {
        if (!isDragging.current) return;
        isDragging.current = false;
        const distance = dragStartX.current - dragCurrentX.current;
        const swipeThreshold = 50;

        if (Math.abs(distance) > swipeThreshold) {
            handleSwipe(dragStartX.current, dragCurrentX.current);
        }
    };

    // Common swipe handler
    const handleSwipe = (startX, endX) => {
        const distance = startX - endX;
        const swipeThreshold = 50;

        if (distance > swipeThreshold) {
            nextSlide();
        } else if (distance < -swipeThreshold) {
            prevSlide();
        }
    };

    // Prevent rendering until container width is known
    if (containerWidth === 0) {
        return <div ref={containerRef} className="relative w-full overflow-hidden" />;
    }

    // Calculate slide width and translation
    const slideWidthPercent = 100 / visibleSlides;
    const gapPercent = (gap / containerWidth) * 100;
    const totalSlideWidthPercent = slideWidthPercent + gapPercent;
    const translateXPercent = -totalSlideWidthPercent * currentIndex;

    return (
        <div
            className="relative w-full overflow-hidden"
            ref={containerRef}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseLeave}
            style={{ cursor: isDragging.current ? 'grabbing' : 'grab' }}
        >
            {/* Slides container */}
            <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{
                    gap: `${gap}px`,
                    transform: `translateX(${translateXPercent}%)`,
                    width: `${totalSlideWidthPercent * slidesCount}%`,
                }}
            >
                {
                    React.Children.map(children, (child, index) => (
                        <div
                            className="flex-shrink-0 pointer-events-auto"
                            style={{ width: `${slideWidthPercent}%` }}
                            key={index}
                        >
                            {child}
                        </div>
                    ))}
            </div>

            {/* Navigation buttons */}
            <div className="absolute inset-y-0 left-0 flex items-center">
                <button
                    aria-label="Previous Slide"
                    onClick={prevSlide}
                    className="bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full p-2 transition"
                    style={{ width: '2.5rem', height: '2.5rem' }}
                >
                    ❮
                </button>
            </div>
            <div className="absolute inset-y-0 right-0 flex items-center">
                <button
                    aria-label="Next Slide"
                    onClick={nextSlide}
                    className="bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full p-2 transition"
                    style={{ width: '2.5rem', height: '2.5rem' }}
                >
                    ❯
                </button>
            </div>

            {/* Pagination dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-3">
                {Array.from({ length: slidesCount - visibleSlides + 1 }).map((_, idx) => (
                    <button
                        key={idx}
                        aria-label={`Go to slide ${idx + 1}`}
                        onClick={() => setCurrentIndex(idx)}
                        className={`w-3 h-3 rounded Around transition-colors ${idx === currentIndex ? 'bg-black' : 'bg-gray-400'
                            }`}
                    />
                ))}
            </div>
        </div>
    );
};

export default Carousel;