"use client"

import Link from "next/link"
import { motion } from "motion/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Check, ArrowRight, Zap } from "lucide-react"
import { AnimatedSection } from "@/components/marketing/animated-section"
import { AnimatedCard } from "@/components/marketing/animated-card"

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
  },
]

export default function PricingPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-background via-background to-muted/20">
        <div className="container relative mx-auto px-4 py-24 md:py-32">
          <AnimatedSection>
            <div className="mx-auto max-w-3xl text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="mb-6 inline-flex items-center gap-2 rounded-full border bg-muted/50 px-4 py-2 text-sm"
              >
                <Sparkles className="h-4 w-4 text-primary" />
                <span>Pricing</span>
              </motion.div>
              <h1 className="text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl">
                Simple, Transparent
                <br />
                <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
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
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-3">
          {plans.map((plan, index) => (
            <AnimatedCard key={plan.name} delay={index * 0.1}>
              <motion.div
                whileHover={{ y: -8 }}
                transition={{ duration: 0.2 }}
                className="h-full"
              >
                <Card
                  className={`relative h-full border-2 transition-all ${
                    plan.popular
                      ? "border-primary shadow-xl scale-105"
                      : "hover:border-primary/50 hover:shadow-lg"
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <Badge className="bg-primary text-primary-foreground">
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
                  <CardContent className="space-y-4">
                    <ul className="space-y-3">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-3">
                          <motion.div
                            initial={{ scale: 0 }}
                            whileInView={{ scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ type: "spring" }}
                          >
                            <Check className="h-5 w-5 flex-shrink-0 text-primary" />
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
                        className="w-full"
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
            <div className="mx-auto max-w-3xl">
              <h2 className="mb-12 text-center text-4xl font-bold">
                Frequently Asked Questions
              </h2>
              <div className="space-y-6">
                {[
                  {
                    q: "Can I change plans later?",
                    a: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.",
                  },
                  {
                    q: "What payment methods do you accept?",
                    a: "We accept all major credit cards, PayPal, and bank transfers for enterprise plans.",
                  },
                  {
                    q: "Is there a free trial?",
                    a: "Yes, all paid plans come with a 14-day free trial. No credit card required.",
                  },
                  {
                    q: "Do you offer refunds?",
                    a: "Yes, we offer a 30-day money-back guarantee for all paid plans.",
                  },
                ].map((faq, index) => (
                  <motion.div
                    key={faq.q}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="rounded-lg border bg-background p-6"
                  >
                    <h3 className="text-lg font-semibold">{faq.q}</h3>
                    <p className="mt-2 text-muted-foreground">{faq.a}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  )
}

