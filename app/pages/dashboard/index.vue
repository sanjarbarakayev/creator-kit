<script setup lang="ts">
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler } from 'chart.js'
import { Line, Bar } from 'vue-chartjs'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler)

definePageMeta({ middleware: 'auth' })

const { t } = useI18n()
const authStore = useAuthStore()

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
    gradient: 'from-violet-600/30 to-indigo-600/10',
    iconGradient: 'from-violet-500 to-indigo-500',
    trendColor: 'text-violet-300',
    glowClass: 'stat-glow-purple',
  },
  {
    label: t('dashboard.engagement'),
    value: `${mockStats.engagementRate}%`,
    trend: '+0.5%',
    positive: true,
    icon: 'i-lucide-trending-up',
    gradient: 'from-pink-600/30 to-rose-600/10',
    iconGradient: 'from-pink-500 to-rose-500',
    trendColor: 'text-pink-300',
    glowClass: 'stat-glow-pink',
  },
  {
    label: t('dashboard.growth'),
    value: `+${mockStats.weeklyGrowth}%`,
    trend: '+1.1%',
    positive: true,
    icon: 'i-lucide-arrow-up-right',
    gradient: 'from-blue-600/30 to-indigo-600/10',
    iconGradient: 'from-blue-500 to-indigo-500',
    trendColor: 'text-blue-300',
    glowClass: 'stat-glow-blue',
  },
  {
    label: t('dashboard.connectedAccounts'),
    value: mockStats.connectedAccounts.toString(),
    trend: '',
    positive: true,
    icon: 'i-lucide-link',
    gradient: 'from-orange-600/30 to-amber-600/10',
    iconGradient: 'from-orange-500 to-amber-500',
    trendColor: 'text-orange-300',
    glowClass: 'stat-glow-orange',
  },
])

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
      borderColor: '#7c3aed',
      backgroundColor: 'rgba(124,58,237,0.12)',
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
    x: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#52525b', font: { size: 11 } } },
    y: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#52525b', font: { size: 11 } } },
  },
}

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
    backgroundColor: 'rgba(236,72,153,0.7)',
    borderRadius: 6,
    borderSkipped: false,
  }],
}

const barOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: {
    x: { grid: { display: false }, ticks: { color: '#52525b', maxRotation: 45, font: { size: 10 } } },
    y: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#52525b', font: { size: 11 } } },
  },
}

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

    <!-- ── Header ────────────────────────────────────────────── -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-white">{{ t('dashboard.title') }}</h1>
        <p class="mt-1 text-sm text-white/40">
          {{ t('dashboard.welcome', { name: authStore.user?.email }) }}
        </p>
      </div>
      <div class="flex items-center gap-2">
        <div class="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
        <span class="text-xs text-white/40">Live</span>
      </div>
    </div>

    <!-- ── Stat Cards ────────────────────────────────────────── -->
    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div
        v-for="card in statCards"
        :key="card.label"
        :class="`relative overflow-hidden rounded-2xl border border-white/[0.06] bg-gradient-to-br ${card.gradient} p-5 ${card.glowClass} transition-transform duration-200 hover:-translate-y-0.5`"
      >
        <!-- Background glow dot -->
        <div class="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-white/[0.03] blur-xl" />

        <div class="flex items-start justify-between">
          <div>
            <p class="text-xs text-white/50 font-medium">{{ card.label }}</p>
            <p class="mt-3 text-3xl font-extrabold text-white tracking-tight">{{ card.value }}</p>
            <p v-if="card.trend" :class="['mt-1 text-xs font-medium', card.trendColor]">
              ↑ {{ card.trend }}
            </p>
          </div>
          <div :class="`flex-shrink-0 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${card.iconGradient} shadow-lg`">
            <UIcon :name="card.icon" class="size-5 text-white" />
          </div>
        </div>
      </div>
    </div>

    <!-- ── Growth Chart ──────────────────────────────────────── -->
    <div class="glass-card p-6">
      <div class="mb-6 flex items-center justify-between">
        <div>
          <h2 class="text-base font-semibold text-white">{{ t('dashboard.growthChart') }}</h2>
          <p class="text-xs text-white/35 mt-0.5">Follower growth over time</p>
        </div>
        <div class="flex gap-1 rounded-xl border border-white/[0.07] bg-white/[0.03] p-1">
          <button
            v-for="p in (['7d', '30d', '90d'] as const)"
            :key="p"
            class="rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-200"
            :class="selectedPeriod === p
              ? 'bg-violet-600 text-white shadow'
              : 'text-white/40 hover:text-white/80'"
            @click="selectedPeriod = p"
          >
            {{ t(`dashboard.period${p.charAt(0).toUpperCase() + p.slice(1)}`) }}
          </button>
        </div>
      </div>
      <div class="h-72">
        <Line :data="growthChartData" :options="chartOptions" />
      </div>
    </div>

    <!-- ── Engagement + Top Posts ────────────────────────────── -->
    <div class="grid gap-6 lg:grid-cols-2">
      <!-- Engagement Chart -->
      <div class="glass-card p-6">
        <h2 class="mb-1 text-base font-semibold text-white">{{ t('dashboard.engagementChart') }}</h2>
        <p class="text-xs text-white/35 mb-6">Daily engagement rate (%)</p>
        <div class="h-64">
          <Bar :data="engagementChartData" :options="barOptions" />
        </div>
      </div>

      <!-- Top Posts -->
      <div class="glass-card p-6">
        <h2 class="mb-1 text-base font-semibold text-white">{{ t('dashboard.topPosts') }}</h2>
        <p class="text-xs text-white/35 mb-6">Your best performing content</p>
        <div class="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <div
            v-for="post in mockPosts"
            :key="post.id"
            class="group cursor-pointer rounded-xl border border-white/[0.06] bg-white/[0.03] overflow-hidden transition-all hover:border-violet-500/30 hover:bg-white/[0.05]"
          >
            <div class="aspect-square bg-gradient-to-br from-white/[0.04] to-white/[0.02] flex items-center justify-center">
              <UIcon name="i-lucide-image" class="size-6 text-white/20 group-hover:text-violet-400/50 transition-colors" />
            </div>
            <div class="p-2">
              <div class="flex items-center gap-1.5 text-xs text-white/50">
                <span>❤️ {{ post.likes }}</span>
                <span>💬 {{ post.comments }}</span>
              </div>
              <p class="mt-0.5 text-[10px] text-white/25">{{ post.date }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ── Quick Actions ─────────────────────────────────────── -->
    <div class="glass-card p-6">
      <h2 class="mb-5 text-base font-semibold text-white">{{ t('dashboard.quickActions') }}</h2>
      <div class="flex flex-wrap gap-3">
        <NuxtLink
          to="/dashboard/instagram"
          class="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/20 hover:shadow-violet-500/35 hover:-translate-y-0.5 transition-all duration-200"
        >
          <UIcon name="i-lucide-instagram" class="size-4" />
          {{ t('dashboard.connectInstagram') }}
        </NuxtLink>
        <NuxtLink
          to="/dashboard/media-kit"
          class="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] px-5 py-2.5 text-sm font-semibold text-white/80 hover:bg-white/[0.09] hover:text-white transition-all duration-200"
        >
          <UIcon name="i-lucide-file-text" class="size-4" />
          {{ t('dashboard.createMediaKit') }}
        </NuxtLink>
        <button
          class="inline-flex items-center gap-2 rounded-xl border border-white/[0.07] bg-transparent px-5 py-2.5 text-sm font-semibold text-white/50 hover:text-white/80 hover:border-white/15 transition-all duration-200"
        >
          <UIcon name="i-lucide-refresh-cw" class="size-4" />
          {{ t('dashboard.syncAnalytics') }}
        </button>
      </div>
    </div>

  </div>
</template>
