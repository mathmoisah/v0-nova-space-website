"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { AlertCircle, Loader, ImageIcon, Lock, Globe } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface CreatePostFormProps {
  userId: string
  displayName: string
  avatar?: string
}

export default function CreatePostForm({ userId, displayName, avatar }: CreatePostFormProps) {
  const [content, setContent] = useState("")
  const [mediaUrls, setMediaUrls] = useState<string[]>([])
  const [previewUrls, setPreviewUrls] = useState<string[]>([])
  const [postType, setPostType] = useState<"text" | "image" | "video" | "short">("text")
  const [isPublic, setIsPublic] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])

    files.forEach((file) => {
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError("Les fichiers ne doivent pas dépasser 10 Mo")
        return
      }

      // Create preview URL
      const reader = new FileReader()
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string
        setPreviewUrls((prev) => [...prev, dataUrl])
        setMediaUrls((prev) => [...prev, dataUrl])
        setPostType("image")
      }
      reader.readAsDataURL(file)
    })
  }

  const removeMedia = (index: number) => {
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index))
    setMediaUrls((prev) => prev.filter((_, i) => i !== index))
    if (mediaUrls.length === 1) {
      setPostType("text")
    }
  }

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!content.trim() && mediaUrls.length === 0) {
      setError("Veuillez ajouter du contenu ou une image")
      return
    }

    setLoading(true)

    try {
      const supabase = createClient()

      const { data, error: createError } = await supabase
        .from("posts")
        .insert({
          user_id: userId,
          content: content || "",
          media_urls: mediaUrls.length > 0 ? mediaUrls : undefined,
          post_type: postType,
          is_public: isPublic,
        })
        .select()
        .single()

      if (createError) {
        setError(createError.message)
        setLoading(false)
        return
      }

      // Reset form
      setContent("")
      setMediaUrls([])
      setPreviewUrls([])
      setPostType("text")

      // Redirect to feed
      router.push("/feed")
      router.refresh()
    } catch (err) {
      setError("Une erreur est survenue. Veuillez réessayer.")
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleCreatePost} className="space-y-6">
      {error && (
        <div className="flex gap-3 p-4 rounded-lg bg-red-500/10 border border-red-500/30">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <p className="text-sm text-red-500">{error}</p>
        </div>
      )}

      <div className="flex items-center gap-3 p-4 bg-card border border-border rounded-xl">
        <Avatar className="w-12 h-12">
          <AvatarImage src={avatar || "/placeholder.svg"} alt={displayName} />
          <AvatarFallback className="font-semibold">{displayName.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-semibold">{displayName}</p>
          <p className="text-xs text-muted-foreground">Partagez votre création</p>
        </div>
      </div>

      <div>
        <Textarea
          placeholder="Que souhaitez-vous partager avec la communauté?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={loading}
          maxLength={2000}
          rows={6}
          className="resize-none"
        />
        <p className="text-xs text-muted-foreground mt-2">{content.length}/2000 caractères</p>
      </div>

      {previewUrls.length > 0 && (
        <div className="grid grid-cols-2 gap-4">
          {previewUrls.map((url, idx) => (
            <div key={idx} className="relative rounded-lg overflow-hidden bg-secondary">
              <img src={url || "/placeholder.svg"} alt={`Preview ${idx + 1}`} className="w-full h-48 object-cover" />
              <button
                type="button"
                onClick={() => removeMedia(idx)}
                className="absolute top-2 right-2 p-2 bg-black/50 hover:bg-black/70 rounded-lg transition text-white"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
        <div className="flex gap-2">
          <label className="p-3 rounded-lg border border-border bg-card hover:border-blue-500/50 cursor-pointer transition">
            <ImageIcon className="w-5 h-5" />
            <input
              type="file"
              multiple
              accept="image/*,video/*"
              onChange={handleMediaUpload}
              disabled={loading}
              className="hidden"
            />
          </label>

          <button
            type="button"
            onClick={() => setIsPublic(!isPublic)}
            className="px-4 py-3 rounded-lg border border-border bg-card hover:border-blue-500/50 transition flex items-center gap-2 font-medium text-sm"
          >
            {isPublic ? (
              <>
                <Globe className="w-4 h-4" />
                Public
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                Privé
              </>
            )}
          </button>
        </div>

        <Button
          type="submit"
          disabled={loading || (!content.trim() && mediaUrls.length === 0)}
          className="gap-2"
          style={{ backgroundColor: loading ? "#0099CC" : "#00D4FF", color: "#111827" }}
        >
          {loading && <Loader className="w-4 h-4 animate-spin" />}
          {loading ? "Publication..." : "Publier"}
        </Button>
      </div>
    </form>
  )
}
