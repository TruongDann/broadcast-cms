import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001'

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add user headers (placeholder for auth)
api.interceptors.request.use((config) => {
  // TODO: Replace with real auth token/headers
  config.headers['x-user-id'] = 'user_1'
  config.headers['x-user-name'] = 'Phóng viên Demo'
  config.headers['x-user-role'] = 'reporter'
  return config
})

// Types for API requests
export interface CreateTopicRequest {
  title: string
  outline?: string
  contentType: 'broadcast' | 'print' | 'digital' | 'social' | 'combo'
  category?: string
  teamMembers?: Array<{
    userId: string
    userName: string
    role: string
    position: 'lead' | 'member' | 'support'
  }>
  attachments?: Array<{
    id: string
    fileName: string
    fileUrl: string
    fileType: string
    fileSize: number
    uploadedAt: string
  }>
  estimatedDays?: number
  startDate?: string
  deadline?: string
  approver?: 'bbt' | 'truong_pho_phong'
  isDraft?: boolean
}

export interface UpdateTopicRequest {
  title?: string
  outline?: string
  contentType?: 'broadcast' | 'print' | 'digital' | 'social' | 'combo'
  category?: string
  teamMembers?: Array<{
    userId: string
    userName: string
    role: string
    position: 'lead' | 'member' | 'support'
  }>
  attachments?: Array<{
    id: string
    fileName: string
    fileUrl: string
    fileType: string
    fileSize: number
    uploadedAt: string
  }>
  estimatedDays?: number
  startDate?: string
  deadline?: string
  approver?: 'bbt' | 'truong_pho_phong'
}

interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

// Response type from API
export interface TopicResponse {
  id: string
  title: string
  outline: string | null
  contentType: 'broadcast' | 'print' | 'digital' | 'social' | 'combo'
  category: string | null
  teamMembers: Array<{
    userId: string
    userName: string
    role: string
    position: 'lead' | 'member' | 'support'
  }>
  attachments: Array<{
    id: string
    fileName: string
    fileUrl: string
    fileType: string
    fileSize: number
    uploadedAt: string
  }>
  estimatedDays: number
  startDate: string | null
  deadline: string | null
  approver: 'bbt' | 'truong_pho_phong' | null
  createdBy: string
  createdByName: string | null
  departmentId: string | null
  departmentName: string | null
  status:
    | 'draft'
    | 'pending'
    | 'revision_required'
    | 'approved'
    | 'rejected'
  createdAt: string
  updatedAt: string
  approvalHistory?: Array<{
    id: string
    userId: string
    userName: string
    userRole: string
    action: string
    level?: string
    comment?: string
    createdAt: string
  }>
}

export interface TopicListResponse {
  topics: TopicResponse[]
  total: number
}

export interface TopicStatsResponse {
  total: { count: number; previousCount: number; trend: number }
  pending: { count: number; previousCount: number; trend: number }
  approved: { count: number; previousCount: number; trend: number }
  successRate: { rate: number; trend: number }
  lastUpdated: string
}

// API functions
export const topicsApi = {
  // Create new topic
  async create(data: CreateTopicRequest): Promise<TopicResponse> {
    const response = await api.post<ApiResponse<TopicResponse>>(
      '/api/topics',
      data
    )
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || 'Failed to create topic')
    }
    return response.data.data
  },

  // Get all topics
  async getAll(filters?: {
    status?: string
    contentType?: string
  }): Promise<TopicListResponse> {
    const params = new URLSearchParams()
    if (filters?.status) params.append('status', filters.status)
    if (filters?.contentType) params.append('contentType', filters.contentType)

    const response = await api.get<ApiResponse<TopicListResponse>>(
      `/api/topics?${params}`
    )
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || 'Failed to fetch topics')
    }
    return response.data.data
  },

  // Get current user's topics
  async getMyTopics(): Promise<TopicListResponse> {
    const response =
      await api.get<ApiResponse<TopicListResponse>>('/api/topics/my')
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || 'Failed to fetch my topics')
    }
    return response.data.data
  },

  // Get single topic by ID
  async getById(id: string): Promise<TopicResponse> {
    const response = await api.get<ApiResponse<TopicResponse>>(
      `/api/topics/${id}`
    )
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || 'Failed to fetch topic')
    }
    return response.data.data
  },

  // Update topic
  async update(id: string, data: UpdateTopicRequest): Promise<TopicResponse> {
    const response = await api.put<ApiResponse<TopicResponse>>(
      `/api/topics/${id}`,
      data
    )
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || 'Failed to update topic')
    }
    return response.data.data
  },

  // Delete topic (drafts only)
  async delete(id: string): Promise<void> {
    const response = await api.delete<ApiResponse<void>>(`/api/topics/${id}`)
    if (!response.data.success) {
      throw new Error(response.data.error || 'Failed to delete topic')
    }
  },

  // Submit topic for approval
  async submit(id: string): Promise<TopicResponse> {
    const response = await api.post<ApiResponse<TopicResponse>>(
      `/api/topics/${id}/submit`
    )
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || 'Failed to submit topic')
    }
    return response.data.data
  },

  // Approve topic (leadership)
  async approve(id: string, comment?: string): Promise<TopicResponse> {
    const response = await api.post<ApiResponse<TopicResponse>>(
      `/api/topics/${id}/approve`,
      { comment }
    )
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || 'Failed to approve topic')
    }
    return response.data.data
  },

  // Reject topic
  async reject(id: string, comment?: string): Promise<TopicResponse> {
    const response = await api.post<ApiResponse<TopicResponse>>(
      `/api/topics/${id}/reject`,
      { comment }
    )
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || 'Failed to reject topic')
    }
    return response.data.data
  },

  // Request revision
  async requestRevision(id: string, comment?: string): Promise<TopicResponse> {
    const response = await api.post<ApiResponse<TopicResponse>>(
      `/api/topics/${id}/request-revision`,
      { comment }
    )
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || 'Failed to request revision')
    }
    return response.data.data
  },

  // Get topic statistics
  async getStats(): Promise<TopicStatsResponse> {
    const response =
      await api.get<ApiResponse<TopicStatsResponse>>('/api/topics/stats')
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || 'Failed to fetch topic stats')
    }
    return response.data.data
  },
}
