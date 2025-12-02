# Payment & Subscription System Setup Guide

This guide will help you set up the PayFast payment gateway integration for handling subscriptions and payments in South Africa.

## Prerequisites

- PayFast merchant account ([Sign up here](https://www.payfast.co.za/))
- PostgreSQL database configured
- Environment variables configured

## Step 1: Create PayFast Account

1. Visit [PayFast](https://www.payfast.co.za/) and create a merchant account
2. Complete the merchant verification process
3. Navigate to Settings > Integration to get your credentials:
   - Merchant ID
   - Merchant Key
   - Passphrase (optional but recommended for security)

## Step 2: Environment Variables

Add the following to your `.env.local` file:

```env
# PayFast Configuration
PAYFAST_MERCHANT_ID="your-merchant-id"
PAYFAST_MERCHANT_KEY="your-merchant-key"
PAYFAST_PASSPHRASE="your-passphrase" # Optional but recommended
PAYFAST_SANDBOX="true" # Set to "false" for production

# App URL (for webhooks and redirects)
AUTH_URL="http://localhost:3028" # Development
NEXT_PUBLIC_APP_URL="http://localhost:3028" # Development
# For production, use your actual domain:
# AUTH_URL="https://yourdomain.com"
# NEXT_PUBLIC_APP_URL="https://yourdomain.com"
```

## Step 3: Database Migration

Run the Prisma migration to create payment and subscription tables:

```bash
# Generate Prisma client with new models
pnpm prisma generate

# Create and apply migration
pnpm prisma migrate dev --name add_payment_system
```

This will create:
- `user_subscriptions` table - Stores subscription records
- `payments` table - Stores payment records
- `transactions` table - Stores transaction history

## Step 4: Configure PayFast Webhooks

1. Log in to your PayFast merchant dashboard
2. Go to Settings > Integration
3. Set the ITN (Instant Transaction Notification) URL to:
   ```
   https://yourdomain.com/api/payments/webhook
   ```
4. Enable ITN notifications
5. Save your settings

## Step 5: Test the Integration

### Sandbox Testing

1. Set `PAYFAST_SANDBOX="true"` in your `.env.local`
2. Use PayFast test credentials (provided in sandbox mode)
3. Test cards:
   - **Success**: Use any valid card number with future expiry
   - **Decline**: Use card number `4000000000000002`

### Production Setup

1. Set `PAYFAST_SANDBOX="false"`
2. Use your production PayFast credentials
3. Ensure webhook URL is publicly accessible
4. Test with small amounts first

## Subscription Plans

The system supports the following subscription plans:

- **FREE**: R0/month - Basic features
- **STARTER**: R9/month or R90/year - For individuals
- **PROFESSIONAL**: R29/month or R290/year - For teams
- **ENTERPRISE**: Custom pricing - Contact sales

## Payment Flow

1. User selects a subscription plan
2. System creates a payment record
3. User is redirected to PayFast payment page
4. User completes payment on PayFast
5. PayFast sends webhook notification
6. System updates subscription status
7. User is redirected back to billing page

## Webhook Security

The system verifies PayFast webhooks using MD5 signature verification. Ensure your `PAYFAST_PASSPHRASE` is set for additional security.

## Subscription Management

Users can:
- Subscribe to plans (monthly or yearly)
- Cancel subscriptions (cancels at period end)
- Reactivate cancelled subscriptions
- View payment history
- See transaction details

## Troubleshooting

### Webhook Not Receiving Notifications

1. Check that your webhook URL is publicly accessible
2. Verify PayFast ITN settings in merchant dashboard
3. Check server logs for webhook errors
4. Ensure signature verification is working

### Payment Not Completing

1. Verify PayFast credentials are correct
2. Check sandbox vs production mode
3. Review payment status in PayFast dashboard
4. Check database for payment records

### Subscription Not Activating

1. Verify webhook is being received
2. Check payment status in database
3. Review subscription status
4. Check user subscription field

## Support

For PayFast support:
- Documentation: https://developers.payfast.co.za/
- Support: support@payfast.co.za
- Phone: +27 21 447 5696

## Security Best Practices

1. **Never commit credentials** to version control
2. **Use environment variables** for all sensitive data
3. **Enable passphrase** for signature verification
4. **Use HTTPS** in production
5. **Verify webhook signatures** before processing
6. **Log all transactions** for audit purposes
7. **Handle payment failures** gracefully
8. **Implement rate limiting** on webhook endpoint

## Next Steps

After setup:
1. Test the complete payment flow
2. Set up monitoring for webhooks
3. Configure email notifications for payments
4. Set up invoice generation (optional)
5. Implement subscription renewal reminders

