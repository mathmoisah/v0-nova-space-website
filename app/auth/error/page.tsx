import { Button } from "@/components/ui/button"
import { AlertCircle, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function AuthErrorPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 bg-gradient-to-b from-background to-secondary/5">
      <Link href="/" className="mb-8 flex items-center gap-2 hover:opacity-80 transition">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600" />
        <span className="font-bold text-lg" style={{ color: "#00D4FF" }}>
          NovaSpace
        </span>
      </Link>

      <div className="w-full max-w-md mx-auto">
        <div className="rounded-2xl border border-border bg-card p-8 shadow-lg text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-bold font-poppins">Erreur d'authentification</h1>
            <p className="text-muted-foreground">
              Une erreur s'est produite lors de la vérification de votre email. Veuillez réessayer.
            </p>
          </div>

          <div className="space-y-3 pt-4">
            <Link href="/auth/sign-up">
              <Button className="w-full gap-2" style={{ backgroundColor: "#00D4FF", color: "#111827" }}>
                Réessayer l'inscription
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline" className="w-full gap-2 bg-transparent">
                <ArrowLeft className="w-4 h-4" />
                Retourner à l'accueil
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
