import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import UserNav from "@/components/user-nav"
import ChatMessage from "@/components/chat-message"
import DirectMessageInput from "@/components/direct-message-input"

export default async function DirectMessagePage({ params }: { params: { userId: string } }) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  // Fetch other user profile
  const { data: otherProfile } = await supabase.from("profiles").select("*").eq("id", params.userId).single()

  if (!otherProfile) {
    redirect("/messages")
  }

  // Fetch messages
  const { data: messages } = await supabase
    .from("direct_messages")
    .select("*, profiles:sender_id(display_name, avatar_url)")
    .or(
      `and(sender_id.eq.${user.id},recipient_id.eq.${params.userId}),and(sender_id.eq.${params.userId},recipient_id.eq.${user.id})`,
    )
    .order("created_at", { ascending: true })
    .limit(100)

  return (
    <>
      <UserNav user={user} avatar={profile?.avatar_url} />
      <div className="pt-20 min-h-screen bg-background">
        <div className="max-w-2xl mx-auto px-4 py-8">
          <div className="flex flex-col h-96 rounded-2xl border border-border bg-card overflow-hidden">
            <div className="p-6 border-b border-border">
              <h1 className="text-2xl font-bold font-poppins">{otherProfile.display_name}</h1>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages && messages.length > 0 ? (
                messages.map((message) => (
                  <ChatMessage key={message.id} message={message} isOwn={message.sender_id === user.id} />
                ))
              ) : (
                <div className="h-full flex items-center justify-center text-center">
                  <p className="text-muted-foreground">Aucun message. Commencez la conversation!</p>
                </div>
              )}
            </div>

            <DirectMessageInput recipientId={params.userId} userId={user.id} />
          </div>
        </div>
      </div>
    </>
  )
}
