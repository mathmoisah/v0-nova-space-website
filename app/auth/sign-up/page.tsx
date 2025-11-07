import AuthCard from "@/components/auth-card"
import SignupForm from "@/components/signup-form"
import Link from "next/link"

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 bg-gradient-to-b from-background to-secondary/5">
      <Link href="/" className="mb-8 flex items-center gap-2 hover:opacity-80 transition">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600" />
        <span className="font-bold text-lg" style={{ color: "#00D4FF" }}>
          NovaSpace
        </span>
      </Link>

      <AuthCard title="Créer un compte" subtitle="Rejoignez la communauté NovaSpace">
        <SignupForm />
      </AuthCard>
    </div>
  )
}
