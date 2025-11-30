// app/page.tsx
'use client';

import HeroSection from '../components/home/HeroSection'; // 👈 Import the HeroSection

export default function Home() {
  return (
    <div className="min-h-screen"> {/* A container to ensure full height if needed */}
      <HeroSection /> {/* 👈 Render the HeroSection here */}

      {/* You can add more temporary content here if needed, 
          like a placeholder for MissionSection or HowItWorks */}
      <section className="py-16 text-center text-gray-600">
        <h2 className="text-3xl font-bold mb-4">More Home Page Content Coming Soon!</h2>
        <p className="text-lg">This space will feature mission, how it works, and more.</p>
      </section>
    </div>
  );
}