import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import UserNav from "@/components/user-nav"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MessageCircle } from "lucide-react"

export default async function MessagesPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  // Fetch conversations
  const { data: conversations } = await supabase
    .from("direct_messages")
    .select("sender_id, recipient_id, content, created_at, profiles:sender_id(display_name, avatar_url)")
    .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
    .order("created_at", { ascending: false })
    .limit(20)

  // Group conversations by user
  const conversationMap = new Map()
  conversations?.forEach((conv) => {
    const otherUserId = conv.sender_id === user.id ? conv.recipient_id : conv.sender_id
    if (!conversationMap.has(otherUserId)) {
      conversationMap.set(otherUserId, conv)
    }
  })

  return (
    <>
      <UserNav user={user} avatar={profile?.avatar_url} />
      <div className="pt-20 min-h-screen bg-background">
        <div className="max-w-2xl mx-auto px-4 py-8">
          <div className="space-y-4 mb-8">
            <h1 className="text-4xl font-bold font-poppins">Messages directs</h1>
            <p className="text-lg text-muted-foreground">Conversations privées avec d'autres utilisateurs</p>
          </div>

          <div className="space-y-3">
            {conversationMap.size > 0 ? (
              Array.from(conversationMap.entries()).map(([userId, conv]) => (
                <Link key={userId} href={`/messages/${userId}`}>
                  <button className="w-full p-4 rounded-lg border border-border bg-card hover:border-blue-500/50 transition text-left">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={conv.profiles?.avatar_url || "/placeholder.svg"} />
                        <AvatarFallback className="text-sm">
                          {conv.profiles?.display_name?.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1 min-w-0">
                        <p className="font-semibold">{conv.profiles?.display_name}</p>
                        <p className="text-sm text-muted-foreground truncate">{conv.content}</p>
                      </div>

                      <p className="text-xs text-muted-foreground shrink-0">
                        {new Date(conv.created_at).toLocaleDateString("fr-FR")}
                      </p>
                    </div>
                  </button>
                </Link>
              ))
            ) : (
              <div className="text-center py-12">
                <MessageCircle className="w-12 h-12 mx-auto opacity-50 mb-4" />
                <p className="text-muted-foreground">Aucun message direct pour le moment</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
