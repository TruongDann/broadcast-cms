// Article/News types for article management (Quản lý Tin bài)
import { type Role } from '@/stores/auth-store'

// Article type - loại tin bài
export type ArticleType =
  | 'ptth' // Phát thanh truyền hình
  | 'bao_in' // Báo in
  | 'bao_dien_tu' // Báo điện tử
  | 'noi_dung_so' // Nội dung số (FB, YTB, Zalo OA)

// Article status workflow - quy trình duyệt tin bài
export type ArticleStatus =
  | 'tac_nghiep' // Đang tác nghiệp - PV đang thu thập thông tin
  | 'cho_duyet_cap_1' // Chờ duyệt cấp 1 - Chờ lãnh đạo phòng duyệt
  | 'cho_duyet_cap_2' // Chờ duyệt cấp 2 - Chờ Ban biên tập duyệt
  | 'hau_ky' // Đang xử lý hậu kỳ - Dựng video/Dàn trang
  | 'cho_duyet_hau_ky' // Chờ duyệt hậu kỳ - Duyệt file thành phẩm
  | 'da_xuat_ban' // Đã xuất bản - Phát sóng/In/Đăng tải
  | 'tu_choi' // Bị từ chối - Cần sửa lại

// Legacy status for backward compatibility
export type AssignmentStatus =
  | 'pending' // Chờ phân công
  | 'assigned' // Đã phân công
  | 'in_progress' // Đang thực hiện
  | 'completed' // Hoàn thành
  | 'overdue' // Quá hạn

// Assignment priority
export type AssignmentPriority = 'low' | 'medium' | 'high' | 'urgent'

// Service type for assignments (legacy)
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

// Main Article interface - Tin bài
export interface Article {
  id: string
  code: string // Mã tin bài: TB-2024-01-001
  title: string // Tiêu đề tin bài
  topicId: string // Liên kết với đề tài đã được duyệt
  topicTitle: string
  articleType: ArticleType
  description: string
  content?: string // Nội dung bài viết
  scriptContent?: string // Nội dung kịch bản (cho PTTH)
  assignedMembers: AssignedMember[]
  status: ArticleStatus
  priority: AssignmentPriority
  deadline: Date
  createdBy: string
  createdByName: string
  departmentId: string
  departmentName: string
  // Approval history
  approvalLevel1?: {
    approvedBy: string
    approvedAt: Date
    comment?: string
  }
  approvalLevel2?: {
    approvedBy: string
    approvedAt: Date
    comment?: string
  }
  // Post-production
  postProductionFile?: string // File thành phẩm từ hệ thống dựng
  // Publishing
  publishedAt?: Date
  publishUrl?: string
  createdAt: Date
  updatedAt: Date
}

// Legacy Assignment interface - kept for backward compatibility
export interface Assignment {
  id: string
  code: string
  topicId?: string
  topicTitle: string
  clientName: string
  clientAvatar?: string
  serviceType: ServiceType
  description: string
  assignedMembers: AssignedMember[]
  estimatedValue: number
  progress: number
  priority: AssignmentPriority
  status: AssignmentStatus
  startDate: Date
  deadline: Date
  deliverables: string[]
  createdBy: string
  createdByName: string
  departmentId: string
  departmentName: string
  createdAt: Date
  updatedAt: Date
}

// Article status display configuration
export const ARTICLE_STATUS_CONFIG: Record<
  ArticleStatus,
  { label: string; color: string; bgColor: string }
> = {
  tac_nghiep: {
    label: 'Đang tác nghiệp',
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
  },
  cho_duyet_cap_1: {
    label: 'Chờ duyệt cấp 1',
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-500/10',
  },
  cho_duyet_cap_2: {
    label: 'Chờ duyệt cấp 2',
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10',
  },
  hau_ky: {
    label: 'Đang hậu kỳ',
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
  },
  cho_duyet_hau_ky: {
    label: 'Chờ duyệt thành phẩm',
    color: 'text-cyan-500',
    bgColor: 'bg-cyan-500/10',
  },
  da_xuat_ban: {
    label: 'Đã xuất bản',
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
  },
  tu_choi: {
    label: 'Bị từ chối',
    color: 'text-red-500',
    bgColor: 'bg-red-500/10',
  },
}

// Article type display configuration
export const ARTICLE_TYPE_CONFIG: Record<
  ArticleType,
  { label: string; color: string; bgColor: string }
> = {
  ptth: {
    label: 'PTTH',
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
  },
  bao_in: {
    label: 'Báo in',
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
  },
  bao_dien_tu: {
    label: 'Báo điện tử',
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
  },
  noi_dung_so: {
    label: 'Nội dung số',
    color: 'text-pink-500',
    bgColor: 'bg-pink-500/10',
  },
}

// Legacy status configuration
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
