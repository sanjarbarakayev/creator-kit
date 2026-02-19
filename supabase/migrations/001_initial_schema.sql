-- 001_initial_schema.sql
-- CreatorKit initial database schema

-- profiles
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text UNIQUE NOT NULL,
  full_name text,
  avatar_url text,
  bio text,
  niche text[],
  language text[],
  city text,
  country text DEFAULT 'UZ',
  contact_email text,
  telegram_username text,
  is_public boolean NOT NULL DEFAULT true,
  onboarding_complete boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- social_accounts
CREATE TABLE IF NOT EXISTS social_accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  platform text NOT NULL,
  platform_user_id text,
  platform_username text,
  access_token text,
  refresh_token text,
  token_expires_at timestamptz,
  followers_count integer,
  is_connected boolean NOT NULL DEFAULT true,
  last_synced_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- analytics_snapshots
CREATE TABLE IF NOT EXISTS analytics_snapshots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  social_account_id uuid NOT NULL REFERENCES social_accounts(id) ON DELETE CASCADE,
  snapshot_date date NOT NULL,
  followers_count integer,
  following_count integer,
  posts_count integer,
  avg_likes numeric,
  avg_comments numeric,
  avg_views numeric,
  engagement_rate numeric,
  audience_demographics jsonb,
  top_posts jsonb,
  growth_rate numeric,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(social_account_id, snapshot_date)
);

-- media_kits
CREATE TABLE IF NOT EXISTS media_kits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  template text,
  custom_data jsonb,
  include_analytics boolean DEFAULT true,
  pdf_url text,
  pdf_generated_at timestamptz,
  views_count integer NOT NULL DEFAULT 0,
  downloads_count integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- creator_categories
CREATE TABLE IF NOT EXISTS creator_categories (
  id serial PRIMARY KEY,
  slug text UNIQUE NOT NULL,
  name_uz text NOT NULL,
  name_ru text NOT NULL,
  name_en text NOT NULL,
  icon text
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_profiles_username ON profiles(username);
CREATE INDEX IF NOT EXISTS idx_profiles_country ON profiles(country);
CREATE INDEX IF NOT EXISTS idx_profiles_is_public ON profiles(is_public);
CREATE INDEX IF NOT EXISTS idx_social_accounts_profile_id ON social_accounts(profile_id);
CREATE INDEX IF NOT EXISTS idx_social_accounts_platform ON social_accounts(platform);
CREATE INDEX IF NOT EXISTS idx_analytics_snapshots_account_id ON analytics_snapshots(social_account_id);
CREATE INDEX IF NOT EXISTS idx_analytics_snapshots_date ON analytics_snapshots(snapshot_date);
CREATE INDEX IF NOT EXISTS idx_media_kits_profile_id ON media_kits(profile_id);
CREATE INDEX IF NOT EXISTS idx_creator_categories_slug ON creator_categories(slug);

-- RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_kits ENABLE ROW LEVEL SECURITY;
ALTER TABLE creator_categories ENABLE ROW LEVEL SECURITY;

-- profiles policies
CREATE POLICY "profiles_select_public" ON profiles FOR SELECT
  USING (is_public = true OR auth.uid() = id);
CREATE POLICY "profiles_insert_owner" ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_owner" ON profiles FOR UPDATE
  USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- social_accounts policies
CREATE POLICY "social_accounts_select_owner" ON social_accounts FOR SELECT
  USING (auth.uid() = profile_id);
CREATE POLICY "social_accounts_insert_owner" ON social_accounts FOR INSERT
  WITH CHECK (auth.uid() = profile_id);
CREATE POLICY "social_accounts_update_owner" ON social_accounts FOR UPDATE
  USING (auth.uid() = profile_id) WITH CHECK (auth.uid() = profile_id);
CREATE POLICY "social_accounts_delete_owner" ON social_accounts FOR DELETE
  USING (auth.uid() = profile_id);

-- analytics_snapshots policies
CREATE POLICY "analytics_snapshots_select_owner" ON analytics_snapshots FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM social_accounts
    WHERE social_accounts.id = analytics_snapshots.social_account_id
      AND social_accounts.profile_id = auth.uid()
  ));
CREATE POLICY "analytics_snapshots_insert_service" ON analytics_snapshots FOR INSERT
  WITH CHECK (auth.role() = 'service_role');

-- media_kits policies
CREATE POLICY "media_kits_select_public" ON media_kits FOR SELECT
  USING (pdf_url IS NOT NULL OR auth.uid() = profile_id);
CREATE POLICY "media_kits_insert_owner" ON media_kits FOR INSERT
  WITH CHECK (auth.uid() = profile_id);
CREATE POLICY "media_kits_update_owner" ON media_kits FOR UPDATE
  USING (auth.uid() = profile_id) WITH CHECK (auth.uid() = profile_id);
CREATE POLICY "media_kits_delete_owner" ON media_kits FOR DELETE
  USING (auth.uid() = profile_id);

-- creator_categories policies
CREATE POLICY "creator_categories_select_public" ON creator_categories FOR SELECT
  USING (true);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER media_kits_updated_at BEFORE UPDATE ON media_kits
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
