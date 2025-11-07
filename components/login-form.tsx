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

export default function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const supabase = createClient()

      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (authError) {
        setError(authError.message)
        setLoading(false)
        return
      }

      if (data.user) {
        router.push("/dashboard")
        router.refresh()
      }
    } catch (err) {
      setError("Une erreur est survenue. Veuillez réessayer.")
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleLogin} className="space-y-5">
      {error && (
        <div className="flex gap-3 p-4 rounded-lg bg-red-500/10 border border-red-500/30">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <p className="text-sm text-red-500">{error}</p>
        </div>
      )}

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
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Mot de passe</Label>
          <Link
            href="/auth/forgot-password"
            className="text-sm hover:text-blue-400 transition"
            style={{ color: "#00D4FF" }}
          >
            Oublié?
          </Link>
        </div>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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
        {loading ? "Connexion..." : "Se connecter"}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Pas de compte?{" "}
        <Link href="/auth/sign-up" className="hover:text-blue-400 transition" style={{ color: "#00D4FF" }}>
          Créer un compte
        </Link>
      </p>
    </form>
  )
}
