import postgres from 'postgres'
import { drizzle } from 'drizzle-orm/postgres-js'
import { creatorCategories } from './schema'

const connectionString = process.env.DATABASE_URL
if (!connectionString) {
  console.error('DATABASE_URL is required')
  process.exit(1)
}

const client = postgres(connectionString, { prepare: false })
const db = drizzle(client)

const categories = [
  { slug: 'lifestyle', nameUz: 'Hayot tarzi', nameRu: 'Лайфстайл', nameEn: 'Lifestyle', icon: 'i-lucide-heart' },
  { slug: 'food', nameUz: 'Ovqat', nameRu: 'Еда', nameEn: 'Food', icon: 'i-lucide-utensils' },
  { slug: 'fashion', nameUz: 'Moda', nameRu: 'Мода', nameEn: 'Fashion', icon: 'i-lucide-shirt' },
  { slug: 'tech', nameUz: 'Texnologiya', nameRu: 'Технологии', nameEn: 'Tech', icon: 'i-lucide-laptop' },
  { slug: 'fitness', nameUz: 'Fitnes', nameRu: 'Фитнес', nameEn: 'Fitness', icon: 'i-lucide-dumbbell' },
  { slug: 'beauty', nameUz: "Go'zallik", nameRu: 'Красота', nameEn: 'Beauty', icon: 'i-lucide-sparkles' },
  { slug: 'travel', nameUz: 'Sayohat', nameRu: 'Путешествия', nameEn: 'Travel', icon: 'i-lucide-plane' },
  { slug: 'education', nameUz: "Ta'lim", nameRu: 'Образование', nameEn: 'Education', icon: 'i-lucide-graduation-cap' },
  { slug: 'business', nameUz: 'Biznes', nameRu: 'Бизнес', nameEn: 'Business', icon: 'i-lucide-briefcase' },
  { slug: 'entertainment', nameUz: "Ko'ngilochar", nameRu: 'Развлечения', nameEn: 'Entertainment', icon: 'i-lucide-clapperboard' },
]

async function seed() {
  console.info('Seeding creator categories...')

  await db
    .insert(creatorCategories)
    .values(categories)
    .onConflictDoNothing({ target: creatorCategories.slug })

  console.info(`Seeded ${categories.length} categories`)
  process.exit(0)
}

seed().catch((error) => {
  console.error('Seed failed:', error)
  process.exit(1)
})
