import type { Metadata } from "next";
import Script from "next/script";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.classydebbie.com';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Classy Debbie Collection | Premium Women's Fashion & Accessories",
    template: "%s | Classy Debbie Collection"
  },
  description: "Your premier destination for women's dresses, shoes, bags, accessories, and intimate products. Classy Debbie Collection offers elegance and style for every occasion.",
  keywords: [
    "Classy Debbie Collection",
    "Women's Fashion Ghana",
    "Ladies Dresses",
    "Women's Shoes",
    "Designer Bags",
    "Fashion Accessories",
    "Sex Toys Ghana",
    "Intimate Products",
    "Buy Dresses Online",
    "Ladies Footwear"
  ],
  authors: [{ name: "Classy Debbie" }],
  creator: "Classy Debbie",
  publisher: "Classy Debbie Collection",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/icons/icon-96x96.png', sizes: '96x96', type: 'image/png' },
      { url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/icons/icon-152x152.png', sizes: '152x152', type: 'image/png' },
      { url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
    ],
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Classy Debbie',
  },
  formatDetection: {
    telephone: true,
  },
  verification: {
    // Add your Google Search Console verification code here
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || '',
  },
  openGraph: {
    type: "website",
    locale: "en_GH",
    url: siteUrl,
    title: "Classy Debbie Collection | Premium Women's Fashion & Accessories",
    description: "Discover our exclusive collection of women's dresses, shoes, bags, accessories, and intimate products. Elegance redefined.",
    siteName: "Classy Debbie Collection",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Classy Debbie Collection",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Classy Debbie Collection | Premium Fashion",
    description: "Exclusive women's fashion, accessories & intimate products.",
    images: ["/og-image.jpg"],
    creator: "@classydebbie",
  },
  alternates: {
    canonical: siteUrl,
  },
};

// Google Analytics Measurement ID
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
// Google reCAPTCHA v3 Site Key
const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* PWA Meta Tags */}
        <meta name="theme-color" content="#2563eb" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Classy Debbie" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#2563eb" />
        <meta name="msapplication-tap-highlight" content="no" />

        {/* Apple Touch Icons */}
        <link rel="apple-touch-icon" href="/icons/icon-152x152.png" />
        <link rel="apple-touch-icon" sizes="192x192" href="/icons/icon-192x192.png" />
        <link rel="apple-touch-icon" sizes="384x384" href="/icons/icon-384x384.png" />
        <link rel="apple-touch-icon" sizes="512x512" href="/icons/icon-512x512.png" />

        {/* Apple Splash Screens */}
        <link rel="apple-touch-startup-image" href="/icons/icon-512x512.png" />

        <link
          href="https://cdn.jsdelivr.net/npm/remixicon@4.1.0/fonts/remixicon.css"
          rel="stylesheet"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Pacifico&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet" />

        {/* Structured Data - Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Classy Debbie Collection",
              "url": "https://www.classydebbie.com",
              "logo": "https://www.classydebbie.com/logo.svg",
              "description": "Your premier destination for women's dresses, shoes, bags, accessories, and intimate products.",
              "address": {
                "@type": "PostalAddress",
                "addressCountry": "GH",
                "addressLocality": "Accra"
              },
              "contactPoint": {
                "@type": "ContactPoint",
                "contactType": "customer service",
                "availableLanguage": "English"
              }
            })
          }}
        />
      </head>

      {/* Google Analytics */}
      {GA_MEASUREMENT_ID && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_MEASUREMENT_ID}', {
                page_path: window.location.pathname,
              });
            `}
          </Script>
        </>
      )}

      {/* Google reCAPTCHA v3 */}
      {RECAPTCHA_SITE_KEY && (
        <Script
          src={`https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`}
          strategy="afterInteractive"
        />
      )}

      <body className="antialiased font-sans overflow-x-hidden pwa-body">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[10000] focus:px-6 focus:py-3 focus:bg-blue-600 focus:text-white focus:rounded-lg focus:font-semibold focus:shadow-lg"
        >
          Skip to main content
        </a>
        <CartProvider>
          <WishlistProvider>
            <div id="main-content">
              {children}
            </div>
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  );
}
