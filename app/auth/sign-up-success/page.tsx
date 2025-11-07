import { Button } from "@/components/ui/button"
import { Mail, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function SignUpSuccessPage() {
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
          <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto">
            <Mail className="w-8 h-8 text-green-500" />
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-bold font-poppins">Vérifiez votre email</h1>
            <p className="text-muted-foreground">
              Un lien de confirmation a été envoyé à votre adresse email. Cliquez sur le lien pour activer votre compte.
            </p>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
            <p className="text-sm text-foreground">
              N'oubliez pas de vérifier votre dossier de courrier indésirable (spam) si vous ne voyez pas l'email.
            </p>
          </div>

          <div className="space-y-3 pt-4">
            <Link href="/" className="block">
              <Button className="w-full gap-2" style={{ backgroundColor: "#00D4FF", color: "#111827" }}>
                Retourner à l'accueil
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button variant="outline" className="w-full bg-transparent">
                Se connecter
              </Button>
            </Link>
          </div>

          <p className="text-xs text-muted-foreground">
            Une fois confirmé, vous pourrez vous connecter et commencer à créer du contenu!
          </p>
        </div>
      </div>
    </div>
  )
}
