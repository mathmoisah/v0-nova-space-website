import { createClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import UserNav from "@/components/user-nav"
import FeedPost from "@/components/feed-post"
import CommentSection from "@/components/comment-section"

export default async function PostDetailPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  // Fetch post
  const { data: post } = await supabase.from("posts").select("*").eq("id", params.id).single()

  if (!post) {
    notFound()
  }

  // Check access
  if (!post.is_public && post.user_id !== user.id) {
    redirect("/feed")
  }

  // Fetch post author
  const { data: postProfile } = await supabase.from("profiles").select("*").eq("id", post.user_id).single()

  // Fetch stats
  const { count: likeCount } = await supabase
    .from("likes")
    .select("*", { count: "exact", head: true })
    .eq("post_id", post.id)

  const { count: commentCount } = await supabase
    .from("comments")
    .select("*", { count: "exact", head: true })
    .eq("post_id", post.id)

  const { data: userLike } = await supabase
    .from("likes")
    .select("*")
    .eq("user_id", user.id)
    .eq("post_id", post.id)
    .single()

  return (
    <>
      <UserNav user={user} avatar={profile?.avatar_url} />
      <div className="pt-20 min-h-screen bg-background">
        <div className="max-w-2xl mx-auto px-4 py-8">
          <FeedPost
            post={post}
            profile={postProfile}
            currentUserId={user.id}
            likes={likeCount || 0}
            comments={commentCount || 0}
            isLiked={!!userLike}
          />

          <div className="mt-8">
            <CommentSection postId={post.id} userId={user.id} />
          </div>
        </div>
      </div>
    </>
  )
}
