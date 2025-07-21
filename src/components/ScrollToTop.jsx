import { useEffect } from 'react';
import { useLocation } from 'react-router';

export function ScrollToTop() {
    const { pathname } = useLocation();

    useEffect(() => {
        // Define route patterns that should scroll to top
        const scrollToTopPatterns = [
            /^\/collections\/[^\/]+$/,
            // /^\/products\/[^\/]+$/,
            // /^\/$/
        ];

        // Check if current route should scroll to top
        const shouldScrollToTop = scrollToTopPatterns.some(pattern =>
            pattern.test(pathname)
        );

        if (shouldScrollToTop) {
            const timer = setTimeout(() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }, 0)
            console.log('Scrolled to top:', pathname);

            return () => clearTimeout(timer);
        }
    }, [pathname]);

    return null;
}