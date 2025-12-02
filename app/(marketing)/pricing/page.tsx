"use client"

import Link from "next/link"
import { motion } from "motion/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Check, ArrowRight, Zap, HelpCircle } from "lucide-react"
import { AnimatedSection } from "@/components/marketing/animated-section"
import { AnimatedCard } from "@/components/marketing/animated-card"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for getting started",
    features: [
      "Up to 1,000 API calls/month",
      "Basic AI chat",
      "Community support",
      "5 projects",
      "Basic analytics",
    ],
    cta: "Get Started",
    href: "/register",
    popular: false,
    gradient: "from-gray-500 to-gray-600",
  },
  {
    name: "Starter",
    price: "$29",
    period: "per month",
    description: "For growing teams",
    features: [
      "Up to 50,000 API calls/month",
      "Advanced AI chat",
      "Priority support",
      "Unlimited projects",
      "Advanced analytics",
      "Custom integrations",
      "Team collaboration",
    ],
    cta: "Start Free Trial",
    href: "/register",
    popular: true,
    gradient: "from-primary to-primary/80",
  },
  {
    name: "Professional",
    price: "$99",
    period: "per month",
    description: "For power users",
    features: [
      "Up to 500,000 API calls/month",
      "Premium AI models",
      "24/7 priority support",
      "Unlimited projects",
      "Enterprise analytics",
      "Custom integrations",
      "Advanced team features",
      "Dedicated account manager",
    ],
    cta: "Contact Sales",
    href: "/contact",
    popular: false,
    gradient: "from-purple-500 to-pink-500",
  },
]

const faqs = [
  {
    q: "Can I change plans later?",
    a: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate the billing accordingly.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept all major credit cards, PayPal, and bank transfers for enterprise plans. All payments are processed securely through Stripe.",
  },
  {
    q: "Is there a free trial?",
    a: "Yes, all paid plans come with a 14-day free trial. No credit card required. You can cancel anytime during the trial period.",
  },
  {
    q: "Do you offer refunds?",
    a: "Yes, we offer a 30-day money-back guarantee for all paid plans. If you're not satisfied, contact us for a full refund.",
  },
  {
    q: "What happens if I exceed my API limit?",
    a: "We'll notify you when you're approaching your limit. You can upgrade your plan or purchase additional API credits as needed.",
  },
  {
    q: "Do you offer discounts for annual plans?",
    a: "Yes! Annual plans come with a 20% discount. Contact our sales team for enterprise pricing and custom plans.",
  },
]

export default function PricingPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-background via-background to-muted/30">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/20 blur-3xl" />
        </div>
        <div className="container relative mx-auto px-4 py-24 md:py-32">
          <AnimatedSection>
            <div className="mx-auto max-w-4xl text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="mb-8 inline-flex items-center gap-2 rounded-full border bg-muted/50 px-4 py-2 text-sm backdrop-blur-sm"
              >
                <Sparkles className="h-4 w-4 text-primary" />
                <span>Pricing</span>
              </motion.div>
              <h1 className="text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl">
                Simple, Transparent
                <br />
                <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                  Pricing
                </span>
              </h1>
              <p className="mt-6 text-xl leading-8 text-muted-foreground sm:text-2xl">
                Choose the plan that's right for you. Upgrade or downgrade at any time.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="container mx-auto px-4 py-24">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-3">
          {plans.map((plan, index) => (
            <AnimatedCard key={plan.name} delay={index * 0.1} scaleOnHover>
              <motion.div
                whileHover={{ y: plan.popular ? -12 : -8 }}
                transition={{ duration: 0.2 }}
                className="h-full"
              >
                <Card
                  className={`relative h-full border-2 transition-all ${
                    plan.popular
                      ? "border-primary shadow-xl scale-105 bg-gradient-to-br from-primary/5 to-background"
                      : "hover:border-primary/50 hover:shadow-lg"
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <Badge className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-lg">
                        <Zap className="mr-1 h-3 w-3" />
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="text-3xl">{plan.name}</CardTitle>
                    <div className="mt-4">
                      <span className="text-5xl font-bold">{plan.price}</span>
                      <span className="text-muted-foreground">/{plan.period}</span>
                    </div>
                    <CardDescription className="mt-2 text-base">
                      {plan.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <ul className="space-y-3">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-3">
                          <motion.div
                            initial={{ scale: 0 }}
                            whileInView={{ scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ type: "spring" }}
                            className="mt-0.5 flex-shrink-0"
                          >
                            <Check className="h-5 w-5 text-primary" />
                          </motion.div>
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="pt-4"
                    >
                      <Button
                        asChild
                        className={`w-full ${
                          plan.popular
                            ? "bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg shadow-primary/25"
                            : ""
                        }`}
                        variant={plan.popular ? "default" : "outline"}
                        size="lg"
                      >
                        <Link href={plan.href}>
                          {plan.cta}
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            </AnimatedCard>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-muted/50 py-24">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="mx-auto max-w-4xl">
              <div className="mb-12 text-center">
                <div className="mb-4 inline-flex items-center justify-center rounded-full bg-primary/10 p-3">
                  <HelpCircle className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-4xl font-bold sm:text-5xl">Frequently Asked Questions</h2>
                <p className="mt-4 text-lg text-muted-foreground">
                  Everything you need to know about our pricing
                </p>
              </div>
              <Accordion type="single" collapsible className="w-full space-y-4">
                {faqs.map((faq, index) => (
                  <motion.div
                    key={faq.q}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <AccordionItem
                      value={`item-${index}`}
                      className="rounded-lg border bg-background px-6"
                    >
                      <AccordionTrigger className="text-left font-semibold hover:no-underline">
                        {faq.q}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        {faq.a}
                      </AccordionContent>
                    </AccordionItem>
                  </motion.div>
                ))}
              </Accordion>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  )
}

