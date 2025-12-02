"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useBilling } from "@/lib/hooks/use-billing"
import { updateSubscriptionPlan } from "@/app/actions/billing"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { CreditCard, Check, Loader2, X, Calendar, Sparkles, ArrowRight, AlertCircle, RefreshCw, Zap, Users, Building2, Crown } from "lucide-react"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Subscription } from "@/lib/generated/prisma/enums"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { format } from "date-fns"
import { toast } from "sonner"

const subscriptionPlans: Record<Subscription, { 
  name: string
  description: string
  priceMonthly: string
  priceYearly: string
  monthlyAmount: number // in ZAR cents
  yearlyAmount: number // in ZAR cents
  icon: typeof CreditCard
  color: string
}> = {
  FREE: { 
    name: "Free", 
    description: "Basic features", 
    priceMonthly: "R0/month",
    priceYearly: "R0/year",
    monthlyAmount: 0,
    yearlyAmount: 0,
    icon: CreditCard,
    color: "text-muted-foreground",
  },
  STARTER: { 
    name: "Starter", 
    description: "For individuals", 
    priceMonthly: "R9/month",
    priceYearly: "R90/year",
    monthlyAmount: 900,
    yearlyAmount: 9000,
    icon: Zap,
    color: "text-blue-600 dark:text-blue-400",
  },
  PROFESSIONAL: { 
    name: "Professional", 
    description: "For teams", 
    priceMonthly: "R29/month",
    priceYearly: "R290/year",
    monthlyAmount: 2900,
    yearlyAmount: 29000,
    icon: Users,
    color: "text-purple-600 dark:text-purple-400",
  },
  ENTERPRISE: { 
    name: "Enterprise", 
    description: "Custom solutions", 
    priceMonthly: "Custom",
    priceYearly: "Custom",
    monthlyAmount: 0,
    yearlyAmount: 0,
    icon: Building2,
    color: "text-amber-600 dark:text-amber-400",
  },
}

export function BillingSettings() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { billing, loading, refetch } = useBilling()
  const [updating, setUpdating] = useState(false)
  const [selectedFrequency, setSelectedFrequency] = useState<"monthly" | "yearly">("monthly")

  // Handle URL-based notifications
  useEffect(() => {
    const cancelled = searchParams.get("cancelled")
    const reactivated = searchParams.get("reactivated")
    const updated = searchParams.get("updated")

    if (cancelled === "true") {
      toast.success("Subscription will be cancelled at the end of the billing period")
      router.replace("/dashboard/billing", { scroll: false })
    }
    if (reactivated === "true") {
      toast.success("Subscription reactivated successfully")
      router.replace("/dashboard/billing", { scroll: false })
    }
    if (updated === "true") {
      toast.success("Subscription updated successfully")
      router.replace("/dashboard/billing", { scroll: false })
    }
  }, [searchParams, router])

  const handlePayment = async (plan: Subscription) => {
    if (plan === Subscription.FREE || plan === Subscription.ENTERPRISE) {
      setUpdating(true)
      try {
        await updateSubscriptionPlan(plan)
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Failed to update subscription")
        setUpdating(false)
      }
      return
    }

    // Navigate to payment modal using intercepting route
    router.push(
      `/dashboard/billing/payment?plan=${plan}&frequency=${selectedFrequency}&provider=payfast`
    )
  }

  const handleCancelSubscription = () => {
    router.push("/dashboard/billing/cancel")
  }

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="space-y-4">
          <Skeleton className="h-12 w-64" />
          <Skeleton className="h-6 w-96" />
        </div>
        <Skeleton className="h-80 w-full rounded-xl" />
        <Skeleton className="h-96 w-full rounded-xl" />
      </div>
    )
  }

  if (!billing) {
    return (
      <Card className="border-2">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <AlertCircle className="h-12 w-12 text-destructive mb-4" />
            <p className="text-lg font-semibold text-destructive mb-2">Failed to load billing information</p>
            <p className="text-sm text-muted-foreground">Please try refreshing the page</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const currentPlan = subscriptionPlans[billing.subscription]
  const PlanIcon = currentPlan.icon

  return (
    <div className="space-y-8">
      {/* Current Plan Card */}
      <Card className="border-2 shadow-lg overflow-hidden">
        <CardHeader className="pb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 border border-primary/20">
              <CreditCard className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold">Current Plan</CardTitle>
              <CardDescription className="text-base mt-1">
                Your active subscription and billing details
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Current Plan Display */}
          <div className="relative overflow-hidden rounded-xl border-2 bg-gradient-to-br from-primary/10 via-primary/5 to-background p-6 sm:p-8 shadow-sm transition-all hover:shadow-md">
            <div className="absolute inset-0 bg-grid-pattern opacity-5" />
            <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
                <div className={`flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-2xl bg-primary/15 border-2 border-primary/20 shadow-md ${currentPlan.color} shrink-0`}>
                  <PlanIcon className="h-8 w-8 sm:h-10 sm:w-10" />
                </div>
                <div className="flex-1 space-y-3 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                    <h3 className="text-3xl sm:text-4xl font-bold tracking-tight">
                      {currentPlan.name}
                    </h3>
                    <Badge variant="outline" className="text-xs font-semibold px-2.5 py-1">
                      {billing.subscription}
                    </Badge>
                    {billing.activeSubscription?.status === "ACTIVE" && (
                      <Badge className="gap-1.5 bg-green-500 hover:bg-green-600 text-white border-0 shadow-sm">
                        <Check className="h-3.5 w-3.5" />
                        Active
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm sm:text-base text-muted-foreground">
                    {currentPlan.description}
                  </p>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
                    <div>
                      <p className="text-2xl sm:text-3xl font-bold text-primary">
                        {currentPlan.priceMonthly}
                      </p>
                      {billing.activeSubscription?.frequency && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Billed {billing.activeSubscription.frequency.toLowerCase()}
                        </p>
                      )}
                    </div>
                    {billing.activeSubscription?.currentPeriodEnd && (
                      <div className="flex items-center gap-2 rounded-lg bg-muted/50 px-3 sm:px-4 py-2 w-fit">
                        <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
                        <div className="text-sm">
                          <span className="text-muted-foreground">Renews </span>
                          <span className="font-semibold">
                            {format(new Date(billing.activeSubscription.currentPeriodEnd), "MMM dd, yyyy")}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Cancellation Notice */}
          {billing.activeSubscription?.cancelAtPeriodEnd && (
            <Alert className="border-yellow-200 bg-gradient-to-r from-yellow-50 to-yellow-50/50 dark:from-yellow-950/30 dark:to-yellow-950/10 dark:border-yellow-900 shadow-sm">
              <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
              <AlertDescription className="text-yellow-900 dark:text-yellow-200 font-medium">
                Your subscription will be cancelled on{" "}
                <span className="font-bold">
                  {billing.activeSubscription.currentPeriodEnd
                    ? format(new Date(billing.activeSubscription.currentPeriodEnd), "MMMM dd, yyyy")
                    : "the end of your billing period"}
                </span>
                . You can reactivate it anytime before then.
              </AlertDescription>
            </Alert>
          )}

          {/* Frequency Toggle */}
          <div className="space-y-4 rounded-lg border-2 bg-muted/30 p-4 sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <Label className="text-base font-semibold">Billing Frequency</Label>
                <p className="text-sm text-muted-foreground mt-1">
                  Choose your preferred billing cycle
                </p>
              </div>
              <ToggleGroup
                type="single"
                value={selectedFrequency}
                onValueChange={(value) => value && setSelectedFrequency(value as "monthly" | "yearly")}
                variant="outline"
                className="gap-2 w-full sm:w-auto"
              >
                <ToggleGroupItem value="monthly" aria-label="Monthly billing" className="gap-2 px-4 flex-1 sm:flex-initial">
                  Monthly
                </ToggleGroupItem>
                <ToggleGroupItem value="yearly" aria-label="Yearly billing" className="gap-2 px-4 flex-1 sm:flex-initial">
                  <Sparkles className="h-3.5 w-3.5 shrink-0" />
                  <span className="whitespace-nowrap">Yearly</span>
                  <Badge variant="secondary" className="ml-1 text-xs bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20 shrink-0">
                    Save 17%
                  </Badge>
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
          </div>

          {/* Plan Selector */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Change Plan</Label>
            <Select
              value={billing.subscription}
              onValueChange={(value) => handlePayment(value as Subscription)}
              disabled={updating}
            >
              <SelectTrigger className="h-12 text-base">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(subscriptionPlans).map(([value, plan]) => {
                  const PlanIcon = plan.icon
                  return (
                    <SelectItem key={value} value={value} className="py-3">
                      <div className="flex items-center justify-between w-full gap-4">
                        <div className="flex items-center gap-3">
                          <PlanIcon className={`h-5 w-5 ${plan.color}`} />
                          <span className="font-semibold">{plan.name}</span>
                        </div>
                        <span className="text-muted-foreground font-medium">
                          {selectedFrequency === "yearly" ? plan.priceYearly : plan.priceMonthly}
                        </span>
                      </div>
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
            {updating && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground pt-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Updating subscription...</span>
              </div>
            )}
          </div>

          {/* Subscription Actions */}
          {billing.subscription !== Subscription.FREE && (
            <div className="pt-6 border-t">
              {billing.activeSubscription?.cancelAtPeriodEnd ? (
                <Button
                  variant="outline"
                  size="default"
                  onClick={async () => {
                    setUpdating(true)
                    try {
                      await updateSubscriptionPlan(billing.subscription)
                    } catch (error) {
                      toast.error(error instanceof Error ? error.message : "Failed to reactivate")
                      setUpdating(false)
                    }
                  }}
                  disabled={updating}
                  className="gap-2 hover:bg-green-50 dark:hover:bg-green-950/20 hover:border-green-300 dark:hover:border-green-800"
                >
                  <RefreshCw className="h-4 w-4" />
                  Reactivate Subscription
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="default"
                  onClick={handleCancelSubscription}
                  disabled={updating}
                  className="gap-2 text-destructive hover:text-destructive hover:bg-destructive/10 hover:border-destructive/30"
                >
                  <X className="h-4 w-4" />
                  Cancel Subscription
                </Button>
              )}
            </div>
          )}

          {/* Member Since */}
          <div className="pt-6 border-t">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>
                Member since{" "}
                <span className="font-semibold text-foreground">
                  {new Date(billing.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Available Plans */}
      <Card className="border-2 shadow-lg">
        <CardHeader className="pb-6">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold">Available Plans</CardTitle>
              <CardDescription className="text-base mt-1">
                Choose the plan that best fits your needs
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {Object.entries(subscriptionPlans).map(([value, plan]) => {
              const isCurrent = billing.subscription === value
              const PlanIcon = plan.icon
              const savings = selectedFrequency === "yearly" && plan.yearlyAmount > 0 
                ? (plan.monthlyAmount * 12 - plan.yearlyAmount) / 100 
                : 0

              return (
                <div
                  key={value}
                  className={`group relative flex flex-col rounded-xl border-2 p-6 transition-all duration-300 ${
                    isCurrent 
                      ? "border-primary bg-gradient-to-br from-primary/10 via-primary/5 to-background shadow-lg scale-[1.02]" 
                      : "border-border bg-card hover:border-primary/50 hover:shadow-xl hover:-translate-y-1"
                  }`}
                >
                  {isCurrent && (
                    <div className="absolute -top-3 right-4 z-10">
                      <Badge variant="default" className="gap-1.5 shadow-lg px-3 py-1">
                        <Check className="h-3.5 w-3.5" />
                        Current Plan
                      </Badge>
                    </div>
                  )}
                  
                  <div className="flex flex-col flex-1 space-y-5">
                    {/* Plan Header */}
                    <div className="space-y-3">
                      <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-muted ${plan.color} transition-transform group-hover:scale-110`}>
                        <PlanIcon className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-bold text-2xl mb-1.5">{plan.name}</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {plan.description}
                        </p>
                      </div>
                    </div>

                    {/* Pricing */}
                    <div className="space-y-2 py-2">
                      <div className="flex items-baseline gap-2">
                        <p className="text-4xl font-bold tracking-tight">
                          {selectedFrequency === "yearly" ? plan.priceYearly : plan.priceMonthly}
                        </p>
                        {plan.priceMonthly !== "Custom" && (
                          <span className="text-sm text-muted-foreground">
                            /{selectedFrequency === "yearly" ? "year" : "month"}
                          </span>
                        )}
                      </div>
                      {savings > 0 && (
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20 gap-1">
                            <Sparkles className="h-3 w-3" />
                            Save R{savings}/year
                          </Badge>
                        </div>
                      )}
                    </div>

                    {/* Action Button */}
                    {!isCurrent && (
                      <div className="mt-auto pt-4">
                        <Button
                          variant={isCurrent ? "outline" : "default"}
                          size="default"
                          className="w-full gap-2 font-semibold"
                          onClick={() => handlePayment(value as Subscription)}
                          disabled={updating || value === Subscription.ENTERPRISE}
                        >
                          {value === Subscription.ENTERPRISE ? (
                            <>
                              <Building2 className="h-4 w-4" />
                              Contact Sales
                            </>
                          ) : (
                            <>
                              Subscribe Now
                              <ArrowRight className="h-4 w-4" />
                            </>
                          )}
                        </Button>
                      </div>
                    )}
                    {isCurrent && (
                      <div className="mt-auto pt-4">
                        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground py-2">
                          <Check className="h-4 w-4 text-primary" />
                          <span className="font-medium">Your current plan</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

