import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import UserNav from "@/components/user-nav"
import ChatRoomSelector from "@/components/chat-room-selector"
import ChatMessage from "@/components/chat-message"
import ChatInput from "@/components/chat-input"

export default async function ChatRoomPage({ params }: { params: { roomId: string } }) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  // Fetch messages
  const { data: messages } = await supabase
    .from("chat_messages")
    .select("*, profiles:user_id(display_name, avatar_url)")
    .eq("room_id", params.roomId)
    .order("created_at", { ascending: true })
    .limit(50)

  const roomName = params.roomId.charAt(0).toUpperCase() + params.roomId.slice(1)

  return (
    <>
      <UserNav user={user} avatar={profile?.avatar_url} />
      <div className="pt-20 min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="hidden lg:block space-y-6">
              <ChatRoomSelector />
            </div>

            <div className="lg:col-span-2 flex flex-col h-96 rounded-2xl border border-border bg-card overflow-hidden">
              <div className="p-6 border-b border-border">
                <h1 className="text-2xl font-bold font-poppins capitalize">{roomName}</h1>
                <p className="text-sm text-muted-foreground">Discussion en temps réel</p>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages && messages.length > 0 ? (
                  messages.map((message) => (
                    <ChatMessage key={message.id} message={message} isOwn={message.user_id === user.id} />
                  ))
                ) : (
                  <div className="h-full flex items-center justify-center text-center">
                    <p className="text-muted-foreground">Aucun message pour le moment. Commencez la conversation!</p>
                  </div>
                )}
              </div>

              <ChatInput roomId={params.roomId} userId={user.id} />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
