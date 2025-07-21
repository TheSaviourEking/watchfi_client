import React from 'react';
import { motion } from 'motion/react';
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
            staggerChildren: 0.15, // Coordinated delay between sections
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
            duration: 1.2, // Much slower like Apple
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
            duration: 1.6, // Longest for hero impact
            ease: slowAppleEasing
        }
    }
};

// Authenticity - Subtle slide with coordinated fade
const authenticityVariants = {
    hidden: {
        opacity: 0,
        x: -30, // Much more subtle than before
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
        x: 30, // Opposite direction for visual balance
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
            duration: 1.4, // Slightly longer for emphasis
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
            duration: 1.5, // Grand finale timing
            ease: slowAppleEasing
        }
    }
};

const Home = () => {
    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <motion.div
                variants={heroVariants}
                viewport={{
                    once: true, // Apple-style: animate once, elegantly
                    amount: 0.2, // Trigger earlier for smoother flow
                    margin: "0px 0px -100px 0px" // Start animation before fully visible
                }}
                whileInView="visible"
                initial="hidden"
            >
                <Hero />
            </motion.div>

            <motion.div
                variants={authenticityVariants}
                viewport={{
                    once: true,
                    amount: 0.2,
                    margin: "0px 0px -80px 0px"
                }}
                whileInView="visible"
                initial="hidden"
            >
                <AuthenticitySection />
            </motion.div>

            <motion.div
                variants={paymentVariants}
                viewport={{
                    once: true,
                    amount: 0.2,
                    margin: "0px 0px -80px 0px"
                }}
                whileInView="visible"
                initial="hidden"
            >
                <FlexiblePayment />
            </motion.div>

            <motion.div
                variants={provenanceVariants}
                viewport={{
                    once: true,
                    amount: 0.2,
                    margin: "0px 0px -80px 0px"
                }}
                whileInView="visible"
                initial="hidden"
            >
                <Provenance />
            </motion.div>

            <motion.div
                variants={picksVariants}
                viewport={{
                    once: true,
                    amount: 0.2,
                    margin: "0px 0px -80px 0px"
                }}
                whileInView="visible"
                initial="hidden"
            >
                <TopPicks />
            </motion.div>

            <motion.div
                variants={brandsVariants}
                viewport={{
                    once: true,
                    amount: 0.2,
                    margin: "0px 0px -80px 0px"
                }}
                whileInView="visible"
                initial="hidden"
            >
                <BrandsSection />
            </motion.div>

            <motion.div
                variants={bannerVariants}
                viewport={{
                    once: true,
                    amount: 0.2,
                    margin: "0px 0px -50px 0px"
                }}
                whileInView="visible"
                initial="hidden"
            >
                <BannerSection />
            </motion.div>
        </motion.div>
    );
};

export default Home;