"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Sparkles,
  BarChart3,
  ArrowRight,
  Zap,
  Shield,
  Code,
  TrendingUp,
  Users,
  Globe,
} from "lucide-react"
import { MarketingHeader } from "@/components/marketing/marketing-header"
import { MarketingFooter } from "@/components/marketing/marketing-footer"
import { AnimatedSection } from "@/components/marketing/animated-section"
import { AnimatedCard } from "@/components/marketing/animated-card"

const features = [
  {
    icon: Sparkles,
    title: "AI Chat",
    description:
      "Engage in intelligent conversations with advanced AI models. Get context-aware responses with reasoning and source citations.",
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description:
      "Track and visualize your data with interactive charts and comprehensive analytics tools.",
  },
  {
    icon: Code,
    title: "Developer API",
    description:
      "Comprehensive REST and GraphQL APIs. Integrate Qalisa into your existing applications seamlessly.",
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

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <MarketingHeader />
      <main className="flex-1">
      {/* Hero Section */}
        <section className="container mx-auto px-4 py-24 md:py-32">
          <div className="mx-auto max-w-4xl text-center">
            <AnimatedSection>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-muted px-4 py-2 text-sm">
                <Sparkles className="h-4 w-4 text-primary" />
                <span>AI-Powered Platform</span>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.1}>
              <h1 className="text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl">
                Build Intelligent Applications
          </h1>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <p className="mt-6 text-xl leading-8 text-muted-foreground max-w-2xl mx-auto">
                Qalisa is your AI-powered companion. Build intelligent applications with advanced AI
                capabilities—all in one platform.
          </p>
            </AnimatedSection>

            <AnimatedSection delay={0.3}>
              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button asChild size="lg" className="text-lg px-8">
              <Link href="/register">
                Get Started Free
                    <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
                <Button asChild variant="outline" size="lg" className="text-lg px-8">
              <Link href="/login">Sign In</Link>
            </Button>
          </div>
            </AnimatedSection>

            {/* Stats */}
            <AnimatedSection delay={0.4}>
              <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-3">
                {stats.map((stat) => (
                  <div key={stat.label} className="text-center">
                    <div className="text-4xl font-bold text-foreground">{stat.value}</div>
                    <div className="mt-2 text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                ))}
              </div>
            </AnimatedSection>
        </div>
      </section>

      {/* Features Section */}
        <section id="features" className="container mx-auto px-4 py-24 md:py-32">
          <AnimatedSection>
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Powerful AI Capabilities
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Powered by Google Gemini AI for intelligent, context-aware assistance
          </p>
        </div>
          </AnimatedSection>

          <div className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <AnimatedCard key={feature.title} delay={index * 0.1}>
                <Card className="h-full border transition-all hover:border-primary/50">
            <CardHeader>
                    <div className="mb-4 inline-flex items-center justify-center rounded-lg bg-primary/10 p-3">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                    <CardDescription className="mt-2">
                      {feature.description}
              </CardDescription>
            </CardHeader>
          </Card>
              </AnimatedCard>
            ))}
        </div>
      </section>

      {/* Benefits Section */}
        <section className="bg-muted/30 py-24 md:py-32">
        <div className="container mx-auto px-4">
            <AnimatedSection>
              <div className="mx-auto max-w-3xl text-center">
                <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Why Choose Qalisa?
            </h2>
                <p className="mt-4 text-lg text-muted-foreground">
                  Everything you need to build and scale your AI-powered applications
                </p>
              </div>
            </AnimatedSection>

            <div className="mx-auto mt-16 grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-2">
              {benefits.map((benefit, index) => (
                <AnimatedCard key={benefit.title} delay={index * 0.1}>
                  <div className="flex gap-4 rounded-lg border bg-background p-6 transition-all hover:border-primary/50">
                    <div className="shrink-0 rounded-lg bg-primary/10 p-3">
                      <benefit.icon className="h-5 w-5 text-primary" />
            </div>
              <div>
                      <h3 className="text-lg font-semibold">{benefit.title}</h3>
                      <p className="mt-2 text-sm text-muted-foreground">{benefit.description}</p>
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
            <div className="mx-auto max-w-3xl rounded-lg border bg-muted/30 p-12 text-center md:p-16">
              <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Ready to Get Started?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Create your account and start building with AI-powered tools.
          </p>
          <div className="mt-10">
                <Button asChild size="lg" className="text-lg px-8">
              <Link href="/register">
                Get Started Free
                    <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
          </AnimatedSection>
      </section>
      </main>
      <MarketingFooter />
    </div>
  )
}
