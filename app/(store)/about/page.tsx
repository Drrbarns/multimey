'use client';

import Link from 'next/link';
import { useCMS } from '@/context/CMSContext';
import AnimatedSection from '@/components/AnimatedSection';

export default function AboutPage() {
  const { getSetting } = useCMS();
  const contactEmail = getSetting('contact_email') || 'info@multimeysupplies.com';
  const contactPhone = getSetting('contact_phone') || '+233209597443';

  const values = [
    {
      icon: 'ri-shield-check-line',
      title: 'Authenticity',
      description: 'Every product we sell is 100% genuine, sourced directly from authorised distributors and trusted brands.'
    },
    {
      icon: 'ri-money-dollar-circle-line',
      title: 'Affordable Luxury',
      description: 'We cut out the middleman to bring you premium beauty products at prices that make sense.'
    },
    {
      icon: 'ri-truck-line',
      title: 'Fast Delivery',
      description: 'Same-day dispatch for orders placed before 12pm, with delivery across Ghana.'
    },
    {
      icon: 'ri-customer-service-2-line',
      title: 'Customer First',
      description: 'Our dedicated team is always a WhatsApp message away to help you with anything you need.'
    }
  ];

  const stats = [
    { value: '5,000+', label: 'Happy Customers' },
    { value: '1,000+', label: 'Products' },
    { value: '24hr', label: 'Delivery in Accra' },
    { value: '100%', label: 'Authentic Products' }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-20 lg:py-28 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        </div>
        <AnimatedSection className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">About MultiMey Supplies</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed font-light">
            Your trusted destination for premium cosmetics, beauty products, and accessories in Ghana. 
            We bring you the best brands at the best prices.
          </p>
        </AnimatedSection>
      </div>

      {/* Our Story */}
      <AnimatedSection direction="up" delay={0.1} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Our Story</h2>
            <div className="w-16 h-1 bg-amber-500 mx-auto rounded-full"></div>
          </div>
          <div className="prose prose-lg max-w-none text-gray-600 leading-relaxed space-y-6">
            <p>
              MultiMey Supplies was born from a simple belief: everyone deserves access to quality beauty products 
              without the inflated price tag. Based in Accra, Ghana, we set out to bridge the gap between 
              international beauty brands and Ghanaian consumers.
            </p>
            <p>
              What started as a passion for beauty and skincare has grown into a trusted online store serving 
              thousands of happy customers across Ghana. We carefully curate our collection — from popular 
              cosmetics and skincare essentials to hair care products and accessories — ensuring every item 
              meets our strict standards for quality and authenticity.
            </p>
            <p>
              We are not just a store. We are a community of beauty enthusiasts who believe in looking and 
              feeling your best, every single day. Whether you are a makeup artist stocking your kit, a skincare 
              lover discovering new favourites, or shopping for the perfect gift, MultiMey Supplies has you covered.
            </p>
          </div>
        </div>
      </AnimatedSection>

      {/* Stats */}
      <div className="bg-gray-50 py-16">
        <AnimatedSection className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <p className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{stat.value}</p>
                <p className="text-gray-600 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </AnimatedSection>
      </div>

      {/* Our Values */}
      <AnimatedSection direction="up" delay={0.1} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">What We Stand For</h2>
          <div className="w-16 h-1 bg-amber-500 mx-auto rounded-full"></div>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value, index) => (
            <div key={index} className="bg-white border-2 border-gray-100 rounded-2xl p-8 text-center hover:border-gray-900 hover:shadow-xl transition-all duration-300 group">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-gray-900 transition-colors duration-300">
                <i className={`${value.icon} text-3xl text-gray-900 group-hover:text-white transition-colors duration-300`}></i>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
              <p className="text-gray-600 leading-relaxed text-sm">{value.description}</p>
            </div>
          ))}
        </div>
      </AnimatedSection>

      {/* What We Sell */}
      <div className="bg-gray-900 text-white py-20">
        <AnimatedSection className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">What We Offer</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              A carefully curated selection of products to meet all your beauty and lifestyle needs.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: 'ri-palette-line', title: 'Cosmetics & Makeup', desc: 'Foundations, lipsticks, palettes, and more from top brands' },
              { icon: 'ri-drop-line', title: 'Skincare', desc: 'Cleansers, serums, moisturisers, and treatments for every skin type' },
              { icon: 'ri-scissors-line', title: 'Hair Care', desc: 'Shampoos, conditioners, styling products, and hair tools' },
              { icon: 'ri-perfume-line', title: 'Fragrances', desc: 'Premium perfumes and body mists for men and women' },
              { icon: 'ri-handbag-line', title: 'Accessories', desc: 'Beauty tools, bags, and fashion accessories' },
              { icon: 'ri-gift-line', title: 'Gift Sets', desc: 'Curated beauty bundles perfect for any occasion' }
            ].map((item, index) => (
              <div key={index} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all">
                <i className={`${item.icon} text-3xl text-amber-400 mb-4 block`}></i>
                <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </AnimatedSection>
      </div>

      {/* Importation Class CTA */}
      <AnimatedSection direction="up" delay={0.1} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 rounded-3xl p-10 md:p-14 text-center">
          <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <i className="ri-graduation-cap-line text-3xl text-amber-700"></i>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Learn the Business</h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8 leading-relaxed">
            Interested in starting your own importation business? Our 1-on-1 Online Importation Class teaches you 
            everything you need to know about sourcing, importing, and selling products profitably.
          </p>
          <Link
            href="/importation-class"
            className="inline-flex items-center gap-2 bg-gray-900 text-white px-8 py-4 rounded-full font-medium hover:bg-gray-800 transition-all hover:-translate-y-1 hover:shadow-lg"
          >
            <i className="ri-arrow-right-line"></i>
            Learn More
          </Link>
        </div>
      </AnimatedSection>

      {/* CTA */}
      <div className="bg-gray-50 py-20">
        <AnimatedSection className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Ready to Shop?</h2>
          <p className="text-xl text-gray-600 mb-10 leading-relaxed">
            Browse our collection and discover your new favourites. 
            Premium quality, honest prices, delivered to your door.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 bg-gray-900 text-white px-8 py-4 rounded-full font-medium hover:bg-gray-800 transition-all hover:-translate-y-1 hover:shadow-lg"
            >
              <i className="ri-shopping-bag-line"></i>
              Browse Products
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-white text-gray-900 px-8 py-4 rounded-full font-medium border-2 border-gray-200 hover:border-gray-900 transition-all hover:-translate-y-1 hover:shadow-lg"
            >
              <i className="ri-mail-line"></i>
              Contact Us
            </Link>
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
}
