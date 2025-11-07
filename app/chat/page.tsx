import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import UserNav from "@/components/user-nav"
import ChatRoomSelector from "@/components/chat-room-selector"
import { Mail } from "lucide-react"

export default async function ChatPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  return (
    <>
      <UserNav user={user} avatar={profile?.avatar_url} />
      <div className="pt-20 min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="space-y-6">
              <ChatRoomSelector />
            </div>

            <div className="lg:col-span-2">
              <div className="h-96 rounded-2xl border border-border bg-card flex flex-col items-center justify-center text-center p-6">
                <Mail className="w-12 h-12 opacity-50 mb-4 mx-auto" style={{ color: "#00D4FF" }} />
                <h2 className="text-xl font-semibold mb-2">Sélectionnez un salon</h2>
                <p className="text-muted-foreground text-sm max-w-sm">
                  Choisissez un salon thématique à gauche pour commencer à discuter avec la communauté
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
