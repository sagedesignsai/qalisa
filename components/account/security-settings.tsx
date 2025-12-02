"use client"

import { useSessions, useDeleteSession } from "@/lib/hooks/use-sessions"
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Shield, Monitor, Trash2, Mail } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

export function SecuritySettings() {
  const { sessions, loading, refetch } = useSessions()
  const { deleteSession, loading: deleting } = useDeleteSession()

  const handleDeleteSession = async (sessionId: string) => {
    try {
      await deleteSession(sessionId, () => {
        refetch()
      })
    } catch (error) {
      // Error handled by hook
    }
  }

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="space-y-1">
        <h1 className="text-4xl font-bold tracking-tight">Security</h1>
        <p className="text-muted-foreground text-lg">
          Manage your account security and active sessions
        </p>
      </div>

      <Card className="border-2">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl">Active Sessions</CardTitle>
              <CardDescription>
                Manage your active sessions across different devices
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {sessions.length === 0 ? (
            <div className="text-center py-12">
              <Monitor className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
              <p className="text-sm text-muted-foreground">No active sessions</p>
            </div>
          ) : (
            <div className="rounded-lg border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="font-semibold">Device</TableHead>
                    <TableHead className="font-semibold">Location</TableHead>
                    <TableHead className="font-semibold">Last Active</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="text-right font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sessions.map((session) => (
                    <TableRow key={session.id} className="hover:bg-muted/30">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
                            <Monitor className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <span className="font-medium">{session.device}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{session.location}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDistanceToNow(session.expires, { addSuffix: true })}
                      </TableCell>
                      <TableCell>
                        {session.isCurrent ? (
                          <Badge variant="default" className="gap-1.5">
                            <div className="h-1.5 w-1.5 rounded-full bg-current animate-pulse" />
                            Current
                          </Badge>
                        ) : (
                          <Badge variant="outline">Active</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {!session.isCurrent && (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" size="sm" disabled={deleting}>
                                <Trash2 className="h-4 w-4 mr-2" />
                                Revoke
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Revoke Session?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to revoke this session? You'll need to sign in again on that device.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteSession(session.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Revoke Session
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-2">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl">Security Tips</CardTitle>
          <CardDescription>
            Best practices to keep your account secure
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 rounded-lg bg-muted/30 border space-y-2">
            <h4 className="font-semibold flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              Use a strong password
            </h4>
            <p className="text-sm text-muted-foreground">
              Choose a unique password with at least 8 characters, including letters, numbers, and symbols.
            </p>
          </div>
          <div className="p-4 rounded-lg bg-muted/30 border space-y-2">
            <h4 className="font-semibold flex items-center gap-2">
              <Monitor className="h-4 w-4 text-primary" />
              Review active sessions
            </h4>
            <p className="text-sm text-muted-foreground">
              Regularly check your active sessions and revoke any that you don't recognize.
            </p>
          </div>
          <div className="p-4 rounded-lg bg-muted/30 border space-y-2">
            <h4 className="font-semibold flex items-center gap-2">
              <Mail className="h-4 w-4 text-primary" />
              Keep your email secure
            </h4>
            <p className="text-sm text-muted-foreground">
              Your email is used for account recovery. Make sure it's secure and you have access to it.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

