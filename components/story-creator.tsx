"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { AlertCircle, Loader, Upload } from "lucide-react"

interface StoryCreatorProps {
  userId: string
}

export default function StoryCreator({ userId }: StoryCreatorProps) {
  const [mediaUrl, setMediaUrl] = useState<string | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file size
    if (file.size > 50 * 1024 * 1024) {
      setError("Le fichier ne doit pas dépasser 50 Mo")
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string
      setPreviewUrl(dataUrl)
      setMediaUrl(dataUrl)
    }
    reader.readAsDataURL(file)
  }

  const handleCreateStory = async () => {
    if (!mediaUrl) {
      setError("Veuillez ajouter un média")
      return
    }

    setLoading(true)

    // Story creation logic will be similar to post creation
    // For now, we show the UI structure

    setLoading(false)
  }

  return (
    <div className="space-y-6 p-8 bg-card border border-border rounded-2xl">
      {error && (
        <div className="flex gap-3 p-4 rounded-lg bg-red-500/10 border border-red-500/30">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <p className="text-sm text-red-500">{error}</p>
        </div>
      )}

      <div>
        {previewUrl ? (
          <div className="relative rounded-lg overflow-hidden bg-secondary max-h-96">
            <img src={previewUrl || "/placeholder.svg"} alt="Story preview" className="w-full h-auto object-cover" />
            <button
              type="button"
              onClick={() => {
                setPreviewUrl(null)
                setMediaUrl(null)
              }}
              className="absolute top-4 right-4 px-4 py-2 bg-black/50 hover:bg-black/70 rounded-lg transition text-white"
            >
              Modifier
            </button>
          </div>
        ) : (
          <label className="block p-12 border-2 border-dashed border-border rounded-lg hover:border-blue-500/50 cursor-pointer transition">
            <div className="flex flex-col items-center justify-center gap-3">
              <Upload className="w-8 h-8" style={{ color: "#00D4FF" }} />
              <span className="font-semibold">Glissez-déposez ou cliquez pour ajouter une story</span>
              <span className="text-xs text-muted-foreground">Max 50 Mo • Les stories expirent après 24h</span>
            </div>
            <input
              type="file"
              accept="image/*,video/*"
              onChange={handleMediaUpload}
              disabled={loading}
              className="hidden"
            />
          </label>
        )}
      </div>

      <Button
        type="button"
        onClick={handleCreateStory}
        disabled={loading || !mediaUrl}
        className="w-full gap-2"
        style={{ backgroundColor: loading ? "#0099CC" : "#00D4FF", color: "#111827" }}
      >
        {loading && <Loader className="w-4 h-4 animate-spin" />}
        {loading ? "Publication..." : "Publier la story"}
      </Button>

      <p className="text-xs text-muted-foreground text-center">
        Les stories sont visibles pendant 24 heures avant de disparaître automatiquement.
      </p>
    </div>
  )
}
