"use client"

import { useConnections, useDeleteConnection } from "@/lib/hooks/use-connections"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Link2, Trash2 } from "lucide-react"
import { signIn } from "next-auth/react"

const providerLabels: Record<string, string> = {
  google: "Google",
  github: "GitHub",
  discord: "Discord",
  credentials: "Email",
}

export function ConnectedAccountsSection() {
  const { connections, loading, refetch } = useConnections()
  const { deleteConnection, loading: deleting } = useDeleteConnection()

  const handleDisconnect = async (provider: string) => {
    try {
      await deleteConnection(provider, () => {
        refetch()
      })
    } catch (error) {
      // Error handled by hook
    }
  }

  const handleConnect = (provider: string) => {
    signIn(provider, { callbackUrl: "/dashboard/account" })
  }

  const availableProviders = ["google"]

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Connected Accounts</CardTitle>
          <CardDescription>
            Manage your connected social accounts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-20 w-full" />
        </CardContent>
      </Card>
    )
  }

  const connectedProviders = connections.map((c) => c.provider)
  const disconnectedProviders = availableProviders.filter(
    (p) => !connectedProviders.includes(p)
  )

  return (
    <Card className="border-2">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Link2 className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-xl">Connected Accounts</CardTitle>
            <CardDescription>
              Manage your connected social accounts for authentication
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {connections.length > 0 && (
          <div className="space-y-3">
            {connections.map((connection) => (
              <div
                key={connection.id}
                className="flex items-center justify-between p-4 border-2 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-background border">
                    <Link2 className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">
                      {providerLabels[connection.provider] || connection.provider}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Connected account
                    </p>
                  </div>
                  <Badge variant="outline" className="bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900 text-green-700 dark:text-green-400">
                    Active
                  </Badge>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="sm" disabled={deleting} className="ml-4">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Disconnect
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Disconnect Account?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to disconnect{" "}
                        <span className="font-medium">
                          {providerLabels[connection.provider] || connection.provider}
                        </span>?
                        You won't be able to sign in with this account anymore.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDisconnect(connection.provider)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Disconnect
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            ))}
          </div>
        )}

        {disconnectedProviders.length > 0 && (
          <div className="space-y-3 pt-2">
            <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Available Providers
            </p>
            {disconnectedProviders.map((provider) => (
              <div
                key={provider}
                className="flex items-center justify-between p-4 border-2 rounded-lg bg-muted/20 hover:bg-muted/40 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-background border border-dashed">
                    <Link2 className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">
                      {providerLabels[provider] || provider}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Not connected
                    </p>
                  </div>
                </div>
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => handleConnect(provider)}
                  className="ml-4"
                >
                  Connect
                </Button>
              </div>
            ))}
          </div>
        )}

        {connections.length === 0 && disconnectedProviders.length === 0 && (
          <div className="text-center py-8">
            <Link2 className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
            <p className="text-sm text-muted-foreground">
              No account connections available
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

