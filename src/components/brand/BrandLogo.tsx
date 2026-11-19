import { useId } from 'react'
import { Link } from 'react-router'
import { ROUTES } from '@/config/routes'
import { siteConfig } from '@/config/site'
import { cn } from '@/lib/cn'

export function BrandMark({ className }: { className?: string }) {
  const gradientId = useId().replace(/[^a-zA-Z0-9_-]/g, '')
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden className={cn('size-8 shrink-0', className)}>
      <defs>
        <linearGradient id={gradientId} x1="4" y1="2" x2="28" y2="30" gradientUnits="userSpaceOnUse">
          <stop stopColor="#8B5CF6" />
          <stop offset="0.55" stopColor="#7157F5" />
          <stop offset="1" stopColor="#4F8DF7" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="9" fill={`url(#${gradientId})`} />
      <path
        d="M16 7 8.5 24h3.4l1.5-3.6h5.2l1.5 3.6h3.4L16 7Zm0 7.2 1.7 4.2h-3.4L16 14.2Z"
        fill="#fff"
      />
    </svg>
  )
}

export function BrandLogo({ collapsed = false, onClick }: { collapsed?: boolean; onClick?: () => void }) {
  return (
    <Link
      to={ROUTES.overview}
      onClick={onClick}
      aria-label={`${siteConfig.name} — go to overview`}
      className="flex items-center gap-2.5 rounded-lg"
    >
      <BrandMark />
      {!collapsed && <span className="text-[1.0625rem] font-semibold tracking-tight">{siteConfig.name}</span>}
    </Link>
  )
}
