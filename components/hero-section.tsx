"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Zap, Users, Sparkles } from "lucide-react"

export default function HeroSection() {
  return (
    <section className="min-h-screen pt-20 px-4 bg-gradient-to-b from-background to-secondary/5 flex items-center">
      <div className="max-w-7xl mx-auto w-full">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl font-bold font-poppins leading-tight text-balance">
                Explorez un <span style={{ color: "#00D4FF" }}>univers créatif</span> sans limites
              </h1>
              <p className="text-lg text-muted-foreground max-w-lg">
                NovaSpace est votre plateforme communautaire pour partager du contenu, créer, discuter et vous connecter
                avec des créateurs du monde entier.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/auth/sign-up">
                <Button
                  size="lg"
                  className="w-full sm:w-auto gap-2"
                  style={{ backgroundColor: "#00D4FF", color: "#111827" }}
                >
                  Commencer gratuitement
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/feed">
                <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent">
                  Explorer le contenu
                </Button>
              </Link>
            </div>

            <div className="pt-8 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <Zap className="w-5 h-5" style={{ color: "#00D4FF" }} />
                </div>
                <span className="text-foreground">Partage instantané de contenu</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <Users className="w-5 h-5" style={{ color: "#00D4FF" }} />
                </div>
                <span className="text-foreground">Communauté mondiale engagée</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <Sparkles className="w-5 h-5" style={{ color: "#00D4FF" }} />
                </div>
                <span className="text-foreground">Découvrez des créateurs talentueux</span>
              </div>
            </div>
          </div>

          <div className="hidden md:block">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center space-y-4">
                  <Sparkles className="w-24 h-24 mx-auto" style={{ color: "#00D4FF" }} />
                  <p className="text-lg font-semibold">NovaSpace</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
