-- Create users profiles table
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null,
  bio text,
  avatar_url text,
  banner_url text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create posts table
create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  content text not null,
  media_urls text[] default array[]::text[],
  post_type text default 'text' check (post_type in ('text', 'image', 'video', 'short')),
  is_public boolean default true,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create likes table
create table if not exists public.likes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  post_id uuid not null references public.posts(id) on delete cascade,
  created_at timestamp with time zone default now(),
  unique(user_id, post_id)
);

-- Create comments table
create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  post_id uuid not null references public.posts(id) on delete cascade,
  content text not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create stories table
create table if not exists public.stories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  media_url text not null,
  expires_at timestamp with time zone not null,
  created_at timestamp with time zone default now()
);

-- Create chat messages table
create table if not exists public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  room_id text not null,
  content text not null,
  created_at timestamp with time zone default now()
);

-- Create direct messages table
create table if not exists public.direct_messages (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid not null references auth.users(id) on delete cascade,
  recipient_id uuid not null references auth.users(id) on delete cascade,
  content text not null,
  read boolean default false,
  created_at timestamp with time zone default now()
);

-- Create follows table for subscriptions
create table if not exists public.follows (
  id uuid primary key default gen_random_uuid(),
  follower_id uuid not null references auth.users(id) on delete cascade,
  following_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamp with time zone default now(),
  unique(follower_id, following_id)
);

-- Create notifications table
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type text not null,
  related_user_id uuid references auth.users(id) on delete cascade,
  related_post_id uuid references public.posts(id) on delete cascade,
  read boolean default false,
  created_at timestamp with time zone default now()
);

-- Create reported content table for moderation
create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references auth.users(id) on delete cascade,
  post_id uuid references public.posts(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  reason text not null,
  status text default 'pending' check (status in ('pending', 'reviewed', 'resolved', 'dismissed')),
  created_at timestamp with time zone default now()
);

-- Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.posts enable row level security;
alter table public.likes enable row level security;
alter table public.comments enable row level security;
alter table public.stories enable row level security;
alter table public.chat_messages enable row level security;
alter table public.direct_messages enable row level security;
alter table public.follows enable row level security;
alter table public.notifications enable row level security;
alter table public.reports enable row level security;

-- Profiles RLS policies
create policy "profiles_select_all" on public.profiles for select using (true);
create policy "profiles_insert_own" on public.profiles for insert with check (auth.uid() = id);
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id);

-- Posts RLS policies
create policy "posts_select_public" on public.posts for select using (is_public = true or auth.uid() = user_id);
create policy "posts_insert_own" on public.posts for insert with check (auth.uid() = user_id);
create policy "posts_update_own" on public.posts for update using (auth.uid() = user_id);
create policy "posts_delete_own" on public.posts for delete using (auth.uid() = user_id);

-- Likes RLS policies
create policy "likes_select_all" on public.likes for select using (true);
create policy "likes_insert_own" on public.likes for insert with check (auth.uid() = user_id);
create policy "likes_delete_own" on public.likes for delete using (auth.uid() = user_id);

-- Comments RLS policies
create policy "comments_select_all" on public.comments for select using (true);
create policy "comments_insert_own" on public.comments for insert with check (auth.uid() = user_id);
create policy "comments_update_own" on public.comments for update using (auth.uid() = user_id);
create policy "comments_delete_own" on public.comments for delete using (auth.uid() = user_id);

-- Stories RLS policies
create policy "stories_select_all" on public.stories for select using (true);
create policy "stories_insert_own" on public.stories for insert with check (auth.uid() = user_id);
create policy "stories_delete_own" on public.stories for delete using (auth.uid() = user_id);

-- Chat messages RLS policies
create policy "chat_messages_select_all" on public.chat_messages for select using (true);
create policy "chat_messages_insert_own" on public.chat_messages for insert with check (auth.uid() = user_id);

-- Direct messages RLS policies
create policy "dm_select_own" on public.direct_messages for select using (auth.uid() = sender_id or auth.uid() = recipient_id);
create policy "dm_insert_own" on public.direct_messages for insert with check (auth.uid() = sender_id);

-- Follows RLS policies
create policy "follows_select_all" on public.follows for select using (true);
create policy "follows_insert_own" on public.follows for insert with check (auth.uid() = follower_id);
create policy "follows_delete_own" on public.follows for delete using (auth.uid() = follower_id);

-- Notifications RLS policies
create policy "notifications_select_own" on public.notifications for select using (auth.uid() = user_id);
create policy "notifications_insert_admin" on public.notifications for insert with check (true);
create policy "notifications_update_own" on public.notifications for update using (auth.uid() = user_id);

-- Reports RLS policies
create policy "reports_select_admin" on public.reports for select using (true);
create policy "reports_insert_own" on public.reports for insert with check (auth.uid() = reporter_id);
