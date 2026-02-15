'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useCMS } from '@/context/CMSContext';
import PageHero from '@/components/PageHero';
import { usePageTitle } from '@/hooks/usePageTitle';

export default function AboutPage() {
  usePageTitle('Our Story');
  const { getSetting } = useCMS();
  const [activeTab, setActiveTab] = useState('story');

  const siteName = getSetting('site_name') || 'Classy Debbie Collection';

  const values = [
    {
      icon: 'ri-verified-badge-line',
      title: 'Authenticity',
      description: 'Handpicked selections. We document our sourcing journey so you know exactly what you are buying.'
    },
    {
      icon: 'ri-money-dollar-circle-line',
      title: 'Unbeatable Value',
      description: 'Direct sourcing ensures premium quality at prices that make sense, without the markup.'
    },
    {
      icon: 'ri-star-smile-line',
      title: 'Quality Assured',
      description: 'Every product is personally inspected. From dresses to accessories, quality is our priority.'
    },
    {
      icon: 'ri-group-line',
      title: 'Discretion & Trust',
      description: 'Built on trust. We ensure privacy and discretion, especially with our intimate product line.'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <PageHero
        title="More Than Just A Brand"
        subtitle="Welcome to Classy Debbie Collection. Where elegance meets confidence, offering premium fashion and intimate lifestyle products."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex border-b border-gray-200 mb-12 justify-center">
          <button
            onClick={() => setActiveTab('story')}
            className={`px-8 py-4 font-medium transition-colors text-lg cursor-pointer ${activeTab === 'story'
              ? 'text-blue-700 border-b-4 border-blue-700 font-bold'
              : 'text-gray-500 hover:text-gray-700'
              }`}
          >
            Our Story
          </button>
          <button
            onClick={() => setActiveTab('mission')}
            className={`px-8 py-4 font-medium transition-colors text-lg cursor-pointer ${activeTab === 'mission'
              ? 'text-blue-700 border-b-4 border-blue-700 font-bold'
              : 'text-gray-500 hover:text-gray-700'
              }`}
          >
            Our Mission
          </button>
        </div>

        {activeTab === 'story' && (
          <div className="grid md:grid-cols-2 gap-16 items-center animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Empowering Your Style</h2>
              <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
                <p>
                  <strong>Classy Debbie Collection</strong> is more than just a store; it's a celebration of femininity and confidence. We believe that every woman deserves to look and feel her absolute best, whether she's stepping out in a stunning dress or embracing her intimate side.
                </p>
                <p>
                  Our journey began with a simple mission: to curate a collection that blends elegance with excitement. We noticed a gap in the market for high-quality, fashionable items that are both accessible and unique.
                </p>
                <p>
                  From the latest trends in women's dresses, shoes, and bags to a discreet and tasteful selection of sex toys, <strong>Classy Debbie Collection</strong> is your one-stop destination for all things chic and sensual. We carefully select each item to ensure it meets our high standards of quality and style.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl bg-gray-100 relative flex items-center justify-center">
                <img
                  src="/logo.svg"
                  alt="Classy Debbie Collection"
                  className="w-2/3 h-auto object-contain opacity-80"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-8">
                  <p className="text-white font-bold text-xl">Classy Debbie</p>
                  <p className="text-blue-200">Founder & CEO</p>
                </div>
              </div>
              {/* Decorative Element */}
              <div className="absolute -z-10 top-10 -right-10 w-full h-full border-4 border-blue-100 rounded-2xl hidden md:block"></div>
            </div>
          </div>
        )}

        {activeTab === 'mission' && (
          <div className="grid md:grid-cols-2 gap-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-blue-50 p-10 rounded-3xl border border-blue-100">
              <div className="w-16 h-16 bg-blue-700 rounded-2xl flex items-center justify-center mb-8 shadow-lg">
                <i className="ri-shirt-line text-3xl text-white"></i>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">Fashion Forward</h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                We are committed to bringing you the latest styles. Our collection of dresses, shoes, and bags is constantly updated to reflect current trends, ensuring you always step out in style.
              </p>
            </div>
            <div className="bg-amber-50 p-10 rounded-3xl border border-amber-100">
              <div className="w-16 h-16 bg-amber-600 rounded-2xl flex items-center justify-center mb-8 shadow-lg">
                <i className="ri-heart-pulse-line text-3xl text-white"></i>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">Intimate Wellness</h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                We advocate for self-love and confidence. Our intimate products are chosen to enhance your personal wellness journey, provided with the utmost discretion and care.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Values Section */}
      <div className="bg-gray-50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Shop With Us?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">It's not just shopping; it's an experience of luxury and care.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                  <i className={`${value.icon} text-2xl text-blue-700`}></i>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-blue-900 py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h2 className="text-4xl md:text-5xl font-bold mb-8">Ready to elevate your style?</h2>
          <p className="text-xl text-blue-100 mb-10 leading-relaxed max-w-2xl mx-auto">
            Join the Classy Debbie community and discover your new favorite pieces today.
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-3 bg-white text-blue-900 px-10 py-5 rounded-full font-bold text-lg hover:bg-blue-50 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all"
          >
            Start Shopping
            <i className="ri-arrow-right-line"></i>
          </Link>
        </div>
      </div>
    </div>
  );
}
