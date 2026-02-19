import {
  pgTable,
  uuid,
  text,
  jsonb,
  boolean,
  integer,
  timestamp,
} from 'drizzle-orm/pg-core'
import { profiles } from './profiles'

export const mediaKits = pgTable('media_kits', {
  id: uuid('id').defaultRandom().primaryKey(),
  profileId: uuid('profile_id').references(() => profiles.id, { onDelete: 'cascade' }).notNull(),
  template: text('template'),
  customData: jsonb('custom_data'),
  includeAnalytics: boolean('include_analytics').default(true),
  pdfUrl: text('pdf_url'),
  pdfGeneratedAt: timestamp('pdf_generated_at', { withTimezone: true }),
  viewsCount: integer('views_count').default(0).notNull(),
  downloadsCount: integer('downloads_count').default(0).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
})
