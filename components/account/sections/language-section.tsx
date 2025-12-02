"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { User } from "@/lib/hooks/use-account"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Globe } from "lucide-react"

const languageSchema = z.object({
  language: z.string().min(1, "Language is required"),
})

type LanguageFormData = z.infer<typeof languageSchema>

const languages = [
  { value: "en", label: "English" },
  { value: "es", label: "Spanish" },
  { value: "fr", label: "French" },
  { value: "de", label: "German" },
  { value: "it", label: "Italian" },
  { value: "pt", label: "Portuguese" },
  { value: "ja", label: "Japanese" },
  { value: "zh", label: "Chinese" },
  { value: "ko", label: "Korean" },
]

interface LanguageSectionProps {
  user: User
  onUpdate: (data: { language?: string }) => Promise<void>
  loading: boolean
}

export function LanguageSection({ user, onUpdate, loading }: LanguageSectionProps) {
  const {
    handleSubmit,
    setValue,
    watch,
  } = useForm<LanguageFormData>({
    resolver: zodResolver(languageSchema),
    defaultValues: {
      language: user.language || "en",
    },
  })

  const selectedLanguage = watch("language")

  const onSubmit = async (data: LanguageFormData) => {
    if (data.language !== user.language) {
      await onUpdate({ language: data.language })
    }
  }

  return (
    <Card className="border-2">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Globe className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-xl">Language & Region</CardTitle>
            <CardDescription>
              Choose your preferred language for the interface
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="language" className="text-sm font-medium">Language</Label>
            <Select
              value={selectedLanguage}
              onValueChange={(value) => setValue("language", value)}
            >
              <SelectTrigger id="language" className="h-11">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem key={lang.value} value={lang.value}>
                    {lang.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end pt-2">
            <Button type="submit" disabled={loading} size="lg" className="min-w-[140px]">
              <Globe className="mr-2 h-4 w-4" />
              {loading ? "Saving..." : "Save Language"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

