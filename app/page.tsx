import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  IconFileText,
  IconSparkles,
  IconChartBar,
  IconArrowRight,
  IconCheck,
} from "@tabler/icons-react"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            AI-Powered Platform
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Qalisa is your AI-powered companion. Build intelligent applications with
            advanced AI capabilities—all in one platform.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Button asChild size="lg">
              <Link href="/register">
                Get Started Free
                <IconArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/login">Sign In</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Powerful AI Capabilities
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Powered by Google Gemini AI for intelligent, context-aware assistance
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          <Card>
            <CardHeader>
              <IconSparkles className="h-10 w-10 text-primary mb-4" />
              <CardTitle>AI Chat</CardTitle>
              <CardDescription>
                Engage in intelligent conversations with advanced AI models. Get context-aware
                responses with reasoning and source citations.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <IconChartBar className="h-10 w-10 text-primary mb-4" />
              <CardTitle>Analytics Dashboard</CardTitle>
              <CardDescription>
                Track and visualize your data with interactive charts and comprehensive
                analytics tools.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <IconFileText className="h-10 w-10 text-primary mb-4" />
              <CardTitle>Customizable</CardTitle>
              <CardDescription>
                Build your own features and workflows. Extend the platform with custom
                integrations and tools.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-muted py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Why Choose Qalisa?
            </h2>
          </div>

          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-2">
            <div className="flex gap-4">
              <IconCheck className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-semibold">AI-Powered</h3>
                <p className="text-muted-foreground">
                  Powered by Google Gemini AI for intelligent, context-aware assistance.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <IconCheck className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-semibold">Easy to Use</h3>
                <p className="text-muted-foreground">
                  Intuitive interface designed for users of all technical levels.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <IconCheck className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-semibold">Extensible</h3>
                <p className="text-muted-foreground">
                  Build custom features and integrate with your existing tools and workflows.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <IconCheck className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-semibold">Open Source</h3>
                <p className="text-muted-foreground">
                  Fully customizable boilerplate ready for your specific use case.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Ready to Get Started?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Create your account and start building with AI-powered tools.
          </p>
          <div className="mt-10">
            <Button asChild size="lg">
              <Link href="/register">
                Get Started Free
                <IconArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
