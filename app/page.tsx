'use client'

import React from 'react';
import { Hero_stat } from '@/src/components/layout/Hero-stats';
import { SelectedWorkSection } from '@/src/components/layout/SelectedWorkSection';
import { AboutSection } from '@/src/components/layout/AboutSection';
import LightRays from "@/components/LightRays";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-20">
        <div className="max-w-[1200px] mx-auto px-5">
          <div className="brand-gradient rounded-lg border-none overflow-hidden mb-3 relative flex">
            <div className="absolute inset-0 w-full h-full z-0 mix-blend-color-dodge pointer-events-none">
              <LightRays
                raysOrigin="left"
                raysColor="#27E5EF"
                raysSpeed={2}
                lightSpread={1.3}
                rayLength={5}
                pulsating={false}
                fadeDistance={1}
                saturation={1}
                followMouse
                mouseInfluence={0.15}
                noiseAmount={0.1}
                distortion={0}
              />
            </div>
            <div className="p-8 md:p-12 lg:p-16 min-h-[360px]">
              <h2 className="text-text-inverted-1 text-2xl md:text-3xl lg:text-4xl font-medium leading-tight mb-20">
                Hey, I&apos;m Vassili, a designer who believes in crafting delightful experiences for social good
              </h2>
              <p className="text-text-subtle text-md md:text-lg font-medium">
                Currently a student at McGill
              </p>
            </div>
          </div>

          <Hero_stat />
        </div>
      </section>

      {/* Selected Work / Case Studies */}
      <SelectedWorkSection />

      {/* About Me */}
      <AboutSection />
    </div>
  );
}
