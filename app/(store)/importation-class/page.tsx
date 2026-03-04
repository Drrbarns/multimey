'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { usePageTitle } from '@/hooks/usePageTitle';
import Link from 'next/link';

export default function ImportationClassPage() {
  usePageTitle('Register for 1v1 Online Importation Class');

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    location: '',
  });
  const [errors, setErrors] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);

  const COURSE_PRICE = 500;
  const COURSE_TITLE = '1v1 Online Importation Class';

  const validate = () => {
    const newErrors: any = {};
    if (!form.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!form.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Invalid email address';
    if (!form.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!form.location.trim()) newErrors.location = 'Location is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      const registrationId = `COURSE-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

      // Save registration to Supabase
      const { error: dbError } = await supabase
        .from('course_registrations')
        .insert([{
          registration_id: registrationId,
          full_name: form.fullName,
          email: form.email,
          phone: form.phone,
          location: form.location,
          course_title: COURSE_TITLE,
          amount: COURSE_PRICE,
          payment_status: 'pending',
        }]);

      if (dbError) throw dbError;

      // Trigger Moolre payment
      const paymentRes = await fetch('/api/payment/moolre', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: registrationId,
          amount: COURSE_PRICE,
          customerEmail: form.email,
        }),
      });

      const paymentResult = await paymentRes.json();
      if (!paymentResult.success) {
        throw new Error(paymentResult.message || 'Payment initialization failed');
      }

      window.location.href = paymentResult.url;

    } catch (err: any) {
      console.error('Registration error:', err);
      alert('Something went wrong: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-brand-light">
      {/* Hero */}
      <div className="bg-brand-blue text-white py-16 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="relative z-10 max-w-3xl mx-auto">
          <span className="text-brand-gold font-bold tracking-widest uppercase text-xs mb-4 block">Exclusive Course</span>
          <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">1v1 Online Importation Class</h1>
          <div className="w-20 h-1 bg-brand-gold mx-auto mb-6 rounded-full"></div>
          <p className="text-white/80 text-lg max-w-xl mx-auto">Learn how to import goods directly and build a profitable business. Personalised, one-on-one coaching just for you.</p>
        </div>
      </div>

      {/* What You'll Get */}
      <div className="max-w-4xl mx-auto px-4 py-12 grid md:grid-cols-3 gap-6">
        {[
          { icon: 'ri-video-chat-line', title: 'Live 1v1 Session', desc: 'A private, personalised online class tailored to you' },
          { icon: 'ri-ship-line', title: 'Import Secrets', desc: 'Learn how to source and import products affordably' },
          { icon: 'ri-money-dollar-circle-line', title: 'Build Your Business', desc: 'Practical steps to start selling and making profit' },
        ].map((item, i) => (
          <div key={i} className="bg-white rounded-2xl p-6 text-center shadow-sm border border-gray-100">
            <div className="w-14 h-14 bg-brand-gold/10 rounded-full flex items-center justify-center mx-auto mb-4 text-brand-blue">
              <i className={`${item.icon} text-2xl`}></i>
            </div>
            <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
            <p className="text-gray-500 text-sm">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* Registration Form */}
      <div className="max-w-xl mx-auto px-4 pb-20">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Form Header */}
          <div className="bg-brand-blue/5 border-b border-gray-100 px-8 py-6 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Register Now</h2>
            <p className="text-gray-500 text-sm">Fill in your details to secure your spot</p>
            <div className="mt-4 inline-flex items-center gap-2 bg-brand-gold/10 text-brand-blue border border-brand-gold/30 px-5 py-2 rounded-full font-bold text-lg">
              <i className="ri-price-tag-3-line text-brand-gold"></i>
              GH₵{COURSE_PRICE.toFixed(2)}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="px-8 py-8 space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name *</label>
              <input
                type="text"
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                placeholder="Enter your full name"
                className={`w-full px-4 py-3.5 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-brand-blue focus:border-brand-blue transition-all text-sm ${errors.fullName ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
              />
              {errors.fullName && <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1"><i className="ri-error-warning-line"></i>{errors.fullName}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address *</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="Enter your email"
                className={`w-full px-4 py-3.5 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-brand-blue focus:border-brand-blue transition-all text-sm ${errors.email ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
              />
              {errors.email && <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1"><i className="ri-error-warning-line"></i>{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number *</label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+233 XX XXX XXXX"
                className={`w-full px-4 py-3.5 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-brand-blue focus:border-brand-blue transition-all text-sm ${errors.phone ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
              />
              {errors.phone && <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1"><i className="ri-error-warning-line"></i>{errors.phone}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Location *</label>
              <input
                type="text"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                placeholder="e.g. Accra, Kumasi, Takoradi..."
                className={`w-full px-4 py-3.5 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-brand-blue focus:border-brand-blue transition-all text-sm ${errors.location ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
              />
              {errors.location && <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1"><i className="ri-error-warning-line"></i>{errors.location}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-brand-blue hover:bg-brand-blue/90 text-white h-14 rounded-xl font-bold text-base transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed mt-2"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                <>
                  <i className="ri-smartphone-line text-xl text-brand-gold"></i>
                  Pay GH₵{COURSE_PRICE.toFixed(2)} with Mobile Money
                </>
              )}
            </button>

            <p className="text-center text-xs text-gray-400 pt-1">
              <i className="ri-shield-check-line mr-1 text-green-500"></i>
              Secure payment powered by Moolre
            </p>
          </form>
        </div>

        <div className="text-center mt-6">
          <Link href="/" className="text-sm text-gray-500 hover:text-brand-blue transition-colors">
            <i className="ri-arrow-left-line mr-1"></i> Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
