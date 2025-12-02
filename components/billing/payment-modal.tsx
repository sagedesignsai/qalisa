"use client"

import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { Loader2, CreditCard, Check, ArrowRight, Sparkles, Zap, Shield } from "lucide-react"
import { Subscription } from "@/lib/generated/prisma/enums"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useInitiatePayment } from "@/lib/hooks/use-payments"
import { useInitiatePolarPayment } from "@/lib/hooks/use-polar"

interface PaymentModalProps {
  user: {
    id: string
    email: string
    name: string | null
  }
  plan: Subscription
  frequency: "monthly" | "yearly"
  provider: "payfast" | "polar"
  currentSubscription: Subscription
}

const subscriptionPlans: Record<Subscription, {
  name: string
  description: string
  priceMonthly: string
  priceYearly: string
  monthlyAmount: number
  yearlyAmount: number
}> = {
  FREE: {
    name: "Free",
    description: "Basic features",
    priceMonthly: "R0/month",
    priceYearly: "R0/year",
    monthlyAmount: 0,
    yearlyAmount: 0,
  },
  STARTER: {
    name: "Starter",
    description: "For individuals",
    priceMonthly: "R9/month",
    priceYearly: "R90/year",
    monthlyAmount: 900,
    yearlyAmount: 9000,
  },
  PROFESSIONAL: {
    name: "Professional",
    description: "For teams",
    priceMonthly: "R29/month",
    priceYearly: "R290/year",
    monthlyAmount: 2900,
    yearlyAmount: 29000,
  },
  ENTERPRISE: {
    name: "Enterprise",
    description: "Custom solutions",
    priceMonthly: "Custom",
    priceYearly: "Custom",
    monthlyAmount: 0,
    yearlyAmount: 0,
  },
}

export function PaymentModal({
  user,
  plan,
  frequency: initialFrequency,
  provider: initialProvider,
  currentSubscription,
}: PaymentModalProps) {
  const router = useRouter()
  const [frequency, setFrequency] = useState<"monthly" | "yearly">(initialFrequency)
  const [provider, setProvider] = useState<"payfast" | "polar">(initialProvider)
  const { initiatePayment, loading: payfastLoading } = useInitiatePayment()
  const { initiatePayment: initiatePolarPayment, loading: polarLoading } = useInitiatePolarPayment()

  const planDetails = subscriptionPlans[plan]
  const isCurrentPlan = currentSubscription === plan
  const loading = payfastLoading || polarLoading

  const handlePayment = async () => {
    try {
      if (provider === "polar") {
        await initiatePolarPayment(plan)
      } else {
        await initiatePayment(plan, frequency)
      }
    } catch (error) {
      // Error handled by hook
    }
  }

  const handleClose = () => {
    router.back()
  }

  const amount = frequency === "yearly" ? planDetails.yearlyAmount : planDetails.monthlyAmount
  const priceDisplay = frequency === "yearly" ? planDetails.priceYearly : planDetails.priceMonthly

  return (
    <Dialog open={true} onOpenChange={handleClose}>
      <DialogContent className="w-[95vw] sm:max-w-[650px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-4 pb-4">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 border border-primary/20">
              <CreditCard className="h-7 w-7 text-primary" />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-3xl font-bold">Subscribe to {planDetails.name}</DialogTitle>
              <DialogDescription className="text-base pt-2">
                {planDetails.description}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-2">
          {/* Plan Summary */}
          <div className="relative overflow-hidden rounded-xl border-2 bg-gradient-to-br from-primary/10 via-primary/5 to-background p-6 shadow-lg">
            <div className="absolute inset-0 bg-grid-pattern opacity-5" />
            <div className="relative space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold mb-1">{planDetails.name} Plan</h3>
                  <p className="text-sm text-muted-foreground">{planDetails.description}</p>
                </div>
                {isCurrentPlan && (
                  <Badge variant="default" className="gap-1.5 shadow-sm">
                    <Check className="h-3.5 w-3.5" />
                    Current Plan
                  </Badge>
                )}
              </div>
              <div className="flex items-baseline gap-3 pt-2">
                <span className="text-5xl font-bold tracking-tight">{priceDisplay}</span>
                {frequency === "yearly" && planDetails.yearlyAmount > 0 && (
                  <div className="flex flex-col">
                    <Badge variant="secondary" className="bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20 gap-1 w-fit">
                      <Sparkles className="h-3 w-3" />
                      Save R{(planDetails.monthlyAmount * 12 - planDetails.yearlyAmount) / 100}/year
                    </Badge>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Frequency Selection (PayFast only) */}
          {provider === "payfast" && (
            <div className="space-y-4 rounded-lg border-2 bg-muted/30 p-5">
              <div>
                <Label className="text-base font-semibold">Billing Frequency</Label>
                <p className="text-sm text-muted-foreground mt-1">
                  Choose how often you'd like to be billed
                </p>
              </div>
              <RadioGroup value={frequency} onValueChange={(value) => setFrequency(value as "monthly" | "yearly")} className="space-y-3">
                <div className={`flex items-center space-x-3 rounded-xl border-2 p-5 transition-all cursor-pointer ${
                  frequency === "monthly" 
                    ? "border-primary bg-primary/5 shadow-sm" 
                    : "border-border hover:border-primary/50 hover:bg-muted/50"
                }`}>
                  <RadioGroupItem value="monthly" id="monthly" className="mt-0" />
                  <Label htmlFor="monthly" className="flex-1 cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-base">Monthly</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{planDetails.priceMonthly}</p>
                      </div>
                    </div>
                  </Label>
                </div>
                <div className={`flex items-center space-x-3 rounded-xl border-2 p-5 transition-all cursor-pointer ${
                  frequency === "yearly" 
                    ? "border-primary bg-primary/5 shadow-sm" 
                    : "border-border hover:border-primary/50 hover:bg-muted/50"
                }`}>
                  <RadioGroupItem value="yearly" id="yearly" className="mt-0" />
                  <Label htmlFor="yearly" className="flex-1 cursor-pointer">
                    <div className="flex items-center justify-between w-full">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-base">Yearly</span>
                          <Badge variant="secondary" className="bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20 text-xs">
                            <Sparkles className="h-3 w-3 mr-1" />
                            Save 17%
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{planDetails.priceYearly}</p>
                        <p className="text-xs text-green-600 dark:text-green-400 font-medium mt-1">
                          Save R{(planDetails.monthlyAmount * 12 - planDetails.yearlyAmount) / 100}/year
                        </p>
                      </div>
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            </div>
          )}

          {/* Payment Provider Selection */}
          <div className="space-y-4 rounded-lg border-2 bg-muted/30 p-5">
            <div>
              <Label className="text-base font-semibold">Payment Provider</Label>
              <p className="text-sm text-muted-foreground mt-1">
                Select your preferred payment gateway
              </p>
            </div>
            <RadioGroup value={provider} onValueChange={(value) => setProvider(value as "payfast" | "polar")} className="space-y-3">
              <div className={`flex items-center space-x-3 rounded-xl border-2 p-5 transition-all cursor-pointer ${
                provider === "payfast" 
                  ? "border-primary bg-primary/5 shadow-sm" 
                  : "border-border hover:border-primary/50 hover:bg-muted/50"
              }`}>
                <RadioGroupItem value="payfast" id="payfast" className="mt-0" />
                <Label htmlFor="payfast" className="flex-1 cursor-pointer">
                  <div className="flex items-center justify-between w-full">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-base">PayFast</span>
                        {provider === "payfast" && frequency === "yearly" && (
                          <Badge variant="secondary" className="bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20 text-xs">
                            Save 17%
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">South African payment gateway</p>
                    </div>
                    {provider === "payfast" && (
                      <Shield className="h-5 w-5 text-primary" />
                    )}
                  </div>
                </Label>
              </div>
              <div className={`flex items-center space-x-3 rounded-xl border-2 p-5 transition-all cursor-pointer ${
                provider === "polar" 
                  ? "border-primary bg-primary/5 shadow-sm" 
                  : "border-border hover:border-primary/50 hover:bg-muted/50"
              }`}>
                <RadioGroupItem value="polar" id="polar" className="mt-0" />
                <Label htmlFor="polar" className="flex-1 cursor-pointer">
                  <div className="flex items-center justify-between w-full">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-base">Polar.sh</span>
                        <Badge variant="outline" className="text-xs">Global Tax</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">Global payment platform</p>
                    </div>
                    {provider === "polar" && (
                      <Shield className="h-5 w-5 text-primary" />
                    )}
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        <DialogFooter className="gap-3 sm:gap-2 pt-4 border-t">
          <Button variant="outline" onClick={handleClose} disabled={loading} className="gap-2">
            Cancel
          </Button>
          <Button 
            onClick={handlePayment} 
            disabled={loading || isCurrentPlan} 
            className="gap-2 font-semibold"
            size="lg"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                Continue to Payment
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

