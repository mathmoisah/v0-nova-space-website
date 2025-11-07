"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, Loader } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

export default function SignupForm() {
  const [displayName, setDisplayName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas")
      return
    }

    if (password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères")
      return
    }

    setLoading(true)

    try {
      const supabase = createClient()

      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo:
            process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/auth/callback`,
          data: {
            display_name: displayName,
          },
        },
      })

      if (authError) {
        setError(authError.message)
        setLoading(false)
        return
      }

      if (data.user) {
        router.push("/auth/sign-up-success")
      }
    } catch (err) {
      setError("Une erreur est survenue. Veuillez réessayer.")
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSignup} className="space-y-5">
      {error && (
        <div className="flex gap-3 p-4 rounded-lg bg-red-500/10 border border-red-500/30">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <p className="text-sm text-red-500">{error}</p>
        </div>
      )}

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
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Adresse email</Label>
        <Input
          id="email"
          type="email"
          placeholder="votre@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Mot de passe</Label>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={loading}
        />
        <p className="text-xs text-muted-foreground">Au minimum 8 caractères</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
        <Input
          id="confirmPassword"
          type="password"
          placeholder="••••••••"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          disabled={loading}
        />
      </div>

      <Button
        type="submit"
        className="w-full gap-2"
        disabled={loading}
        style={{ backgroundColor: loading ? "#0099CC" : "#00D4FF", color: "#111827" }}
      >
        {loading && <Loader className="w-4 h-4 animate-spin" />}
        {loading ? "Création..." : "Créer un compte"}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Déjà un compte?{" "}
        <Link href="/auth/login" className="hover:text-blue-400 transition" style={{ color: "#00D4FF" }}>
          Se connecter
        </Link>
      </p>
    </form>
  )
}
