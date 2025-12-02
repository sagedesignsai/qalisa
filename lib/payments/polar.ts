/**
 * Polar.sh Integration using Official SDK
 * Documentation: https://polar.sh/docs/api-reference/introduction
 * 
 * Polar.sh is a platform for monetizing software products with subscriptions,
 * payments, and customer management. It uses Stripe Connect for payment processing.
 */

import { Polar as PolarSDK } from "@polar-sh/sdk"
import crypto from "crypto"

export interface PolarConfig {
  accessToken: string
  webhookSecret?: string
  server: "production" | "sandbox"
  organizationId?: string
}

// Re-export types from SDK for convenience
export type PolarProduct = any // Will use SDK types
export type PolarPrice = any // Will use SDK types
export type PolarSubscription = any // Will use SDK types
export type PolarWebhookEvent = any // Will use SDK types

export class Polar {
  private sdk: PolarSDK
  private config: PolarConfig

  constructor(config: PolarConfig) {
    this.config = config
    this.sdk = new PolarSDK({
      accessToken: config.accessToken,
      server: config.server === "sandbox" ? "sandbox" : "production",
    })
  }

  /**
   * Verify webhook signature
   */
  verifyWebhookSignature(
    payload: string,
    signature: string,
    secret: string
  ): boolean {
    // Polar uses HMAC SHA256 for webhook signatures
    
    // Extract signature from header (format: "sha256=...")
    const signatureValue = signature.startsWith("sha256=")
      ? signature.substring(7)
      : signature
    
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(payload)
      .digest("hex")

    // Use timing-safe comparison to prevent timing attacks
    try {
      return crypto.timingSafeEqual(
        Buffer.from(signatureValue, "hex"),
        Buffer.from(expectedSignature, "hex")
      )
    } catch {
      return false
    }
  }

  /**
   * Get products
   */
  async getProducts(): Promise<PolarProduct[]> {
    try {
      const response = await this.sdk.products.list({})
      return (response as any).items || []
    } catch (error) {
      console.error("Error fetching products:", error)
      throw error
    }
  }

  /**
   * Get product by ID
   */
  async getProduct(productId: string): Promise<PolarProduct> {
    try {
      return await (this.sdk.products as any).get({ id: productId })
    } catch (error) {
      console.error("Error fetching product:", error)
      throw error
    }
  }

  /**
   * Create checkout session
   */
  async createCheckoutSession(data: {
    productId: string
    priceId: string
    successUrl: string
    customerEmail?: string
    customerId?: string
    metadata?: Record<string, string>
  }): Promise<{ url: string; id: string }> {
    try {
      const checkout = await (this.sdk.checkouts as any).create({
        productId: data.productId,
        priceId: data.priceId,
        successUrl: data.successUrl,
        customerEmail: data.customerEmail,
        customerId: data.customerId,
        metadata: data.metadata,
      })

      return {
        url: checkout?.url || checkout?.checkout_url || "",
        id: checkout?.id || "",
      }
    } catch (error) {
      console.error("Error creating checkout:", error)
      throw error
    }
  }

  /**
   * Get subscription by ID
   */
  async getSubscription(subscriptionId: string): Promise<PolarSubscription> {
    try {
      return await (this.sdk.subscriptions as any).get({ id: subscriptionId })
    } catch (error) {
      console.error("Error fetching subscription:", error)
      throw error
    }
  }

  /**
   * Cancel subscription
   */
  async cancelSubscription(
    subscriptionId: string,
    cancelAtPeriodEnd: boolean = true
  ): Promise<PolarSubscription> {
    try {
      return await (this.sdk.subscriptions as any).update({
        id: subscriptionId,
        cancelAtPeriodEnd,
      })
    } catch (error) {
      console.error("Error cancelling subscription:", error)
      throw error
    }
  }

  /**
   * Reactivate subscription
   */
  async reactivateSubscription(
    subscriptionId: string
  ): Promise<PolarSubscription> {
    try {
      return await (this.sdk.subscriptions as any).update({
        id: subscriptionId,
        cancelAtPeriodEnd: false,
      })
    } catch (error) {
      console.error("Error reactivating subscription:", error)
      throw error
    }
  }

  /**
   * Get customer subscriptions
   */
  async getCustomerSubscriptions(
    customerId: string
  ): Promise<PolarSubscription[]> {
    try {
      const response = await (this.sdk.subscriptions as any).list({
        customerId,
      })
      return (response as any).items || []
    } catch (error) {
      console.error("Error fetching customer subscriptions:", error)
      throw error
    }
  }

  /**
   * Create customer session for customer portal
   */
  async createCustomerSession(customerId: string): Promise<{ url: string }> {
    try {
      const session = await (this.sdk.customerSessions as any).create({
        customerId,
      })
      return { url: session?.url || session?.session_url || "" }
    } catch (error) {
      console.error("Error creating customer session:", error)
      throw error
    }
  }
}

/**
 * Initialize Polar instance from environment variables
 */
export function initPolar(): Polar {
  const config: PolarConfig = {
    accessToken: process.env.POLAR_ACCESS_TOKEN || "",
    webhookSecret: process.env.POLAR_WEBHOOK_SECRET,
    server:
      process.env.POLAR_SANDBOX === "true" || !process.env.POLAR_ACCESS_TOKEN
        ? "sandbox"
        : "production",
    organizationId: process.env.POLAR_ORGANIZATION_ID,
  }

  if (!config.accessToken) {
    throw new Error("POLAR_ACCESS_TOKEN environment variable is required")
  }

  return new Polar(config)
}

