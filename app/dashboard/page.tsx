import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  // Redirect to onboarding if profile incomplete
  if (!profile?.bio) {
    redirect("/dashboard/onboarding")
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold font-poppins">Bienvenue, {profile.display_name}!</h1>
        <p className="text-lg text-muted-foreground">
          Commencez à explorer le contenu et à vous connecter avec d'autres créateurs.
        </p>
      </div>

      <div className="mt-12 grid md:grid-cols-2 gap-6">
        <div className="p-8 rounded-2xl border border-border bg-card hover:border-blue-500/50 transition cursor-pointer">
          <h3 className="text-xl font-semibold font-poppins mb-2">Créer un post</h3>
          <p className="text-muted-foreground">Partagez vos pensées, photos et vidéos avec la communauté.</p>
        </div>

        <div className="p-8 rounded-2xl border border-border bg-card hover:border-blue-500/50 transition cursor-pointer">
          <h3 className="text-xl font-semibold font-poppins mb-2">Découvrir du contenu</h3>
          <p className="text-muted-foreground">Explorez les posts populaires et trouvez de nouveaux créateurs.</p>
        </div>

        <div className="p-8 rounded-2xl border border-border bg-card hover:border-blue-500/50 transition cursor-pointer">
          <h3 className="text-xl font-semibold font-poppins mb-2">Chatter en direct</h3>
          <p className="text-muted-foreground">Rejoignez des discussions en temps réel dans nos salons thématiques.</p>
        </div>

        <div className="p-8 rounded-2xl border border-border bg-card hover:border-blue-500/50 transition cursor-pointer">
          <h3 className="text-xl font-semibold font-poppins mb-2">Mes paramètres</h3>
          <p className="text-muted-foreground">Gérez votre profil et vos préférences de notification.</p>
        </div>
      </div>
    </div>
  )
}
