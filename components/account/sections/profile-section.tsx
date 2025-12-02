"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { User } from "@/lib/hooks/use-account"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User as UserIcon, Upload } from "lucide-react"

const profileSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name is too long"),
  image: z.string().url().optional().nullable(),
})

type ProfileFormData = z.infer<typeof profileSchema>

interface ProfileSectionProps {
  user: User
  onUpdate: (data: { name?: string; image?: string | null }) => Promise<void>
  loading: boolean
}

export function ProfileSection({ user, onUpdate, loading }: ProfileSectionProps) {
  const [avatarUrl, setAvatarUrl] = useState(user.image || "")

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user.name || "",
      image: user.image || "",
    },
  })

  const onSubmit = async (data: ProfileFormData) => {
    await onUpdate({
      name: data.name,
      image: data.image || null,
    })
  }

  return (
    <Card className="border-2">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <UserIcon className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-xl">Profile</CardTitle>
            <CardDescription>
              Update your profile information and avatar
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 p-4 rounded-lg bg-muted/30">
          <Avatar className="h-28 w-28 ring-4 ring-background shadow-lg">
            <AvatarImage src={avatarUrl || undefined} alt={user.name || "User"} />
            <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10">
              <UserIcon className="h-14 w-14 text-primary" />
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-2 w-full">
            <Label htmlFor="image" className="text-sm font-medium">Avatar URL</Label>
            <Input
              id="image"
              {...register("image")}
              placeholder="https://example.com/avatar.jpg"
              value={avatarUrl}
              onChange={(e) => {
                setAvatarUrl(e.target.value)
                register("image").onChange(e)
              }}
              className="bg-background"
            />
            <p className="text-xs text-muted-foreground">
              Enter a URL to your profile picture. Changes will be reflected immediately.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">Full Name</Label>
            <Input
              id="name"
              {...register("name")}
              placeholder="John Doe"
              className="h-11"
            />
            {errors.name && (
              <p className="text-sm text-destructive flex items-center gap-1">
                {errors.name.message}
              </p>
            )}
          </div>

          <div className="flex justify-end pt-2">
            <Button type="submit" disabled={loading} size="lg" className="min-w-[120px]">
              {loading ? (
                <>
                  <span className="mr-2">Saving...</span>
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

