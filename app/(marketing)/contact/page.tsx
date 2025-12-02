"use client"

import { useState } from "react"
import { motion } from "motion/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles, Mail, MessageSquare, Send, CheckCircle2 } from "lucide-react"
import { AnimatedSection } from "@/components/marketing/animated-section"
import { AnimatedCard } from "@/components/marketing/animated-card"

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // Simulate form submission
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
  }

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
                <span>Contact</span>
              </motion.div>
              <h1 className="text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl">
                Get In Touch
                <br />
                <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  We'd Love to Hear From You
                </span>
              </h1>
              <p className="mt-6 text-xl leading-8 text-muted-foreground sm:text-2xl">
                Have a question or want to work together? Send us a message and we'll respond as
                soon as possible.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="container mx-auto px-4 py-24">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 lg:grid-cols-2">
          {/* Contact Form */}
          <AnimatedCard delay={0.1}>
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-3xl">Send us a message</CardTitle>
                <CardDescription>
                  Fill out the form below and we'll get back to you within 24 hours.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {submitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center py-12"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200 }}
                    >
                      <CheckCircle2 className="h-16 w-16 text-primary" />
                    </motion.div>
                    <h3 className="mt-4 text-2xl font-semibold">Message Sent!</h3>
                    <p className="mt-2 text-muted-foreground">
                      We'll get back to you soon.
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input id="name" name="name" required placeholder="Your name" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        placeholder="your@email.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Input id="subject" name="subject" required placeholder="What's this about?" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        id="message"
                        name="message"
                        required
                        rows={6}
                        placeholder="Tell us more..."
                      />
                    </div>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button type="submit" className="w-full" size="lg">
                        Send Message
                        <Send className="ml-2 h-4 w-4" />
                      </Button>
                    </motion.div>
                  </form>
                )}
              </CardContent>
            </Card>
          </AnimatedCard>

          {/* Contact Info */}
          <div className="space-y-8">
            <AnimatedCard delay={0.2}>
              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Mail className="h-6 w-6 text-primary" />
                    Email
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    <a
                      href="mailto:hello@qalisa.com"
                      className="text-foreground hover:text-primary transition-colors"
                    >
                      hello@qalisa.com
                    </a>
                  </p>
                </CardContent>
              </Card>
            </AnimatedCard>

            <AnimatedCard delay={0.3}>
              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <MessageSquare className="h-6 w-6 text-primary" />
                    Support
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    For technical support, visit our{" "}
                    <a href="/docs" className="text-foreground hover:text-primary transition-colors">
                      documentation
                    </a>{" "}
                    or{" "}
                    <a
                      href="mailto:support@qalisa.com"
                      className="text-foreground hover:text-primary transition-colors"
                    >
                      contact support
                    </a>
                    .
                  </p>
                </CardContent>
              </Card>
            </AnimatedCard>

            <AnimatedCard delay={0.4}>
              <Card className="border-2 bg-gradient-to-br from-primary/10 to-background">
                <CardHeader>
                  <CardTitle>Office Hours</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-muted-foreground">
                    <strong>Monday - Friday:</strong> 9:00 AM - 6:00 PM PST
                  </p>
                  <p className="text-muted-foreground">
                    <strong>Weekend:</strong> Closed
                  </p>
                </CardContent>
              </Card>
            </AnimatedCard>
          </div>
        </div>
      </section>

      {/* FAQ Quick Links */}
      <section className="bg-muted/50 py-24">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="mb-4 text-4xl font-bold">Common Questions</h2>
              <p className="mb-12 text-lg text-muted-foreground">
                Before reaching out, check if your question is answered in our FAQ.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                {[
                  "How do I get started?",
                  "What are your pricing plans?",
                  "Do you offer support?",
                  "Can I integrate with my existing tools?",
                ].map((question, index) => (
                  <motion.div
                    key={question}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    className="rounded-lg border bg-background px-6 py-3 transition-all hover:border-primary hover:shadow-md"
                  >
                    <span className="text-sm font-medium">{question}</span>
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

