"use client"

import { useState } from "react"
import Link from "next/link"
import { Heart, MessageCircle, Share2, Trash2 } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

interface Post {
  id: string
  user_id: string
  content: string
  media_urls?: string[]
  post_type: string
  is_public: boolean
  created_at: string
  updated_at: string
}

interface Profile {
  id: string
  display_name: string
  avatar_url?: string
}

interface FeedPostProps {
  post: Post
  profile: Profile
  currentUserId: string
  likes: number
  comments: number
  isLiked: boolean
  onLikeChange?: (liked: boolean) => void
}

export default function FeedPost({
  post,
  profile,
  currentUserId,
  likes,
  comments,
  isLiked,
  onLikeChange,
}: FeedPostProps) {
  const [liked, setLiked] = useState(isLiked)
  const [likeCount, setLikeCount] = useState(likes)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLike = async () => {
    if (loading) return
    setLoading(true)

    try {
      const supabase = createClient()

      if (liked) {
        // Unlike
        const { error } = await supabase.from("likes").delete().eq("user_id", currentUserId).eq("post_id", post.id)

        if (!error) {
          setLiked(false)
          setLikeCount(Math.max(0, likeCount - 1))
          onLikeChange?.(false)
        }
      } else {
        // Like
        const { error } = await supabase.from("likes").insert({
          user_id: currentUserId,
          post_id: post.id,
        })

        if (!error) {
          setLiked(true)
          setLikeCount(likeCount + 1)
          onLikeChange?.(true)
        }
      }
    } catch (error) {
      console.error("Error toggling like:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (currentUserId !== post.user_id) return

    try {
      const supabase = createClient()

      const { error } = await supabase.from("posts").delete().eq("id", post.id)

      if (!error) {
        router.refresh()
      }
    } catch (error) {
      console.error("Error deleting post:", error)
    }
  }

  const formatDate = (date: string) => {
    const now = new Date()
    const created = new Date(date)
    const diff = now.getTime() - created.getTime()
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (hours < 1) return "À l'instant"
    if (hours < 24) return `Il y a ${hours}h`
    if (days < 7) return `Il y a ${days}j`
    return created.toLocaleDateString("fr-FR")
  }

  return (
    <article className="p-6 border border-border bg-card rounded-xl hover:border-blue-500/30 transition">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <Avatar className="w-12 h-12">
            <AvatarImage src={profile?.avatar_url || "/placeholder.svg"} alt={profile?.display_name} />
            <AvatarFallback className="font-semibold">
              {profile?.display_name?.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div>
            <Link href={`/profile/${profile.id}`}>
              <h3 className="font-semibold hover:text-blue-400 transition">{profile.display_name}</h3>
            </Link>
            <p className="text-xs text-muted-foreground">{formatDate(post.created_at)}</p>
          </div>
        </div>

        {currentUserId === post.user_id && (
          <button onClick={handleDelete} className="p-2 hover:bg-secondary rounded-lg transition text-destructive">
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="mb-4">
        <p className="text-foreground leading-relaxed break-words">{post.content}</p>
      </div>

      {post.media_urls && post.media_urls.length > 0 && (
        <div className="mb-4 grid gap-2">
          {post.media_urls.map((url, idx) => (
            <div key={idx} className="rounded-lg overflow-hidden bg-secondary/50">
              <img
                src={url || "/placeholder.svg"}
                alt={`Post media ${idx + 1}`}
                className="w-full h-auto max-h-96 object-cover"
              />
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between pt-4 border-t border-border">
        <button
          onClick={handleLike}
          disabled={loading}
          className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-secondary transition disabled:opacity-50"
        >
          <Heart className="w-5 h-5" fill={liked ? "#00D4FF" : "none"} stroke={liked ? "#00D4FF" : "currentColor"} />
          <span className="text-sm font-medium">{likeCount}</span>
        </button>

        <Link href={`/post/${post.id}`}>
          <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-secondary transition">
            <MessageCircle className="w-5 h-5" />
            <span className="text-sm font-medium">{comments}</span>
          </button>
        </Link>

        <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-secondary transition">
          <Share2 className="w-5 h-5" />
          <span className="text-sm font-medium">Partager</span>
        </button>
      </div>
    </article>
  )
}
