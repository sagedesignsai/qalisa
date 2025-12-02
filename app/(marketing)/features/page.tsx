"use client"

import { motion } from "motion/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Sparkles,
  BarChart3,
  FileText,
  Zap,
  Shield,
  Code,
  Brain,
  Database,
  Lock,
  Globe,
  Workflow,
  MessageSquare,
} from "lucide-react"
import { AnimatedSection } from "@/components/marketing/animated-section"
import { AnimatedCard } from "@/components/marketing/animated-card"

const features = [
  {
    icon: Sparkles,
    title: "AI Chat Interface",
    description:
      "Engage in intelligent conversations with advanced AI models. Get context-aware responses with reasoning and source citations.",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description:
      "Track and visualize your data with interactive charts and comprehensive analytics tools. Make data-driven decisions.",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: Brain,
    title: "Smart Reasoning",
    description:
      "Advanced AI reasoning capabilities that understand context and provide intelligent insights for your workflows.",
    color: "from-green-500 to-emerald-500",
  },
  {
    icon: Database,
    title: "Data Management",
    description:
      "Efficient data storage and retrieval with powerful query capabilities. Manage your data with ease.",
    color: "from-orange-500 to-red-500",
  },
  {
    icon: Lock,
    title: "Enterprise Security",
    description:
      "Bank-level security with encryption, authentication, and authorization. Your data is safe with us.",
    color: "from-indigo-500 to-purple-500",
  },
  {
    icon: Globe,
    title: "Global Scale",
    description:
      "Built for scale with global CDN and edge computing. Serve users worldwide with low latency.",
    color: "from-teal-500 to-blue-500",
  },
  {
    icon: Workflow,
    title: "Workflow Automation",
    description:
      "Automate repetitive tasks and create complex workflows with our visual workflow builder.",
    color: "from-rose-500 to-pink-500",
  },
  {
    icon: MessageSquare,
    title: "Real-time Collaboration",
    description:
      "Work together with your team in real-time. Share insights, collaborate on projects, and stay in sync.",
    color: "from-amber-500 to-orange-500",
  },
  {
    icon: Code,
    title: "Developer API",
    description:
      "Comprehensive REST and GraphQL APIs. Integrate Qalisa into your existing applications seamlessly.",
    color: "from-violet-500 to-purple-500",
  },
]

export default function FeaturesPage() {
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
                <span>Features</span>
              </motion.div>
              <h1 className="text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl">
                Everything You Need
                <br />
                <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  To Build & Scale
                </span>
              </h1>
              <p className="mt-6 text-xl leading-8 text-muted-foreground sm:text-2xl">
                Powerful features designed to help you build intelligent applications faster
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-24">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <AnimatedCard key={feature.title} delay={index * 0.1}>
              <Card className="group relative h-full overflow-hidden border-2 transition-all hover:border-primary/50 hover:shadow-xl">
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 transition-opacity duration-300 group-hover:opacity-10`}
                />
                <CardHeader className="relative">
                  <motion.div
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                    className="mb-4 inline-block"
                  >
                    <div
                      className={`rounded-lg bg-gradient-to-br ${feature.color} p-3 text-white`}
                    >
                      <feature.icon className="h-6 w-6" />
                    </div>
                  </motion.div>
                  <CardTitle className="text-2xl">{feature.title}</CardTitle>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            </AnimatedCard>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-muted/50 py-24">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="mx-auto max-w-4xl">
              <h2 className="mb-12 text-center text-4xl font-bold">
                Trusted by Developers Worldwide
              </h2>
              <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                {[
                  { value: "10K+", label: "Active Users" },
                  { value: "50M+", label: "API Calls" },
                  { value: "99.9%", label: "Uptime" },
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="text-center"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 + 0.2, type: "spring" }}
                      className="text-5xl font-bold text-primary"
                    >
                      {stat.value}
                    </motion.div>
                    <div className="mt-2 text-muted-foreground">{stat.label}</div>
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

