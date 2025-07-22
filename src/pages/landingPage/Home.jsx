import { motion, useReducedMotion } from 'motion/react';
import Hero from './Hero';
import AuthenticitySection from './AuthencitySections';
import FlexiblePayment from './FlexiblePayment';
import Provenance from './Provenance';
import TopPicks from './TopPicks';
import BrandsSection from './BrandsSections';
import BannerSection from './BannerSection';

// Apple-style coordinated animation system
const appleEasing = [0.25, 0.46, 0.45, 0.94]; // Apple's signature easing curve
const slowAppleEasing = [0.16, 1, 0.3, 1]; // Even smoother for key moments

// Master container for orchestrated animations
const containerVariants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.2, // Increased for smoother sequencing
            delayChildren: 0.1
        }
    }
};

// Unified base animation that all sections inherit from
const baseSectionVariants = {
    hidden: {
        opacity: 0,
        y: 60,
        scale: 0.95
    },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            duration: 1.2,
            ease: appleEasing
        }
    }
};

// Hero - The grand entrance with extra presence
const heroVariants = {
    hidden: {
        opacity: 0,
        y: 40,
        scale: 0.98
    },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            duration: 1.6,
            ease: slowAppleEasing
        }
    }
};

// Authenticity - Subtle slide with coordinated fade
const authenticityVariants = {
    hidden: {
        opacity: 0,
        x: -30,
        y: 20
    },
    visible: {
        opacity: 1,
        x: 0,
        y: 0,
        transition: {
            duration: 1.2,
            ease: appleEasing
        }
    }
};

// Payment - Gentle scale with coordinated movement
const paymentVariants = {
    hidden: {
        opacity: 0,
        scale: 0.92,
        y: 40
    },
    visible: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: {
            duration: 1.3,
            ease: appleEasing
        }
    }
};

// Provenance - Mirror of authenticity for balance
const provenanceVariants = {
    hidden: {
        opacity: 0,
        x: 30,
        y: 20
    },
    visible: {
        opacity: 1,
        x: 0,
        y: 0,
        transition: {
            duration: 1.2,
            ease: appleEasing
        }
    }
};

// TopPicks - The showpiece with extra elegance
const picksVariants = {
    hidden: {
        opacity: 0,
        y: 50,
        scale: 0.94
    },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            duration: 1.4,
            ease: slowAppleEasing
        }
    }
};

// Brands - Coordinated rise
const brandsVariants = {
    hidden: {
        opacity: 0,
        y: 35,
        scale: 0.96
    },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            duration: 1.2,
            ease: appleEasing
        }
    }
};

// Banner - The finale with subtle grandeur
const bannerVariants = {
    hidden: {
        opacity: 0,
        y: 45,
        scale: 0.95
    },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            duration: 1.5,
            ease: slowAppleEasing
        }
    }
};

// Minimal CSS for smooth scrolling and layout stability
const styles = `
    html {
        scroll-behavior: smooth;
    }
    .section-container {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        justify-content: center;
    }
    .motion-div {
        will-change: transform, opacity;
    }
`;

const Home = () => {
    const shouldReduceMotion = useReducedMotion();

    // Adjust variants for reduced motion
    const adjustedVariants = shouldReduceMotion
        ? {
            hidden: { opacity: 1, y: 0, scale: 1, x: 0 },
            visible: { opacity: 1, y: 0, scale: 1, x: 0 }
        }
        : {
            hero: heroVariants,
            authenticity: authenticityVariants,
            payment: paymentVariants,
            provenance: provenanceVariants,
            picks: picksVariants,
            brands: brandsVariants,
            banner: bannerVariants
        };

    return (
        <>
            <style>{styles}</style>
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="motion-div"
            >
                <div className="section-container">
                    <motion.div
                        variants={adjustedVariants.hero || baseSectionVariants}
                        viewport={{ once: true, amount: 0.3, margin: "0px 0px -50px 0px" }}
                        whileInView="visible"
                        initial="hidden"
                        className="motion-div"
                    >
                        <Hero />
                    </motion.div>
                </div>

                <div className="section-container">
                    <motion.div
                        variants={adjustedVariants.authenticity || baseSectionVariants}
                        viewport={{ once: true, amount: 0.3, margin: "0px 0px -50px 0px" }}
                        whileInView="visible"
                        initial="hidden"
                        className="motion-div"
                    >
                        <AuthenticitySection />
                    </motion.div>
                </div>

                <div className="section-container">
                    <motion.div
                        variants={adjustedVariants.payment || baseSectionVariants}
                        viewport={{ once: true, amount: 0.3, margin: "0px 0px -50px 0px" }}
                        whileInView="visible"
                        initial="hidden"
                        className="motion-div"
                    >
                        <FlexiblePayment />
                    </motion.div>
                </div>

                <div className="section-container">
                    <motion.div
                        variants={adjustedVariants.provenance || baseSectionVariants}
                        viewport={{ once: true, amount: 0.3, margin: "0px 0px -50px 0px" }}
                        whileInView="visible"
                        initial="hidden"
                        className="motion-div"
                    >
                        <Provenance />
                    </motion.div>
                </div>

                <div className="section-containe">
                    <motion.div
                        variants={adjustedVariants.picks || baseSectionVariants}
                        viewport={{ once: true, amount: 0.3, margin: "0px 0px -50px 0px" }}
                        whileInView="visible"
                        initial="hidden"
                        className="motion-div"
                    >
                        <TopPicks />
                    </motion.div>
                </div>

                <div className="section-containe">
                    <motion.div
                        variants={adjustedVariants.brands || baseSectionVariants}
                        viewport={{ once: true, amount: 0.3, margin: "0px 0px -50px 0px" }}
                        whileInView="visible"
                        initial="hidden"
                        className="motion-div"
                    >
                        <BrandsSection />
                    </motion.div>
                </div>

                <div className="section-container">
                    <motion.div
                        variants={adjustedVariants.banner || baseSectionVariants}
                        viewport={{ once: true, amount: 0.3, margin: "0px 0px -50px 0px" }}
                        whileInView="visible"
                        initial="hidden"
                        className="motion-div"
                    >
                        <BannerSection />
                    </motion.div>
                </div>
            </motion.div>
        </>
    );
};

export default Home;