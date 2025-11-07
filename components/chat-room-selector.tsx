"use client"

import Link from "next/link"
import { Users } from "lucide-react"

interface ChatRoom {
  id: string
  name: string
  description: string
  memberCount: number
}

const chatRooms: ChatRoom[] = [
  { id: "general", name: "Général", description: "Discussions générales", memberCount: 1250 },
  { id: "art", name: "Art & Design", description: "Partagez vos créations", memberCount: 856 },
  { id: "tech", name: "Technologie", description: "Technologie et innovation", memberCount: 723 },
  { id: "music", name: "Musique", description: "Musique et audio", memberCount: 645 },
]

export default function ChatRoomSelector() {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="font-semibold flex items-center gap-2">
          <Users className="w-4 h-4" style={{ color: "#00D4FF" }} />
          Salons thématiques
        </h3>
      </div>

      {chatRooms.map((room) => (
        <Link key={room.id} href={`/chat/${room.id}`}>
          <button className="w-full text-left p-4 rounded-lg border border-border bg-card hover:border-blue-500/50 transition">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-semibold text-sm">{room.name}</p>
                <p className="text-xs text-muted-foreground">{room.description}</p>
              </div>
              <span className="text-xs px-2 py-1 rounded-full bg-blue-500/20" style={{ color: "#00D4FF" }}>
                {room.memberCount} en ligne
              </span>
            </div>
          </button>
        </Link>
      ))}
    </div>
  )
}
