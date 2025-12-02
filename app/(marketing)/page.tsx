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
  Play,
  TrendingUp,
  Users,
  Globe,
} from "lucide-react"
import { AnimatedSection } from "@/components/marketing/animated-section"
import { AnimatedCard } from "@/components/marketing/animated-card"

const features = [
  {
    icon: Sparkles,
    title: "AI Chat",
    description:
      "Engage in intelligent conversations with advanced AI models. Get context-aware responses with reasoning and source citations.",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description:
      "Track and visualize your data with interactive charts and comprehensive analytics tools.",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    icon: Code,
    title: "Developer API",
    description:
      "Comprehensive REST and GraphQL APIs. Integrate Qalisa into your existing applications seamlessly.",
    gradient: "from-green-500 to-emerald-500",
  },
]

const benefits = [
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Built for performance with optimized algorithms and infrastructure.",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "Bank-level security with encryption, authentication, and authorization.",
  },
  {
    icon: Globe,
    title: "Global Scale",
    description: "Built for scale with global CDN and edge computing capabilities.",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description: "Work together seamlessly with real-time collaboration features.",
  },
]

const stats = [
  { value: "10K+", label: "Active Users", icon: Users },
  { value: "50M+", label: "API Calls", icon: TrendingUp },
  { value: "99.9%", label: "Uptime", icon: Shield },
]

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-background via-background to-muted/30">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
        </div>

        <div className="container relative mx-auto px-4 py-24 md:py-32 lg:py-40">
          <div className="mx-auto max-w-5xl text-center">
            <AnimatedSection>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="mb-8 inline-flex items-center gap-2 rounded-full border bg-muted/50 px-4 py-2 text-sm backdrop-blur-sm"
              >
                <Sparkles className="h-4 w-4 text-primary" />
                <span>AI-Powered Platform</span>
                <motion.span
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="ml-2 h-2 w-2 rounded-full bg-primary"
                />
              </motion.div>
            </AnimatedSection>

            <AnimatedSection delay={0.1}>
              <h1 className="text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">
                Build Intelligent
                <br />
                <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                  Applications
                </span>
              </h1>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <p className="mt-6 text-xl leading-8 text-muted-foreground sm:text-2xl max-w-3xl mx-auto">
                Qalisa is your AI-powered companion. Build intelligent applications with advanced AI
                capabilities—all in one platform.
              </p>
            </AnimatedSection>

            <AnimatedSection delay={0.3}>
              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    asChild
                    size="lg"
                    className="text-lg px-8 py-6 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg shadow-primary/25"
                  >
                    <Link href="/register">
                      Get Started Free
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="text-lg px-8 py-6 border-2"
                  >
                    <Link href="/login">
                      <Play className="mr-2 h-5 w-5" />
                      Watch Demo
                    </Link>
                  </Button>
                </motion.div>
              </div>
            </AnimatedSection>

            {/* Stats */}
            <AnimatedSection delay={0.4}>
              <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-3">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="text-center"
                  >
                    <div className="inline-flex items-center justify-center rounded-full bg-primary/10 p-3 mb-4">
                      <stat.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="text-3xl font-bold text-foreground">{stat.value}</div>
                    <div className="mt-1 text-sm text-muted-foreground">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-24 md:py-32">
        <AnimatedSection>
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Powerful AI Capabilities
            </h2>
            <p className="mt-4 text-lg text-muted-foreground sm:text-xl">
              Powered by Google Gemini AI for intelligent, context-aware assistance
            </p>
          </div>
        </AnimatedSection>

        <div className="mx-auto mt-16 grid max-w-6xl grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <AnimatedCard key={feature.title} delay={index * 0.1} scaleOnHover>
              <Card className="h-full border-2 transition-all hover:border-primary/50 hover:shadow-xl group">
                <CardHeader>
                  <motion.div
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                    className={`mb-4 inline-flex items-center justify-center rounded-xl bg-gradient-to-br ${feature.gradient} p-4 text-white shadow-lg`}
                  >
                    <feature.icon className="h-8 w-8" />
                  </motion.div>
                  <CardTitle className="text-2xl group-hover:text-primary transition-colors">
                    {feature.title}
                  </CardTitle>
                  <CardDescription className="text-base mt-2">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            </AnimatedCard>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-muted/50 py-24 md:py-32">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                Why Choose Qalisa?
              </h2>
              <p className="mt-4 text-lg text-muted-foreground sm:text-xl">
                Everything you need to build and scale your AI-powered applications
              </p>
            </div>
          </AnimatedSection>

          <div className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2">
            {benefits.map((benefit, index) => (
              <AnimatedCard key={benefit.title} delay={index * 0.1}>
                <div className="group flex gap-4 rounded-xl border bg-background p-6 transition-all hover:border-primary/50 hover:shadow-lg">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="flex-shrink-0 rounded-lg bg-primary/10 p-3 group-hover:bg-primary/20 transition-colors"
                  >
                    <benefit.icon className="h-6 w-6 text-primary" />
                  </motion.div>
                  <div>
                    <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                      {benefit.title}
                    </h3>
                    <p className="mt-2 text-muted-foreground">{benefit.description}</p>
                  </div>
                </div>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-24 md:py-32">
        <AnimatedSection>
          <div className="mx-auto max-w-4xl rounded-2xl border-2 bg-gradient-to-br from-primary/10 via-background to-background p-12 text-center shadow-2xl md:p-16">
            <motion.div
              animate={{
                scale: [1, 1.05, 1],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="mb-6 inline-block"
            >
              <div className="rounded-full bg-gradient-to-br from-primary to-primary/60 p-4 shadow-lg">
                <Sparkles className="h-12 w-12 text-primary-foreground" />
              </div>
            </motion.div>
            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Ready to Get Started?
            </h2>
            <p className="mt-4 text-xl text-muted-foreground">
              Create your account and start building with AI-powered tools.
            </p>
            <div className="mt-10">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  asChild
                  size="lg"
                  className="text-lg px-8 py-6 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg shadow-primary/25"
                >
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

