"use client"

import type React from "react"

import Link from "next/link"
import { TrendingUp, Users } from "lucide-react"
import { Button } from "@/components/ui/button"

interface TrendingTopic {
  name: string
  posts: number
}

const trendingTopics: TrendingTopic[] = [
  { name: "Créativité", posts: 15420 },
  { name: "Technologie", posts: 12340 },
  { name: "Art Numérique", posts: 9876 },
  { name: "Musique", posts: 8765 },
  { name: "Photography", posts: 7654 },
]

export default function FeedSidebar() {
  return (
    <aside className="space-y-6">
      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5" style={{ color: "#00D4FF" }} />
          <h2 className="text-xl font-bold font-poppins">Tendances</h2>
        </div>

        <div className="space-y-3">
          {trendingTopics.map((topic, idx) => (
            <Link key={idx} href={`/feed?topic=${topic.name}`}>
              <button className="w-full text-left p-3 rounded-lg hover:bg-secondary transition">
                <p className="font-semibold text-foreground">#{topic.name}</p>
                <p className="text-xs text-muted-foreground">{topic.posts.toLocaleString()} posts</p>
              </button>
            </Link>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <Users className="w-5 h-5" style={{ color: "#00D4FF" }} />
          <h2 className="text-xl font-bold font-poppins">À suivre</h2>
        </div>

        <div className="space-y-3">
          {[1, 2, 3].map((idx) => (
            <div key={idx} className="flex items-center justify-between p-3 rounded-lg hover:bg-secondary transition">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600" />
                <div>
                  <p className="text-sm font-semibold">Créateur {idx}</p>
                  <p className="text-xs text-muted-foreground">@creator{idx}</p>
                </div>
              </div>
              <Button size="sm" variant="outline" style={{ "--tw-ring-color": "#00D4FF" } as React.CSSProperties}>
                Suivre
              </Button>
            </div>
          ))}
        </div>
      </div>
    </aside>
  )
}
