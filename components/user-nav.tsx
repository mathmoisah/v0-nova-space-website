"use client"

import type React from "react"

import Link from "next/link"
import { Search, Bell, Plus, LogOut, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

interface UserNavProps {
  user: { email?: string; user_metadata?: { display_name?: string } }
  avatar?: string
}

export default function UserNav({ user, avatar }: UserNavProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
  }

  const displayName = user.user_metadata?.display_name || user.email?.split("@")[0] || "Utilisateur"
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-6">
        <Link href="/dashboard" className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600" />
          <span className="font-bold text-lg hidden sm:inline" style={{ color: "#00D4FF" }}>
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

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="hover:opacity-80 transition">
                <Avatar className="w-10 h-10 border-2" style={{ borderColor: "#00D4FF" }}>
                  <AvatarImage src={avatar || "/placeholder.svg"} alt={displayName} />
                  <AvatarFallback className="font-semibold">{initials}</AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem asChild>
                <Link href={`/profile`}>Mon profil</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings">
                  <Settings className="w-4 h-4 mr-2" />
                  Paramètres
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-red-500">
                <LogOut className="w-4 h-4 mr-2" />
                Déconnexion
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  )
}
