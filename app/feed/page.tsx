import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import UserNav from "@/components/user-nav"
import FeedPost from "@/components/feed-post"
import FeedSidebar from "@/components/feed-sidebar"

export default async function FeedPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  // Fetch posts
  const { data: posts } = await supabase
    .from("posts")
    .select("*")
    .eq("is_public", true)
    .order("created_at", { ascending: false })
    .limit(20)

  // Fetch user likes
  const { data: userLikes } = await supabase.from("likes").select("post_id").eq("user_id", user.id)

  const likedPostIds = new Set(userLikes?.map((l) => l.post_id) || [])

  // Fetch post stats
  const postStats = await Promise.all(
    posts?.map(async (post) => {
      const { count: likeCount } = await supabase
        .from("likes")
        .select("*", { count: "exact", head: true })
        .eq("post_id", post.id)

      const { count: commentCount } = await supabase
        .from("comments")
        .select("*", { count: "exact", head: true })
        .eq("post_id", post.id)

      const { data: postProfile } = await supabase.from("profiles").select("*").eq("id", post.user_id).single()

      return {
        post,
        likeCount: likeCount || 0,
        commentCount: commentCount || 0,
        profile: postProfile,
      }
    }) || [],
  )

  return (
    <>
      <UserNav user={user} avatar={profile?.avatar_url} />
      <div className="pt-20 min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="space-y-2">
                <h1 className="text-4xl font-bold font-poppins">Fil d'actualité</h1>
                <p className="text-muted-foreground">Découvrez le meilleur du contenu de NovaSpace</p>
              </div>

              <div className="flex gap-2 border-b border-border">
                {["Tout", "Populaire", "Récent", "Shorts", "Photos", "Stories"].map((tab) => (
                  <button
                    key={tab}
                    className="px-4 py-3 font-medium text-sm border-b-2 border-transparent hover:border-blue-500/50 transition text-muted-foreground hover:text-foreground"
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className="space-y-6">
                {postStats.length > 0 ? (
                  postStats.map(({ post, likeCount, commentCount, profile: postProfile }) => (
                    <FeedPost
                      key={post.id}
                      post={post}
                      profile={postProfile}
                      currentUserId={user.id}
                      likes={likeCount}
                      comments={commentCount}
                      isLiked={likedPostIds.has(post.id)}
                    />
                  ))
                ) : (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">Aucun post disponible pour le moment.</p>
                  </div>
                )}
              </div>
            </div>

            <div className="hidden lg:block">
              <FeedSidebar />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
