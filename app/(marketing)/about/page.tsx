"use client"

import { motion } from "motion/react"
import { Card, CardContent } from "@/components/ui/card"
import { Sparkles, Target, Users, Lightbulb, Heart, Award, Globe, Rocket } from "lucide-react"
import { AnimatedSection } from "@/components/marketing/animated-section"
import { AnimatedCard } from "@/components/marketing/animated-card"

const values = [
  {
    icon: Target,
    title: "Mission-Driven",
    description:
      "We're on a mission to make AI accessible to everyone, empowering developers and businesses to build the future.",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: Users,
    title: "Community First",
    description:
      "Our community is at the heart of everything we do. We build with and for our users.",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    icon: Lightbulb,
    title: "Innovation",
    description:
      "We constantly push the boundaries of what's possible with AI, always staying ahead of the curve.",
    gradient: "from-green-500 to-emerald-500",
  },
  {
    icon: Heart,
    title: "User-Centric",
    description:
      "Every decision we make is driven by what's best for our users. Your success is our success.",
    gradient: "from-orange-500 to-red-500",
  },
]

const team = [
  {
    name: "Alex Chen",
    role: "CEO & Founder",
    description: "Former AI researcher with 10+ years of experience building scalable platforms",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    name: "Sarah Johnson",
    role: "CTO",
    description: "Ex-Google engineer, AI infrastructure expert passionate about developer tools",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    name: "Michael Park",
    role: "Head of Product",
    description: "Product leader with a passion for creating intuitive developer experiences",
    gradient: "from-green-500 to-emerald-500",
  },
  {
    name: "Emily Rodriguez",
    role: "Head of Design",
    description: "Award-winning designer focused on user experience and accessibility",
    gradient: "from-orange-500 to-red-500",
  },
]

const milestones = [
  { year: "2023", event: "Founded", icon: Rocket },
  { year: "2024", event: "10K+ Users", icon: Users },
  { year: "2024", event: "Global Launch", icon: Globe },
  { year: "2025", event: "Award Winner", icon: Award },
]

export default function AboutPage() {
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
                <span>About Us</span>
              </motion.div>
              <h1 className="text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl">
                Building the Future of
                <br />
                <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                  AI-Powered Applications
                </span>
              </h1>
              <p className="mt-6 text-xl leading-8 text-muted-foreground sm:text-2xl">
                We're a team of passionate developers, designers, and AI researchers working
                together to democratize AI.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Story Section */}
      <section className="container mx-auto px-4 py-24">
        <div className="mx-auto max-w-4xl">
          <AnimatedSection>
            <div className="prose prose-lg dark:prose-invert mx-auto max-w-none">
              <h2 className="text-4xl font-bold mb-6">Our Story</h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-4">
                Qalisa was born from a simple observation: building AI-powered applications
                shouldn't be complicated. We started in 2023 with a vision to make AI accessible
                to developers of all skill levels.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed mb-4">
                Today, we're proud to serve thousands of developers and businesses worldwide,
                helping them build intelligent applications that transform how people work and
                interact with technology.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Our platform combines cutting-edge AI technology with intuitive design, making it
                easy for anyone to build, deploy, and scale AI-powered applications.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Milestones */}
      <section className="bg-muted/50 py-24">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <h2 className="mb-12 text-center text-4xl font-bold">Our Journey</h2>
            <div className="mx-auto grid max-w-4xl grid-cols-2 gap-8 md:grid-cols-4">
              {milestones.map((milestone, index) => (
                <motion.div
                  key={milestone.year}
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, type: "spring" }}
                  className="text-center"
                >
                  <div className="mb-4 inline-flex items-center justify-center rounded-full bg-primary/10 p-4">
                    <milestone.icon className="h-8 w-8 text-primary" />
                  </div>
                  <div className="text-3xl font-bold text-primary">{milestone.year}</div>
                  <div className="mt-2 text-sm font-medium text-foreground">
                    {milestone.event}
                  </div>
                </motion.div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Values Section */}
      <section className="container mx-auto px-4 py-24">
        <AnimatedSection>
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-4 text-4xl font-bold sm:text-5xl">Our Values</h2>
            <p className="text-lg text-muted-foreground">
              The principles that guide everything we do
            </p>
          </div>
        </AnimatedSection>

        <div className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2">
          {values.map((value, index) => (
            <AnimatedCard key={value.title} delay={index * 0.1} scaleOnHover>
              <Card className="h-full border-2 transition-all hover:border-primary/50 hover:shadow-xl group">
                <CardContent className="p-8">
                  <motion.div
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                    className={`mb-6 inline-flex items-center justify-center rounded-xl bg-gradient-to-br ${value.gradient} p-4 text-white shadow-lg`}
                  >
                    <value.icon className="h-8 w-8" />
                  </motion.div>
                  <h3 className="mb-3 text-2xl font-semibold group-hover:text-primary transition-colors">
                    {value.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">{value.description}</p>
                </CardContent>
              </Card>
            </AnimatedCard>
          ))}
        </div>
      </section>

      {/* Team Section */}
      <section className="bg-muted/50 py-24">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="mb-4 text-4xl font-bold sm:text-5xl">Meet Our Team</h2>
              <p className="text-lg text-muted-foreground">
                The talented people behind Qalisa
              </p>
            </div>
          </AnimatedSection>

          <div className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-2">
            {team.map((member, index) => (
              <AnimatedCard key={member.name} delay={index * 0.1} scaleOnHover>
                <Card className="h-full border-2 transition-all hover:border-primary/50 hover:shadow-xl">
                  <CardContent className="p-8">
                    <motion.div
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 + 0.2, type: "spring" }}
                      className={`mb-6 h-24 w-24 rounded-full bg-gradient-to-br ${member.gradient} flex items-center justify-center text-2xl font-bold text-white shadow-lg`}
                    >
                      {member.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </motion.div>
                    <h3 className="text-xl font-semibold">{member.name}</h3>
                    <p className="mt-1 text-primary font-medium">{member.role}</p>
                    <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                      {member.description}
                    </p>
                  </CardContent>
                </Card>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-24">
        <AnimatedSection>
          <div className="mx-auto max-w-5xl">
            <h2 className="mb-12 text-center text-4xl font-bold">By The Numbers</h2>
            <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
              {[
                { value: "10K+", label: "Users" },
                { value: "50+", label: "Countries" },
                { value: "99.9%", label: "Uptime" },
                { value: "24/7", label: "Support" },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, type: "spring" }}
                  className="rounded-xl border bg-background p-6 text-center shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="text-4xl font-bold text-primary">{stat.value}</div>
                  <div className="mt-2 text-sm text-muted-foreground">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </AnimatedSection>
      </section>
    </>
  )
}

