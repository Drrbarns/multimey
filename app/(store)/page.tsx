'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import ProductCard, { type ColorVariant, getColorHex } from '@/components/ProductCard';
import ProductCardSkeleton from '@/components/skeletons/ProductCardSkeleton';
import AnimatedSection, { AnimatedGrid } from '@/components/AnimatedSection';
import { usePageTitle } from '@/hooks/usePageTitle';

export default function Home() {
  usePageTitle('');
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Config State - Managed in Code
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const config: {
    hero: {
      headline: string;
      subheadline: string;
      primaryButtonText: string;
      primaryButtonLink: string;
      secondaryButtonText: string;
      secondaryButtonLink: string;
      backgroundImage?: string;
    };
    banners?: Array<{ text: string; active: boolean }>;
  } = {
    hero: {
      headline: 'Mannequins, Kitchen Essentials, Electronics & Dresses — All In One Store',
      subheadline: 'Verified quality China-sourced products at unbeatable prices. Perfect for homes, businesses, and resellers.',
      primaryButtonText: 'Shop Collections',
      primaryButtonLink: '/shop',
      secondaryButtonText: 'Our Story',
      secondaryButtonLink: '/about',
      // backgroundImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop' // Optional override
    },
    banners: [
      { text: '🚚 Free delivery on orders over GH₵ 500 within Accra!', active: false },
      { text: '✨ New stock arriving this weekend - Pre-order now!', active: false },
      { text: '💳 Secure payments via Mobile Money & Card', active: false }
    ]
  };

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch featured products directly from Supabase
        const { data: productsData, error: productsError } = await supabase
          .from('products')
          .select('*, product_variants(*), product_images(*)')
          .eq('status', 'active')
          .eq('featured', true)
          .order('created_at', { ascending: false })
          .limit(8);

        if (productsError) throw productsError;
        setFeaturedProducts(productsData || []);

        // Fetch featured categories (featured is stored in metadata JSONB)
        const { data: categoriesData, error: categoriesError } = await supabase
          .from('categories')
          .select('id, name, slug, image_url, metadata')
          .eq('status', 'active')
          .order('name');

        if (categoriesError) throw categoriesError;

        // Filter by metadata.featured = true on client side
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


  const getHeroImage = () => {
    if (config.hero.backgroundImage) return config.hero.backgroundImage;
    return "/sarah-lawson.jpeg";
  };

  const renderBanners = () => {
    const activeBanners = config.banners?.filter(b => b.active) || [];
    if (activeBanners.length === 0) return null;

    return (
      <div className="bg-blue-900 text-white py-2 overflow-hidden relative">
        <div className="flex animate-marquee whitespace-nowrap">
          {activeBanners.concat(activeBanners).map((banner, index) => (
            <span key={index} className="mx-8 text-sm font-medium tracking-wide flex items-center">
              {banner.text}
            </span>
          ))}
        </div>
      </div>
    );
  };

  return (
    <main className="flex-col items-center justify-between min-h-screen">
      {renderBanners()}

      {/* Hero Section */}
      <section className="relative w-full h-[90vh] overflow-hidden bg-black">

        {/* Background Slider */}
        <div className="absolute inset-0 z-0">
          {[
            '/hero-1.png',
            '/hero-2.png',
            '/hero-3.png'
          ].map((img, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
            >
              <Image
                src={img}
                alt={`Hero Banner ${index + 1}`}
                fill
                className="object-cover opacity-80"
                priority={index === 0}
                quality={90}
              />
              <div className="absolute inset-0 bg-black/30"></div> {/* Dark overlay for text readability */}
            </div>
          ))}
        </div>

        {/* Content Overlay */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4 max-w-5xl mx-auto mt-[-50px]">

          <p className="text-white/90 text-sm md:text-base tracking-[0.2em] uppercase font-medium mb-6 animate-fade-in-up">
            New Collection
          </p>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif text-white mb-6 leading-tight drop-shadow-lg animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            Elevate Your Style <br />
            <span className="italic font-light">with Classy Debbie</span>
          </h1>

          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-10 font-light tracking-wide animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Premium women&apos;s fashion, accessories, and intimate products.<br />Handpicked for quality and elegance.
          </p>

          <div className="flex items-center gap-6 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <Link
              href="/shop"
              className="bg-white text-gray-900 px-10 py-4 rounded-full font-medium text-lg hover:bg-gray-100 transition-colors shadow-lg hover:shadow-xl hover:-translate-y-1 duration-300"
            >
              Shop Collections
            </Link>
            <Link
              href="/about"
              className="px-10 py-4 rounded-full font-medium text-lg text-white border border-white/40 hover:bg-white/10 transition-colors backdrop-blur-sm"
            >
              Our Story
            </Link>
          </div>

        </div>

        {/* Bottom Features (Desktop) */}
        <div className="absolute bottom-12 left-0 right-0 z-20 hidden md:flex justify-center items-center gap-16 text-white text-center">
          <div>
            <p className="font-serif text-lg font-medium">Direct Import</p>
            <p className="text-xs text-white/60 font-light tracking-wide uppercase mt-1">Sourced from Manufacturers</p>
          </div>
          <div className="w-px h-10 bg-white/20"></div>
          <div>
            <p className="font-serif text-lg font-medium">Verified Quality</p>
            <p className="text-xs text-white/60 font-light tracking-wide uppercase mt-1">Inspected by Hand</p>
          </div>
          <div className="w-px h-10 bg-white/20"></div>
          <div>
            <p className="font-serif text-lg font-medium">Best Prices</p>
            <p className="text-xs text-white/60 font-light tracking-wide uppercase mt-1">Unbeatable Value</p>
          </div>
        </div>

        {/* Floating "Exclusive Offer" Card (Bottom Left) */}
        <div className="absolute bottom-8 left-8 md:bottom-12 md:left-12 z-20 bg-white rounded-xl p-6 shadow-2xl max-w-[280px] animate-fade-in hidden lg:block">
          <p className="font-serif text-blue-800 text-lg italic mb-0.5">Exclusive Offer</p>
          <h3 className="text-3xl font-bold text-gray-900 mb-1">25% Off</h3>
          <p className="text-xs text-gray-500 font-medium leading-relaxed">
            On your first dedicated order. <br />
            <Link href="/shop" className="underline text-blue-700 hover:text-blue-900 mt-1 inline-block">Shop now</Link>
          </p>
        </div>

      </section>

      {/* Categories Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <AnimatedSection className="flex items-end justify-between mb-12">
            <div>
              <h2 className="font-serif text-4xl md:text-5xl text-gray-900 mb-4">Shop by Category</h2>
              <p className="text-gray-600 text-lg max-w-md">Explore our carefully curated collections</p>
            </div>
            <Link href="/categories" className="hidden md:flex items-center text-blue-800 font-medium hover:text-blue-900 transition-colors">
              View All <i className="ri-arrow-right-line ml-2"></i>
            </Link>
          </AnimatedSection>

          <AnimatedGrid className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            {categories.map((category) => (
              <Link href={`/shop?category=${category.slug}`} key={category.id} className="group cursor-pointer block">
                <div className="aspect-[3/4] rounded-2xl overflow-hidden mb-4 relative shadow-md">
                  <Image
                    src={category.image || category.image_url || 'https://via.placeholder.com/600x800?text=' + encodeURIComponent(category.name)}
                    alt={category.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 768px) 50vw, 25vw"
                    quality={75}
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
                  <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm p-4 rounded-xl text-center transform translate-y-2 opacity-90 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    <h3 className="font-serif font-bold text-gray-900 text-lg">{category.name}</h3>
                    <span className="text-xs text-blue-800 font-medium uppercase tracking-wider mt-1 block">View Collection</span>
                  </div>
                </div>
              </Link>
            ))}
          </AnimatedGrid>

          <div className="mt-8 text-center md:hidden">
            <Link href="/categories" className="inline-flex items-center text-blue-800 font-medium hover:text-blue-900 transition-colors">
              View All <i className="ri-arrow-right-line ml-2"></i>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-16">
            <h2 className="font-serif text-4xl md:text-5xl text-gray-900 mb-4">Featured Products</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">Handpicked for you</p>
          </AnimatedSection>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8 md:gap-8">
              {[...Array(4)].map((_, i) => (
                <ProductCardSkeleton key={i} />
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

                // Extract unique colors from option2
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
                  />
                );
              })}
            </AnimatedGrid>
          )}

          <div className="text-center mt-16">
            <Link
              href="/shop"
              className="inline-flex items-center justify-center bg-gray-900 text-white px-10 py-4 rounded-full font-medium hover:bg-blue-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 btn-animate"
            >
              View All Products
            </Link>
          </div>
        </div>
      </section>


    </main>
  );
}
