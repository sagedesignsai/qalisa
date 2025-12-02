"use client"

import { Suspense, useState } from "react"
import { BillingSettings } from "@/components/account/billing-settings"
import { PaymentHistory } from "@/components/account/payment-history"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { CreditCard, Receipt } from "lucide-react"

export default function BillingPage() {
  return (
    <Tabs defaultValue="subscription" className="w-full">
      <TabsList className="mb-6">
        <TabsTrigger value="subscription" className="gap-2">
          <CreditCard className="h-4 w-4" />
          Subscription
        </TabsTrigger>
        <TabsTrigger value="history" className="gap-2">
          <Receipt className="h-4 w-4" />
          Payment History
        </TabsTrigger>
      </TabsList>

      <TabsContent value="subscription" className="mt-6">
        <BillingSettings />
      </TabsContent>

      <TabsContent value="history" className="mt-6">
        <Suspense
          fallback={
            <div className="space-y-4">
              <Skeleton className="h-10 w-64" />
              <Skeleton className="h-96 w-full rounded-xl" />
            </div>
          }
        >
          <PaymentHistory />
        </Suspense>
      </TabsContent>
    </Tabs>
  )
}


