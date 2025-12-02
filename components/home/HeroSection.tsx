// components/home/HeroSection.tsx
'use client'; // This component might include client-side interactivity later

import Image from 'next/image';
import Link from 'next/link';

const HeroSection = () => {
    return (
        <section className="relative bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-20 md:py-32 overflow-hidden">

            {/* Background Image/Overlay for visual appeal */}
            <div className="absolute inset-0 z-0 opacity-20">
                <Image
                    src="/images/hero-bg.jpg" // Placeholder image path (you'll need to create this)
                    alt="Event Hub Background"
                    fill
                    style={{ objectFit: 'cover' }}
                    priority // Prioritize loading for LCP
                />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

                {/* Main Heading */}
                <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-4 animate-fade-in-up">
                    Discover & Book Your Next Unforgettable Event
                </h1>

                {/* Subheading/Description */}
                <p className="text-lg md:text-xl text-indigo-100 mb-8 max-w-3xl mx-auto animate-fade-in-up delay-100">
                    From concerts to conferences, workshops to webinars, EventHub connects you to experiences that matter.
                </p>

                {/* Call to Action Buttons */}
                <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fade-in-up delay-200">
                    <Link
                        href="/events" // Assuming /events will be the page listing all events
                        className="px-8 py-3 bg-white text-indigo-700 font-bold rounded-full shadow-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105"
                    >
                        Explore Events
                    </Link>
                    <Link
                        href="/about"
                        className="px-8 py-3 border border-white text-white font-bold rounded-full hover:bg-white hover:text-indigo-700 transition-all duration-300 transform hover:scale-105"
                    >
                        Learn More
                    </Link>
                </div>

            </div>
        </section>
    );
};

export default HeroSection;