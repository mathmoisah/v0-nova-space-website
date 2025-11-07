"use client"

import type React from "react"

import Link from "next/link"
import { Search, Bell, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export default function NavBar() {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-6">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600" />
          <span className="font-bold text-lg" style={{ color: "#00D4FF" }}>
            NovaSpace
          </span>
        </Link>

        <div className="hidden md:flex flex-1 max-w-sm">
          <div className="w-full relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-secondary text-foreground placeholder-muted-foreground border border-border focus:outline-none focus:ring-2"
              style={{ "--tw-ring-color": "#00D4FF" } as React.CSSProperties}
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button className="relative p-2 hover:bg-secondary rounded-lg transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500" />
          </button>

          <Link href="/create">
            <Button className="gap-2 md:gap-2" style={{ backgroundColor: "#00D4FF", color: "#111827" }}>
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Créer</span>
            </Button>
          </Link>

          <Link href="/auth/login">
            <Button variant="outline">Connexion</Button>
          </Link>
        </div>
      </div>
    </nav>
  )
}
