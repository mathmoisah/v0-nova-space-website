"use client"

import { Heart, MessageCircle, Share2, Camera, Video, Flame } from "lucide-react"

const features = [
  {
    icon: Camera,
    title: "Partage créatif",
    description: "Partagez photos, vidéos et stories avec votre communauté.",
  },
  {
    icon: Heart,
    title: "Engagement social",
    description: "Likez, commentez et découvrez du contenu en direct.",
  },
  {
    icon: MessageCircle,
    title: "Chat communautaire",
    description: "Discussions en temps réel avec la communauté dans des salons thématiques.",
  },
  {
    icon: Video,
    title: "Shorts et Stories",
    description: "Créez des vidéos courtes et des stories verticales qui disparaissent.",
  },
  {
    icon: Share2,
    title: "Partage facile",
    description: "Partage instantané sur vos réseaux sociaux préférés.",
  },
  {
    icon: Flame,
    title: "Tendances",
    description: "Découvrez le contenu le plus populaire et les créateurs en vogue.",
  },
]

export default function FeaturesSection() {
  return (
    <section className="py-20 px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold font-poppins">Tout ce dont vous avez besoin</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Une plateforme complète pour créer, partager et vous connecter avec une communauté mondiale.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, idx) => {
            const Icon = feature.icon
            return (
              <div
                key={idx}
                className="p-6 rounded-xl border border-border bg-card hover:border-blue-500/50 transition-all hover:shadow-lg hover:shadow-blue-500/10"
              >
                <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6" style={{ color: "#00D4FF" }} />
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
