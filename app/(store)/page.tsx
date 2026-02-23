'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import { useCMS } from '@/context/CMSContext';
import ProductCard, { type ColorVariant, getColorHex } from '@/components/ProductCard';
import AnimatedSection, { AnimatedGrid } from '@/components/AnimatedSection';
import { usePageTitle } from '@/hooks/usePageTitle';
import { motion, AnimatePresence } from 'framer-motion';

export default function Home() {
  usePageTitle('');
  const { getSetting, getActiveBanners } = useCMS();
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const { data: productsData, error: productsError } = await supabase
          .from('products')
          .select('*, product_variants(*), product_images(*)')
          .eq('status', 'active')
          .eq('featured', true)
          .order('created_at', { ascending: false })
          .limit(8);

        if (productsError) throw productsError;
        setFeaturedProducts(productsData || []);

        const { data: categoriesData, error: categoriesError } = await supabase
          .from('categories')
          .select('id, name, slug, image_url, metadata')
          .eq('status', 'active')
          .order('name');

        if (categoriesError) throw categoriesError;

        const featuredCategories = (categoriesData || []).filter(
          (cat: any) => cat.metadata?.featured === true
        );
        setCategories(featuredCategories);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // ── CMS-driven config ────────────────────────────────────────────
  const heroHeadline = getSetting('hero_headline') || 'Welcome to MultiMey Supplies';
  const heroSubheadline = getSetting('hero_subheadline') || 'Premium quality, crafted for you.';
  const HERO_SLIDES = ['/hero-1.png', '/image.jpg'];
  const HERO_SLIDE_CONTENT: Array<{
    tag?: string;
    headline?: string;
    subheadline?: string;
    primaryText?: string;
    primaryLink?: string;
    secondaryText?: string;
    secondaryLink?: string;
    showBadge?: boolean;
    showStats?: boolean;
  } | null> = [
    {
      tag: 'ELECTRONICS & APPLIANCES',
      headline: 'Top-Quality Electronics & Gadgets',
      subheadline: 'From smart kitchen appliances to everyday electronics — imported directly and priced to move.',
      primaryText: 'Shop Electronics',
      primaryLink: '/shop',
      secondaryText: 'View All',
      secondaryLink: '/shop',
      showBadge: false,
      showStats: false,
    }, // slide 0: hero-1.png
    {
      tag: 'FASHION & DRESSES',
      headline: 'Stunning African Print Dresses',
      subheadline: 'Beautiful locally sourced dresses and fashion pieces – bold prints, perfect fits, unbeatable prices.',
      primaryText: 'Shop Dresses',
      primaryLink: '/shop',
      secondaryText: 'All Fashion',
      secondaryLink: '/shop',
      showBadge: false,
      showStats: false,
    }, // slide 1: image.jpg
  ];
  const HERO_INTERVAL_MS = 3000;
  const [heroIndex, setHeroIndex] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setHeroIndex((i) => (i + 1) % HERO_SLIDES.length), HERO_INTERVAL_MS);
    return () => clearInterval(t);
  }, []);
  const slideContent = HERO_SLIDE_CONTENT[heroIndex];
  const heroPrimaryText = slideContent?.primaryText ?? getSetting('hero_primary_btn_text');
  const heroPrimaryLink = slideContent?.primaryLink ?? getSetting('hero_primary_btn_link') ?? '/shop';
  const heroSecondaryText = slideContent?.secondaryText ?? getSetting('hero_secondary_btn_text');
  const heroSecondaryLink = slideContent?.secondaryLink ?? getSetting('hero_secondary_btn_link') ?? '/about';
  const heroTagText = slideContent?.tag ?? getSetting('hero_tag_text');
  const heroBadgeLabel = getSetting('hero_badge_label');
  const heroBadgeText = getSetting('hero_badge_text');
  const heroBadgeSubtext = getSetting('hero_badge_subtext');
  const heroHeadlineDisplay = slideContent?.headline ?? heroHeadline;
  const heroSubheadlineDisplay = slideContent?.subheadline ?? heroSubheadline;
  const showHeroBadge = slideContent?.showBadge !== false;
  const showHeroStats = slideContent?.showStats !== false;

  const features = [
    { icon: getSetting('feature1_icon'), title: getSetting('feature1_title'), desc: getSetting('feature1_desc') },
    { icon: getSetting('feature2_icon'), title: getSetting('feature2_title'), desc: getSetting('feature2_desc') },
    { icon: getSetting('feature3_icon'), title: getSetting('feature3_title'), desc: getSetting('feature3_desc') },
    { icon: getSetting('feature4_icon'), title: getSetting('feature4_title'), desc: getSetting('feature4_desc') },
  ];

  const stat1Title = getSetting('hero_stat1_title');
  const stat1Desc = getSetting('hero_stat1_desc');
  const stat2Title = getSetting('hero_stat2_title');
  const stat2Desc = getSetting('hero_stat2_desc');
  const stat3Title = getSetting('hero_stat3_title');
  const stat3Desc = getSetting('hero_stat3_desc');

  const activeBanners = getActiveBanners('top');

  const renderBanners = () => {
    if (activeBanners.length === 0) return null;
    return (
      <div className="bg-gray-900 text-white py-2 overflow-hidden relative z-50">
        <div className="flex animate-marquee whitespace-nowrap">
          {activeBanners.concat(activeBanners).map((banner, index) => (
            <span key={index} className="mx-8 text-sm font-medium tracking-wide flex items-center">
              {banner.title}
            </span>
          ))}
        </div>
      </div>
    );
  };

  return (
    <main className="flex-col items-center justify-between min-h-screen bg-white">
      {renderBanners()}

      {/* Hero Section — Slider with popup transition (3s), no white flash */}
      <section className="relative w-full min-h-[70vh] xs:min-h-[80vh] sm:min-h-[85vh] lg:min-h-[90vh] flex flex-col justify-end overflow-hidden group bg-black">
        <div className="absolute inset-0 z-0 bg-black">
          <AnimatePresence initial={false} mode="sync">
            <motion.div
              key={heroIndex}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1.05 }}
              exit={{ opacity: 0, scale: 1.08 }}
              transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="absolute inset-0"
            >
              <Image
                src={HERO_SLIDES[heroIndex]}
                fill
                className="object-cover object-center"
                alt={`Hero slide ${heroIndex + 1}`}
                priority={heroIndex === 0}
                sizes="100vw"
                quality={85}
              />
            </motion.div>
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/30 pointer-events-none" aria-hidden />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pb-16 sm:pb-20 lg:pb-24 pt-24 text-center">
          {heroTagText && (
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-white/90 text-sm font-bold tracking-[0.2em] uppercase mb-6 inline-block px-4 py-1 border border-white/30 rounded-full backdrop-blur-sm"
            >
              {heroTagText}
            </motion.p>
          )}
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white leading-tight mb-6 lg:mb-8 max-w-5xl mx-auto drop-shadow-2xl"
          >
            {heroHeadlineDisplay}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-lg sm:text-xl text-white/90 max-w-2xl mx-auto mb-10 lg:mb-12 font-light leading-relaxed"
          >
            {heroSubheadlineDisplay}
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              href={heroPrimaryLink}
              className="inline-flex items-center justify-center bg-white text-gray-900 hover:bg-gray-100 px-10 py-4 rounded-full font-bold text-lg transition-all hover:scale-105 shadow-lg hover:shadow-white/20"
            >
              {heroPrimaryText}
            </Link>
            {heroSecondaryText && (
              <Link
                href={heroSecondaryLink}
                className="inline-flex items-center justify-center border border-white/40 bg-white/10 backdrop-blur-sm text-white hover:bg-white hover:text-gray-900 px-10 py-4 rounded-full font-bold text-lg transition-all hover:scale-105"
              >
                {heroSecondaryText}
              </Link>
            )}
          </motion.div>
          
          {/* Stats — desktop */}
          {showHeroStats && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="mt-16 pt-8 border-t border-white/10 hidden lg:flex justify-center gap-16"
          >
            <div className="text-center">
              <p className="font-serif font-bold text-white text-2xl mb-1">{stat1Title}</p>
              <p className="text-sm text-white/60 uppercase tracking-wider">{stat1Desc}</p>
            </div>
            <div className="text-center">
              <p className="font-serif font-bold text-white text-2xl mb-1">{stat2Title}</p>
              <p className="text-sm text-white/60 uppercase tracking-wider">{stat2Desc}</p>
            </div>
            <div className="text-center">
              <p className="font-serif font-bold text-white text-2xl mb-1">{stat3Title}</p>
              <p className="text-sm text-white/60 uppercase tracking-wider">{stat3Desc}</p>
            </div>
          </motion.div>
          )}
        </div>

        {/* Optional floating badge (desktop only) */}
        {showHeroBadge && heroBadgeLabel && (
          <motion.div 
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="hidden md:block absolute bottom-12 left-12 z-20 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-2xl max-w-[240px]"
          >
            <p className="font-serif text-white/80 text-sm italic mb-1">{heroBadgeLabel}</p>
            <p className="text-3xl font-bold text-white mb-1">{heroBadgeText}</p>
            <p className="text-xs text-white/60 uppercase tracking-wider">{heroBadgeSubtext}</p>
          </motion.div>
        )}
      </section>

      {/* Categories Section removed per user request */}
      
      {/* Featured Products */}
      <section className="py-24 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-16">
            <span className="text-gray-500 font-bold tracking-widest uppercase text-xs mb-3 block">New Arrivals</span>
            <h2 className="font-serif text-4xl md:text-5xl text-gray-900 mb-4">Featured Products</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto font-light">Handpicked favorites just for you.</p>
          </AnimatedSection>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 aspect-[3/4] rounded-2xl mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : (
            <AnimatedGrid className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
              {featuredProducts.map((product) => {
                const variants = product.product_variants || [];
                const hasVariants = variants.length > 0;
                const minVariantPrice = hasVariants ? Math.min(...variants.map((v: any) => v.price || product.price)) : undefined;
                const totalVariantStock = hasVariants ? variants.reduce((sum: number, v: any) => sum + (v.quantity || 0), 0) : 0;
                const effectiveStock = hasVariants ? totalVariantStock : product.quantity;

                const colorVariants: ColorVariant[] = [];
                const seenColors = new Set<string>();
                for (const v of variants) {
                  const colorName = (v as any).option2;
                  if (colorName && !seenColors.has(colorName.toLowerCase().trim())) {
                    const hex = getColorHex(colorName);
                    if (hex) {
                      seenColors.add(colorName.toLowerCase().trim());
                      colorVariants.push({ name: colorName.trim(), hex });
                    }
                  }
                }

                return (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    slug={product.slug}
                    name={product.name}
                    price={product.price}
                    originalPrice={product.compare_at_price}
                    image={product.product_images?.[0]?.url || 'https://via.placeholder.com/400x500'}
                    rating={product.rating_avg || 5}
                    reviewCount={product.review_count || 0}
                    badge={product.featured ? 'Featured' : undefined}
                    inStock={effectiveStock > 0}
                    maxStock={effectiveStock || 50}
                    moq={product.moq || 1}
                    hasVariants={hasVariants}
                    minVariantPrice={minVariantPrice}
                    colorVariants={colorVariants}
                    brand={product.brand || product.vendor}
                  />
                );
              })}
            </AnimatedGrid>
          )}

          <div className="text-center mt-20">
            <Link
              href="/shop"
              className="inline-flex items-center justify-center bg-gray-900 text-white px-12 py-5 rounded-full font-bold text-lg hover:bg-gray-800 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1"
            >
              Shop All Products
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Features */}
      <section className="py-24 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            {features.map((feature, i) => (
              <AnimatedSection key={i} delay={i * 0.1} className="flex flex-col items-center text-center group">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6 text-gray-900 group-hover:bg-gray-900 group-hover:text-white transition-colors duration-500">
                  <i className={`${feature.icon} text-3xl`}></i>
                </div>
                <h3 className="font-bold text-gray-900 mb-2 text-lg">{feature.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{feature.desc}</p>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
