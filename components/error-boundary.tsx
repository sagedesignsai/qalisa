"use client"

import * as React from "react"
import { AlertTriangle, RefreshCw, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
  errorInfo: React.ErrorInfo | null
}

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<ErrorFallbackProps>
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
}

interface ErrorFallbackProps {
  error: Error
  errorInfo: React.ErrorInfo | null
  resetError: () => void
}

// Error boundary must be a class component
class ErrorBoundaryClass extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    }
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
    }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({
      errorInfo,
    })

    // Call optional error handler
    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }

    // Enhanced error logging in development
    if (process.env.NODE_ENV === "development") {
      console.group("🚨 ErrorBoundary caught an error")
      console.error("Error:", error)
      console.error("Error message:", error.message)
      console.error("Error stack:", error.stack)
      console.error("Component stack:", errorInfo.componentStack)
      console.error("Error info:", errorInfo)
      
      // Check if it's a React rendering error
      if (error.message.includes("Objects are not valid as a React child")) {
        console.warn("💡 This is likely a rendering issue - check if you're trying to render an object directly")
        console.warn("💡 Common causes:")
        console.warn("   - Returning an object from a render function")
        console.warn("   - Passing an object as children")
        console.warn("   - Incorrect return value from onRender callback")
      }
      
      console.groupEnd()
    }
  }

  resetError = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    })
  }

  render() {
    if (this.state.hasError && this.state.error) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback

      return (
        <FallbackComponent
          error={this.state.error}
          errorInfo={this.state.errorInfo}
          resetError={this.resetError}
        />
      )
    }

    return this.props.children
  }
}

// Default error fallback component with modern UI
function DefaultErrorFallback({
  error,
  errorInfo,
  resetError,
}: ErrorFallbackProps) {
  const handleGoHome = () => {
    window.location.href = "/"
  }

  const handleReload = () => {
    window.location.reload()
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-destructive/10">
            <AlertTriangle className="size-8 text-destructive" />
          </div>
          <CardTitle className="text-2xl">Something went wrong</CardTitle>
          <CardDescription className="mt-2">
            We encountered an unexpected error. Don't worry, your data is safe.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <Alert variant="destructive">
            <AlertTriangle className="size-4" />
            <AlertTitle>Error Details</AlertTitle>
            <AlertDescription className="mt-2">
              <p className="font-mono text-xs break-words">
                {error.message || "An unknown error occurred"}
              </p>
            </AlertDescription>
          </Alert>

          {process.env.NODE_ENV === "development" && errorInfo && (
            <>
              <details className="rounded-lg border bg-muted/50 p-4">
                <summary className="cursor-pointer font-medium text-sm mb-2">
                  Component Stack (Development Only)
                </summary>
                <pre className="mt-2 overflow-auto text-xs font-mono text-muted-foreground max-h-40">
                  {errorInfo.componentStack}
                </pre>
              </details>
              {error.stack && (
                <details className="rounded-lg border bg-muted/50 p-4">
                  <summary className="cursor-pointer font-medium text-sm mb-2">
                    Error Stack Trace (Development Only)
                  </summary>
                  <pre className="mt-2 overflow-auto text-xs font-mono text-muted-foreground max-h-40">
                    {error.stack}
                  </pre>
                </details>
              )}
            </>
          )}
        </CardContent>

        <CardFooter className="flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Button onClick={resetError} variant="default" className="w-full sm:w-auto">
            <RefreshCw className="mr-2 size-4" />
            Try Again
          </Button>
          <Button
            onClick={handleReload}
            variant="outline"
            className="w-full sm:w-auto"
          >
            <RefreshCw className="mr-2 size-4" />
            Reload Page
          </Button>
          <Button
            onClick={handleGoHome}
            variant="outline"
            className="w-full sm:w-auto"
          >
            <Home className="mr-2 size-4" />
            Go Home
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

// Client component wrapper
export function ErrorBoundary({
  children,
  fallback,
  onError,
}: ErrorBoundaryProps) {
  return (
    <ErrorBoundaryClass fallback={fallback} onError={onError}>
      {children}
    </ErrorBoundaryClass>
  )
}

