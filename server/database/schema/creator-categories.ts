import {
  pgTable,
  serial,
  text,
} from 'drizzle-orm/pg-core'

export const creatorCategories = pgTable('creator_categories', {
  id: serial('id').primaryKey(),
  slug: text('slug').unique().notNull(),
  nameUz: text('name_uz').notNull(),
  nameRu: text('name_ru').notNull(),
  nameEn: text('name_en').notNull(),
  icon: text('icon'),
})
