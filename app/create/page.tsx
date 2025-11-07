import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import UserNav from "@/components/user-nav"
import CreatePostForm from "@/components/create-post-form"

export default async function CreatePage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  if (!profile?.bio) {
    redirect("/dashboard/onboarding")
  }

  return (
    <>
      <UserNav user={user} avatar={profile?.avatar_url} />
      <div className="pt-20 min-h-screen bg-background">
        <div className="max-w-2xl mx-auto px-4 py-8">
          <div className="space-y-4 mb-8">
            <h1 className="text-4xl font-bold font-poppins">Créer un post</h1>
            <p className="text-lg text-muted-foreground">
              Partagez vos pensées, photos, vidéos et stories avec la communauté NovaSpace
            </p>
          </div>

          <div className="flex gap-2 mb-8 border-b border-border">
            {["Post", "Story", "Short"].map((tab) => (
              <button
                key={tab}
                className="px-4 py-3 font-medium text-sm border-b-2 border-transparent hover:border-blue-500/50 transition text-muted-foreground hover:text-foreground"
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="bg-card border border-border rounded-2xl p-8">
            <CreatePostForm userId={user.id} displayName={profile.display_name} avatar={profile.avatar_url} />
          </div>
        </div>
      </div>
    </>
  )
}
