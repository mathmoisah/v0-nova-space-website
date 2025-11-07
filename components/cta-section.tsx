"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export default function CTASection() {
  return (
    <section className="py-20 px-4 bg-secondary/50">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        <div className="space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold font-poppins">
            Prêt à créer votre <span style={{ color: "#00D4FF" }}>histoire?</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Rejoignez des milliers de créateurs qui partagent leur passion et construisent une communauté engagée sur
            NovaSpace.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Link href="/auth/sign-up">
            <Button size="lg" className="gap-2" style={{ backgroundColor: "#00D4FF", color: "#111827" }}>
              Créer mon compte
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Link href="/feed">
            <Button size="lg" variant="outline">
              Découvrir la communauté
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
