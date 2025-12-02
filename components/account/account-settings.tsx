"use client"

import { useAccount, useUpdateAccount, useUpdatePassword } from "@/lib/hooks/use-account"
import { ProfileSection } from "./sections/profile-section"
import { EmailSection } from "./sections/email-section"
import { PasswordSection } from "./sections/password-section"
import { LanguageSection } from "./sections/language-section"
import { ConnectedAccountsSection } from "./sections/connected-accounts-section"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { User, Shield, Settings } from "lucide-react"

export function AccountSettings() {
  const { user, loading, error, refetch } = useAccount()
  const { updateAccount, loading: updating } = useUpdateAccount()
  const { updatePassword, loading: updatingPassword } = useUpdatePassword()

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  if (error || !user) {
    return (
      <div>
        <Card>
          <CardContent className="pt-6">
            <p className="text-destructive">
              {error?.message || "Failed to load account settings"}
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const handleUpdateAccount = async (data: {
    name?: string
    email?: string
    language?: string
    image?: string | null
  }) => {
    await updateAccount(data)
    refetch()
  }

  const handleUpdatePassword = async (data: {
    currentPassword: string
    newPassword: string
  }) => {
    await updatePassword(data)
  }

  return (
    <div className="w-full">
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="general" className="gap-2">
            <User className="h-4 w-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <Shield className="h-4 w-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="preferences" className="gap-2">
            <Settings className="h-4 w-4" />
            Preferences
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-6 space-y-6">
          <ProfileSection
            user={user}
            onUpdate={handleUpdateAccount}
            loading={updating}
          />

          <EmailSection
            user={user}
            onUpdate={handleUpdateAccount}
            loading={updating}
          />
        </TabsContent>

        <TabsContent value="security" className="mt-6 space-y-6">
          <PasswordSection
            hasPassword={user.hasPassword}
            onUpdate={handleUpdatePassword}
            loading={updatingPassword}
          />

          <ConnectedAccountsSection />
        </TabsContent>

        <TabsContent value="preferences" className="mt-6 space-y-6">
          <LanguageSection
            user={user}
            onUpdate={handleUpdateAccount}
            loading={updating}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}

