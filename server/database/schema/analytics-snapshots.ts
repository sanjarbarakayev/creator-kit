import {
  pgTable,
  uuid,
  date,
  integer,
  numeric,
  jsonb,
  timestamp,
  unique,
} from 'drizzle-orm/pg-core'
import { socialAccounts } from './social-accounts'

export const analyticsSnapshots = pgTable('analytics_snapshots', {
  id: uuid('id').defaultRandom().primaryKey(),
  socialAccountId: uuid('social_account_id').references(() => socialAccounts.id, { onDelete: 'cascade' }).notNull(),
  snapshotDate: date('snapshot_date').notNull(),
  followersCount: integer('followers_count'),
  followingCount: integer('following_count'),
  postsCount: integer('posts_count'),
  avgLikes: numeric('avg_likes'),
  avgComments: numeric('avg_comments'),
  avgViews: numeric('avg_views'),
  engagementRate: numeric('engagement_rate'),
  audienceDemographics: jsonb('audience_demographics'),
  topPosts: jsonb('top_posts'),
  growthRate: numeric('growth_rate'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  unique('uq_account_date').on(table.socialAccountId, table.snapshotDate),
])
