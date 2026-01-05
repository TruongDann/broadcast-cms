// Server-side DTOs for Topic API

export interface CreateTopicDTO {
  title: string
  outline?: string
  contentType: 'broadcast' | 'print' | 'digital' | 'social' | 'combo'
  teamMembers?: TeamMemberInput[]
  attachments?: AttachmentInput[]
  estimatedDays?: number
  deadline?: string
  isDraft?: boolean
}

export interface UpdateTopicDTO {
  title?: string
  outline?: string
  contentType?: 'broadcast' | 'print' | 'digital' | 'social' | 'combo'
  teamMembers?: TeamMemberInput[]
  attachments?: AttachmentInput[]
  estimatedDays?: number
  deadline?: string
}

export interface ApprovalDTO {
  action: 'approve' | 'reject' | 'request_revision'
  comment?: string
}

export interface TeamMemberInput {
  userId: string
  userName: string
  role: string
  position: 'lead' | 'member' | 'support'
}

export interface AttachmentInput {
  id: string
  fileName: string
  fileUrl: string
  fileType: string
  fileSize: number
  uploadedAt: string
}

// API Response types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

export interface TopicListResponse {
  topics: TopicResponse[]
  total: number
}

export interface TopicResponse {
  id: string
  title: string
  outline: string | null
  contentType: 'broadcast' | 'print' | 'digital' | 'social' | 'combo'
  teamMembers: TeamMemberInput[]
  attachments: AttachmentInput[]
  estimatedDays: number
  deadline: string | null
  createdBy: string
  createdByName: string | null
  departmentId: string | null
  departmentName: string | null
  status: 'draft' | 'pending' | 'revision_required' | 'approved' | 'rejected'
  createdAt: string
  updatedAt: string
  approvalHistory?: ApprovalHistoryResponse[]
}

export interface ApprovalHistoryResponse {
  id: string
  userId: string
  userName: string | null
  userRole: string | null
  action: 'approve' | 'reject' | 'comment' | 'submit' | 'request_revision'
  level: 'B1' | 'B2' | 'B3' | null
  comment: string | null
  createdAt: string
}
