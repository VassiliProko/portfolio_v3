'use client'

import React from 'react';
import Image from 'next/image';
import { Hero_stat } from '@/src/components/layout/Hero-stats';
import { SelectedWorkSection } from '@/src/components/layout/SelectedWorkSection';
import { AboutSection } from '@/src/components/layout/AboutSection';
import { PlaygroundSection } from '@/src/components/layout/PlaygroundSection';
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
            <div className="p-8 md:p-12 lg:p-16 min-h-[360px] animate-fade-in-up">
              <h2 className="text-text-inverted-1 text-2xl md:text-3xl lg:text-4xl font-medium leading-tight mb-20">
                Hey, I&apos;m Vassili, a designer who believes in crafting delightful experiences that make a meaningful difference
              </h2>
              <div className="inline-flex flex-col bg-surface-1 rounded-lg overflow-hidden">
                <div className="flex items-center gap-3 px-2 py-1">
                  <span className="text-text-subtle text-md md:text-lg font-medium">
                    Currently a student at McGill
                  </span>
                  <Image
                    src="/images/optimized/home/mcgill.svg"
                    alt="McGill University"
                    width={24}
                    height={24}
                    className="shrink-0"
                  />
                </div>
                <div className="flex w-full h-2 overflow-hidden shrink-0">
                  <div className="flex-[3] bg-surface-dark-1" />
                  <div className="flex-[2] bg-surface-dark-2" />
                  <div className="flex-[2] bg-primary-base" />
                  <div className="flex-[1.5] bg-primary-darker" />
                  <div className="flex-[0.75] bg-accent-base" />
                  <div className="flex-[1] bg-text-inverted-1" />
                </div>
              </div>
            </div>
          </div>

          <Hero_stat />
        </div>
      </section>

      {/* Selected Work / Case Studies */}
      <SelectedWorkSection />

      {/* Playground */}
      <PlaygroundSection />

      {/* About Me */}
      <AboutSection />
    </div>
  );
}
