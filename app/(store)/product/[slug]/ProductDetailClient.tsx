'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { cachedQuery } from '@/lib/query-cache';
import ProductCard from '@/components/ProductCard';
import ProductReviews from '@/components/ProductReviews';
import { StructuredData, generateProductSchema, generateBreadcrumbSchema } from '@/components/SEOHead';
import { notFound } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { usePageTitle } from '@/hooks/usePageTitle';

// Map common color names to hex values for the swatch preview
function colorNameToHex(name: string): string {
  const map: Record<string, string> = {
    red: '#ef4444', blue: '#3b82f6', green: '#22c55e', yellow: '#eab308',
    orange: '#f97316', purple: '#a855f7', pink: '#ec4899', black: '#111827',
    white: '#ffffff', gray: '#6b7280', grey: '#6b7280', brown: '#92400e',
    navy: '#1e3a5f', gold: '#d4a017', silver: '#c0c0c0', beige: '#f5f5dc',
    maroon: '#800000', teal: '#14b8a6', coral: '#ff7f50', ivory: '#fffff0',
    cream: '#fffdd0', burgundy: '#800020', lavender: '#e6e6fa', cyan: '#06b6d4',
    magenta: '#d946ef', olive: '#84cc16', peach: '#ffcba4', mint: '#98f5e1',
    rose: '#f43f5e', wine: '#722f37', charcoal: '#374151', sky: '#0ea5e9',
  };
  return map[name.toLowerCase().trim()] || '#d1d5db';
}

export default function ProductDetailClient({ slug }: { slug: string }) {
  const [product, setProduct] = useState<any>(null);
  usePageTitle(product?.name || 'Product');
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);

  const { addToCart } = useCart();

  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoading(true);
        // Fetch main product (cached for 2 minutes)
        const { data: productData, error } = await cachedQuery<{ data: any; error: any }>(
          `product:${slug}`,
          async () => {
            let query = supabase
              .from('products')
              .select(`
                *,
                categories(name),
                product_variants(*),
                product_images(url, position, alt_text)
              `);

            const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug);

            if (isUUID) {
              query = query.or(`id.eq.${slug},slug.eq.${slug}`);
            } else {
              query = query.eq('slug', slug);
            }

            return query.single() as any;
          },
          2 * 60 * 1000 // 2 minutes
        );

        if (error || !productData) {
          console.error('Error fetching product:', error);
          setLoading(false);
          return;
        }

        // Transform product data
        // Map variant colors from option2, and extract color_hex from metadata
        const rawVariants = (productData.product_variants || []).map((v: any) => ({
          ...v,
          color: v.option2 || '',
          colorHex: v.metadata?.color_hex || ''
        }));

        // Build a color-to-hex map from variants (prefer stored hex, fallback to colorNameToHex)
        const colorHexMap: Record<string, string> = {};
        rawVariants.forEach((v: any) => {
          if (v.color) {
            if (!colorHexMap[v.color]) {
              colorHexMap[v.color] = v.colorHex || colorNameToHex(v.color);
            }
          }
        });

        const transformedProduct = {
          ...productData,
          images: productData.product_images?.sort((a: any, b: any) => a.position - b.position).map((img: any) => img.url) || [],
          category: productData.categories?.name || 'Shop',
          rating: productData.rating_avg || 0,
          reviewCount: 0,
          stockCount: productData.quantity,
          moq: productData.moq || 1,
          colors: [...new Set(rawVariants.map((v: any) => v.color).filter(Boolean))],
          colorHexMap,
          variants: rawVariants,
          sizes: rawVariants.map((v: any) => v.name) || [],
          features: ['Premium Quality', 'Authentic Design'],
          featured: ['Premium Quality', 'Authentic Design'],
          care: 'Handle with care.',
          preorderShipping: productData.metadata?.preorder_shipping || null
        };

        // Ensure at least one image/placeholder
        if (transformedProduct.images.length === 0) {
          transformedProduct.images = ['https://via.placeholder.com/800x800?text=No+Image'];
        }

        setProduct(transformedProduct);

        // Set initial quantity to MOQ
        if (transformedProduct.moq > 1) {
          setQuantity(transformedProduct.moq);
        }

        // If variants exist, do NOT pre-select — force user to choose
        // Reset variant and color selection
        setSelectedVariant(null);
        setSelectedSize('');
        setSelectedColor('');

        // Fetch related products (cached for 5 minutes)
        if (productData.category_id) {
          const { data: related } = await cachedQuery<{ data: any; error: any }>(
            `related:${productData.category_id}:${productData.id}`,
            (() => supabase
              .from('products')
              .select('*, product_images(url, position), product_variants(id, name, price, quantity)')
              .eq('category_id', productData.category_id)
              .neq('id', productData.id)
              .limit(4)) as any,
            5 * 60 * 1000
          );

          if (related) {
            setRelatedProducts(related.map((p: any) => {
              const variants = p.product_variants || [];
              const hasVariants = variants.length > 0;
              const minVariantPrice = hasVariants ? Math.min(...variants.map((v: any) => v.price || p.price)) : undefined;
              const totalVariantStock = hasVariants ? variants.reduce((sum: number, v: any) => sum + (v.quantity || 0), 0) : 0;
              const effectiveStock = hasVariants ? totalVariantStock : p.quantity;
              return {
                id: p.id,
                slug: p.slug,
                name: p.name,
                price: p.price,
                image: p.product_images?.[0]?.url || 'https://via.placeholder.com/800?text=No+Image',
                rating: p.rating_avg || 0,
                reviewCount: 0,
                inStock: effectiveStock > 0,
                maxStock: effectiveStock || 50,
                moq: p.moq || 1,
                hasVariants,
                minVariantPrice
              };
            }));
          }
        }

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    if (slug) {
      fetchProduct();
    }
  }, [slug]);

  const hasVariants = product?.variants?.length > 0;
  const hasColors = product?.colors?.length > 0;
  const needsVariantSelection = hasVariants && !selectedVariant;
  const needsColorSelection = hasColors && !selectedColor;

  // Determine the active price: variant price if selected, otherwise base price
  const activePrice = selectedVariant?.price ?? product?.price ?? 0;
  const activeStock = selectedVariant ? (selectedVariant.stock ?? selectedVariant.quantity ?? product?.stockCount ?? 0) : (product?.stockCount ?? 0);

  const handleAddToCart = () => {
    if (!product) return;
    if (needsVariantSelection) return; // Safety check

    // Build variant display string: "Color / Name" or just "Name" or just "Color"
    let variantLabel: string | undefined;
    if (selectedVariant) {
      const color = selectedVariant.color || selectedColor || '';
      const name = selectedVariant.name || '';
      if (color && name) {
        variantLabel = `${color} / ${name}`;
      } else {
        variantLabel = color || name || undefined;
      }
    }

    addToCart({
      id: product.id,
      name: product.name,
      price: activePrice,
      image: product.images[0],
      quantity: quantity,
      variant: variantLabel,
      slug: product.slug,
      maxStock: activeStock,
      moq: product.moq || 1
    });
  };

  const handleBuyNow = () => {
    handleAddToCart();
    window.location.href = '/checkout';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white py-12 flex justify-center items-center">
        <div className="text-center">
          <i className="ri-loader-4-line text-4xl text-gray-700 animate-spin mb-4 block"></i>
          <p className="text-gray-500">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white py-20 flex justify-center items-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h2>
          <Link href="/shop" className="text-gray-700 hover:underline">Return to Shop</Link>
        </div>
      </div>
    );
  }

  const discount = product.compare_at_price ? Math.round((1 - activePrice / product.compare_at_price) * 100) : 0;
  const minVariantPrice = hasVariants ? Math.min(...product.variants.map((v: any) => v.price || product.price)) : product.price;

  const productSchema = generateProductSchema({
    name: product.name,
    description: product.description,
    image: product.images[0],
    price: hasVariants ? minVariantPrice : product.price,
    currency: 'GHS',
    sku: product.sku,
    rating: product.rating,
    reviewCount: product.reviewCount,
    availability: product.quantity > 0 ? 'in_stock' : 'out_of_stock',
    category: product.category
  });

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || (typeof window !== 'undefined' ? window.location.origin : 'https://example.com');
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: baseUrl },
    { name: 'Shop', url: `${baseUrl}/shop` },
    { name: product.category, url: `${baseUrl}/shop?category=${product.category.toLowerCase().replace(/\s+/g, '-')}` },
    { name: product.name, url: `${baseUrl}/product/${slug}` }
  ]);

  return (
    <>
      <StructuredData data={productSchema} />
      <StructuredData data={breadcrumbSchema} />

      <main className="min-h-screen bg-white">
        <section className="py-8 bg-gray-50 border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <nav className="flex items-center space-x-2 text-sm flex-wrap gap-y-2">
              <Link href="/" className="text-gray-600 hover:text-gray-700 transition-colors">Home</Link>
              <i className="ri-arrow-right-s-line text-gray-400"></i>
              <Link href="/shop" className="text-gray-600 hover:text-gray-700 transition-colors">Shop</Link>
              <i className="ri-arrow-right-s-line text-gray-400"></i>
              <Link href="#" className="text-gray-600 hover:text-gray-700 transition-colors">{product.category}</Link>
              <i className="ri-arrow-right-s-line text-gray-400"></i>
              <span className="text-gray-900 font-medium truncate max-w-[200px]">{product.name}</span>
            </nav>
          </div>
        </section>

        <section className="py-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
              {/* Left Column - Image Gallery */}
              <div className="w-full lg:w-1/2">
                <div className="sticky top-24">
                  <div className="relative aspect-[4/5] sm:aspect-square md:aspect-[3/4] lg:aspect-square rounded-2xl overflow-hidden bg-gray-100 mb-4 group">
                    <Image
                      src={product.images[selectedImage]}
                      alt={product.name}
                      fill
                      className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      priority
                      quality={90}
                    />
                    {discount > 0 && (
                      <span className="absolute top-4 left-4 bg-red-600 text-white text-xs font-bold tracking-wider px-3 py-1.5 rounded-full">
                        SAVE {discount}%
                      </span>
                    )}
                  </div>

                  {product.images.length > 1 && (
                    <div className="grid grid-cols-5 gap-3 sm:gap-4">
                      {product.images.map((image: string, index: number) => (
                        <button
                          key={index}
                          onClick={() => setSelectedImage(index)}
                          className={`relative aspect-square rounded-xl overflow-hidden transition-all cursor-pointer ${selectedImage === index ? 'ring-2 ring-gray-900 opacity-100' : 'opacity-60 hover:opacity-100'
                            }`}
                        >
                          <Image
                            src={image}
                            alt={`${product.name} view ${index + 1}`}
                            fill
                            className="object-cover object-center"
                            sizes="(max-width: 1024px) 20vw, 10vw"
                            quality={60}
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column - Product Info */}
              <div className="w-full lg:w-1/2 flex flex-col">
                <div className="flex flex-col mb-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs text-gray-500 font-bold tracking-widest uppercase mb-2">{product.category}</p>
                      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 leading-tight">{product.name}</h1>
                    </div>
                    <button
                      onClick={() => setIsWishlisted(!isWishlisted)}
                      className="w-10 h-10 flex-shrink-0 flex items-center justify-center border border-gray-200 bg-white hover:bg-gray-50 rounded-full transition-all cursor-pointer ml-4"
                    >
                      <i className={`${isWishlisted ? 'ri-heart-fill text-red-500' : 'ri-heart-line text-gray-400'} text-lg`}></i>
                    </button>
                  </div>

                  <div className="flex items-center mb-4">
                    <div className="flex items-center space-x-1 mr-3">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <i
                          key={star}
                          className={`${star <= Math.round(product.rating) ? 'ri-star-fill text-amber-400' : 'ri-star-line text-gray-200'} text-lg`}
                        ></i>
                      ))}
                    </div>
                    <span className="text-sm text-gray-600 font-medium">{Number(product.rating).toFixed(1)} <span className="text-gray-400 ml-1">({product.reviewCount} reviews)</span></span>
                  </div>

                  <div className="flex items-baseline space-x-3 pb-4 border-b border-gray-100">
                    {hasVariants && !selectedVariant ? (
                      <span className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
                        <span className="text-base text-gray-500 font-normal mr-1.5">From</span>
                        GH₵{minVariantPrice.toFixed(2)}
                      </span>
                    ) : (
                      <span className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">GH₵{activePrice.toFixed(2)}</span>
                    )}
                    {product.compare_at_price && product.compare_at_price > activePrice && (
                      <span className="text-lg text-gray-400 line-through decoration-gray-300">GH₵{product.compare_at_price.toFixed(2)}</span>
                    )}
                  </div>
                </div>

                <p className="text-gray-600 leading-relaxed mb-6 text-base font-light">{product.description}</p>

                {/* Color Selector */}
                {hasVariants && product.colors.length > 0 && (
                  <div className="mb-6">
                    <label className="block font-semibold text-gray-900 mb-3 uppercase tracking-wider text-xs">
                      Color: {selectedColor ? (
                        <span className="text-gray-600 font-normal ml-1 capitalize">{selectedColor}</span>
                      ) : (
                        <span className="text-red-500 font-normal ml-1 capitalize">Required</span>
                      )}
                    </label>
                    <div className="flex flex-wrap gap-3">
                      {product.colors.map((color: string) => {
                        const isSelected = selectedColor === color;
                        const colorVariants = product.variants.filter((v: any) => v.color === color);
                        const colorStock = colorVariants.reduce((sum: number, v: any) => sum + (v.stock ?? v.quantity ?? 0), 0);
                        const isOutOfStock = colorStock === 0 && product.stockCount === 0;
                        return (
                          <button
                            key={color}
                            onClick={() => {
                              setSelectedColor(color);
                              const matching = product.variants.filter((v: any) => v.color === color);
                              if (matching.length === 1) {
                                setSelectedVariant(matching[0]);
                                setSelectedSize(matching[0].name);
                              } else {
                                setSelectedVariant(null);
                                setSelectedSize('');
                              }
                            }}
                            disabled={isOutOfStock}
                            className={`h-10 px-4 rounded-lg border-2 font-medium transition-all whitespace-nowrap flex items-center gap-2 text-sm ${isSelected
                              ? 'border-gray-900 bg-white text-gray-900 shadow-sm ring-1 ring-gray-900'
                              : isOutOfStock
                                ? 'border-gray-100 text-gray-300 cursor-not-allowed bg-gray-50'
                                : 'border-gray-200 text-gray-600 hover:border-gray-400 bg-white cursor-pointer hover:shadow-sm'
                              }`}
                            title={isOutOfStock ? 'Out of stock' : `Select ${color}`}
                          >
                            <span className={`w-4 h-4 rounded-full border shadow-inner ${isSelected ? 'border-gray-300' : 'border-gray-200'}`} style={{ backgroundColor: product.colorHexMap?.[color] || colorNameToHex(color) }}></span>
                            <span className="capitalize">{color}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Size / Name Variant Selector */}
                {hasVariants && (() => {
                  // Filter variants: if colors exist and one is selected, show only matching; otherwise show all
                  const hasColors = product.colors.length > 0;
                  const visibleVariants = hasColors && selectedColor
                    ? product.variants.filter((v: any) => v.color === selectedColor)
                    : hasColors
                      ? [] // Don't show name variants until a color is picked
                      : product.variants;

                  // Check if we need to show the name selector (skip if all visible variants have the same name or only 1)
                  const uniqueNames = [...new Set(visibleVariants.map((v: any) => v.name).filter(Boolean))];
                  const showNameSelector = visibleVariants.length > 1 || (!hasColors && visibleVariants.length > 0);

                  if (!showNameSelector && !hasColors) {
                    // Single variant with no colors — show standard picker
                    return (
                      <div className="mb-8">
                        <label className="block font-semibold text-gray-900 mb-3 uppercase tracking-wider text-xs">
                          Variant: {selectedVariant ? (
                            <span className="text-gray-600 font-normal ml-1">{selectedVariant.name} — GH₵{selectedVariant.price?.toFixed(2)}</span>
                          ) : (
                            <span className="text-red-500 font-normal ml-1 capitalize">Required</span>
                          )}
                        </label>
                        <div className="flex flex-wrap gap-3">
                          {product.variants.map((variant: any) => {
                            const isSelected = selectedVariant?.id === variant.id || selectedVariant?.name === variant.name;
                            const variantStock = variant.stock ?? variant.quantity ?? 0;
                            const isOutOfStock = variantStock === 0 && product.stockCount === 0;
                            return (
                              <button
                                key={variant.id || variant.name}
                                onClick={() => {
                                  setSelectedVariant(variant);
                                  setSelectedSize(variant.name);
                                }}
                                disabled={isOutOfStock}
                                className={`px-5 py-2.5 rounded-lg border-2 font-medium transition-all whitespace-nowrap flex flex-col items-center ${isSelected
                                  ? 'border-gray-900 bg-white text-gray-900 shadow-sm ring-1 ring-gray-900'
                                  : isOutOfStock
                                    ? 'border-gray-100 text-gray-300 cursor-not-allowed bg-gray-50'
                                    : 'border-gray-200 text-gray-600 hover:border-gray-400 bg-white cursor-pointer hover:shadow-sm'
                                  }`}
                              >
                                <span className="text-sm">{variant.name}</span>
                                <span className={`text-xs mt-0.5 ${isSelected ? 'text-gray-600' : 'text-gray-500'}`}>
                                  GH₵{(variant.price || product.price).toFixed(2)}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  }

                  if (visibleVariants.length > 1) {
                    return (
                      <div className="mb-8">
                        <label className="block font-semibold text-gray-900 mb-3 uppercase tracking-wider text-xs">
                          Size / Type: {selectedVariant ? (
                            <span className="text-gray-600 font-normal ml-1">{selectedVariant.name} — GH₵{selectedVariant.price?.toFixed(2)}</span>
                          ) : (
                            <span className="text-red-500 font-normal ml-1 capitalize">Required</span>
                          )}
                        </label>
                        <div className="flex flex-wrap gap-3">
                          {visibleVariants.map((variant: any) => {
                            const isSelected = selectedVariant?.id === variant.id;
                            const variantStock = variant.stock ?? variant.quantity ?? 0;
                            const isOutOfStock = variantStock === 0 && product.stockCount === 0;
                            return (
                              <button
                                key={variant.id || variant.name}
                                onClick={() => {
                                  setSelectedVariant(variant);
                                  setSelectedSize(variant.name);
                                }}
                                disabled={isOutOfStock}
                                className={`px-5 py-2.5 rounded-lg border-2 font-medium transition-all whitespace-nowrap flex flex-col items-center ${isSelected
                                  ? 'border-gray-900 bg-white text-gray-900 shadow-sm ring-1 ring-gray-900'
                                  : isOutOfStock
                                    ? 'border-gray-100 text-gray-300 cursor-not-allowed bg-gray-50'
                                    : 'border-gray-200 text-gray-600 hover:border-gray-400 bg-white cursor-pointer hover:shadow-sm'
                                  }`}
                              >
                                <span className="text-sm">{variant.name}</span>
                                <span className={`text-xs mt-0.5 ${isSelected ? 'text-gray-600' : 'text-gray-500'}`}>
                                  GH₵{(variant.price || product.price).toFixed(2)}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  }

                  return null;
                })()}

                <div className="mb-6">
                  <label className="block font-semibold text-gray-900 mb-3 uppercase tracking-wider text-xs">Quantity</label>
                  <div className="flex flex-wrap sm:flex-nowrap items-center gap-4">
                    <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                      <button
                        onClick={() => setQuantity(Math.max(product.moq || 1, quantity - 1))}
                        className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer disabled:opacity-50"
                        disabled={activeStock === 0 || quantity <= (product.moq || 1)}
                      >
                        <i className="ri-subtract-line"></i>
                      </button>
                      <input
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(Math.max(product.moq || 1, Math.min(activeStock, parseInt(e.target.value) || (product.moq || 1))))}
                        className="w-14 h-10 text-center border-x border-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-900 text-sm font-semibold text-gray-900"
                        min={product.moq || 1}
                        max={activeStock}
                        disabled={activeStock === 0}
                      />
                      <button
                        onClick={() => setQuantity(Math.min(activeStock, quantity + 1))}
                        className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer disabled:opacity-50"
                        disabled={activeStock === 0 || quantity >= activeStock}
                      >
                        <i className="ri-add-line"></i>
                      </button>
                    </div>
                    <div className="flex flex-col">
                      {product.moq > 1 && (
                        <span className="text-gray-600 font-medium text-xs flex items-center mb-1">
                          <i className="ri-information-line mr-1.5 text-gray-400"></i>
                          Min order: {product.moq} units
                        </span>
                      )}
                      {activeStock > 10 && (
                        <span className="text-green-700 font-medium text-xs flex items-center">
                          <i className="ri-checkbox-circle-fill mr-1.5"></i>
                          In stock, ready to ship
                        </span>
                      )}
                      {activeStock > 0 && activeStock <= 10 && (
                        <span className="text-amber-600 font-medium text-xs flex items-center">
                          <i className="ri-error-warning-fill mr-1.5"></i>
                          Only {activeStock} left
                        </span>
                      )}
                      {activeStock === 0 && (
                        <span className="text-red-600 font-medium text-xs flex items-center">
                          <i className="ri-close-circle-fill mr-1.5"></i>
                          Out of stock
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 mb-6">
                  <button
                    disabled={activeStock === 0 || needsVariantSelection || needsColorSelection}
                    className={`flex-1 border-2 border-gray-900 bg-white hover:bg-gray-50 text-gray-900 h-14 rounded-xl font-bold transition-all flex items-center justify-center space-x-2 text-base whitespace-nowrap cursor-pointer ${(activeStock === 0 || needsVariantSelection || needsColorSelection) ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={handleAddToCart}
                  >
                    <i className="ri-shopping-cart-2-line text-xl"></i>
                    <span>{activeStock === 0 ? 'Out of Stock' : needsColorSelection ? 'Select Color' : needsVariantSelection ? 'Select Variant' : 'Add to Cart'}</span>
                  </button>
                  {activeStock > 0 && !needsVariantSelection && !needsColorSelection && (
                    <button
                      onClick={handleBuyNow}
                      className="flex-1 bg-gray-900 hover:bg-gray-800 text-white h-14 rounded-xl font-bold transition-all whitespace-nowrap cursor-pointer text-base"
                    >
                      Buy It Now
                    </button>
                  )}
                </div>

                <div className="pt-6 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-start text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                    <i className="ri-store-2-line text-blue-600 mr-3 text-xl"></i>
                    <div>
                      <p className="font-semibold text-gray-900 mb-0.5">Free Store Pickup</p>
                      <p className="text-xs">At our Accra location</p>
                    </div>
                  </div>
                  <div className="flex items-start text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                    <i className="ri-arrow-left-right-line text-green-600 mr-3 text-xl"></i>
                    <div>
                      <p className="font-semibold text-gray-900 mb-0.5">Easy Returns</p>
                      <p className="text-xs">24-hour return policy</p>
                    </div>
                  </div>
                  <div className="flex items-start text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                    <i className="ri-shield-check-line text-purple-600 mr-3 text-xl"></i>
                    <div>
                      <p className="font-semibold text-gray-900 mb-0.5">Secure Payment</p>
                      <p className="text-xs">100% buyer protection</p>
                    </div>
                  </div>
                  {product.sku && (
                    <div className="flex items-start text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                      <i className="ri-barcode-box-line text-gray-600 mr-3 text-xl"></i>
                      <div>
                        <p className="font-semibold text-gray-900 mb-0.5">SKU</p>
                        <p className="text-xs">{product.sku}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-white border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="mb-10 flex justify-center">
              <div className="inline-flex bg-gray-100/80 p-1.5 rounded-2xl overflow-x-auto max-w-full no-scrollbar shadow-inner">
                {['description', 'features', 'care', 'reviews'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-6 sm:px-8 py-3 font-semibold transition-all rounded-xl whitespace-nowrap cursor-pointer text-sm sm:text-base ${activeTab === tab
                      ? 'bg-white text-gray-900 shadow-sm ring-1 ring-black/5'
                      : 'text-gray-500 hover:text-gray-900 hover:bg-white/50'
                      }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="max-w-4xl mx-auto min-h-[300px]">
              {activeTab === 'description' && (
                <div className="prose prose-lg max-w-none text-gray-600 font-light animate-fade-in">
                  <p className="leading-relaxed">{product.description}</p>
                </div>
              )}

              {activeTab === 'features' && (
                <div className="animate-fade-in">
                  <h3 className="text-2xl font-serif text-gray-900 mb-8 text-center">Product Features</h3>
                  <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-6">
                    {product.features.map((feature: string, index: number) => (
                      <li key={index} className="flex items-start bg-gray-50 p-4 rounded-xl">
                        <i className="ri-checkbox-circle-fill text-blue-600 text-xl mr-4 mt-0.5"></i>
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {activeTab === 'care' && (
                <div className="animate-fade-in text-center">
                  <div className="w-16 h-16 mx-auto bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-6">
                    <i className="ri-drop-line text-3xl"></i>
                  </div>
                  <h3 className="text-2xl font-serif text-gray-900 mb-6">Care & Maintenance</h3>
                  <p className="text-gray-600 text-lg leading-relaxed font-light max-w-2xl mx-auto">{product.care}</p>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div id="reviews" className="animate-fade-in">
                  <ProductReviews productId={product.id} />
                </div>
              )}
            </div>
          </div>
        </section>

        {relatedProducts.length > 0 && (
          <section className="py-20 bg-white" data-product-shop>
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
              <div className="text-center mb-12">
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">You May Also Like</h2>
                <p className="text-lg text-gray-600">Curated recommendations based on this product</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {relatedProducts.map((p) => (
                  <ProductCard key={p.id} {...p} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </>
  );
}
