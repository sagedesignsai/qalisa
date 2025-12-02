"use client"

import { useEffect } from "react"
import { usePaymentHistory } from "@/lib/hooks/use-payments"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Receipt, Loader2, Download, ExternalLink, CreditCard, Wallet, CheckCircle2, Clock, XCircle, Ban, AlertCircle, RefreshCw } from "lucide-react"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"

const statusConfig: Record<string, { 
  colors: string
  icon: typeof CheckCircle2
  label: string
}> = {
  COMPLETED: {
    colors: "bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-900 text-green-700 dark:text-green-400",
    icon: CheckCircle2,
    label: "Completed",
  },
  PENDING: {
    colors: "bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200 dark:border-yellow-900 text-yellow-700 dark:text-yellow-400",
    icon: Clock,
    label: "Pending",
  },
  FAILED: {
    colors: "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900 text-red-700 dark:text-red-400",
    icon: XCircle,
    label: "Failed",
  },
  CANCELLED: {
    colors: "bg-gray-50 dark:bg-gray-950/30 border-gray-200 dark:border-gray-900 text-gray-700 dark:text-gray-400",
    icon: Ban,
    label: "Cancelled",
  },
  PROCESSING: {
    colors: "bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900 text-blue-700 dark:text-blue-400",
    icon: Loader2,
    label: "Processing",
  },
}

export function PaymentHistory() {
  const { payments, loading, error, refetch } = usePaymentHistory()

  useEffect(() => {
    refetch()
  }, [refetch])

  const formatAmount = (amount: number, currency: string = "ZAR") => {
    return new Intl.NumberFormat("en-ZA", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 2,
    }).format(amount / 100)
  }

  if (loading) {
    return (
      <Card className="border-2 shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Receipt className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl">Payment History</CardTitle>
              <CardDescription>View your past payments and transactions</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-16 w-full rounded-lg" />
            <Skeleton className="h-16 w-full rounded-lg" />
            <Skeleton className="h-16 w-full rounded-lg" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="border-2 shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Receipt className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl">Payment History</CardTitle>
              <CardDescription>View your past payments and transactions</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <AlertCircle className="h-12 w-12 text-destructive mb-4" />
            <p className="text-lg font-semibold text-destructive mb-2">{error.message}</p>
            <Button variant="outline" size="sm" onClick={() => refetch()} className="mt-4 gap-2">
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  const getPaymentMethodIcon = (method: string) => {
    const methodLower = method.toLowerCase()
    if (methodLower.includes("card")) return <CreditCard className="h-4 w-4" />
    if (methodLower.includes("eft") || methodLower.includes("bank")) return <Wallet className="h-4 w-4" />
    return <CreditCard className="h-4 w-4" />
  }

  return (
    <Card className="border-2 shadow-lg">
      <CardHeader className="pb-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 border border-primary/20">
              <Receipt className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold">Payment History</CardTitle>
              <CardDescription className="text-base mt-1">
                View your past payments and transactions
              </CardDescription>
            </div>
          </div>
          {payments.length > 0 && (
            <Button variant="outline" size="default" className="gap-2 w-full sm:w-auto">
              <Download className="h-4 w-4" />
              Export History
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {payments.length === 0 ? (
          <div className="text-center py-20">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-muted to-muted/50 mx-auto mb-6 border-2 border-dashed">
              <Receipt className="h-10 w-10 text-muted-foreground opacity-60" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No payment history</h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Your payment history will appear here once you make a payment. All transactions are securely stored and can be accessed anytime.
            </p>
          </div>
        ) : (
          <div className="rounded-xl border-2 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50 hover:bg-muted/50">
                    <TableHead className="font-semibold h-12">Date & Time</TableHead>
                    <TableHead className="font-semibold">Description</TableHead>
                    <TableHead className="font-semibold text-right">Amount</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="font-semibold">Method</TableHead>
                    <TableHead className="font-semibold w-[120px] text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map((payment, index) => {
                    const statusInfo = statusConfig[payment.status] || {
                      colors: "bg-gray-50 dark:bg-gray-950/30 border-gray-200 dark:border-gray-900 text-gray-700 dark:text-gray-400",
                      icon: AlertCircle,
                      label: payment.status,
                    }
                    const StatusIcon = statusInfo.icon
                    const isProcessing = payment.status === "PROCESSING" || payment.status === "PENDING"

                    return (
                      <TableRow 
                        key={payment.id} 
                        className="hover:bg-muted/50 transition-colors border-b last:border-b-0"
                      >
                        <TableCell className="py-4">
                          <div className="flex flex-col gap-1">
                            <span className="font-semibold text-sm">
                              {format(new Date(payment.createdAt), "MMM dd, yyyy")}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {format(new Date(payment.createdAt), "h:mm a")}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="space-y-2">
                            <p className="font-medium text-sm">{payment.description || "Payment"}</p>
                            {payment.plan && (
                              <Badge variant="outline" className="text-xs font-medium">
                                {payment.plan}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="py-4 text-right">
                          <span className="font-bold text-lg">
                            {formatAmount(payment.amount, payment.currency)}
                          </span>
                        </TableCell>
                        <TableCell className="py-4">
                          <Badge
                            variant="outline"
                            className={`${statusInfo.colors} font-medium gap-1.5 px-3 py-1 border`}
                          >
                            <StatusIcon className={`h-3.5 w-3.5 ${isProcessing ? "animate-spin" : ""}`} />
                            {statusInfo.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="flex items-center gap-2">
                            <div className="text-muted-foreground">
                              {getPaymentMethodIcon(payment.paymentMethod)}
                            </div>
                            <span className="text-sm font-medium capitalize">
                              {payment.paymentMethod.toLowerCase().replace("_", " ")}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="py-4 text-right">
                          <Button variant="ghost" size="sm" className="gap-1.5 h-8">
                            <ExternalLink className="h-3.5 w-3.5" />
                            <span className="hidden sm:inline">View</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

