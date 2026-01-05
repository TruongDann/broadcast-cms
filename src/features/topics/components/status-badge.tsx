import { Badge } from '@/components/ui/badge'
import { type TopicStatus, STATUS_CONFIG } from '../types'

interface StatusBadgeProps {
  status: TopicStatus
  className?: string
}

const colorVariants: Record<string, string> = {
  gray: 'bg-gray-100 text-gray-800 hover:bg-gray-100',
  yellow: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100',
  orange: 'bg-orange-100 text-orange-800 hover:bg-orange-100',
  blue: 'bg-blue-100 text-blue-800 hover:bg-blue-100',
  red: 'bg-red-100 text-red-800 hover:bg-red-100',
  green: 'bg-green-100 text-green-800 hover:bg-green-100',
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  // Fallback for unknown or legacy statuses (e.g., pending_b1, pending_b2, pending_b3)
  const config = STATUS_CONFIG[status] || {
    label: status,
    color: 'gray',
    description: 'Trạng thái không xác định',
  }
  const colorClass = colorVariants[config.color] || colorVariants.gray

  return (
    <Badge
      variant='outline'
      className={`${colorClass} border-none font-medium ${className || ''}`}
      title={config.description}
    >
      {config.label}
    </Badge>
  )
}
