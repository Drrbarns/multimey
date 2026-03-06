export const getArticles = (contactPhone: string, contactEmail: string) => ({
  '1': {
    id: 1,
    title: 'How do I track my order?',
    category: 'Orders & Delivery',
    views: 1247,
    helpful: 234,
    updated: 'February 1, 2026',
    content: `
      <h2>Tracking Your Order</h2>
      <p>We make it easy to track your order every step of the way. Here's how:</p>
      
      <h3>Method 1: Track via Email</h3>
      <ol>
        <li>Check your email for the order confirmation</li>
        <li>Click on the "Track Order" button in the email</li>
        <li>You'll be redirected to the tracking page with real-time updates</li>
      </ol>
      
      <h3>Method 2: Track on Website</h3>
      <ol>
        <li>Go to the <a href="/order-tracking">Order Tracking</a> page</li>
        <li>Enter your order number and email address</li>
        <li>Click "Track Order" to see your delivery status</li>
      </ol>
      
      <h3>Method 3: Track in Your Account</h3>
      <ol>
        <li>Log in to your account</li>
        <li>Go to "Order History"</li>
        <li>Click on any order to see detailed tracking information</li>
      </ol>
      
      <h2>Understanding Tracking Statuses</h2>
      <ul>
        <li><strong>Order Confirmed:</strong> We've received your order</li>
        <li><strong>Processing:</strong> We're preparing your items</li>
        <li><strong>Packaged:</strong> Your order has been packaged</li>
        <li><strong>Out for Delivery:</strong> Your order will arrive today</li>
        <li><strong>Delivered:</strong> Your order has been delivered</li>
      </ul>
      
      <h2>Need More Help?</h2>
      <p>If you can't find your tracking information or have questions about your delivery, please <a href="/support/ticket">contact our support team</a>.</p>
    `
  },
  '2': {
    id: 2,
    title: 'What are the delivery times?',
    category: 'Orders & Delivery',
    views: 892,
    helpful: 178,
    updated: 'February 1, 2026',
    content: `
      <h2>Delivery Times</h2>
      <p>We process and ship orders as quickly as possible so you can enjoy your products.</p>

      <h3>Within Accra</h3>
      <ul>
        <li><strong>Same-Day Delivery:</strong> Orders placed before 12pm (Mon–Sat) are dispatched the same day with delivery before 5:30pm</li>
        <li><strong>Next-Day Delivery:</strong> Orders placed after 12pm are dispatched the following business day</li>
        <li><strong>Delivery Fee:</strong> GH₵35–50 within Accra; GH₵50–100 for Tema & Kasoa</li>
      </ul>

      <h3>Outside Accra (Domestic)</h3>
      <ul>
        <li><strong>Kumasi, Cape Coast, Takoradi, Sunyani, Tamale:</strong> GH₵25 — dispatched the next working day via bus services (VIP, Eagle Express)</li>
        <li>Delivery takes approximately 24 hours after dispatch</li>
        <li>You'll receive a collection code and vehicle info via SMS or WhatsApp</li>
      </ul>

      <h3>Weekend & Public Holiday Orders</h3>
      <p>Orders placed on Sundays, Mondays, or public holidays are processed and dispatched the next working day.</p>

      <h2>Need It Faster?</h2>
      <p>If you need same-day delivery for a late order, we can arrange a <strong>Yango courier</strong> at your expense. Contact us on WhatsApp at ${contactPhone} to arrange this.</p>
    `
  },
  '3': {
    id: 3,
    title: 'Can I change my delivery address?',
    category: 'Orders & Delivery',
    views: 654,
    helpful: 132,
    updated: 'February 1, 2026',
    content: `
      <h2>Changing Your Delivery Address</h2>
      <p>You can change your delivery address within <strong>1 hour</strong> of placing your order, before it enters processing.</p>

      <h3>How to Change Your Address</h3>
      <ol>
        <li>Contact us immediately via WhatsApp at ${contactPhone}</li>
        <li>Provide your order number and the new delivery address</li>
        <li>We'll confirm the change and update your order</li>
      </ol>

      <h3>After Processing Begins</h3>
      <p>Once your order has been processed and dispatched, we cannot change the delivery address. If the package is returned to us, we can reship to the new address (additional shipping fees may apply).</p>

      <h3>Saving Multiple Addresses</h3>
      <p>To avoid last-minute changes, you can save multiple delivery addresses in your account. During checkout, simply select the address you want to use.</p>
    `
  },
  '4': {
    id: 4,
    title: 'What if my order is delayed?',
    category: 'Orders & Delivery',
    views: 543,
    helpful: 109,
    updated: 'February 1, 2026',
    content: `
      <h2>Delayed Orders</h2>
      <p>While we strive to deliver on time, occasional delays can happen due to high demand, weather, or courier issues.</p>

      <h3>What to Do If Your Order Is Late</h3>
      <ol>
        <li><strong>Check your tracking:</strong> Visit the <a href="/order-tracking">Order Tracking</a> page for the latest status</li>
        <li><strong>Wait an extra day:</strong> Domestic deliveries outside Accra may take an additional day during peak periods</li>
        <li><strong>Contact us:</strong> If your order is more than 2 days late, reach out via WhatsApp at ${contactPhone} or email ${contactEmail}</li>
      </ol>

      <h3>Our Guarantee</h3>
      <p>If your order is significantly delayed due to our error, we will work with you to find a solution — whether that's a reshipment, alternative delivery method, or refund of shipping fees.</p>
    `
  },
  '5': {
    id: 5,
    title: 'Do you offer express delivery?',
    category: 'Orders & Delivery',
    views: 421,
    helpful: 84,
    updated: 'February 1, 2026',
    content: `
      <h2>Express Delivery</h2>
      <p>Yes! We offer express delivery options for customers within Accra.</p>

      <h3>Same-Day Delivery</h3>
      <ul>
        <li>Available for orders placed before 12pm (Tuesday–Saturday)</li>
        <li>Delivered before 5:30pm the same day</li>
        <li>Standard delivery fees apply (GH₵35–50 within Accra)</li>
      </ul>

      <h3>Yango Courier (Urgent Orders)</h3>
      <ul>
        <li>Available for orders placed after 12pm when same-day delivery is needed</li>
        <li>Delivery within 1–3 hours depending on location</li>
        <li>Client bears the Yango courier cost</li>
        <li>Contact us on WhatsApp at ${contactPhone} to arrange</li>
      </ul>

      <h3>Outside Accra</h3>
      <p>Express delivery is not currently available for locations outside Accra. All domestic orders ship via next-working-day bus services.</p>
    `
  },
  '6': {
    id: 6,
    title: 'How do I return an item?',
    category: 'Returns & Refunds',
    views: 2341,
    helpful: 456,
    updated: 'February 1, 2026',
    content: `
      <h2>Our Return Process</h2>
      <p>We want you to love your purchase! If something isn't right, here's how returns work.</p>
      
      <h3>Step 1: Contact Us First</h3>
      <ol>
        <li>Reach out via WhatsApp at ${contactPhone} or email ${contactEmail} within <strong>24 hours</strong> of receiving your item</li>
        <li>Explain the issue (faulty, damaged, or not what you requested)</li>
        <li>Provide photos of the item and packaging</li>
      </ol>
      
      <h3>Step 2: Get Approval</h3>
      <p>Our team will review your request and let you know if the return is approved. If approved, you'll receive return instructions.</p>
      
      <h3>Step 3: Ship Your Return</h3>
      <p>Pack the item securely in its original packaging with all tags attached and send it back as instructed.</p>
      
      <h3>Step 4: Get Your Refund</h3>
      <p>Once we receive and inspect your return, we'll process the refund to your original payment method. Your bank or mobile money provider may take extra time to process it.</p>
      
      <h2>Return Policy Details</h2>
      <ul>
        <li>You have <strong>24 hours</strong> after receiving your item to request a return (faulty, damaged, or not what you requested only)</li>
        <li>Items must be unworn/unused, with tags, in original packaging</li>
        <li>Receipt or proof of purchase required</li>
        <li>Returns sent without prior approval are not accepted</li>
        <li>No returns on personal care/beauty (opened), custom items, sale items, or gift cards due to hygiene reasons</li>
      </ul>
      
      <h2>Exchange Instead?</h2>
      <p>Return the item first; once accepted, we'll arrange the exchange. You cannot request a different item than what you originally purchased. See our <a href="/refund-policy">Refund Policy</a> for full details.</p>
    `
  },
  '7': {
    id: 7,
    title: 'What is your return policy?',
    category: 'Returns & Refunds',
    views: 1876,
    helpful: 375,
    updated: 'February 1, 2026',
    content: `
      <h2>Return Policy Overview</h2>
      <p>We have a <strong>24-hour return policy</strong>. You have 24 hours after receiving your item to request a return.</p>

      <h3>Eligible Reasons for Return</h3>
      <ul>
        <li>Item is faulty or defective</li>
        <li>Item arrived damaged during shipping</li>
        <li>Item is not what you requested/ordered</li>
      </ul>

      <h3>Items That Cannot Be Returned</h3>
      <ul>
        <li>Opened cosmetics and beauty products (for hygiene reasons)</li>
        <li>Custom or personalised items</li>
        <li>Sale/clearance items</li>
        <li>Gift cards</li>
      </ul>

      <h3>Conditions for Return</h3>
      <ul>
        <li>Items must be unworn, unused, and in original condition</li>
        <li>All tags and original packaging must be intact</li>
        <li>You must have proof of purchase (order confirmation or receipt)</li>
        <li>You must contact us <strong>before</strong> sending the item back</li>
      </ul>

      <p>For full details, visit our <a href="/refund-policy">Refund Policy</a> page or contact us at ${contactEmail}.</p>
    `
  },
  '8': {
    id: 8,
    title: 'When will I get my refund?',
    category: 'Returns & Refunds',
    views: 1432,
    helpful: 287,
    updated: 'February 1, 2026',
    content: `
      <h2>Refund Timeline</h2>
      <p>Once your return is received and inspected, here's what to expect:</p>

      <h3>Processing Time</h3>
      <ol>
        <li><strong>Return inspection:</strong> 1–2 business days after we receive the item</li>
        <li><strong>Approval notification:</strong> You'll receive an email or WhatsApp message confirming whether your refund is approved</li>
        <li><strong>Refund issued:</strong> Processed within 24 hours of approval</li>
      </ol>

      <h3>Time to Appear in Your Account</h3>
      <ul>
        <li><strong>Mobile Money (MTN, Vodafone, AirtelTigo):</strong> Instant to 24 hours</li>
        <li><strong>Credit/Debit Card:</strong> 5–10 business days (depends on your bank)</li>
      </ul>

      <h3>Partial Refunds</h3>
      <p>In some cases, a partial refund may be granted (e.g., items that show signs of use or are missing tags/packaging).</p>

      <p>If you haven't received your refund after the expected time, contact us at ${contactPhone} or ${contactEmail}.</p>
    `
  },
  '9': {
    id: 9,
    title: 'Can I exchange instead of return?',
    category: 'Returns & Refunds',
    views: 987,
    helpful: 198,
    updated: 'February 1, 2026',
    content: `
      <h2>Exchanges</h2>
      <p>Yes, we do offer exchanges! Here's how the process works:</p>

      <h3>How to Request an Exchange</h3>
      <ol>
        <li>Contact us within 24 hours of receiving your item via WhatsApp at ${contactPhone} or email ${contactEmail}</li>
        <li>Let us know which item you'd like to exchange and why</li>
        <li>If approved, return the original item to us</li>
        <li>Once we receive and inspect it, we'll ship the replacement</li>
      </ol>

      <h3>Important Notes</h3>
      <ul>
        <li>You can only exchange for the <strong>same item</strong> (e.g., different shade or size — not a completely different product)</li>
        <li>The exchange item must be in stock</li>
        <li>If there's a price difference, you'll be notified before the exchange is processed</li>
        <li>All exchange conditions follow our standard return policy</li>
      </ul>

      <p>If the item you want is out of stock, we'll process a full refund instead.</p>
    `
  },
  '10': {
    id: 10,
    title: 'How do I print a return label?',
    category: 'Returns & Refunds',
    views: 765,
    helpful: 153,
    updated: 'February 1, 2026',
    content: `
      <h2>Return Labels</h2>
      <p>For returns within Accra, we typically arrange pickup or provide drop-off instructions rather than printed labels.</p>

      <h3>How It Works</h3>
      <ol>
        <li>Contact us to initiate your return via WhatsApp at ${contactPhone}</li>
        <li>Our team will provide specific return instructions based on your location</li>
        <li>For Accra customers, we may arrange a pickup at your convenience</li>
        <li>For customers outside Accra, we'll provide bus service drop-off instructions</li>
      </ol>

      <h3>Packaging Your Return</h3>
      <ul>
        <li>Use the original packaging if possible</li>
        <li>Include all tags, accessories, and proof of purchase</li>
        <li>Seal the package securely</li>
        <li>Write your order number on the outside of the package</li>
      </ul>

      <p>Return shipping costs are covered by us if the return is due to a defect or our error. For other approved returns, the customer covers shipping.</p>
    `
  },
  '11': {
    id: 11,
    title: 'What payment methods do you accept?',
    category: 'Payment & Pricing',
    views: 1654,
    helpful: 331,
    updated: 'February 1, 2026',
    content: `
      <h2>Accepted Payment Methods</h2>
      <p>We offer multiple secure payment options through our Moolre payment gateway:</p>

      <h3>Mobile Money</h3>
      <ul>
        <li><strong>MTN Mobile Money</strong></li>
        <li><strong>Vodafone Cash</strong></li>
        <li><strong>AirtelTigo Money</strong></li>
      </ul>

      <h3>Card Payments</h3>
      <ul>
        <li><strong>Visa</strong> (credit & debit)</li>
        <li><strong>Mastercard</strong> (credit & debit)</li>
      </ul>

      <h3>How Payment Works</h3>
      <ol>
        <li>Add items to your cart and proceed to checkout</li>
        <li>Enter your delivery information</li>
        <li>Select your preferred payment method</li>
        <li>Complete the secure payment through Moolre</li>
        <li>Receive your order confirmation via email</li>
      </ol>

      <p>All payments are processed securely with encryption. We never store your full card or mobile money details.</p>
    `
  },
  '12': {
    id: 12,
    title: 'Is my payment information secure?',
    category: 'Payment & Pricing',
    views: 1234,
    helpful: 247,
    updated: 'February 1, 2026',
    content: `
      <h2>Payment Security</h2>
      <p>Your payment security is our top priority. Here's how we protect your information:</p>

      <h3>Secure Processing</h3>
      <ul>
        <li>All payments are processed through <strong>Moolre</strong>, a trusted and PCI-DSS compliant payment provider</li>
        <li>Your connection is encrypted with <strong>SSL/TLS</strong> technology</li>
        <li>We never see, store, or have access to your full card number or mobile money PIN</li>
      </ul>

      <h3>What We Store</h3>
      <p>We only keep a record of the transaction (amount, date, payment method type) for order tracking and refund purposes. No sensitive payment details are stored on our servers.</p>

      <h3>Protecting Yourself</h3>
      <ul>
        <li>Always ensure you're on <strong>multimeysupplies.com</strong> before entering payment info</li>
        <li>Look for the padlock icon in your browser's address bar</li>
        <li>Never share your payment credentials with anyone claiming to be from our team</li>
      </ul>

      <p>If you notice any suspicious activity on your account, contact us immediately at ${contactEmail}.</p>
    `
  },
  '13': {
    id: 13,
    title: 'Can I pay in installments?',
    category: 'Payment & Pricing',
    views: 987,
    helpful: 198,
    updated: 'February 1, 2026',
    content: `
      <h2>Installment Payments</h2>
      <p>We currently do not offer installment or "buy now, pay later" options. All orders must be paid in full at checkout before they are processed and dispatched.</p>

      <h3>Payment Options Available</h3>
      <ul>
        <li>Mobile Money (MTN, Vodafone, AirtelTigo)</li>
        <li>Credit/Debit Card (Visa, Mastercard)</li>
      </ul>

      <h3>Future Plans</h3>
      <p>We are exploring partnerships to offer installment plans in the future. Follow us on social media or subscribe to our newsletter to be the first to know when this becomes available.</p>

      <p>For any questions about payment, contact us at ${contactEmail}.</p>
    `
  },
  '14': {
    id: 14,
    title: 'Do you accept gift cards?',
    category: 'Payment & Pricing',
    views: 543,
    helpful: 109,
    updated: 'February 1, 2026',
    content: `
      <h2>Gift Cards</h2>
      <p>Gift cards are not currently available at MultiMey Supplies. However, we are working on introducing digital gift cards in the near future.</p>

      <h3>Alternatives</h3>
      <ul>
        <li><strong>Send a gift:</strong> You can order products and have them delivered directly to your recipient by using their address at checkout</li>
        <li><strong>Share a coupon:</strong> Check our promotions for discount codes that you can share with friends and family</li>
      </ul>

      <p>Stay tuned for updates on gift card availability by following us on social media.</p>
    `
  },
  '15': {
    id: 15,
    title: 'Why was my payment declined?',
    category: 'Payment & Pricing',
    views: 432,
    helpful: 87,
    updated: 'February 1, 2026',
    content: `
      <h2>Payment Declined</h2>
      <p>If your payment was declined, here are the most common reasons and what to do:</p>

      <h3>Common Reasons</h3>
      <ul>
        <li><strong>Insufficient funds:</strong> Ensure you have enough balance in your mobile money or bank account</li>
        <li><strong>Incorrect details:</strong> Double-check your card number, expiry date, and CVV</li>
        <li><strong>Mobile Money PIN:</strong> Make sure you enter the correct PIN when prompted</li>
        <li><strong>Network issues:</strong> Poor internet or mobile network can cause timeouts</li>
        <li><strong>Card restrictions:</strong> Some cards may block online transactions by default</li>
      </ul>

      <h3>What to Try</h3>
      <ol>
        <li>Wait a few minutes and try again</li>
        <li>Try a different payment method</li>
        <li>Contact your bank or mobile money provider to ensure online payments are enabled</li>
        <li>Clear your browser cache and cookies, then retry</li>
      </ol>

      <p>If the issue persists, contact us at ${contactPhone} and we'll help you complete your order.</p>
    `
  },
  '16': {
    id: 16,
    title: 'How do I create an account?',
    category: 'Account & Profile',
    views: 876,
    helpful: 175,
    updated: 'February 1, 2026',
    content: `
      <h2>Creating Your Account</h2>
      <p>Setting up an account takes less than a minute and gives you access to order tracking, wishlists, and faster checkout.</p>

      <h3>Steps to Sign Up</h3>
      <ol>
        <li>Click the <strong>Account</strong> icon in the top navigation bar</li>
        <li>Select <strong>"Sign Up"</strong></li>
        <li>Enter your full name, email address, and create a password</li>
        <li>Click <strong>"Create Account"</strong></li>
        <li>Verify your email by clicking the link sent to your inbox</li>
      </ol>

      <h3>Benefits of Having an Account</h3>
      <ul>
        <li>Track your orders in real-time</li>
        <li>Save your delivery addresses for faster checkout</li>
        <li>Build and manage your wishlist</li>
        <li>View your full order history</li>
        <li>Receive personalised product recommendations</li>
        <li>Earn loyalty points on purchases</li>
      </ul>

      <p>You can also checkout as a guest without creating an account.</p>
    `
  },
  '17': {
    id: 17,
    title: 'I forgot my password',
    category: 'Account & Profile',
    views: 1543,
    helpful: 309,
    updated: 'February 1, 2026',
    content: `
      <h2>Resetting Your Password</h2>
      <p>Don't worry — resetting your password is quick and easy.</p>

      <h3>Steps to Reset</h3>
      <ol>
        <li>Go to the <a href="/auth/login">Login page</a></li>
        <li>Click <strong>"Forgot Password"</strong></li>
        <li>Enter the email address linked to your account</li>
        <li>Check your inbox (and spam folder) for a reset email</li>
        <li>Click the reset link in the email (valid for 1 hour)</li>
        <li>Enter your new password and confirm</li>
      </ol>

      <h3>Tips for a Strong Password</h3>
      <ul>
        <li>Use at least 8 characters</li>
        <li>Mix uppercase, lowercase, numbers, and symbols</li>
        <li>Avoid using your name, email, or common words</li>
      </ul>

      <p>If you don't receive the reset email, contact us at ${contactEmail} for assistance.</p>
    `
  },
  '18': {
    id: 18,
    title: 'How do I update my email?',
    category: 'Account & Profile',
    views: 654,
    helpful: 131,
    updated: 'February 1, 2026',
    content: `
      <h2>Updating Your Email Address</h2>
      <p>You can update your email address from your account settings.</p>

      <h3>Steps</h3>
      <ol>
        <li>Log in to your <a href="/account">Account</a></li>
        <li>Go to <strong>Account Settings</strong> or <strong>Privacy</strong></li>
        <li>Click <strong>Edit</strong> next to your email address</li>
        <li>Enter your new email and confirm</li>
        <li>Verify the new email by clicking the confirmation link sent to it</li>
      </ol>

      <h3>Important Notes</h3>
      <ul>
        <li>You'll need to verify the new email before it becomes active</li>
        <li>Order confirmations and notifications will be sent to your new email once verified</li>
        <li>If you can't access your current email, contact us at ${contactEmail} for help</li>
      </ul>
    `
  },
  '19': {
    id: 19,
    title: 'Can I delete my account?',
    category: 'Account & Profile',
    views: 432,
    helpful: 87,
    updated: 'February 1, 2026',
    content: `
      <h2>Deleting Your Account</h2>
      <p>You can request account deletion at any time. Here's what you need to know:</p>

      <h3>How to Request Deletion</h3>
      <ol>
        <li>Contact us via email at ${contactEmail} or WhatsApp at ${contactPhone}</li>
        <li>Include "Account Deletion Request" as the subject</li>
        <li>Provide the email address associated with your account</li>
        <li>We will process your request within 48 hours</li>
      </ol>

      <h3>What Happens When You Delete</h3>
      <ul>
        <li>Your personal information will be permanently removed</li>
        <li>Your order history will be deleted</li>
        <li>Any loyalty points or rewards will be forfeited</li>
        <li>Saved addresses and wishlists will be removed</li>
      </ul>

      <p><strong>Note:</strong> We may retain certain transaction records as required by law for accounting and tax purposes.</p>
    `
  },
  '20': {
    id: 20,
    title: 'How do I manage my addresses?',
    category: 'Account & Profile',
    views: 543,
    helpful: 109,
    updated: 'February 1, 2026',
    content: `
      <h2>Managing Your Addresses</h2>
      <p>Save multiple delivery addresses to make checkout faster.</p>

      <h3>Adding a New Address</h3>
      <ol>
        <li>Log in to your <a href="/account">Account</a></li>
        <li>Navigate to <strong>Addresses</strong></li>
        <li>Click <strong>"Add New Address"</strong></li>
        <li>Fill in the full name, phone, address line, city, and region</li>
        <li>Save the address</li>
      </ol>

      <h3>Setting a Default Address</h3>
      <p>Click <strong>"Set as Default"</strong> on any saved address to make it your primary shipping address. This address will be pre-selected during checkout.</p>

      <h3>Editing or Removing Addresses</h3>
      <p>You can edit or delete any saved address from the Addresses section of your account. Changes take effect immediately.</p>
    `
  },
  '21': {
    id: 21,
    title: 'When will items be back in stock?',
    category: 'Products & Stock',
    views: 1987,
    helpful: 397,
    updated: 'February 1, 2026',
    content: `
      <h2>Out-of-Stock Items</h2>
      <p>We restock popular items regularly. Here's how to stay updated:</p>

      <h3>Getting Notified</h3>
      <ul>
        <li>Add the item to your <strong>Wishlist</strong> — we'll notify you when it's back</li>
        <li>Follow us on social media for restock announcements</li>
        <li>Message us on WhatsApp at ${contactPhone} to ask about a specific product</li>
      </ul>

      <h3>Restock Frequency</h3>
      <p>Most popular cosmetics and beauty products are restocked every 2–4 weeks. Limited edition or seasonal items may not be restocked once sold out.</p>

      <h3>Pre-Orders</h3>
      <p>For certain high-demand products, we may offer pre-orders. You'll be charged at checkout and notified when the item ships.</p>
    `
  },
  '22': {
    id: 22,
    title: 'How do I use the size guide?',
    category: 'Products & Stock',
    views: 876,
    helpful: 175,
    updated: 'February 1, 2026',
    content: `
      <h2>Size Guide</h2>
      <p>For products that come in different sizes (such as clothing or accessories), we provide a size guide on the product page.</p>

      <h3>How to Find It</h3>
      <ol>
        <li>Go to the product you're interested in</li>
        <li>Look for the <strong>"Size Guide"</strong> link near the size options</li>
        <li>A chart will show measurements for each size</li>
      </ol>

      <h3>Tips for Choosing the Right Size</h3>
      <ul>
        <li>Measure yourself and compare with the chart</li>
        <li>When in between sizes, we generally recommend going one size up</li>
        <li>Check the product description for specific fit notes (e.g., "runs small")</li>
      </ul>

      <p>If you're still unsure, send us a message on WhatsApp at ${contactPhone} with the product name and your measurements — we'll help you choose.</p>
    `
  },
  '23': {
    id: 23,
    title: 'Are your products authentic?',
    category: 'Products & Stock',
    views: 765,
    helpful: 153,
    updated: 'February 1, 2026',
    content: `
      <h2>Product Authenticity</h2>
      <p><strong>100% Authentic — Always.</strong></p>

      <h3>Our Promise</h3>
      <p>Every product sold on MultiMey Supplies is genuine and sourced directly from authorised distributors and brands. We do not sell counterfeit, replica, or imitation products.</p>

      <h3>How We Ensure Authenticity</h3>
      <ul>
        <li>We source directly from authorised manufacturers and distributors</li>
        <li>Every batch is inspected before listing on our store</li>
        <li>Products include original packaging, labels, and batch codes</li>
      </ul>

      <h3>Spot a Concern?</h3>
      <p>If you ever have a concern about the authenticity of a product you purchased from us, contact us at ${contactEmail} with photos and your order number. We take these reports seriously.</p>
    `
  },
  '24': {
    id: 24,
    title: 'Do you offer gift wrapping?',
    category: 'Products & Stock',
    views: 543,
    helpful: 109,
    updated: 'February 1, 2026',
    content: `
      <h2>Gift Wrapping</h2>
      <p>We do not currently offer gift wrapping as a standard option at checkout.</p>

      <h3>Alternative Options</h3>
      <ul>
        <li><strong>Gift orders:</strong> You can place an order with someone else's delivery address. We won't include pricing information in the package.</li>
        <li><strong>Special requests:</strong> For bulk or special orders, contact us on WhatsApp at ${contactPhone} and we may be able to arrange custom packaging.</li>
      </ul>

      <p>We're considering adding gift wrapping as a feature in the future. Stay tuned!</p>
    `
  },
  '25': {
    id: 25,
    title: 'How do I care for my product?',
    category: 'Products & Stock',
    views: 432,
    helpful: 87,
    updated: 'February 1, 2026',
    content: `
      <h2>Product Care Guide</h2>
      <p>Taking care of your products ensures they last longer and perform their best.</p>

      <h3>Cosmetics & Beauty Products</h3>
      <ul>
        <li>Store in a cool, dry place away from direct sunlight</li>
        <li>Close lids and caps tightly after use</li>
        <li>Check expiry dates and batch codes</li>
        <li>Clean brushes and applicators regularly</li>
        <li>Do not share products to maintain hygiene</li>
      </ul>

      <h3>Skincare Products</h3>
      <ul>
        <li>Patch test new products on a small area of skin first</li>
        <li>Follow the recommended usage instructions on the packaging</li>
        <li>Store serums and active ingredients in a cool environment</li>
      </ul>

      <h3>Accessories & Other Items</h3>
      <p>Refer to the product-specific care instructions included in the packaging. If you have questions about caring for a specific product, contact us at ${contactEmail}.</p>
    `
  },
  '26': {
    id: 26,
    title: 'How do I earn loyalty points?',
    category: 'Loyalty & Rewards',
    views: 2134,
    helpful: 427,
    updated: 'February 1, 2026',
    content: `
      <h2>Earning Loyalty Points</h2>
      <p>Our loyalty programme rewards you for shopping with us!</p>

      <h3>How It Works</h3>
      <ul>
        <li>Earn <strong>1 point for every GHS 10</strong> spent on purchases</li>
        <li>Points are automatically added to your account after each completed order</li>
        <li>Track your points balance in your <a href="/account">Account Dashboard</a></li>
      </ul>

      <h3>Ways to Earn</h3>
      <ul>
        <li><strong>Purchases:</strong> Every order earns you points</li>
        <li><strong>Account creation:</strong> Get bonus points when you create an account</li>
        <li><strong>Reviews:</strong> Leave a product review and earn extra points</li>
        <li><strong>Referrals:</strong> Refer a friend and earn bonus points when they make their first purchase</li>
      </ul>

      <h3>Redeeming Points</h3>
      <p><strong>100 points = GHS 10 discount</strong> on your next purchase. Points can be applied at checkout.</p>
    `
  },
  '27': {
    id: 27,
    title: 'How do I redeem my points?',
    category: 'Loyalty & Rewards',
    views: 1765,
    helpful: 353,
    updated: 'February 1, 2026',
    content: `
      <h2>Redeeming Your Points</h2>
      <p>Converting your loyalty points into savings is simple.</p>

      <h3>At Checkout</h3>
      <ol>
        <li>Add items to your cart and proceed to checkout</li>
        <li>Look for the <strong>"Apply Loyalty Points"</strong> option</li>
        <li>Choose how many points you'd like to redeem</li>
        <li>The discount will be applied to your order total</li>
      </ol>

      <h3>Conversion Rate</h3>
      <p><strong>100 points = GHS 10 discount</strong></p>

      <h3>Important Notes</h3>
      <ul>
        <li>You must have at least 100 points to redeem</li>
        <li>Points can be combined with coupon codes</li>
        <li>Points cannot be redeemed for cash</li>
        <li>Refunded orders will have the corresponding points deducted</li>
      </ul>
    `
  },
  '28': {
    id: 28,
    title: 'Do my points expire?',
    category: 'Loyalty & Rewards',
    views: 987,
    helpful: 198,
    updated: 'February 1, 2026',
    content: `
      <h2>Points Expiration</h2>
      <p>Yes, loyalty points do have an expiration policy to encourage regular use.</p>

      <h3>Expiration Rules</h3>
      <ul>
        <li>Points expire <strong>12 months</strong> after they are earned if not redeemed</li>
        <li>Making any purchase resets the expiration clock on all your points</li>
        <li>You'll receive a reminder email 30 days before your oldest points expire</li>
      </ul>

      <h3>Keeping Your Points Active</h3>
      <p>Simply make a purchase at least once every 12 months and all your points stay active. Even a small purchase keeps your entire balance safe.</p>

      <p>Check your points balance and expiration dates in your <a href="/account">Account Dashboard</a>.</p>
    `
  },
  '29': {
    id: 29,
    title: 'What are the loyalty tiers?',
    category: 'Loyalty & Rewards',
    views: 654,
    helpful: 131,
    updated: 'February 1, 2026',
    content: `
      <h2>Loyalty Tiers</h2>
      <p>Our loyalty programme has tiers that unlock better rewards as you shop more.</p>

      <h3>Tier Levels</h3>
      <ul>
        <li><strong>Bronze (0–499 points):</strong> Standard earning rate (1 point per GHS 10)</li>
        <li><strong>Silver (500–999 points):</strong> 1.5x earning rate + early access to sales</li>
        <li><strong>Gold (1,000+ points):</strong> 2x earning rate + exclusive offers + free shipping on orders over GHS 200</li>
      </ul>

      <h3>How Tiers Work</h3>
      <ul>
        <li>Your tier is based on total points earned (not redeemed) in the past 12 months</li>
        <li>Tiers are recalculated every month</li>
        <li>You'll be notified when you move up or down a tier</li>
      </ul>

      <p>View your current tier in your <a href="/account">Account Dashboard</a>.</p>
    `
  },
  '30': {
    id: 30,
    title: 'How does the referral program work?',
    category: 'Loyalty & Rewards',
    views: 543,
    helpful: 109,
    updated: 'February 1, 2026',
    content: `
      <h2>Referral Programme</h2>
      <p>Share the love and earn rewards when your friends shop with us!</p>

      <h3>How It Works</h3>
      <ol>
        <li>Find your unique referral link in your <a href="/account">Account Dashboard</a></li>
        <li>Share the link with friends via WhatsApp, social media, or email</li>
        <li>When your friend makes their first purchase using your link, you both earn bonus points</li>
      </ol>

      <h3>Rewards</h3>
      <ul>
        <li><strong>You earn:</strong> 50 bonus loyalty points</li>
        <li><strong>Your friend gets:</strong> 10% off their first order</li>
      </ul>

      <h3>Terms</h3>
      <ul>
        <li>There's no limit to how many friends you can refer</li>
        <li>Your friend must be a new customer (no existing account)</li>
        <li>Points are awarded after your friend's order is delivered</li>
        <li>Referral rewards cannot be combined with other promotions</li>
      </ul>

      <p>Start referring today and watch your points grow!</p>
    `
  }
});

export const relatedArticles = [
  { id: 7, title: 'What is your return policy?', category: 'Returns' },
  { id: 8, title: 'When will I get my refund?', category: 'Returns' },
  { id: 9, title: 'Can I exchange instead of return?', category: 'Returns' },
  { id: 10, title: 'How do I print a return label?', category: 'Returns' }
];
