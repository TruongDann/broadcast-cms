// Assignment types for work assignment management
import { type Role } from '@/stores/auth-store'

// Assignment status workflow
export type AssignmentStatus =
  | 'pending' // Chờ phân công
  | 'assigned' // Đã phân công
  | 'in_progress' // Đang thực hiện
  | 'completed' // Hoàn thành
  | 'overdue' // Quá hạn

// Assignment priority
export type AssignmentPriority = 'low' | 'medium' | 'high' | 'urgent'

// Service type for assignments
export type ServiceType =
  | 'quang_cao_tvc'
  | 'tin_tuc_dat_hang'
  | 'su_kien_livestream'
  | 'chuong_trinh_dat_hang'
  | 'phong_su_tai_lieu'

// Team member assigned to work
export interface AssignedMember {
  userId: string
  userName: string
  role: Role
  position: 'lead' | 'cameraman' | 'reporter' | 'editor' | 'support'
  avatar?: string
}

// Main Assignment interface
export interface Assignment {
  id: string
  code: string // Mã đơn hàng: DH-2023-11-005
  topicId?: string
  topicTitle: string
  clientName: string
  clientAvatar?: string
  serviceType: ServiceType
  description: string
  assignedMembers: AssignedMember[]
  estimatedValue: number
  progress: number // 0-100
  priority: AssignmentPriority
  status: AssignmentStatus
  startDate: Date
  deadline: Date
  deliverables: string[] // Sản phẩm: 1 TVC, 3 Tin bài, etc.
  createdBy: string
  createdByName: string
  departmentId: string
  departmentName: string
  createdAt: Date
  updatedAt: Date
}

// Filter options for assignment list
export interface AssignmentFilters {
  status?: AssignmentStatus | 'all'
  serviceType?: ServiceType | 'all'
  priority?: AssignmentPriority | 'all'
  departmentId?: string
  assignedTo?: string
  dateFrom?: Date
  dateTo?: Date
  search?: string
}

// Status display configuration
export const ASSIGNMENT_STATUS_CONFIG: Record<
  AssignmentStatus,
  { label: string; color: string; bgColor: string }
> = {
  pending: {
    label: 'Chờ phân công',
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-500/10',
  },
  assigned: {
    label: 'Đã phân công',
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
  },
  in_progress: {
    label: 'Đang thực hiện',
    color: 'text-cyan-500',
    bgColor: 'bg-cyan-500/10',
  },
  completed: {
    label: 'Hoàn thành',
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
  },
  overdue: {
    label: 'Quá hạn',
    color: 'text-red-500',
    bgColor: 'bg-red-500/10',
  },
}

// Service type display configuration
export const SERVICE_TYPE_CONFIG: Record<
  ServiceType,
  { label: string; color: string; bgColor: string }
> = {
  quang_cao_tvc: {
    label: 'Quảng cáo TVC',
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
  },
  tin_tuc_dat_hang: {
    label: 'Tin tức đặt hàng',
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
  },
  su_kien_livestream: {
    label: 'Sự kiện & Livestream',
    color: 'text-red-500',
    bgColor: 'bg-red-500/10',
  },
  chuong_trinh_dat_hang: {
    label: 'Chương trình đặt hàng',
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10',
  },
  phong_su_tai_lieu: {
    label: 'Phóng sự tài liệu',
    color: 'text-teal-500',
    bgColor: 'bg-teal-500/10',
  },
}

// Priority display configuration
export const PRIORITY_CONFIG: Record<
  AssignmentPriority,
  { label: string; color: string; bgColor: string }
> = {
  low: {
    label: 'Thấp',
    color: 'text-gray-500',
    bgColor: 'bg-gray-500/10',
  },
  medium: {
    label: 'Trung bình',
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
  },
  high: {
    label: 'Cao',
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10',
  },
  urgent: {
    label: 'Khẩn cấp',
    color: 'text-red-500',
    bgColor: 'bg-red-500/10',
  },
}
