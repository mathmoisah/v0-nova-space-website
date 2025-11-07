import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import OnboardingForm from "@/components/onboarding-form"

export default async function OnboardingPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  // Redirect if already has a bio (indicates onboarding is complete)
  if (profile?.bio) {
    redirect("/dashboard")
  }

  return (
    <div className="flex items-center justify-center min-h-screen px-4 py-8 bg-gradient-to-b from-background to-secondary/5">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-border bg-card p-8 shadow-lg space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold font-poppins">Bienvenue à NovaSpace!</h1>
            <p className="text-muted-foreground">Complétez votre profil pour commencer à explorer</p>
          </div>

          <OnboardingForm userId={user.id} initialName={profile?.display_name} />
        </div>
      </div>
    </div>
  )
}
