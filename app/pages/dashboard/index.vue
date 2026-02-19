<script setup lang="ts">
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler } from 'chart.js'
import { Line, Bar } from 'vue-chartjs'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler)

definePageMeta({
  middleware: 'auth',
})

const { t } = useI18n()
const authStore = useAuthStore()

// Mock data
const mockStats = {
  followers: 12450,
  engagementRate: 4.2,
  weeklyGrowth: 2.8,
  connectedAccounts: 1,
}

const statCards = computed(() => [
  {
    label: t('dashboard.followers'),
    value: mockStats.followers.toLocaleString(),
    trend: '+3.2%',
    positive: true,
    icon: 'i-lucide-users',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
  },
  {
    label: t('dashboard.engagement'),
    value: `${mockStats.engagementRate}%`,
    trend: '+0.5%',
    positive: true,
    icon: 'i-lucide-trending-up',
    color: 'text-green-400',
    bg: 'bg-green-500/10',
  },
  {
    label: t('dashboard.growth'),
    value: `+${mockStats.weeklyGrowth}%`,
    trend: '+1.1%',
    positive: true,
    icon: 'i-lucide-arrow-up-right',
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
  },
  {
    label: t('dashboard.connectedAccounts'),
    value: mockStats.connectedAccounts.toString(),
    trend: '',
    positive: true,
    icon: 'i-lucide-link',
    color: 'text-orange-400',
    bg: 'bg-orange-500/10',
  },
])

// Growth chart
const selectedPeriod = ref<'7d' | '30d' | '90d'>('30d')

function generateGrowthData(days: number) {
  const labels: string[] = []
  const data: number[] = []
  const now = new Date()
  let base = 12450 - days * 15

  for (let i = days; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(d.getDate() - i)
    labels.push(d.toLocaleDateString('en', { month: 'short', day: 'numeric' }))
    base += Math.floor(Math.random() * 30) + 5
    data.push(base)
  }
  return { labels, data }
}

const growthChartData = computed(() => {
  const days = selectedPeriod.value === '7d' ? 7 : selectedPeriod.value === '30d' ? 30 : 90
  const { labels, data } = generateGrowthData(days)
  return {
    labels,
    datasets: [{
      label: t('dashboard.followers'),
      data,
      borderColor: '#3b82f6',
      backgroundColor: 'rgba(59,130,246,0.1)',
      fill: true,
      tension: 0.4,
      pointRadius: 0,
      pointHitRadius: 10,
    }],
  }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: {
    x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#71717a' } },
    y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#71717a' } },
  },
}

// Engagement chart
function generateEngagementData() {
  const labels: string[] = []
  const data: number[] = []
  const now = new Date()
  for (let i = 13; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(d.getDate() - i)
    labels.push(d.toLocaleDateString('en', { month: 'short', day: 'numeric' }))
    data.push(+(3 + Math.random() * 3).toFixed(1))
  }
  return { labels, data }
}

const engagementData = generateEngagementData()
const engagementChartData = {
  labels: engagementData.labels,
  datasets: [{
    label: t('dashboard.engagement'),
    data: engagementData.data,
    backgroundColor: '#22c55e',
    borderRadius: 4,
  }],
}

const barOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: {
    x: { grid: { display: false }, ticks: { color: '#71717a', maxRotation: 45 } },
    y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#71717a' } },
  },
}

// Mock top posts
const mockPosts = [
  { id: 1, likes: 842, comments: 56, date: '2026-02-15' },
  { id: 2, likes: 721, comments: 43, date: '2026-02-13' },
  { id: 3, likes: 695, comments: 38, date: '2026-02-10' },
  { id: 4, likes: 634, comments: 29, date: '2026-02-08' },
  { id: 5, likes: 589, comments: 35, date: '2026-02-05' },
  { id: 6, likes: 512, comments: 22, date: '2026-02-02' },
]
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div>
      <h1 class="text-2xl font-bold text-white">
        {{ t('dashboard.title') }}
      </h1>
      <p class="mt-1 text-sm text-zinc-400">
        {{ t('dashboard.welcome', { name: authStore.user?.email }) }}
      </p>
    </div>

    <!-- Stats Cards -->
    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <UCard v-for="card in statCards" :key="card.label" class="bg-zinc-900 border-zinc-800">
        <div class="flex items-start justify-between">
          <div>
            <p class="text-sm text-zinc-400">{{ card.label }}</p>
            <p class="mt-2 text-3xl font-bold text-white">{{ card.value }}</p>
            <p v-if="card.trend" class="mt-1 text-sm" :class="card.positive ? 'text-green-400' : 'text-red-400'">
              {{ card.trend }}
            </p>
          </div>
          <div :class="[card.bg, 'rounded-lg p-2.5']">
            <UIcon :name="card.icon" :class="[card.color, 'size-5']" />
          </div>
        </div>
      </UCard>
    </div>

    <!-- Growth Chart -->
    <UCard class="bg-zinc-900 border-zinc-800">
      <div class="mb-4 flex items-center justify-between">
        <h2 class="text-lg font-semibold text-white">{{ t('dashboard.growthChart') }}</h2>
        <div class="flex gap-1">
          <UButton
            v-for="p in (['7d', '30d', '90d'] as const)"
            :key="p"
            size="xs"
            :variant="selectedPeriod === p ? 'solid' : 'ghost'"
            :color="selectedPeriod === p ? 'primary' : 'neutral'"
            @click="selectedPeriod = p"
          >
            {{ t(`dashboard.period${p.charAt(0).toUpperCase() + p.slice(1)}`) }}
          </UButton>
        </div>
      </div>
      <div class="h-72">
        <Line :data="growthChartData" :options="chartOptions" />
      </div>
    </UCard>

    <!-- Engagement + Top Posts -->
    <div class="grid gap-6 lg:grid-cols-2">
      <!-- Engagement Chart -->
      <UCard class="bg-zinc-900 border-zinc-800">
        <h2 class="mb-4 text-lg font-semibold text-white">{{ t('dashboard.engagementChart') }}</h2>
        <div class="h-64">
          <Bar :data="engagementChartData" :options="barOptions" />
        </div>
      </UCard>

      <!-- Top Posts -->
      <UCard class="bg-zinc-900 border-zinc-800">
        <h2 class="mb-4 text-lg font-semibold text-white">{{ t('dashboard.topPosts') }}</h2>
        <div class="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <div
            v-for="post in mockPosts"
            :key="post.id"
            class="group cursor-pointer overflow-hidden rounded-lg border border-zinc-800 transition-all hover:border-zinc-600"
          >
            <div class="aspect-square bg-zinc-800 flex items-center justify-center">
              <UIcon name="i-lucide-image" class="size-8 text-zinc-600" />
            </div>
            <div class="p-2">
              <div class="flex items-center gap-2 text-xs text-zinc-400">
                <span>❤️ {{ post.likes }}</span>
                <span>💬 {{ post.comments }}</span>
              </div>
              <p class="mt-1 text-xs text-zinc-500">{{ post.date }}</p>
            </div>
          </div>
        </div>
      </UCard>
    </div>

    <!-- Quick Actions -->
    <UCard class="bg-zinc-900 border-zinc-800">
      <h2 class="mb-4 text-lg font-semibold text-white">{{ t('dashboard.quickActions') }}</h2>
      <div class="flex flex-wrap gap-3">
        <UButton color="primary" icon="i-lucide-instagram" to="/dashboard/instagram">
          {{ t('dashboard.connectInstagram') }}
        </UButton>
        <UButton variant="soft" color="neutral" icon="i-lucide-file-text" to="/dashboard/media-kit">
          {{ t('dashboard.createMediaKit') }}
        </UButton>
        <UButton variant="outline" color="neutral" icon="i-lucide-refresh-cw">
          {{ t('dashboard.syncAnalytics') }}
        </UButton>
      </div>
    </UCard>
  </div>
</template>
