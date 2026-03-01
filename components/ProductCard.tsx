'use client';

import { useState } from 'react';
import Link from 'next/link';
import LazyImage from './LazyImage';
import { useCart } from '@/context/CartContext';

// Map common color names to hex values for swatches
const COLOR_MAP: Record<string, string> = {
  black: '#000000', white: '#FFFFFF', red: '#EF4444', blue: '#3B82F6',
  navy: '#1E3A5F', green: '#22C55E', yellow: '#EAB308', orange: '#F97316',
  pink: '#EC4899', purple: '#A855F7', brown: '#92400E', beige: '#D4C5A9',
  grey: '#6B7280', gray: '#6B7280', cream: '#FFFDD0', teal: '#14B8A6',
  maroon: '#800000', coral: '#FF7F50', burgundy: '#800020', olive: '#808000',
  tan: '#D2B48C', khaki: '#C3B091', charcoal: '#36454F', ivory: '#FFFFF0',
  gold: '#FFD700', silver: '#C0C0C0', rose: '#FF007F', lavender: '#E6E6FA',
  mint: '#98FB98', peach: '#FFDAB9', wine: '#722F37', denim: '#1560BD',
  nude: '#E3BC9A', camel: '#C19A6B', sage: '#BCB88A', rust: '#B7410E',
  mustard: '#FFDB58', plum: '#8E4585', lilac: '#C8A2C8', stone: '#928E85',
  sand: '#C2B280', taupe: '#483C32', mauve: '#E0B0FF', sky: '#87CEEB',
  forest: '#228B22', cobalt: '#0047AB', emerald: '#50C878', scarlet: '#FF2400',
  aqua: '#00FFFF', turquoise: '#40E0D0', indigo: '#4B0082', crimson: '#DC143C',
  magenta: '#FF00FF', cyan: '#00FFFF', chocolate: '#7B3F00', coffee: '#6F4E37',
};

export function getColorHex(colorName: string): string | null {
  const lower = colorName.toLowerCase().trim();
  if (COLOR_MAP[lower]) return COLOR_MAP[lower];
  for (const [key, val] of Object.entries(COLOR_MAP)) {
    if (lower.includes(key)) return val;
  }
  return null;
}

export interface ColorVariant {
  name: string;
  hex: string;
}

interface ProductCardProps {
  id: string;
  slug: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating?: number;
  reviewCount?: number;
  badge?: string;
  inStock?: boolean;
  maxStock?: number;
  moq?: number;
  hasVariants?: boolean;
  minVariantPrice?: number;
  colorVariants?: ColorVariant[];
  brand?: string;
}

export default function ProductCard({
  id,
  slug,
  name,
  price,
  originalPrice,
  image,
  rating = 5,
  reviewCount = 0,
  badge,
  inStock = true,
  maxStock = 50,
  moq = 1,
  hasVariants = false,
  minVariantPrice,
  colorVariants = [],
  brand,
}: ProductCardProps) {
  const { addToCart } = useCart();
  const [activeColor, setActiveColor] = useState<string | null>(null);
  const displayPrice = hasVariants && minVariantPrice ? minVariantPrice : price;
  const discount = originalPrice ? Math.round((1 - displayPrice / originalPrice) * 100) : 0;
  const MAX_SWATCHES = 5;

  const formatPrice = (val: number) => `GH₵${val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <div className="group bg-white h-full flex flex-col rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:-translate-y-1">
      {/* Image */}
      <Link
        href={`/product/${slug}`}
        className="relative block aspect-square overflow-hidden bg-gray-100"
      >
        <LazyImage
          src={image}
          alt={name}
          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
        />
        {badge && (
          <span className="absolute top-3 left-3 bg-brand-gold text-brand-blue text-[10px] uppercase tracking-wider font-bold px-3 py-1 rounded-full">
            {badge}
          </span>
        )}
        {discount > 0 && !badge && (
          <span className="absolute top-3 left-3 bg-red-500 text-white text-[10px] uppercase tracking-wider font-bold px-3 py-1 rounded-full">
            -{discount}%
          </span>
        )}
        {!inStock && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
            <span className="text-gray-900 text-sm font-medium">Out of Stock</span>
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="p-4 sm:p-5 flex flex-col flex-grow">
        {brand && (
          <p className="text-[11px] text-gray-500 uppercase tracking-wider font-semibold mb-1">{brand}</p>
        )}
        <Link href={`/product/${slug}`} className="block mb-1">
          <h3 className="text-[15px] font-semibold text-gray-900 line-clamp-2 group-hover:text-brand-blue transition-colors">
            {name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
          <div className="flex text-yellow-400 text-xs">
            {[...Array(5)].map((_, i) => (
              <i key={i} className={i < Math.floor(rating) ? "ri-star-fill" : "ri-star-line"}></i>
            ))}
          </div>
          <span className="text-xs text-gray-500">({reviewCount})</span>
        </div>

        {/* Price & Cart */}
        <div className="mt-auto pt-3 flex items-center justify-between border-t border-gray-50">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-gray-900">{formatPrice(displayPrice)}</span>
              {originalPrice && originalPrice > displayPrice && (
                <span className="text-xs text-gray-400 line-through">{formatPrice(originalPrice)}</span>
              )}
            </div>
            {hasVariants && <p className="text-[10px] text-gray-500">From</p>}
          </div>
          
          {hasVariants ? (
            <Link
              href={`/product/${slug}`}
              className="w-10 h-10 rounded-full bg-gray-100 text-gray-900 flex items-center justify-center hover:bg-brand-blue hover:text-white transition-colors"
            >
              <i className="ri-arrow-right-line"></i>
            </Link>
          ) : (
            <button
              onClick={(e) => {
                e.preventDefault();
                if (inStock) {
                  addToCart({
                    id,
                    slug,
                    name,
                    price: displayPrice,
                    image,
                    quantity: moq,
                    maxStock: maxStock ?? 999,
                  });
                }
              }}
              disabled={!inStock}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                inStock 
                  ? 'bg-brand-blue text-white hover:bg-brand-blue/90 active:scale-95' 
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              <i className={inStock ? "ri-shopping-cart-2-line" : "ri-close-circle-line"}></i>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
