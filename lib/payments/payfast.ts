/**
 * PayFast Payment Gateway Integration
 * Documentation: https://developers.payfast.co.za/
 */

import crypto from "crypto"

export interface PayFastConfig {
  merchantId: string
  merchantKey: string
  passPhrase?: string
  sandbox: boolean
  returnUrl: string
  cancelUrl: string
  notifyUrl: string
}

export interface PayFastPaymentData {
  merchant_id: string
  merchant_key: string
  return_url: string
  cancel_url: string
  notify_url: string
  name_first?: string
  name_last?: string
  email_address: string
  cell_number?: string
  m_payment_id: string // Your internal payment ID
  amount: string // Amount in ZAR format (e.g., "100.00")
  item_name: string
  item_description?: string
  custom_int1?: string // Subscription ID
  custom_str1?: string // User ID
  custom_str2?: string // Plan type
  subscription_type?: number // 1 = subscription
  billing_date?: string // YYYY-MM-DD
  recurring_amount?: string
  frequency?: string // m = monthly, y = yearly
  cycles?: string // Number of cycles (0 = indefinite)
  signature?: string
}

export interface PayFastSubscriptionData {
  merchant_id: string
  merchant_key: string
  return_url: string
  cancel_url: string
  notify_url: string
  name_first?: string
  name_last?: string
  email_address: string
  cell_number?: string
  m_payment_id: string
  amount: string
  item_name: string
  item_description?: string
  subscription_type: number // 1 = subscription
  billing_date: string // YYYY-MM-DD
  recurring_amount: string
  frequency: string // m = monthly, y = yearly
  cycles: string // 0 = indefinite
  custom_str1?: string // User ID
  custom_str2?: string // Plan type
  signature?: string
}

export interface PayFastWebhookData {
  m_payment_id: string
  pf_payment_id: string
  payment_status: string
  item_name: string
  amount_gross: string
  amount_fee: string
  amount_net: string
  custom_str1?: string
  custom_str2?: string
  custom_int1?: string
  signature?: string
}

export class PayFast {
  private config: PayFastConfig
  private baseUrl: string

  constructor(config: PayFastConfig) {
    this.config = config
    this.baseUrl = config.sandbox
      ? "https://sandbox.payfast.co.za/eng/process"
      : "https://www.payfast.co.za/eng/process"
  }

  /**
   * Generate PayFast signature for payment data
   */
  generateSignature(data: Record<string, string>): string {
    // Remove empty values and signature
    const cleanData: Record<string, string> = {}
    for (const [key, value] of Object.entries(data)) {
      if (value && key !== "signature") {
        cleanData[key] = value
      }
    }

    // Sort alphabetically
    const sortedKeys = Object.keys(cleanData).sort()
    const paramString = sortedKeys
      .map((key) => `${key}=${encodeURIComponent(cleanData[key]).replace(/%20/g, "+")}`)
      .join("&")

    // Add passphrase if provided
    const stringToSign = this.config.passPhrase
      ? `${paramString}&passphrase=${encodeURIComponent(this.config.passPhrase)}`
      : paramString

    // Generate MD5 hash
    return crypto.createHash("md5").update(stringToSign).digest("hex")
  }

  /**
   * Verify PayFast webhook signature
   */
  verifySignature(data: PayFastWebhookData): boolean {
    const signature = data.signature
    if (!signature) return false

    // Create parameter string
    const paramString = Object.keys(data)
      .filter((key) => key !== "signature" && data[key as keyof PayFastWebhookData])
      .sort()
      .map((key) => {
        const value = data[key as keyof PayFastWebhookData]
        return `${key}=${encodeURIComponent(String(value)).replace(/%20/g, "+")}`
      })
      .join("&")

    // Add passphrase if provided
    const stringToSign = this.config.passPhrase
      ? `${paramString}&passphrase=${encodeURIComponent(this.config.passPhrase)}`
      : paramString

    // Generate MD5 hash
    const calculatedSignature = crypto.createHash("md5").update(stringToSign).digest("hex")

    return calculatedSignature === signature
  }

  /**
   * Create one-time payment data
   */
  createPaymentData(data: {
    userId: string
    email: string
    amount: number // Amount in ZAR cents
    itemName: string
    itemDescription?: string
    paymentId: string
    name?: string
  }): PayFastPaymentData {
    const amountZAR = (data.amount / 100).toFixed(2)
    const [firstName, ...lastNameParts] = (data.name || "").split(" ")

    const paymentData: PayFastPaymentData = {
      merchant_id: this.config.merchantId,
      merchant_key: this.config.merchantKey,
      return_url: this.config.returnUrl,
      cancel_url: this.config.cancelUrl,
      notify_url: this.config.notifyUrl,
      email_address: data.email,
      m_payment_id: data.paymentId,
      amount: amountZAR,
      item_name: data.itemName,
      item_description: data.itemDescription,
      custom_str1: data.userId,
    }

    if (firstName) {
      paymentData.name_first = firstName
      if (lastNameParts.length > 0) {
        paymentData.name_last = lastNameParts.join(" ")
      }
    }

    // Generate signature
    paymentData.signature = this.generateSignature(paymentData)

    return paymentData
  }

  /**
   * Create subscription payment data
   */
  createSubscriptionData(data: {
    userId: string
    email: string
    amount: number // Amount in ZAR cents
    itemName: string
    itemDescription?: string
    paymentId: string
    plan: string
    billingDate: Date
    frequency: "monthly" | "yearly"
    cycles?: number // 0 = indefinite
    name?: string
  }): PayFastSubscriptionData {
    const amountZAR = (data.amount / 100).toFixed(2)
    const [firstName, ...lastNameParts] = (data.name || "").split(" ")
    const frequency = data.frequency === "monthly" ? "m" : "y"
    const billingDate = data.billingDate.toISOString().split("T")[0] // YYYY-MM-DD

    const subscriptionData: PayFastSubscriptionData = {
      merchant_id: this.config.merchantId,
      merchant_key: this.config.merchantKey,
      return_url: this.config.returnUrl,
      cancel_url: this.config.cancelUrl,
      notify_url: this.config.notifyUrl,
      email_address: data.email,
      m_payment_id: data.paymentId,
      amount: amountZAR,
      item_name: data.itemName,
      item_description: data.itemDescription,
      subscription_type: 1,
      billing_date: billingDate,
      recurring_amount: amountZAR,
      frequency: frequency,
      cycles: String(data.cycles ?? 0),
      custom_str1: data.userId,
      custom_str2: data.plan,
    }

    if (firstName) {
      subscriptionData.name_first = firstName
      if (lastNameParts.length > 0) {
        subscriptionData.name_last = lastNameParts.join(" ")
      }
    }

    // Generate signature
    subscriptionData.signature = this.generateSignature(subscriptionData)

    return subscriptionData
  }

  /**
   * Get payment form URL
   */
  getPaymentUrl(): string {
    return this.baseUrl
  }

  /**
   * Format payment data as HTML form
   */
  createPaymentForm(data: PayFastPaymentData | PayFastSubscriptionData): string {
    const fields = Object.entries(data)
      .filter(([_, value]) => value !== undefined && value !== null)
      .map(([key, value]) => {
        const encodedValue = String(value).replace(/"/g, "&quot;")
        return `<input type="hidden" name="${key}" value="${encodedValue}">`
      })
      .join("\n")

    return `
      <form id="payfast-form" action="${this.baseUrl}" method="post">
        ${fields}
      </form>
      <script>
        document.getElementById('payfast-form').submit();
      </script>
    `
  }
}

/**
 * Initialize PayFast instance from environment variables
 */
export function initPayFast(): PayFast {
  const config: PayFastConfig = {
    merchantId: process.env.PAYFAST_MERCHANT_ID || "",
    merchantKey: process.env.PAYFAST_MERCHANT_KEY || "",
    passPhrase: process.env.PAYFAST_PASSPHRASE,
    sandbox: process.env.PAYFAST_SANDBOX === "true" || !process.env.PAYFAST_MERCHANT_ID,
    returnUrl: `${process.env.AUTH_URL || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3028"}/dashboard/billing?payment=success`,
    cancelUrl: `${process.env.AUTH_URL || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3028"}/dashboard/billing?payment=cancelled`,
    notifyUrl: `${process.env.AUTH_URL || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3028"}/api/payments/webhook`,
  }

  return new PayFast(config)
}


