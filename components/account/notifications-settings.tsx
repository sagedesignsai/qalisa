"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Bell, Mail, MessageSquare } from "lucide-react"
import { toast } from "sonner"

interface NotificationPreferences {
  email: {
    enabled: boolean
    marketing: boolean
    security: boolean
    updates: boolean
  }
  push: {
    enabled: boolean
    messages: boolean
    updates: boolean
  }
  inApp: {
    enabled: boolean
    messages: boolean
    updates: boolean
  }
}

const defaultPreferences: NotificationPreferences = {
  email: {
    enabled: true,
    marketing: false,
    security: true,
    updates: true,
  },
  push: {
    enabled: true,
    messages: true,
    updates: false,
  },
  inApp: {
    enabled: true,
    messages: true,
    updates: true,
  },
}

export function NotificationsSettings() {
  const [preferences, setPreferences] = useState<NotificationPreferences>(defaultPreferences)
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    // In a real app, this would save to the database
    // For MVP, we'll just show a toast
    setTimeout(() => {
      setSaving(false)
      toast.success("Notification preferences saved")
    }, 500)
  }

  const updatePreference = (
    category: keyof NotificationPreferences,
    key: string,
    value: boolean
  ) => {
    setPreferences((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value,
      },
    }))
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="space-y-1">
        <h1 className="text-4xl font-bold tracking-tight">Notifications</h1>
        <p className="text-muted-foreground text-lg">
          Manage how you receive notifications and updates
        </p>
      </div>

      <div className="space-y-6">
        <Card className="border-2">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Mail className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl">Email Notifications</CardTitle>
                <CardDescription>
                  Control which email notifications you receive
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
              <div className="space-y-1">
                <Label htmlFor="email-enabled" className="text-base font-semibold">Email notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Enable or disable all email notifications
                </p>
              </div>
              <Switch
                id="email-enabled"
                checked={preferences.email.enabled}
                onCheckedChange={(checked) =>
                  updatePreference("email", "enabled", checked)
                }
              />
            </div>

            <Separator />

            <div className="space-y-4 pl-2">
              <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/30 transition-colors">
                <div className="space-y-1">
                  <Label htmlFor="email-security" className="text-sm font-medium">Security alerts</Label>
                  <p className="text-xs text-muted-foreground">
                    Important security and account updates
                  </p>
                </div>
                <Switch
                  id="email-security"
                  checked={preferences.email.security}
                  disabled={!preferences.email.enabled}
                  onCheckedChange={(checked) =>
                    updatePreference("email", "security", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/30 transition-colors">
                <div className="space-y-1">
                  <Label htmlFor="email-updates" className="text-sm font-medium">Product updates</Label>
                  <p className="text-xs text-muted-foreground">
                    New features and improvements
                  </p>
                </div>
                <Switch
                  id="email-updates"
                  checked={preferences.email.updates}
                  disabled={!preferences.email.enabled}
                  onCheckedChange={(checked) =>
                    updatePreference("email", "updates", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/30 transition-colors">
                <div className="space-y-1">
                  <Label htmlFor="email-marketing" className="text-sm font-medium">Marketing emails</Label>
                  <p className="text-xs text-muted-foreground">
                    Promotional content and tips
                  </p>
                </div>
                <Switch
                  id="email-marketing"
                  checked={preferences.email.marketing}
                  disabled={!preferences.email.enabled}
                  onCheckedChange={(checked) =>
                    updatePreference("email", "marketing", checked)
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Bell className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl">Push Notifications</CardTitle>
                <CardDescription>
                  Control browser push notifications
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
              <div className="space-y-1">
                <Label htmlFor="push-enabled" className="text-base font-semibold">Push notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Enable or disable browser push notifications
                </p>
              </div>
              <Switch
                id="push-enabled"
                checked={preferences.push.enabled}
                onCheckedChange={(checked) =>
                  updatePreference("push", "enabled", checked)
                }
              />
            </div>

            <Separator />

            <div className="space-y-4 pl-2">
              <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/30 transition-colors">
                <div className="space-y-1">
                  <Label htmlFor="push-messages" className="text-sm font-medium">New messages</Label>
                  <p className="text-xs text-muted-foreground">
                    Notify when you receive new messages
                  </p>
                </div>
                <Switch
                  id="push-messages"
                  checked={preferences.push.messages}
                  disabled={!preferences.push.enabled}
                  onCheckedChange={(checked) =>
                    updatePreference("push", "messages", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/30 transition-colors">
                <div className="space-y-1">
                  <Label htmlFor="push-updates" className="text-sm font-medium">Updates</Label>
                  <p className="text-xs text-muted-foreground">
                    Notify about important updates
                  </p>
                </div>
                <Switch
                  id="push-updates"
                  checked={preferences.push.updates}
                  disabled={!preferences.push.enabled}
                  onCheckedChange={(checked) =>
                    updatePreference("push", "updates", checked)
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <MessageSquare className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl">In-App Notifications</CardTitle>
                <CardDescription>
                  Control notifications within the application
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
              <div className="space-y-1">
                <Label htmlFor="inapp-enabled" className="text-base font-semibold">In-app notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Enable or disable in-app notifications
                </p>
              </div>
              <Switch
                id="inapp-enabled"
                checked={preferences.inApp.enabled}
                onCheckedChange={(checked) =>
                  updatePreference("inApp", "enabled", checked)
                }
              />
            </div>

            <Separator />

            <div className="space-y-4 pl-2">
              <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/30 transition-colors">
                <div className="space-y-1">
                  <Label htmlFor="inapp-messages" className="text-sm font-medium">New messages</Label>
                  <p className="text-xs text-muted-foreground">
                    Show notifications for new messages
                  </p>
                </div>
                <Switch
                  id="inapp-messages"
                  checked={preferences.inApp.messages}
                  disabled={!preferences.inApp.enabled}
                  onCheckedChange={(checked) =>
                    updatePreference("inApp", "messages", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/30 transition-colors">
                <div className="space-y-1">
                  <Label htmlFor="inapp-updates" className="text-sm font-medium">Updates</Label>
                  <p className="text-xs text-muted-foreground">
                    Show notifications for updates
                  </p>
                </div>
                <Switch
                  id="inapp-updates"
                  checked={preferences.inApp.updates}
                  disabled={!preferences.inApp.enabled}
                  onCheckedChange={(checked) =>
                    updatePreference("inApp", "updates", checked)
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end pt-4">
        <Button onClick={handleSave} disabled={saving} size="lg" className="min-w-[160px]">
          {saving ? "Saving..." : "Save Preferences"}
        </Button>
      </div>
    </div>
  )
}

