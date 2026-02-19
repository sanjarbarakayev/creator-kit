-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_kits ENABLE ROW LEVEL SECURITY;
ALTER TABLE creator_categories ENABLE ROW LEVEL SECURITY;

-- profiles: public SELECT if is_public, owner INSERT/UPDATE
CREATE POLICY "profiles_select_public"
  ON profiles FOR SELECT
  USING (is_public = true OR auth.uid() = id);

CREATE POLICY "profiles_insert_owner"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_update_owner"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- social_accounts: owner ALL
CREATE POLICY "social_accounts_select_owner"
  ON social_accounts FOR SELECT
  USING (auth.uid() = profile_id);

CREATE POLICY "social_accounts_insert_owner"
  ON social_accounts FOR INSERT
  WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "social_accounts_update_owner"
  ON social_accounts FOR UPDATE
  USING (auth.uid() = profile_id)
  WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "social_accounts_delete_owner"
  ON social_accounts FOR DELETE
  USING (auth.uid() = profile_id);

-- analytics_snapshots: owner SELECT via FK, service_role INSERT
CREATE POLICY "analytics_snapshots_select_owner"
  ON analytics_snapshots FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM social_accounts
      WHERE social_accounts.id = analytics_snapshots.social_account_id
        AND social_accounts.profile_id = auth.uid()
    )
  );

CREATE POLICY "analytics_snapshots_insert_service"
  ON analytics_snapshots FOR INSERT
  WITH CHECK (auth.role() = 'service_role');

-- media_kits: owner ALL + public SELECT if pdf_url exists
CREATE POLICY "media_kits_select_public"
  ON media_kits FOR SELECT
  USING (pdf_url IS NOT NULL OR auth.uid() = profile_id);

CREATE POLICY "media_kits_insert_owner"
  ON media_kits FOR INSERT
  WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "media_kits_update_owner"
  ON media_kits FOR UPDATE
  USING (auth.uid() = profile_id)
  WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "media_kits_delete_owner"
  ON media_kits FOR DELETE
  USING (auth.uid() = profile_id);

-- creator_categories: public SELECT
CREATE POLICY "creator_categories_select_public"
  ON creator_categories FOR SELECT
  USING (true);
