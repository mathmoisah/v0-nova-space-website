import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Heart, Settings } from "lucide-react"
import Link from "next/link"
import UserNav from "@/components/user-nav"

export default async function ProfilePage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  if (!profile) {
    redirect("/dashboard/onboarding")
  }

  // Get post and follower stats
  const { count: postsCount } = await supabase
    .from("posts")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)

  const { count: followersCount } = await supabase
    .from("follows")
    .select("*", { count: "exact", head: true })
    .eq("following_id", user.id)

  const { count: followingCount } = await supabase
    .from("follows")
    .select("*", { count: "exact", head: true })
    .eq("follower_id", user.id)

  return (
    <>
      <UserNav user={user} avatar={profile?.avatar_url} />
      <div className="pt-20 min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="h-32 rounded-2xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-border mb-4" />

          <div className="flex items-start justify-between mb-8">
            <div className="flex items-start gap-6">
              <Avatar className="w-32 h-32 border-4 -mt-16 relative z-10" style={{ borderColor: "#00D4FF" }}>
                <AvatarImage src={profile?.avatar_url || "/placeholder.svg"} alt={profile?.display_name} />
                <AvatarFallback className="text-2xl font-bold">
                  {profile?.display_name
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="pt-4 flex-1">
                <h1 className="text-3xl font-bold font-poppins">{profile?.display_name}</h1>
                <p className="text-muted-foreground">@{user.email?.split("@")[0]}</p>
                {profile?.bio && <p className="mt-3 text-foreground max-w-md">{profile.bio}</p>}
              </div>
            </div>

            <Link href="/settings">
              <Button variant="outline" size="icon">
                <Settings className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-8 bg-card border border-border rounded-xl p-6">
            <div className="text-center">
              <p className="text-2xl font-bold" style={{ color: "#00D4FF" }}>
                {postsCount || 0}
              </p>
              <p className="text-sm text-muted-foreground">Posts</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold" style={{ color: "#00D4FF" }}>
                {followersCount || 0}
              </p>
              <p className="text-sm text-muted-foreground">Abonnés</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold" style={{ color: "#00D4FF" }}>
                {followingCount || 0}
              </p>
              <p className="text-sm text-muted-foreground">Abonnements</p>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold font-poppins">Galerie</h2>
            <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="aspect-square rounded-lg bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-border flex items-center justify-center hover:border-blue-500/50 transition cursor-pointer"
                >
                  <div className="text-center">
                    <Heart className="w-8 h-8 mx-auto opacity-50" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
