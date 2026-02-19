export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const { template, customData, includeAnalytics, analytics } = body

  const html = generateMediaKitHtml({
    template: template || 'minimal',
    tagline: customData?.tagline || '',
    bio: customData?.bio || '',
    portfolioUrls: customData?.portfolioUrls || [],
    pricing: customData?.pricing || {},
    showPricing: customData?.showPricing ?? true,
    includeAnalytics: includeAnalytics ?? true,
    analytics: analytics || { followers: 0, engagementRate: 0, avgLikes: 0, avgComments: 0 },
  })

  // Return as downloadable HTML (lightweight approach without puppeteer)
  setResponseHeaders(event, {
    'Content-Type': 'application/pdf',
    'Content-Disposition': 'attachment; filename="media-kit.html"',
  })

  // Return the HTML as a downloadable file
  // In production, use puppeteer-core or a PDF service to convert
  return html
})

interface MediaKitData {
  template: string
  tagline: string
  bio: string
  portfolioUrls: string[]
  pricing: { story?: string; post?: string; reel?: string; package?: string }
  showPricing: boolean
  includeAnalytics: boolean
  analytics: { followers: number; engagementRate: number; avgLikes: number; avgComments: number }
}

function generateMediaKitHtml(data: MediaKitData): string {
  const themeColors: Record<string, { bg: string; accent: string; cardBg: string }> = {
    minimal: { bg: '#18181b', accent: '#ffffff', cardBg: '#27272a' },
    professional: { bg: '#0c1445', accent: '#60a5fa', cardBg: '#1e2a6e' },
    creative: { bg: '#2e1065', accent: '#c084fc', cardBg: '#4a1d8e' },
  }

  const theme = themeColors[data.template] || themeColors.minimal

  const pricingRows = data.showPricing
    ? [
        data.pricing.story && `<div class="price-row"><span>Instagram Story</span><span class="price">${data.pricing.story}</span></div>`,
        data.pricing.post && `<div class="price-row"><span>Instagram Post</span><span class="price">${data.pricing.post}</span></div>`,
        data.pricing.reel && `<div class="price-row"><span>Instagram Reel</span><span class="price">${data.pricing.reel}</span></div>`,
        data.pricing.package && `<div class="price-row package"><span>Package Deal</span><span class="price">${data.pricing.package}</span></div>`,
      ].filter(Boolean).join('\n')
    : ''

  const analyticsSection = data.includeAnalytics
    ? `
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-value">${data.analytics.followers.toLocaleString()}</div>
        <div class="stat-label">Followers</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${data.analytics.engagementRate}%</div>
        <div class="stat-label">Engagement Rate</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${data.analytics.avgLikes}</div>
        <div class="stat-label">Avg. Likes</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${data.analytics.avgComments}</div>
        <div class="stat-label">Avg. Comments</div>
      </div>
    </div>`
    : ''

  const portfolioSection = data.portfolioUrls.length > 0
    ? `
    <div class="section">
      <h3>Portfolio</h3>
      ${data.portfolioUrls.map(u => `<a href="${u}" class="link">${u}</a>`).join('\n')}
    </div>`
    : ''

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>Media Kit</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    background: ${theme.bg};
    color: #e4e4e7;
    padding: 40px;
    max-width: 800px;
    margin: 0 auto;
  }
  .header { text-align: center; margin-bottom: 40px; }
  .avatar {
    width: 80px; height: 80px; border-radius: 50%;
    background: rgba(255,255,255,0.1);
    margin: 0 auto 16px;
    display: flex; align-items: center; justify-content: center;
    font-size: 32px; color: rgba(255,255,255,0.4);
  }
  .tagline { font-size: 24px; font-weight: 700; color: ${theme.accent}; margin-bottom: 8px; }
  .bio { font-size: 14px; color: #a1a1aa; line-height: 1.6; max-width: 500px; margin: 0 auto; }
  .stats-grid {
    display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin: 24px 0;
  }
  .stat-card {
    background: ${theme.cardBg}; border-radius: 12px; padding: 20px; text-align: center;
  }
  .stat-value { font-size: 22px; font-weight: 700; color: #fff; }
  .stat-label { font-size: 12px; color: #71717a; margin-top: 4px; }
  .section { margin: 24px 0; }
  .section h3 { font-size: 12px; color: #71717a; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px; }
  .price-row {
    display: flex; justify-content: space-between; padding: 10px 0;
    border-bottom: 1px solid rgba(255,255,255,0.06); font-size: 14px;
  }
  .price-row .price { font-weight: 600; color: ${theme.accent}; }
  .price-row.package { border-top: 1px solid rgba(255,255,255,0.1); border-bottom: none; padding-top: 14px; font-weight: 600; }
  .link {
    display: block; color: ${theme.accent}; font-size: 14px;
    text-decoration: none; margin-bottom: 6px;
  }
  .link:hover { text-decoration: underline; }
  .footer { text-align: center; margin-top: 40px; font-size: 11px; color: #52525b; }
</style>
</head>
<body>
  <div class="header">
    <div class="avatar">👤</div>
    <div class="tagline">${escapeHtml(data.tagline || 'Your Tagline')}</div>
    <div class="bio">${escapeHtml(data.bio || 'Your bio goes here...')}</div>
  </div>
  ${analyticsSection}
  ${pricingRows ? `<div class="section"><h3>Pricing</h3>${pricingRows}</div>` : ''}
  ${portfolioSection}
  <div class="footer">Generated with CreatorKit</div>
</body>
</html>`
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
