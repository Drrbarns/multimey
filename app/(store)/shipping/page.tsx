'use client';

import Link from 'next/link';
import { useCMS } from '@/context/CMSContext';
import { toWhatsAppNumber } from '@/lib/contact';
import AnimatedSection from '@/components/AnimatedSection';

export default function ShippingPage() {
  const { getSetting } = useCMS();
  const contactPhone = getSetting('contact_phone') || '+233209597443';
  const contactEmail = getSetting('contact_email') || 'info@multimeysupplies.com';
  const whatsappNum = toWhatsAppNumber(contactPhone);
  const telHref = whatsappNum ? `tel:+${whatsappNum}` : '#';

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-gradient-to-br from-gray-50 via-white to-amber-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">Shipping &amp; Delivery</h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Everything you need to know about how we get your orders to you, fast and safe.
            </p>
          </AnimatedSection>
        </div>
      </div>

      <AnimatedSection direction="up" delay={0.1} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-3xl mx-auto space-y-10">

          {/* Processing Times */}
          <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 space-y-4 hover-lift">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <i className="ri-timer-line text-amber-600"></i>
              Processing Times
            </h2>
            <p className="text-gray-700 leading-relaxed">
              All orders are processed within <strong>1–2 business days</strong> (Monday–Saturday, excluding public holidays). Orders placed before <strong>12pm GMT</strong> are dispatched the same day.
            </p>
            <p className="text-gray-700 leading-relaxed">
              You will receive a confirmation message via email or WhatsApp once your order has been dispatched with tracking details where available.
            </p>
          </div>

          {/* Delivery Within Accra */}
          <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 space-y-4 hover-lift">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <i className="ri-map-pin-line text-amber-600"></i>
              Delivery Within Accra
            </h2>
            <div className="bg-gray-50 rounded-xl p-5">
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-center justify-between">
                  <span>Within any parts of Accra</span>
                  <span className="font-bold text-gray-900">GH₵35 – 50</span>
                </li>
                <li className="flex items-center justify-between border-t border-gray-200 pt-3">
                  <span>Tema &amp; Kasoa</span>
                  <span className="font-bold text-gray-900">GH₵50 – 100</span>
                </li>
              </ul>
            </div>
            <p className="text-gray-700 leading-relaxed">
              Orders placed between Tuesday and Saturday (before 12pm) are dispatched the same day with delivery before <strong>5:30pm</strong>. Orders placed after 12pm are dispatched the following business day.
            </p>
            <p className="text-gray-700 leading-relaxed">
              If you need same-day delivery for a late order, a <strong>Yango courier service</strong> can be arranged at the client's expense.
            </p>
            <p className="text-gray-700 leading-relaxed">
              All orders placed on Sundays and Mondays will be processed and dispatched the next working day, with delivery before 5:30pm.
            </p>
          </div>

          {/* Domestic Deliveries Outside Accra */}
          <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 space-y-4 hover-lift">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <i className="ri-truck-line text-amber-600"></i>
              Domestic Deliveries Outside Accra
            </h2>
            <div className="bg-gray-50 rounded-xl p-5">
              <div className="flex items-center justify-between text-gray-700">
                <span>Kumasi, Cape Coast, Takoradi, Sunyani, Tamale</span>
                <span className="font-bold text-gray-900">GH₵25</span>
              </div>
              <p className="text-sm text-gray-500 mt-1">Next Working Day</p>
            </div>
            <p className="text-gray-700 leading-relaxed">
              All orders will be packed and dispatched the next working day via domestic bus services such as VIP or Eagle Express. Your order will take approximately 24 hours to arrive in your city. You will receive a code or vehicle registration number and a contact number to collect your package from the bus station.
            </p>
            <p className="text-amber-800 font-semibold bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
              Please note: Parcel office delivery fee is not included in the GH₵25 shipping charge.
            </p>
          </div>

          {/* International Shipping */}
          <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 space-y-4 hover-lift">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <i className="ri-global-line text-amber-600"></i>
              International Shipping
            </h2>
            <p className="text-gray-700 leading-relaxed">
              We currently ship within Ghana only. International shipping to the US, UK, and other countries is <strong>coming soon</strong>. Sign up for our newsletter or follow us on social media to be the first to know when we expand.
            </p>
          </div>

          {/* What We Ship */}
          <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 space-y-4 hover-lift">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <i className="ri-box-3-line text-amber-600"></i>
              Packaging &amp; Handling
            </h2>
            <p className="text-gray-700 leading-relaxed">
              All cosmetics, beauty products, and accessories are carefully packaged to prevent damage during transit. Fragile items like glass bottles and palettes are wrapped with extra protective material.
            </p>
            <p className="text-gray-700 leading-relaxed">
              If your package arrives damaged, please contact us within <strong>24 hours</strong> with photos of the damage and we will arrange a replacement or refund.
            </p>
          </div>

          {/* Delays & Issues */}
          <div className="bg-gray-50 border-2 border-gray-200 rounded-2xl p-8 space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <i className="ri-customer-service-2-line text-amber-600"></i>
              Delays &amp; Issues
            </h2>
            <p className="text-gray-700 leading-relaxed">
              If your package is not delivered on time for reasons beyond our control (weather, external partnership issues, etc.), please call us immediately on{' '}
              <a href={telHref} className="text-gray-900 font-semibold hover:underline">{contactPhone}</a>{' '}
              or email{' '}
              <a href={`mailto:${contactEmail}`} className="text-gray-900 font-semibold hover:underline">{contactEmail}</a>{' '}
              and we will do everything we can to find a suitable solution.
            </p>
          </div>

          <div className="flex flex-wrap gap-4 justify-center pt-4">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-full font-medium hover:bg-gray-800 transition-all hover:-translate-y-1 hover:shadow-lg"
            >
              <i className="ri-mail-line"></i>
              Contact Us
            </Link>
            <Link
              href="/faqs"
              className="inline-flex items-center gap-2 bg-white text-gray-900 px-6 py-3 rounded-full font-medium border-2 border-gray-200 hover:border-gray-900 transition-all hover:-translate-y-1 hover:shadow-lg"
            >
              <i className="ri-question-line"></i>
              View FAQs
            </Link>
          </div>
        </div>
      </AnimatedSection>
    </div>
  );
}
