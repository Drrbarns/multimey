'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CheckoutSteps from '@/components/CheckoutSteps';
import OrderSummary from '@/components/OrderSummary';
import { useCart } from '@/context/CartContext';
import { supabase } from '@/lib/supabase';
import { usePageTitle } from '@/hooks/usePageTitle';
import { useRecaptcha } from '@/hooks/useRecaptcha';

export default function CheckoutPage() {
  usePageTitle('Checkout');
  const router = useRouter();
  const { cart, subtotal: cartSubtotal, clearCart } = useCart();

  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [checkoutType, setCheckoutType] = useState<'guest' | 'account'>('guest');
  const [saveAddress, setSaveAddress] = useState(false);
  const [user, setUser] = useState<any>(null);
  const { getToken } = useRecaptcha();

  const [shippingData, setShippingData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    region: ''
  });

  // Ghana Regions for dropdown
  const ghanaRegions = [
    'Greater Accra',
    'Ashanti',
    'Western',
    'Central',
    'Eastern',
    'Northern',
    'Volta',
    'Upper East',
    'Upper West',
    'Brong-Ahafo',
    'Ahafo',
    'Bono',
    'Bono East',
    'North East',
    'Savannah',
    'Oti',
    'Western North'
  ];

  const [deliveryMethod, setDeliveryMethod] = useState('pickup');
  const [paymentMethod, setPaymentMethod] = useState<'paystack' | 'moolre' | 'stripe' | 'paypal'>('paystack');
  const [errors, setErrors] = useState<any>({});



  // Check auth and cart
  useEffect(() => {
    async function checkUser() {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        setCheckoutType('account'); // Auto-select account checkout if logged in
        // Pre-fill email if available
        setShippingData(prev => ({ ...prev, email: session.user.email || '' }));
      }
    }
    checkUser();

    // Small delay to ensure cart load
    const timer = setTimeout(() => {
      if (cart.length === 0 && !isLoading) {
        // router.push('/cart'); // Optional: redirect if empty
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [cart, router, isLoading]);

  // Scroll to top when step changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStep]);

  // Calculate Totals
  const subtotal = cartSubtotal;
  const shippingCost = 0; // Delivery options temporarily disabled
  const tax = 0; // No Tax
  const total = subtotal + shippingCost + tax;

  const validateShipping = () => {
    const newErrors: any = {};
    if (!shippingData.firstName) newErrors.firstName = 'First name is required';
    if (!shippingData.lastName) newErrors.lastName = 'Last name is required';
    if (!shippingData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(shippingData.email)) newErrors.email = 'Invalid email';
    if (!shippingData.phone) newErrors.phone = 'Phone is required';
    if (!shippingData.address) newErrors.address = 'Address is required';
    if (!shippingData.city) newErrors.city = 'City is required';
    if (!shippingData.region) newErrors.region = 'Region is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinueToDelivery = () => {
    if (validateShipping()) {
      setCurrentStep(2);
    }
  };

  const handleContinueToPayment = async () => {
    // Initiate payment with selected method
    await handlePlaceOrder();
  };



  const handlePlaceOrder = async () => {
    if (cart.length === 0) {
      alert('Your cart is empty');
      return;
    }

    setIsLoading(true);

    // reCAPTCHA verification
    const isHuman = await getToken('checkout');
    if (!isHuman) {
      alert('Security verification failed. Please try again.');
      setIsLoading(false);
      return;
    }

    try {
      const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      // Generate tracking number: SLI-XXXXXX (6-char alphanumeric)
      const trackingId = Array.from({ length: 6 }, () => 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'[Math.floor(Math.random() * 32)]).join('');
      const trackingNumber = `SLI-${trackingId}`;

      // 1. Create Order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert([{
          order_number: orderNumber,
          user_id: user?.id || null, // Capture user_id if logged in
          email: shippingData.email,
          phone: shippingData.phone,
          status: 'pending',
          payment_status: 'pending',
          currency: 'GHS',
          subtotal: subtotal,
          tax_total: tax,
          shipping_total: shippingCost,
          discount_total: 0,
          total: total,
          shipping_method: deliveryMethod,
          payment_method: paymentMethod,
          shipping_address: shippingData,
          billing_address: shippingData, // Using same for now
          metadata: {
            guest_checkout: !user,
            first_name: shippingData.firstName,
            last_name: shippingData.lastName,
            tracking_number: trackingNumber,
            payment_method: paymentMethod
          }
        }])
        .select()
        .single();

      if (orderError) throw orderError;

      // 2. Create Order Items (with UUID validation)
      // Helper to check if string is a valid UUID
      const isValidUUID = (str: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
      
      // Build order items, resolving slugs to UUIDs if needed
      const orderItems = [];
      
      // Batch-fetch product metadata (for preorder_shipping etc.)
      const productIds = cart.map(item => item.id).filter(id => isValidUUID(id));
      const { data: productsData } = productIds.length > 0
        ? await supabase.from('products').select('id, metadata').in('id', productIds)
        : { data: [] };
      const productMetaMap = new Map((productsData || []).map((p: any) => [p.id, p.metadata]));
      
      for (const item of cart) {
        let productId = item.id;
        
        // If id is not a valid UUID, it might be a slug - try to resolve it
        if (!isValidUUID(productId)) {
          const { data: product } = await supabase
            .from('products')
            .select('id, metadata')
            .or(`slug.eq.${productId},id.eq.${productId}`)
            .single();
          
          if (product) {
            productId = product.id;
            productMetaMap.set(product.id, product.metadata);
          } else {
            throw new Error(`Product not found: ${item.name}. Please remove it from your cart and try again.`);
          }
        }
        
        const prodMeta = productMetaMap.get(productId);
        
        orderItems.push({
          order_id: order.id,
          product_id: productId,
          product_name: item.name,
          variant_name: item.variant,
          quantity: item.quantity,
          unit_price: item.price,
          total_price: item.price * item.quantity,
          metadata: {
            image: item.image,
            slug: item.slug,
            preorder_shipping: prodMeta?.preorder_shipping || null
          }
        });
      }

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Note: Stock reduction happens in mark_order_paid when payment is confirmed

      // 3. Upsert Customer Record (for both guest and registered users)
      const fullName = `${shippingData.firstName} ${shippingData.lastName}`.trim();
      await supabase.rpc('upsert_customer_from_order', {
        p_email: shippingData.email,
        p_phone: shippingData.phone,
        p_full_name: fullName,
        p_first_name: shippingData.firstName,
        p_last_name: shippingData.lastName,
        p_user_id: user?.id || null,
        p_address: shippingData
      });

      // 4. Handle Payment Redirects or Completion
      if (paymentMethod === 'paystack') {
        try {
          const paymentRes = await fetch('/api/payment/paystack', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              orderId: orderNumber,
              amount: total,
              customerEmail: shippingData.email,
            }),
          });
          const paymentResult = await paymentRes.json();
          if (!paymentResult.success) {
            throw new Error(paymentResult.message || 'Payment initialization failed');
          }
          clearCart();
          window.location.href = paymentResult.url;
          return;
        } catch (paymentErr: any) {
          console.error('Payment Error:', paymentErr);
          alert('Failed to initialize payment: ' + paymentErr.message);
          setIsLoading(false);
          return;
        }
      }

      if (paymentMethod === 'moolre') {
        try {
          const paymentRes = await fetch('/api/payment/moolre', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              orderId: orderNumber,
              amount: total,
              customerEmail: shippingData.email,
            }),
          });
          const paymentResult = await paymentRes.json();
          if (!paymentResult.success) {
            throw new Error(paymentResult.message || 'Payment initialization failed');
          }
          clearCart();
          window.location.href = paymentResult.url;
          return;
        } catch (paymentErr: any) {
          console.error('Payment Error:', paymentErr);
          alert('Failed to initialize payment: ' + paymentErr.message);
          setIsLoading(false);
          return;
        }
      }

      if (paymentMethod === 'stripe') {
        try {
          const paymentRes = await fetch('/api/payment/stripe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              orderId: orderNumber,
              amount: total,
              customerEmail: shippingData.email,
            }),
          });
          const paymentResult = await paymentRes.json();
          if (!paymentResult.success) {
            throw new Error(paymentResult.message || 'Payment initialization failed');
          }
          clearCart();
          window.location.href = paymentResult.url;
          return;
        } catch (paymentErr: any) {
          console.error('Payment Error:', paymentErr);
          alert('Failed to initialize payment: ' + paymentErr.message);
          setIsLoading(false);
          return;
        }
      }

      if (paymentMethod === 'paypal') {
        try {
          const paymentRes = await fetch('/api/payment/paypal', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              orderId: orderNumber,
              amount: total,
              customerEmail: shippingData.email,
            }),
          });
          const paymentResult = await paymentRes.json();
          if (!paymentResult.success) {
            throw new Error(paymentResult.message || 'Payment initialization failed');
          }
          clearCart();
          window.location.href = paymentResult.url;
          return;
        } catch (paymentErr: any) {
          console.error('Payment Error:', paymentErr);
          alert('Failed to initialize payment: ' + paymentErr.message);
          setIsLoading(false);
          return;
        }
      }

      // 5. Send Notifications (For COD or others)
      fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'order_created',
          payload: order
        })
      }).catch(err => console.error('Notification trigger error:', err));

      // 6. Clear Cart & Redirect (For COD)
      clearCart();
      router.push(`/order-success?order=${orderNumber}`);

    } catch (err: any) {
      console.error('Checkout error:', err);
      alert('Failed to place order: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (cart.length === 0 && !isLoading) {
    return (
      <main className="min-h-screen bg-gray-50 py-20">
        <div className="max-w-md mx-auto text-center px-4">
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
            <i className="ri-shopping-cart-line text-4xl text-gray-300"></i>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h1>
          <p className="text-gray-600 mb-8">Add some items to start the checkout process.</p>
          <Link href="/shop" className="inline-block bg-gray-900 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors">
            Return to Shop
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <Link href="/cart" className="text-gray-600 hover:text-gray-900 font-medium inline-flex items-center whitespace-nowrap">
            <i className="ri-arrow-left-line mr-2"></i>
            Back to Cart
          </Link>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

        {currentStep === 1 && (
          <div className="mb-6 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
            <h2 className="text-2xl font-serif text-gray-900 mb-6">How would you like to checkout?</h2>
            <div className="grid md:grid-cols-2 gap-5">
              <button
                onClick={() => !user && setCheckoutType('guest')}
                className={`p-5 rounded-2xl border-2 transition-all text-left cursor-pointer relative overflow-hidden group ${checkoutType === 'guest'
                  ? 'border-brand-violet bg-brand-pink/5'
                  : 'border-gray-100 hover:border-gray-300 bg-white'
                  } ${user ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={!!user}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${checkoutType === 'guest' ? 'bg-brand-violet text-white' : 'bg-gray-100 text-gray-500 group-hover:bg-gray-200'}`}>
                    <i className="ri-user-line text-xl"></i>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${checkoutType === 'guest' ? 'border-brand-violet bg-brand-violet' : 'border-gray-300'
                    }`}>
                    {checkoutType === 'guest' && <i className="ri-check-line text-white text-xs"></i>}
                  </div>
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-1.5">Guest Checkout</h3>
                <p className="text-[13px] text-gray-500 leading-relaxed">Fast and easy checkout without creating an account.</p>
                {user && <p className="text-[11px] font-semibold text-amber-600 mt-2 flex items-center"><i className="ri-error-warning-fill mr-1"></i> You are logged in</p>}
              </button>

              <button
                onClick={() => setCheckoutType('account')}
                className={`p-5 rounded-2xl border-2 transition-all text-left cursor-pointer relative overflow-hidden group ${checkoutType === 'account'
                  ? 'border-brand-violet bg-brand-pink/5'
                  : 'border-gray-100 hover:border-gray-300 bg-white'
                  }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${checkoutType === 'account' ? 'bg-brand-violet text-white' : 'bg-gray-100 text-gray-500 group-hover:bg-gray-200'}`}>
                    <i className="ri-account-circle-line text-xl"></i>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${checkoutType === 'account' ? 'border-brand-violet bg-brand-violet' : 'border-gray-300'
                    }`}>
                    {checkoutType === 'account' && <i className="ri-check-line text-white text-xs"></i>}
                  </div>
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-1.5">{user ? 'My Account' : 'Create Account'}</h3>
                <p className="text-[13px] text-gray-500 leading-relaxed">
                  {user ? `Logged in as ${user.email}` : 'Save your details for faster checkout next time.'}
                </p>
              </button>
            </div>
          </div>
        )}

        <CheckoutSteps currentStep={currentStep} />

        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 mt-10">
          <div className="lg:col-span-7 xl:col-span-8">
            {currentStep === 1 && (
              <>
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 mb-6">
                  <h2 className="text-2xl font-serif text-gray-900 mb-8">Shipping Information</h2>

                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <input
                          type="text"
                          value={shippingData.firstName}
                          onChange={(e) => setShippingData({ ...shippingData, firstName: e.target.value })}
                          className={`w-full px-5 py-4 bg-gray-50/50 border rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all text-sm placeholder-gray-400 ${errors.firstName ? 'border-red-500 bg-red-50/30' : 'border-gray-200'
                            }`}
                          placeholder="First Name *"
                        />
                        {errors.firstName && <p className="text-xs text-red-500 mt-2 font-medium flex items-center"><i className="ri-error-warning-line mr-1"></i>{errors.firstName}</p>}
                      </div>
                      <div>
                        <input
                          type="text"
                          value={shippingData.lastName}
                          onChange={(e) => setShippingData({ ...shippingData, lastName: e.target.value })}
                          className={`w-full px-5 py-4 bg-gray-50/50 border rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all text-sm placeholder-gray-400 ${errors.lastName ? 'border-red-500 bg-red-50/30' : 'border-gray-200'
                            }`}
                          placeholder="Last Name *"
                        />
                        {errors.lastName && <p className="text-xs text-red-500 mt-2 font-medium flex items-center"><i className="ri-error-warning-line mr-1"></i>{errors.lastName}</p>}
                      </div>
                    </div>

                    <div>
                      <input
                        type="email"
                        value={shippingData.email}
                        readOnly={!!user}
                        onChange={(e) => setShippingData({ ...shippingData, email: e.target.value })}
                        className={`w-full px-5 py-4 bg-gray-50/50 border rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all text-sm placeholder-gray-400 ${errors.email ? 'border-red-500 bg-red-50/30' : 'border-gray-200'
                          } ${user ? 'bg-gray-100 cursor-not-allowed text-gray-500' : ''}`}
                        placeholder="Email Address *"
                      />
                      {errors.email && <p className="text-xs text-red-500 mt-2 font-medium flex items-center"><i className="ri-error-warning-line mr-1"></i>{errors.email}</p>}
                    </div>

                    <div>
                      <input
                        type="tel"
                        value={shippingData.phone}
                        onChange={(e) => setShippingData({ ...shippingData, phone: e.target.value })}
                        className={`w-full px-5 py-4 bg-gray-50/50 border rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all text-sm placeholder-gray-400 ${errors.phone ? 'border-red-500 bg-red-50/30' : 'border-gray-200'
                          }`}
                        placeholder="Phone Number (+233 XX XXX XXXX) *"
                      />
                      {errors.phone && <p className="text-xs text-red-500 mt-2 font-medium flex items-center"><i className="ri-error-warning-line mr-1"></i>{errors.phone}</p>}
                    </div>

                    <div>
                      <input
                        type="text"
                        value={shippingData.address}
                        onChange={(e) => setShippingData({ ...shippingData, address: e.target.value })}
                        className={`w-full px-5 py-4 bg-gray-50/50 border rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all text-sm placeholder-gray-400 ${errors.address ? 'border-red-500 bg-red-50/30' : 'border-gray-200'
                          }`}
                        placeholder="Street Address *"
                      />
                      {errors.address && <p className="text-xs text-red-500 mt-2 font-medium flex items-center"><i className="ri-error-warning-line mr-1"></i>{errors.address}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <input
                          type="text"
                          value={shippingData.city}
                          onChange={(e) => setShippingData({ ...shippingData, city: e.target.value })}
                          className={`w-full px-5 py-4 bg-gray-50/50 border rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all text-sm placeholder-gray-400 ${errors.city ? 'border-red-500 bg-red-50/30' : 'border-gray-200'
                            }`}
                          placeholder="City *"
                        />
                        {errors.city && <p className="text-xs text-red-500 mt-2 font-medium flex items-center"><i className="ri-error-warning-line mr-1"></i>{errors.city}</p>}
                      </div>
                      <div>
                        <div className="relative">
                          <select
                            value={shippingData.region}
                            onChange={(e) => setShippingData({ ...shippingData, region: e.target.value })}
                            className={`w-full px-5 py-4 bg-gray-50/50 border rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all text-sm appearance-none ${errors.region ? 'border-red-500 bg-red-50/30' : 'border-gray-200'
                              } ${!shippingData.region ? 'text-gray-400' : 'text-gray-900'}`}
                          >
                            <option value="" disabled hidden>Region *</option>
                            {ghanaRegions.map((region) => (
                              <option key={region} value={region} className="text-gray-900">{region}</option>
                            ))}
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                            <i className="ri-arrow-down-s-line text-lg"></i>
                          </div>
                        </div>
                        {errors.region && <p className="text-xs text-red-500 mt-2 font-medium flex items-center"><i className="ri-error-warning-line mr-1"></i>{errors.region}</p>}
                      </div>
                    </div>

                    {checkoutType === 'account' && (
                      <label className="flex items-center space-x-3 cursor-pointer mt-4 p-4 border border-brand-pink/30 rounded-xl bg-brand-pink/5 hover:bg-brand-pink/10 transition-colors">
                        <input
                          type="checkbox"
                          checked={saveAddress}
                          onChange={(e) => setSaveAddress(e.target.checked)}
                          className="w-5 h-5 text-brand-violet rounded border-gray-300 focus:ring-brand-violet"
                        />
                        <span className="text-sm font-medium text-gray-700">Save this address for future orders</span>
                      </label>
                    )}
                  </div>

                  <button
                    onClick={handleContinueToDelivery}
                    className="w-full mt-8 bg-brand-violet hover:bg-brand-violet/90 text-white h-14 rounded-xl font-bold transition-all whitespace-nowrap cursor-pointer shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center text-[15px]"
                  >
                    Continue to Delivery <i className="ri-arrow-right-line ml-2 text-lg"></i>
                  </button>
                </div>
              </>
            )}

            {currentStep === 2 && (
              <>
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 mb-6">
                  <h2 className="text-2xl font-serif text-gray-900 mb-8">Delivery Method</h2>
                  <div className="space-y-4">
                    <label className={`flex items-center justify-between p-5 border-2 rounded-xl cursor-pointer transition-all ${deliveryMethod === 'pickup' ? 'border-brand-violet bg-brand-pink/5 shadow-sm' : 'border-gray-100 hover:border-gray-300'
                      }`}>
                      <div className="flex items-center space-x-4">
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${deliveryMethod === 'pickup' ? 'border-brand-violet bg-brand-violet' : 'border-gray-300'}`}>
                           {deliveryMethod === 'pickup' && <div className="w-2 h-2 bg-white rounded-full"></div>}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 text-[15px]">Store Pickup</p>
                          <p className="text-sm text-gray-500 mt-0.5">Pick up from our store — Ready in 24 hours</p>
                        </div>
                      </div>
                      <p className="font-bold text-brand-violet bg-brand-pink/20 px-3 py-1 rounded-lg border border-brand-pink/30 text-xs tracking-wider uppercase shadow-sm">FREE</p>
                    </label>

                    <label className={`flex items-center justify-between p-5 border-2 rounded-xl cursor-pointer transition-all ${deliveryMethod === 'doorstep' ? 'border-brand-violet bg-brand-pink/5 shadow-sm' : 'border-gray-100 hover:border-gray-300'
                      }`}>
                      <div className="flex items-center space-x-4">
                         <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${deliveryMethod === 'doorstep' ? 'border-brand-violet bg-brand-violet' : 'border-gray-300'}`}>
                           {deliveryMethod === 'doorstep' && <div className="w-2 h-2 bg-white rounded-full"></div>}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 text-[15px]">Doorstep Delivery</p>
                          <p className="text-sm text-gray-500 mt-0.5">We will contact you with the delivery cost</p>
                        </div>
                      </div>
                      <p className="font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-lg border border-amber-200 text-xs tracking-wider uppercase shadow-sm">Variable</p>
                    </label>
                  </div>

                  <h2 className="text-2xl font-serif text-gray-900 mt-12 mb-6">Payment Method</h2>
                  <p className="text-sm text-gray-500 mb-6">Select your preferred payment method.</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <label
                      className={`flex items-center gap-4 p-5 border-2 rounded-xl cursor-pointer transition-all relative overflow-hidden group ${paymentMethod === 'paystack' ? 'border-brand-violet bg-brand-pink/5 shadow-sm' : 'border-gray-100 hover:border-gray-300'}`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value="paystack"
                        checked={paymentMethod === 'paystack'}
                        onChange={() => setPaymentMethod('paystack')}
                        className="sr-only"
                      />
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors z-10 ${paymentMethod === 'paystack' ? 'border-brand-violet bg-brand-violet' : 'border-gray-300 group-hover:border-gray-400'}`}>
                           {paymentMethod === 'paystack' && <div className="w-2 h-2 bg-white rounded-full"></div>}
                      </div>
                      <div className="w-10 h-10 bg-white rounded-lg shadow-sm border border-gray-100 flex items-center justify-center flex-shrink-0 z-10">
                         <i className="ri-bank-card-line text-xl text-gray-700"></i>
                      </div>
                      <div className="min-w-0 z-10">
                        <p className="font-bold text-gray-900 text-[14px]">Paystack</p>
                        <p className="text-[11px] text-gray-500 mt-0.5 truncate">Card & Mobile Money</p>
                      </div>
                    </label>

                    <label
                      className={`flex items-center gap-4 p-5 border-2 rounded-xl cursor-pointer transition-all relative overflow-hidden group ${paymentMethod === 'moolre' ? 'border-brand-violet bg-brand-pink/5 shadow-sm' : 'border-gray-100 hover:border-gray-300'}`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value="moolre"
                        checked={paymentMethod === 'moolre'}
                        onChange={() => setPaymentMethod('moolre')}
                        className="sr-only"
                      />
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors z-10 ${paymentMethod === 'moolre' ? 'border-brand-violet bg-brand-violet' : 'border-gray-300 group-hover:border-gray-400'}`}>
                           {paymentMethod === 'moolre' && <div className="w-2 h-2 bg-white rounded-full"></div>}
                      </div>
                      <div className="w-10 h-10 bg-white rounded-lg shadow-sm border border-gray-100 flex items-center justify-center flex-shrink-0 z-10">
                         <i className="ri-smartphone-line text-xl text-gray-700"></i>
                      </div>
                      <div className="min-w-0 z-10">
                        <p className="font-bold text-gray-900 text-[14px]">Moolre</p>
                        <p className="text-[11px] text-gray-500 mt-0.5 truncate">Mobile Money Only</p>
                      </div>
                    </label>

                    <label
                      className={`flex items-center gap-4 p-5 border-2 rounded-xl cursor-pointer transition-all relative overflow-hidden group ${paymentMethod === 'stripe' ? 'border-brand-violet bg-brand-pink/5 shadow-sm' : 'border-gray-100 hover:border-gray-300'}`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value="stripe"
                        checked={paymentMethod === 'stripe'}
                        onChange={() => setPaymentMethod('stripe')}
                        className="sr-only"
                      />
                       <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors z-10 ${paymentMethod === 'stripe' ? 'border-brand-violet bg-brand-violet' : 'border-gray-300 group-hover:border-gray-400'}`}>
                           {paymentMethod === 'stripe' && <div className="w-2 h-2 bg-white rounded-full"></div>}
                      </div>
                      <div className="w-10 h-10 bg-white rounded-lg shadow-sm border border-gray-100 flex items-center justify-center flex-shrink-0 z-10">
                         <i className="ri-bank-card-2-line text-xl text-gray-700"></i>
                      </div>
                      <div className="min-w-0 z-10">
                        <p className="font-bold text-gray-900 text-[14px]">Stripe</p>
                        <p className="text-[11px] text-gray-500 mt-0.5 truncate">Credit/Debit Cards</p>
                      </div>
                    </label>

                    <label
                      className={`flex items-center gap-4 p-5 border-2 rounded-xl cursor-pointer transition-all relative overflow-hidden group ${paymentMethod === 'paypal' ? 'border-brand-violet bg-brand-pink/5 shadow-sm' : 'border-gray-100 hover:border-gray-300'}`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value="paypal"
                        checked={paymentMethod === 'paypal'}
                        onChange={() => setPaymentMethod('paypal')}
                        className="sr-only"
                      />
                       <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors z-10 ${paymentMethod === 'paypal' ? 'border-brand-violet bg-brand-violet' : 'border-gray-300 group-hover:border-gray-400'}`}>
                           {paymentMethod === 'paypal' && <div className="w-2 h-2 bg-white rounded-full"></div>}
                      </div>
                      <div className="w-10 h-10 bg-white rounded-lg shadow-sm border border-gray-100 flex items-center justify-center flex-shrink-0 z-10">
                         <i className="ri-paypal-line text-xl text-gray-700"></i>
                      </div>
                      <div className="min-w-0 z-10">
                        <p className="font-bold text-gray-900 text-[14px]">PayPal</p>
                        <p className="text-[11px] text-gray-500 mt-0.5 truncate">PayPal Balance</p>
                      </div>
                    </label>
                  </div>

                  <div className="flex flex-col-reverse md:flex-row gap-4 mt-10">
                    <button
                      onClick={() => setCurrentStep(1)}
                      disabled={isLoading}
                      className="md:flex-1 border-2 border-gray-200 hover:border-brand-violet hover:bg-brand-pink/5 text-gray-900 h-14 rounded-xl font-bold transition-all whitespace-nowrap cursor-pointer disabled:opacity-50 text-[15px]"
                    >
                      Back to Shipping
                    </button>
                    <button
                      onClick={handleContinueToPayment}
                      disabled={isLoading}
                      className="md:flex-[2] bg-brand-violet hover:bg-brand-violet/90 text-white h-14 rounded-xl font-bold transition-all whitespace-nowrap cursor-pointer disabled:opacity-70 shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center text-[15px]"
                    >
                      {isLoading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing...
                        </>
                      ) : (
                        <>
                          Complete Order <i className="ri-secure-payment-line ml-2 text-lg"></i>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="lg:col-span-5 xl:col-span-4">
            <div className="sticky top-24">
              <OrderSummary
                items={cart}
                subtotal={subtotal}
                shipping={shippingCost}
                tax={tax}
                total={total}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
