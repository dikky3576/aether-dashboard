import { useState } from 'react'
import { cn } from '@/lib/cn'

const SIZES = {
  xs: 'size-6 text-[10px]',
  sm: 'size-8 text-caption',
  md: 'size-10 text-body',
  lg: 'size-12 text-card',
} as const

/** Fallback tints are deterministic per name, so a person keeps the same colour everywhere. */
const TINTS = [
  'bg-accent-soft text-accent-text',
  'bg-info-soft text-info',
  'bg-success-soft text-success',
  'bg-warning-soft text-warning',
] as const

function hash(value: string): number {
  let h = 0
  for (const char of value) h = (h * 31 + char.charCodeAt(0)) >>> 0
  return h
}

function initials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join('')
    .toUpperCase()
}

interface AvatarProps {
  name: string
  src?: string
  size?: keyof typeof SIZES
  className?: string
}

export function Avatar({ name, src, size = 'md', className }: AvatarProps) {
  const [failed, setFailed] = useState(false)
  const tint = TINTS[hash(name) % TINTS.length] ?? TINTS[0]
  const showImage = Boolean(src) && !failed

  return (
    <span
      role="img"
      aria-label={name}
      className={cn(
        'inline-grid shrink-0 select-none place-items-center overflow-hidden rounded-full font-medium',
        SIZES[size],
        !showImage && tint,
        className,
      )}
    >
      {showImage ? (
        <img src={src} alt="" className="size-full object-cover" onError={() => setFailed(true)} />
      ) : (
        <span aria-hidden>{initials(name)}</span>
      )}
    </span>
  )
}
