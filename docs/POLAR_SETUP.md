# Polar.sh Integration Setup Guide

This guide will help you set up Polar.sh as an alternative payment provider alongside PayFast.

## What is Polar.sh?

Polar.sh is a platform for monetizing software products with subscriptions, payments, and customer management. It uses Stripe Connect for payment processing and provides:
- Global tax compliance (VAT, GST, sales tax)
- Subscription management
- Customer portal
- Webhook notifications
- API access

## Prerequisites

- Polar.sh account ([Sign up here](https://polar.sh/))
- Stripe Connect account (for payment processing)
- Environment variables configured

## Step 1: Create Polar.sh Account

1. Visit [Polar.sh](https://polar.sh/) and sign up
2. Create an organization
3. Complete organization setup

## Step 2: Set Up Products in Polar Dashboard

1. Navigate to Products in your Polar dashboard
2. Create products for each subscription plan:
   - **Starter Plan** (Monthly and Yearly)
   - **Professional Plan** (Monthly and Yearly)
3. Note down the Product IDs and Price IDs for each
4. Configure pricing:
   - Starter: R9/month or R90/year
   - Professional: R29/month or R290/year

## Step 3: Generate Access Token

1. Go to Settings > Developer Settings
2. Create an Organization Access Token (OAT)
3. Copy the token securely
4. Set appropriate scopes (read/write for subscriptions and payments)

## Step 4: Configure Webhooks

1. Go to Settings > Developer Settings > Webhooks
2. Add webhook endpoint:
   ```
   https://yourdomain.com/api/payments/polar/webhook
   ```
3. Select events to subscribe to:
   - `checkout.succeeded`
   - `subscription.created`
   - `subscription.updated`
   - `subscription.canceled`
4. Generate and copy webhook secret

## Step 5: Environment Variables

Add to your `.env.local`:

```env
# Polar.sh Configuration
POLAR_ACCESS_TOKEN="your-organization-access-token"
POLAR_WEBHOOK_SECRET="your-webhook-secret"
POLAR_SANDBOX="true" # Set to "false" for production
POLAR_ORGANIZATION_ID="your-organization-id"

# Polar Product/Price IDs (from Step 2)
POLAR_PRODUCT_STARTER_ID="prod_xxxxx"
POLAR_PRICE_STARTER_MONTHLY_ID="price_xxxxx"
POLAR_PRICE_STARTER_YEARLY_ID="price_xxxxx"
POLAR_PRODUCT_PROFESSIONAL_ID="prod_xxxxx"
POLAR_PRICE_PROFESSIONAL_MONTHLY_ID="price_xxxxx"
POLAR_PRICE_PROFESSIONAL_YEARLY_ID="price_xxxxx"
```

## Step 6: Set Up Stripe Connect

1. In Polar dashboard, go to Finance > Setup
2. Connect your Stripe account via Stripe Connect Express
3. Complete Stripe onboarding
4. Configure payout settings

## Step 7: Test Integration

### Sandbox Testing

1. Set `POLAR_SANDBOX="true"`
2. Use Polar sandbox environment: https://sandbox.polar.sh
3. Create test products in sandbox
4. Test checkout flow
5. Verify webhook processing

### Production Setup

1. Set `POLAR_SANDBOX="false"`
2. Use production Polar credentials
3. Ensure webhook URL is publicly accessible
4. Test with small amounts first

## API Integration

The system provides:

- **Polar Library** (`lib/payments/polar.ts`):
  - `createCheckoutSession()` - Create checkout
  - `getSubscription()` - Get subscription details
  - `cancelSubscription()` - Cancel subscription
  - `reactivateSubscription()` - Reactivate subscription
  - `verifyWebhookSignature()` - Verify webhooks

- **API Routes**:
  - `POST /api/payments/polar/initiate` - Initiate Polar checkout
  - `POST /api/payments/polar/webhook` - Webhook handler

- **React Hooks**:
  - `useInitiatePolarPayment()` - Initiate payment flow

## Payment Flow

1. User selects plan and payment provider (Polar)
2. System creates checkout session via Polar API
3. User redirected to Polar checkout page
4. User completes payment (processed by Stripe)
5. Polar sends webhook notification
6. System updates subscription status
7. User redirected back to billing page

## Webhook Events Handled

- `checkout.succeeded` - Payment completed
- `subscription.created` - New subscription
- `subscription.updated` - Subscription updated
- `subscription.canceled` - Subscription cancelled

## Advantages of Polar.sh

- **Global Tax Compliance**: Handles VAT, GST, sales tax automatically
- **Stripe Integration**: Uses Stripe Connect for payments
- **Customer Portal**: Built-in customer management
- **Developer-Friendly**: Clean API and good documentation
- **Open Source**: Self-hostable option available

## Comparison: PayFast vs Polar.sh

| Feature | PayFast | Polar.sh |
|---------|---------|----------|
| **Region** | South Africa | Global |
| **Payment Methods** | Cards, EFT, Instant EFT | Cards (via Stripe) |
| **Tax Compliance** | Manual | Automatic |
| **Subscription Management** | Basic | Advanced |
| **Customer Portal** | No | Yes |
| **API** | REST | REST |
| **Best For** | SA-focused businesses | Global SaaS products |

## Troubleshooting

### Webhook Not Receiving Events

1. Check webhook URL is publicly accessible
2. Verify webhook secret matches
3. Check Polar dashboard webhook logs
4. Ensure signature verification is working

### Checkout Not Working

1. Verify access token is valid
2. Check product/price IDs are correct
3. Ensure Stripe Connect is set up
4. Review Polar dashboard for errors

### Subscription Not Activating

1. Check webhook is being received
2. Verify webhook event handling
3. Review database for payment records
4. Check subscription status in Polar dashboard

## Support & Resources

- Polar Documentation: https://polar.sh/docs
- API Reference: https://polar.sh/docs/api-reference/introduction
- Polar GitHub: https://github.com/polarsource/polar
- Support: support@polar.sh

## Next Steps

1. Set up products in Polar dashboard
2. Configure environment variables
3. Test checkout flow in sandbox
4. Set up webhooks
5. Go live with production credentials

