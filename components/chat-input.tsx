"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Loader } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

interface ChatInputProps {
  roomId: string
  userId: string
}

export default function ChatInput({ roomId, userId }: ChatInputProps) {
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim() || loading) return

    setLoading(true)

    try {
      const supabase = createClient()

      const { error } = await supabase.from("chat_messages").insert({
        room_id: roomId,
        user_id: userId,
        content: message,
      })

      if (!error) {
        setMessage("")
        router.refresh()
      }
    } catch (err) {
      console.error("Error sending message:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSendMessage} className="p-4 border-t border-border">
      <div className="flex gap-2">
        <Input
          type="text"
          placeholder="Écrivez un message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={loading}
          maxLength={500}
        />
        <Button
          type="submit"
          disabled={loading || !message.trim()}
          size="icon"
          style={{ backgroundColor: loading ? "#0099CC" : "#00D4FF", color: "#111827" }}
        >
          {loading ? <Loader className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        </Button>
      </div>
    </form>
  )
}
