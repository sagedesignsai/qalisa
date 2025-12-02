# Payment Providers Comparison: PayFast vs Polar.sh

This document compares the two payment providers integrated into the system.

## Overview

The system supports two payment providers:
1. **PayFast** - South African payment gateway
2. **Polar.sh** - Global SaaS monetization platform

## Feature Comparison

| Feature | PayFast | Polar.sh |
|---------|---------|----------|
| **Primary Market** | South Africa | Global |
| **Payment Methods** | Cards, EFT, Instant EFT, QR codes | Cards (via Stripe) |
| **Subscription Support** | ✅ Yes | ✅ Yes |
| **Recurring Billing** | ✅ Yes | ✅ Yes |
| **Tax Compliance** | Manual | ✅ Automatic (VAT, GST, sales tax) |
| **Customer Portal** | ❌ No | ✅ Yes |
| **API Quality** | Good | Excellent |
| **Documentation** | Good | Excellent |
| **Webhook Support** | ✅ Yes | ✅ Yes |
| **Sandbox Environment** | ✅ Yes | ✅ Yes |
| **Multi-Currency** | Limited (ZAR focus) | ✅ Yes (via Stripe) |
| **Setup Complexity** | Medium | Medium |
| **Transaction Fees** | ~2.9% + R2 | Stripe fees (~2.9% + R2) |

## Use Cases

### Choose PayFast When:
- Your primary market is South Africa
- You need local payment methods (EFT, Instant EFT)
- You want to support QR code payments
- You prefer a South African company
- You need quick setup for SA market

### Choose Polar.sh When:
- You're targeting global markets
- You need automatic tax compliance
- You want built-in customer portal
- You prefer Stripe's payment infrastructure
- You need advanced subscription management
- You want better developer experience

## Integration Details

### PayFast Integration
- **Library**: `lib/payments/payfast.ts`
- **API Routes**: `/api/payments/initiate`, `/api/payments/webhook`
- **Signature**: MD5 with optional passphrase
- **Redirect Flow**: HTML form submission
- **Webhook Format**: Form data

### Polar.sh Integration
- **Library**: `lib/payments/polar.ts`
- **API Routes**: `/api/payments/polar/initiate`, `/api/payments/polar/webhook`
- **Signature**: HMAC SHA256
- **Redirect Flow**: Direct URL redirect
- **Webhook Format**: JSON

## Pricing Comparison

### PayFast
- Transaction fee: ~2.9% + R2 per transaction
- Monthly fee: R0 (no monthly fee)
- Setup fee: R0

### Polar.sh (via Stripe)
- Transaction fee: ~2.9% + R2 per transaction (Stripe rates)
- Platform fee: Check Polar pricing
- Setup fee: R0

## Technical Differences

### Authentication
- **PayFast**: Merchant ID + Merchant Key + Passphrase
- **Polar**: Organization Access Token (OAuth 2.0)

### Webhook Verification
- **PayFast**: MD5 hash with passphrase
- **Polar**: HMAC SHA256 signature

### Payment Flow
- **PayFast**: HTML form → PayFast page → Webhook
- **Polar**: API call → Checkout URL → Webhook

## Recommendation

**For South African Market**: Use **PayFast**
- Better local payment method support
- Familiar to SA customers
- Lower barrier to entry

**For Global Market**: Use **Polar.sh**
- Better tax handling
- More features
- Better developer experience

**Best Practice**: Support both providers and let users choose, or automatically select based on user location.

## Migration Path

You can easily switch between providers:
1. Both use the same database schema
2. Both update the same subscription records
3. UI allows provider selection
4. Webhooks handle provider-specific logic

## Support

- **PayFast**: support@payfast.co.za, +27 21 447 5696
- **Polar**: support@polar.sh, https://polar.sh/docs

