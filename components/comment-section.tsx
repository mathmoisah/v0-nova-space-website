"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { createClient } from "@/lib/supabase/client"
import { Send } from "lucide-react"

interface Comment {
  id: string
  user_id: string
  content: string
  created_at: string
  profiles?: { display_name: string; avatar_url?: string }
}

interface CommentSectionProps {
  postId: string
  userId: string
}

export default function CommentSection({ postId, userId }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState("")
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    fetchComments()
  }, [])

  const fetchComments = async () => {
    const { data } = await supabase
      .from("comments")
      .select("*, profiles:user_id(display_name, avatar_url)")
      .eq("post_id", postId)
      .order("created_at", { ascending: true })

    if (data) {
      setComments(data)
    }
  }

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return

    setLoading(true)

    try {
      const { data: comment, error } = await supabase
        .from("comments")
        .insert({
          post_id: postId,
          user_id: userId,
          content: newComment,
        })
        .select("*, profiles:user_id(display_name, avatar_url)")
        .single()

      if (!error && comment) {
        setComments([...comments, comment])
        setNewComment("")
      }
    } catch (err) {
      console.error("Error adding comment:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold font-poppins">Commentaires</h2>

      <form onSubmit={handleAddComment} className="space-y-3 p-6 border border-border rounded-xl bg-card">
        <Textarea
          placeholder="Partagez votre avis..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          disabled={loading}
          rows={3}
        />
        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={loading || !newComment.trim()}
            className="gap-2"
            style={{ backgroundColor: loading ? "#0099CC" : "#00D4FF", color: "#111827" }}
          >
            <Send className="w-4 h-4" />
            Commenter
          </Button>
        </div>
      </form>

      <div className="space-y-4">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id} className="flex gap-3 p-4 rounded-lg bg-card border border-border">
              <Avatar className="w-10 h-10 shrink-0">
                <AvatarImage src={comment.profiles?.avatar_url || "/placeholder.svg"} />
                <AvatarFallback className="text-sm">
                  {comment.profiles?.display_name?.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <p className="font-semibold text-sm">{comment.profiles?.display_name}</p>
                <p className="text-foreground mt-1 text-sm">{comment.content}</p>
                <p className="text-xs text-muted-foreground mt-2">
                  {new Date(comment.created_at).toLocaleDateString("fr-FR")}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-muted-foreground py-6">Aucun commentaire pour le moment.</p>
        )}
      </div>
    </div>
  )
}
