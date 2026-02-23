import React from 'react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-20">
        <div className="max-w-[1200px] mx-auto px-5">
          <div className="bg-gradient-to-b from-primary-lighter to-primary-base rounded-lg border-none overflow-hidden">
            <div className="p-8 md:p-12 lg:p-16">
              <h2 className="text-text text-2xl md:text-3xl lg:text-4xl font-semibold leading-tight mb-6">
                Hey, I&apos;m Vassili, a{' '}
                <span className="inline-block">🔶</span> designer who believes in crafting
                delightful experiences for social good
              </h2>
              <p className="text-text-subtle text-lg md:text-xl font-medium">
                Currently a student at McGill
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
