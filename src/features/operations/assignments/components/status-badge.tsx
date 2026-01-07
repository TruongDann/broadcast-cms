import { Badge } from '@/components/ui/badge'
import {
  type AssignmentStatus,
  type ServiceType,
  type AssignmentPriority,
  ASSIGNMENT_STATUS_CONFIG,
  SERVICE_TYPE_CONFIG,
  PRIORITY_CONFIG,
} from '../types'

interface StatusBadgeProps {
  status: AssignmentStatus
}

export function AssignmentStatusBadge({ status }: StatusBadgeProps) {
  const config = ASSIGNMENT_STATUS_CONFIG[status]

  return (
    <Badge
      variant='outline'
      className={`${config.color} ${config.bgColor} border-transparent text-xs font-medium`}
    >
      {config.label}
    </Badge>
  )
}

interface ServiceTypeBadgeProps {
  serviceType: ServiceType
}

export function ServiceTypeBadge({ serviceType }: ServiceTypeBadgeProps) {
  const config = SERVICE_TYPE_CONFIG[serviceType]

  return (
    <Badge
      variant='outline'
      className={`${config.color} ${config.bgColor} border-transparent text-xs font-medium`}
    >
      {config.label}
    </Badge>
  )
}

interface PriorityBadgeProps {
  priority: AssignmentPriority
}

export function PriorityBadge({ priority }: PriorityBadgeProps) {
  const config = PRIORITY_CONFIG[priority]

  return (
    <Badge
      variant='outline'
      className={`${config.color} ${config.bgColor} border-transparent text-xs font-medium`}
    >
      {config.label}
    </Badge>
  )
}
