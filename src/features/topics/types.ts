// Topic types for WF.01: Topic Registration & Assignment
import { type Role } from '@/stores/auth-store'

// Content type enum
export type ContentType = 'broadcast' | 'print' | 'digital' | 'social' | 'combo'

// Topic status workflow
export type TopicStatus =
  | 'draft'
  | 'pending'
  | 'revision_required'
  | 'approved'
  | 'rejected'

// Approval action types
export type ApprovalAction =
  | 'approve'
  | 'reject'
  | 'comment'
  | 'submit'
  | 'request_revision'

// Approval level
export type ApprovalLevel = 'B1' | 'B2' | 'B3'

// Approval record for history tracking
export interface ApprovalRecord {
  id: string
  userId: string
  userName: string
  userRole: Role
  action: ApprovalAction
  level: ApprovalLevel
  comment?: string
  timestamp: Date
}

// Team member for e-kip
export interface TeamMember {
  userId: string
  userName: string
  role: Role
  position: 'lead' | 'member' | 'support'
}

// Attachment file
export interface Attachment {
  id: string
  fileName: string
  fileUrl: string
  fileType: string
  fileSize: number
  uploadedAt: Date
}

// Main Topic interface
export interface Topic {
  id: string
  title: string
  outline: string // Rich text content
  contentType: ContentType
  teamMembers: TeamMember[]
  attachments: Attachment[]
  estimatedDays: number
  deadline?: Date
  createdBy: string
  createdByName: string
  departmentId: string
  departmentName: string
  status: TopicStatus
  approvalHistory: ApprovalRecord[]
  createdAt: Date
  updatedAt: Date
}

// Form data for creating/editing topic
export interface TopicFormData {
  title: string
  outline: string
  contentType: ContentType
  teamMemberIds: string[]
  estimatedDays: number
  deadline?: Date
}

// Filter options for topic list
export interface TopicFilters {
  status?: TopicStatus | 'all'
  contentType?: ContentType | 'all'
  departmentId?: string
  createdBy?: string
  dateFrom?: Date
  dateTo?: Date
  search?: string
}

// Status display configuration
export const STATUS_CONFIG: Record<
  TopicStatus,
  { label: string; color: string; description: string }
> = {
  draft: {
    label: 'Nháp',
    color: 'gray',
    description: 'Đề tài đang được soạn thảo',
  },
  pending: {
    label: 'Chờ duyệt',
    color: 'yellow',
    description: 'Đang chờ lãnh đạo duyệt',
  },
  revision_required: {
    label: 'Cần chỉnh sửa',
    color: 'red',
    description: 'Yêu cầu chỉnh sửa và nộp lại',
  },
  approved: {
    label: 'Đã phê duyệt',
    color: 'green',
    description: 'Đề tài đã được phê duyệt',
  },
  rejected: {
    label: 'Bị từ chối',
    color: 'red',
    description: 'Đề tài bị từ chối',
  },
}

// Content type display configuration
export const CONTENT_TYPE_CONFIG: Record<
  ContentType,
  { label: string; description: string }
> = {
  broadcast: {
    label: 'Phát thanh truyền hình',
    description: 'Nội dung phát sóng trên TV/Radio',
  },
  print: {
    label: 'Báo in',
    description: 'Nội dung báo in',
  },
  digital: {
    label: 'Báo điện tử',
    description: 'Nội dung trên website',
  },
  social: {
    label: 'Mạng xã hội',
    description: 'Nội dung trên Facebook, YouTube, TikTok',
  },
  combo: {
    label: 'Đa nền tảng',
    description: 'Nội dung phát trên nhiều nền tảng',
  },
}
