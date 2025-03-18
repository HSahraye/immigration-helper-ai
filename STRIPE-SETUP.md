# Stripe Setup Guide for Immigration Helper AI

This guide will help you set up your Stripe account for processing subscriptions for the Immigration Helper AI application.

## 1. Create a Stripe Account

If you don't already have a Stripe account:
1. Go to [https://dashboard.stripe.com/register](https://dashboard.stripe.com/register)
2. Fill out the registration form
3. Verify your email address

## 2. Get Your API Keys

1. Go to [https://dashboard.stripe.com/test/apikeys](https://dashboard.stripe.com/test/apikeys)
2. Copy your **Publishable key** that starts with `pk_test_`
3. Copy your **Secret key** that starts with `sk_test_`
4. Add these to your `.env.local` file:
   ```
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
   STRIPE_SECRET_KEY=sk_test_your_key_here
   ```

## 3. Create Products and Prices

1. Go to [https://dashboard.stripe.com/test/products](https://dashboard.stripe.com/test/products)
2. Click **Add Product**

### Basic Plan
1. Name: "Basic Plan"
2. Description: "For individuals seeking basic immigration guidance"
3. Pricing:
   - $9.99 per month
   - Recurring
   - Set billing period to "Monthly"
4. Click **Save Product**
5. Copy the **Price ID** that starts with `price_`
6. Add it to your `.env.local` file: `STRIPE_BASIC_PRICE_ID=price_your_basic_id_here`

### Professional Plan
1. Click **Add Product** again
2. Name: "Professional Plan"
3. Description: "For those needing comprehensive immigration assistance"
4. Pricing:
   - $19.99 per month
   - Recurring
   - Set billing period to "Monthly"
5. Click **Save Product**
6. Copy the **Price ID** that starts with `price_`
7. Add it to your `.env.local` file: `STRIPE_PROFESSIONAL_PRICE_ID=price_your_pro_id_here`

## 4. Set Up Webhook Endpoint

1. In your terminal, make sure you have the Stripe CLI installed and you're logged in:
   ```
   stripe login
   ```

2. Start the webhook forwarding:
   ```
   stripe listen --forward-to http://localhost:3000/api/webhook
   ```

3. Copy the webhook signing secret that appears in the terminal output:
   ```
   Ready! Your webhook signing secret is whsec_abc123...
   ```

4. Add this secret to your `.env.local` file:
   ```
   STRIPE_WEBHOOK_SECRET=whsec_your_secret_here
   ```

## 5. Test the Integration

1. Start your application:
   ```
   npm run dev
   ```

2. Try the subscription flow:
   - Browse to your site
   - Select a subscription plan
   - Complete checkout using a test card number:
     - Success: 4242 4242 4242 4242
     - Authentication Required: 4000 0025 0000 3155
     - Decline: 4000 0000 0000 9995
   - Use any future expiration date and any 3-digit CVC

3. Check the Stripe dashboard to verify the subscription was created:
   [https://dashboard.stripe.com/test/subscriptions](https://dashboard.stripe.com/test/subscriptions)

## Troubleshooting

- **Invalid API Key**: Make sure you've copied the full API key including the `sk_test_` prefix
- **Webhook Errors**: Verify the webhook secret is correctly copied to your `.env.local` file
- **Product/Price ID Issues**: Double-check that you've copied the Price IDs correctly
- **Test Mode**: Ensure you're using test credentials from the Stripe dashboard

For more information, visit the [Stripe API documentation](https://stripe.com/docs/api). 