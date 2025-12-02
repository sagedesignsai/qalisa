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
import { cancelSubscription } from "@/app/actions/billing"
import { useState } from "react"
import { Loader2, X, Calendar, AlertCircle, Shield, Info } from "lucide-react"
import { format } from "date-fns"
import { Subscription } from "@/lib/generated/prisma/enums"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface CancelSubscriptionModalProps {
  subscription: {
    id: string
    plan: Subscription
    status: string
    currentPeriodEnd: Date | null
    cancelAtPeriodEnd: boolean
  }
}

export function CancelSubscriptionModal({
  subscription,
}: CancelSubscriptionModalProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleCancel = async () => {
    try {
      setLoading(true)
      setError(null)
      await cancelSubscription()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to cancel subscription")
      setLoading(false)
    }
  }

  const handleClose = () => {
    router.back()
  }

  const planNames: Record<Subscription, string> = {
    FREE: "Free",
    STARTER: "Starter",
    PROFESSIONAL: "Professional",
    ENTERPRISE: "Enterprise",
  }

  return (
    <Dialog open={true} onOpenChange={handleClose}>
      <DialogContent className="w-[95vw] sm:max-w-[550px]">
        <DialogHeader className="space-y-4 pb-4">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-destructive/10 border border-destructive/20">
              <X className="h-7 w-7 text-destructive" />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-3xl font-bold">Cancel Subscription</DialogTitle>
              <DialogDescription className="text-base pt-2">
                We're sorry to see you go. Your subscription will remain active until the end of
                your current billing period.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-2">
          {/* Subscription Details */}
          <div className="relative overflow-hidden rounded-xl border-2 bg-gradient-to-br from-muted/50 to-muted/30 p-6 shadow-sm">
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-muted-foreground">Current Plan</span>
                </div>
                <span className="font-bold text-lg">{planNames[subscription.plan]}</span>
              </div>
              {subscription.currentPeriodEnd && (
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-muted-foreground">Access Until</span>
                  </div>
                  <span className="font-bold text-lg">
                    {format(new Date(subscription.currentPeriodEnd), "MMM dd, yyyy")}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Important Notice */}
          <Alert className="border-yellow-200 bg-gradient-to-r from-yellow-50 to-yellow-50/50 dark:from-yellow-950/30 dark:to-yellow-950/10 dark:border-yellow-900 shadow-sm">
            <Info className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
            <AlertDescription className="text-yellow-900 dark:text-yellow-200">
              <span className="font-semibold mb-1 block">Important:</span>
              You can reactivate your subscription anytime before{" "}
              <span className="font-bold">
                {subscription.currentPeriodEnd
                  ? format(new Date(subscription.currentPeriodEnd), "MMMM dd, yyyy")
                  : "the end of your billing period"}
              </span>
              . After that, you'll lose access to premium features.
            </AlertDescription>
          </Alert>

          {/* Error Alert */}
          {error && (
            <Alert variant="destructive" className="border-destructive/50">
              <AlertCircle className="h-5 w-5" />
              <AlertDescription className="font-medium">{error}</AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter className="gap-3 sm:gap-2 pt-4 border-t">
          <Button variant="outline" onClick={handleClose} disabled={loading} className="gap-2">
            Keep Subscription
          </Button>
          <Button
            variant="destructive"
            onClick={handleCancel}
            disabled={loading}
            className="gap-2 font-semibold"
            size="lg"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Cancelling...
              </>
            ) : (
              <>
                <X className="h-4 w-4" />
                Cancel Subscription
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

