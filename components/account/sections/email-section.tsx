"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { User } from "@/lib/hooks/use-account"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Mail, CheckCircle2 } from "lucide-react"

const emailSchema = z.object({
  email: z.string().email("Invalid email address"),
})

type EmailFormData = z.infer<typeof emailSchema>

interface EmailSectionProps {
  user: User
  onUpdate: (data: { email?: string }) => Promise<void>
  loading: boolean
}

export function EmailSection({ user, onUpdate, loading }: EmailSectionProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: user.email,
    },
  })

  const onSubmit = async (data: EmailFormData) => {
    if (data.email !== user.email) {
      await onUpdate({ email: data.email })
    }
  }

  return (
    <Card className="border-2">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Mail className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-xl">Email Address</CardTitle>
            <CardDescription>
              Update your email address. You'll need to verify the new email.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/30 border">
          <Mail className="h-5 w-5 text-muted-foreground" />
          <span className="text-sm font-medium flex-1">{user.email}</span>
          {user.emailVerified ? (
            <Badge variant="outline" className="gap-1.5 bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900 text-green-700 dark:text-green-400">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Verified
            </Badge>
          ) : (
            <Badge variant="secondary" className="bg-yellow-50 dark:bg-yellow-950/20 text-yellow-700 dark:text-yellow-400">
              Unverified
            </Badge>
          )}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">New Email Address</Label>
            <Input
              id="email"
              type="email"
              {...register("email")}
              placeholder="new@example.com"
              className="h-11"
            />
            {errors.email && (
              <p className="text-sm text-destructive flex items-center gap-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="flex justify-end pt-2">
            <Button type="submit" disabled={loading} size="lg" className="min-w-[120px]">
              {loading ? "Updating..." : "Update Email"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

