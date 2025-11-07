"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface ChatMessageProps {
  message: {
    id: string
    user_id: string
    content: string
    created_at: string
    profiles?: { display_name: string; avatar_url?: string }
  }
  isOwn: boolean
}

export default function ChatMessage({ message, isOwn }: ChatMessageProps) {
  const displayName = message.profiles?.display_name || "Utilisateur"
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()

  const formatTime = (date: string) => {
    return new Date(date).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <div className={`flex gap-3 ${isOwn ? "flex-row-reverse" : ""}`}>
      <Avatar className="w-8 h-8 shrink-0">
        <AvatarImage src={message.profiles?.avatar_url || "/placeholder.svg"} alt={displayName} />
        <AvatarFallback className="text-xs">{initials}</AvatarFallback>
      </Avatar>

      <div className={`flex flex-col ${isOwn ? "items-end" : "items-start"}`}>
        <p className="text-xs text-muted-foreground mb-1">{displayName}</p>
        <div
          className={`px-4 py-2 rounded-lg max-w-xs break-words ${
            isOwn ? "bg-blue-500 text-white" : "bg-card border border-border"
          }`}
          style={isOwn ? { backgroundColor: "#00D4FF", color: "#111827" } : {}}
        >
          <p className="text-sm">{message.content}</p>
        </div>
        <p className="text-xs text-muted-foreground mt-1">{formatTime(message.created_at)}</p>
      </div>
    </div>
  )
}
