"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { AlertCircle, Loader } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { createClient } from "@/lib/supabase/client"

interface OnboardingFormProps {
  userId: string
  initialName?: string
}

export default function OnboardingForm({ userId, initialName = "" }: OnboardingFormProps) {
  const [displayName, setDisplayName] = useState(initialName)
  const [bio, setBio] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleOnboarding = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!displayName.trim()) {
      setError("Le nom d'affichage est requis")
      return
    }

    setLoading(true)

    try {
      const supabase = createClient()

      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          display_name: displayName,
          bio: bio || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId)

      if (updateError) {
        setError(updateError.message)
        setLoading(false)
        return
      }

      router.push("/dashboard")
      router.refresh()
    } catch (err) {
      setError("Une erreur est survenue. Veuillez réessayer.")
      setLoading(false)
    }
  }

  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  return (
    <form onSubmit={handleOnboarding} className="space-y-6">
      {error && (
        <div className="flex gap-3 p-4 rounded-lg bg-red-500/10 border border-red-500/30">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <p className="text-sm text-red-500">{error}</p>
        </div>
      )}

      <div className="flex justify-center">
        <Avatar className="w-24 h-24 border-4" style={{ borderColor: "#00D4FF" }}>
          <AvatarFallback className="text-xl font-bold">{initials || "NS"}</AvatarFallback>
        </Avatar>
      </div>

      <div className="space-y-2">
        <Label htmlFor="displayName">Nom d'affichage</Label>
        <Input
          id="displayName"
          type="text"
          placeholder="Votre nom"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          required
          disabled={loading}
          maxLength={50}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio">Bio (optionnel)</Label>
        <Textarea
          id="bio"
          placeholder="Parlez-nous un peu de vous..."
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          disabled={loading}
          maxLength={160}
          rows={4}
        />
        <p className="text-xs text-muted-foreground">{bio.length}/160 caractères</p>
      </div>

      <Button
        type="submit"
        className="w-full gap-2"
        disabled={loading}
        style={{ backgroundColor: loading ? "#0099CC" : "#00D4FF", color: "#111827" }}
      >
        {loading && <Loader className="w-4 h-4 animate-spin" />}
        {loading ? "Sauvegarde..." : "Terminer la configuration"}
      </Button>

      <p className="text-center text-xs text-muted-foreground">
        Vous pouvez modifier ces informations plus tard dans vos paramètres.
      </p>
    </form>
  )
}
