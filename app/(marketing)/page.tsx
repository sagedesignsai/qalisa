"use client"

import Link from "next/link"
import { motion } from "motion/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  FileText,
  Sparkles,
  BarChart3,
  ArrowRight,
  Check,
  Zap,
  Shield,
  Code,
} from "lucide-react"
import { AnimatedSection } from "@/components/marketing/animated-section"
import { AnimatedCard } from "@/components/marketing/animated-card"

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-background via-background to-muted/20">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="container relative mx-auto px-4 py-24 md:py-32">
          <div className="mx-auto max-w-4xl text-center">
            <AnimatedSection>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="mb-6 inline-flex items-center gap-2 rounded-full border bg-muted/50 px-4 py-2 text-sm"
              >
                <Sparkles className="h-4 w-4 text-primary" />
                <span>AI-Powered Platform</span>
              </motion.div>
            </AnimatedSection>

            <AnimatedSection delay={0.1}>
              <h1 className="text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl">
                Build Intelligent
                <br />
                <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  Applications
                </span>
              </h1>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <p className="mt-6 text-xl leading-8 text-muted-foreground sm:text-2xl">
                Qalisa is your AI-powered companion. Build intelligent applications with
                advanced AI capabilities—all in one platform.
              </p>
            </AnimatedSection>

            <AnimatedSection delay={0.3}>
              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button asChild size="lg" className="text-lg px-8 py-6">
                    <Link href="/register">
                      Get Started Free
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6">
                    <Link href="/login">Sign In</Link>
                  </Button>
                </motion.div>
              </div>
            </AnimatedSection>

            {/* Floating Icons */}
            <div className="mt-16 flex items-center justify-center gap-8 opacity-60">
              {[Sparkles, Zap, Code, Shield].map((Icon, index) => (
                <motion.div
                  key={index}
                  animate={{
                    y: [0, -10, 0],
                  }}
                  transition={{
                    duration: 2 + index * 0.5,
                    repeat: Infinity,
                    delay: index * 0.3,
                  }}
                >
                  <Icon className="h-8 w-8 text-primary" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-24">
        <AnimatedSection>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Powerful AI Capabilities
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Powered by Google Gemini AI for intelligent, context-aware assistance
            </p>
          </div>
        </AnimatedSection>

        <div className="mx-auto mt-16 grid max-w-6xl grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatedCard delay={0.1}>
            <Card className="h-full border-2 transition-all hover:border-primary/50 hover:shadow-lg">
              <CardHeader>
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className="mb-4 inline-block"
                >
                  <Sparkles className="h-12 w-12 text-primary" />
                </motion.div>
                <CardTitle className="text-2xl">AI Chat</CardTitle>
                <CardDescription className="text-base">
                  Engage in intelligent conversations with advanced AI models. Get context-aware
                  responses with reasoning and source citations.
                </CardDescription>
              </CardHeader>
            </Card>
          </AnimatedCard>

          <AnimatedCard delay={0.2}>
            <Card className="h-full border-2 transition-all hover:border-primary/50 hover:shadow-lg">
              <CardHeader>
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className="mb-4 inline-block"
                >
                  <BarChart3 className="h-12 w-12 text-primary" />
                </motion.div>
                <CardTitle className="text-2xl">Analytics Dashboard</CardTitle>
                <CardDescription className="text-base">
                  Track and visualize your data with interactive charts and comprehensive
                  analytics tools.
                </CardDescription>
              </CardHeader>
            </Card>
          </AnimatedCard>

          <AnimatedCard delay={0.3}>
            <Card className="h-full border-2 transition-all hover:border-primary/50 hover:shadow-lg">
              <CardHeader>
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className="mb-4 inline-block"
                >
                  <FileText className="h-12 w-12 text-primary" />
                </motion.div>
                <CardTitle className="text-2xl">Customizable</CardTitle>
                <CardDescription className="text-base">
                  Build your own features and workflows. Extend the platform with custom
                  integrations and tools.
                </CardDescription>
              </CardHeader>
            </Card>
          </AnimatedCard>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="pricing" className="bg-muted/50 py-24">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
                Why Choose Qalisa?
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Everything you need to build and scale your AI-powered applications
              </p>
            </div>
          </AnimatedSection>

          <div className="mx-auto mt-16 grid max-w-4xl grid-cols-1 gap-8 md:grid-cols-2">
            {[
              {
                icon: Zap,
                title: "AI-Powered",
                description:
                  "Powered by Google Gemini AI for intelligent, context-aware assistance.",
              },
              {
                icon: Sparkles,
                title: "Easy to Use",
                description:
                  "Intuitive interface designed for users of all technical levels.",
              },
              {
                icon: Code,
                title: "Extensible",
                description:
                  "Build custom features and integrate with your existing tools and workflows.",
              },
              {
                icon: Shield,
                title: "Open Source",
                description:
                  "Fully customizable boilerplate ready for your specific use case.",
              },
            ].map((benefit, index) => (
              <AnimatedCard key={benefit.title} delay={index * 0.1}>
                <div className="flex gap-4 rounded-lg border bg-background p-6 transition-all hover:shadow-md">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="flex-shrink-0"
                  >
                    <benefit.icon className="h-8 w-8 text-primary" />
                  </motion.div>
                  <div>
                    <h3 className="text-xl font-semibold">{benefit.title}</h3>
                    <p className="mt-2 text-muted-foreground">{benefit.description}</p>
                  </div>
                </div>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-24">
        <AnimatedSection>
          <div className="mx-auto max-w-3xl rounded-2xl border bg-gradient-to-br from-primary/10 via-background to-background p-12 text-center">
            <motion.div
              animate={{
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="mb-6 inline-block"
            >
              <Sparkles className="h-16 w-16 text-primary" />
            </motion.div>
            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Ready to Get Started?
            </h2>
            <p className="mt-4 text-xl text-muted-foreground">
              Create your account and start building with AI-powered tools.
            </p>
            <div className="mt-10">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button asChild size="lg" className="text-lg px-8 py-6">
                  <Link href="/register">
                    Get Started Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </motion.div>
            </div>
          </div>
        </AnimatedSection>
      </section>
    </>
  )
}

