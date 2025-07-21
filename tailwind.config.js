/** @type {import('tailwindcss').Config} */

module.exports = {
    // darkMode: ["class"],
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        // Or if using `src` directory:
        "./src/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: 'hsl(var(--background))',
                foreground: 'hsl(var(--foreground))',
                card: {
                    DEFAULT: 'hsl(var(--card))',
                    foreground: 'hsl(var(--card-foreground))'
                },
                popover: {
                    DEFAULT: 'hsl(var(--popover))',
                    foreground: 'hsl(var(--popover-foreground))'
                },
                primary: {
                    DEFAULT: 'hsl(var(--primary))',
                    foreground: 'hsl(var(--primary-foreground))'
                },
                secondary: {
                    DEFAULT: 'hsl(var(--secondary))',
                    foreground: 'hsl(var(--secondary-foreground))'
                },
                muted: {
                    DEFAULT: 'hsl(var(--muted))',
                    foreground: 'hsl(var(--muted-foreground))'
                },
                accent: {
                    DEFAULT: 'hsl(var(--accent))',
                    foreground: 'hsl(var(--accent-foreground))'
                },
                destructive: {
                    DEFAULT: 'hsl(var(--destructive))',
                    foreground: 'hsl(var(--destructive-foreground))'
                },
                border: 'hsl(var(--border))',
                input: 'hsl(var(--input))',
                ring: 'hsl(var(--ring))',
                chart: {
                    '1': 'hsl(var(--chart-1))',
                    '2': 'hsl(var(--chart-2))',
                    '3': 'hsl(var(--chart-3))',
                    '4': 'hsl(var(--chart-4))',
                    '5': 'hsl(var(--chart-5))'
                },
                'nav-dark': '#09090B',
                'near-black': '#121212',
            },
            fontSize: {
                heading: '80px',
                subText: '40px',
                subHeading1: ['20px', {
                    lineHeight: '125%',
                    letterSpacing: '0%',
                }],
            },
            fontFamily: {
                clash: [
                    'var(--font-clash-grotesk)',
                    'system-ui',
                    'sans-serif'
                ]
            },
            fontWeight: {
                extralight: '200',
                light: '300',
                normal: '400',
                medium: '500',
                semibold: '600',
                bold: '700'
            },
            borderRadius: {
                lg: 'var(--radius)',
                md: 'calc(var(--radius) - 2px)',
                sm: 'calc(var(--radius) - 4px)'
            },
            // MOVE THESE INSIDE EXTEND
            // animation: {
            // 	'marquee': 'marquee var(--duration) infinite linear',
            // 	'marquee-vertical': 'marquee-vertical var(--duration) linear infinite',
            // },
            // keyframes: {
            // 	// marquee: {
            // 	// 	'from': { transform: 'translateX(0)' },
            // 	// 	'to': { transform: 'translateX(calc(-100% - var(--gap)))' },
            // 	// },
            // 	marquee: {
            // 		'from': { transform: 'translateX(0)' },
            // 		'to': {
            // 			transform: 'translateX(calc(-50 % - var(--gap) / 2))'
            // 		}
            // 	},
            // 	'marquee-vertical': {
            // 		'from': { transform: 'translateY(0)' },
            // 		'to': { transform: 'translateY(calc(-100% - var(--gap)))' },
            // 	}
            // }

            keyframes: {
                marquee: {
                    from: { transform: "translateX(0)" },
                    to: { transform: "translateX(calc(-100% - var(--gap)))" },
                },
                "marquee-vertical": {
                    from: { transform: "translateY(0)" },
                    to: { transform: "translateY(calc(-100% - var(--gap)))" },
                },
            },
            animation: {
                marquee: "marquee var(--duration) linear infinite",
                "marquee-vertical": "marquee-vertical var(--duration) linear infinite",
            },
        },
        container: {
            center: true,
            // padding: '1rem'
        },
    },
    plugins: [require("tailwindcss-animate")],
}