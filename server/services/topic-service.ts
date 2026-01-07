import { supabase, type DbTopic, type DbApprovalHistory } from '../db/supabase'
import type {
  CreateTopicDTO,
  UpdateTopicDTO,
  TopicResponse,
  ApprovalHistoryResponse,
} from '../types/topic'

// Helper to convert DB topic to API response
function toTopicResponse(dbTopic: DbTopic, approvalHistory?: DbApprovalHistory[]): TopicResponse {
  return {
    id: dbTopic.id,
    title: dbTopic.title,
    outline: dbTopic.outline,
    contentType: dbTopic.content_type,
    category: dbTopic.category,
    teamMembers: dbTopic.team_members || [],
    attachments: dbTopic.attachments || [],
    estimatedDays: dbTopic.estimated_days,
    startDate: dbTopic.start_date,
    deadline: dbTopic.deadline,
    approver: dbTopic.approver,
    createdBy: dbTopic.created_by,
    createdByName: dbTopic.created_by_name,
    departmentId: dbTopic.department_id,
    departmentName: dbTopic.department_name,
    status: dbTopic.status,
    createdAt: dbTopic.created_at,
    updatedAt: dbTopic.updated_at,
    approvalHistory: approvalHistory?.map(toApprovalHistoryResponse),
  }
}

function toApprovalHistoryResponse(record: DbApprovalHistory): ApprovalHistoryResponse {
  return {
    id: record.id,
    userId: record.user_id,
    userName: record.user_name,
    userRole: record.user_role,
    action: record.action,
    level: record.level,
    comment: record.comment,
    createdAt: record.created_at,
  }
}

export class TopicService {
  // Create a new topic
  async createTopic(data: CreateTopicDTO, userId: string, userName?: string): Promise<TopicResponse> {
    const { data: topic, error } = await supabase
      .from('topics')
      .insert({
        title: data.title,
        outline: data.outline || null,
        content_type: data.contentType,
        category: data.category || null,
        team_members: data.teamMembers || [],
        attachments: data.attachments || [],
        estimated_days: data.estimatedDays || 1,
        start_date: data.startDate || null,
        deadline: data.deadline || null,
        approver: data.approver || null,
        created_by: userId,
        created_by_name: userName || null,
        status: data.isDraft ? 'draft' : 'pending',
      })
      .select()
      .single()

    if (error) throw new Error(`Failed to create topic: ${error.message}`)

    // If submitting for approval, add to approval history
    if (!data.isDraft) {
      await supabase.from('approval_history').insert({
        topic_id: topic.id,
        user_id: userId,
        user_name: userName,
        action: 'submit',
      })
    }

    return toTopicResponse(topic)
  }

  // Get all topics with optional filters
  async getTopics(filters?: {
    status?: string
    createdBy?: string
    contentType?: string
  }): Promise<TopicResponse[]> {
    let query = supabase.from('topics').select('*').order('created_at', { ascending: false })

    if (filters?.status && filters.status !== 'all') {
      query = query.eq('status', filters.status)
    }
    if (filters?.createdBy) {
      query = query.eq('created_by', filters.createdBy)
    }
    if (filters?.contentType && filters.contentType !== 'all') {
      query = query.eq('content_type', filters.contentType)
    }

    const { data: topics, error } = await query

    if (error) throw new Error(`Failed to fetch topics: ${error.message}`)

    return (topics || []).map((t) => toTopicResponse(t))
  }

  // Get single topic by ID with approval history
  async getTopic(id: string): Promise<TopicResponse | null> {
    const { data: topic, error } = await supabase
      .from('topics')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') return null // Not found
      throw new Error(`Failed to fetch topic: ${error.message}`)
    }

    // Fetch approval history
    const { data: history } = await supabase
      .from('approval_history')
      .select('*')
      .eq('topic_id', id)
      .order('created_at', { ascending: true })

    return toTopicResponse(topic, history || [])
  }

  // Get topics by user
  async getTopicsByUser(userId: string): Promise<TopicResponse[]> {
    return this.getTopics({ createdBy: userId })
  }

  // Update topic (only drafts or revision_required)
  async updateTopic(id: string, data: UpdateTopicDTO, userId: string): Promise<TopicResponse> {
    // Check if topic can be edited
    const existing = await this.getTopic(id)
    if (!existing) throw new Error('Topic not found')
    if (existing.createdBy !== userId) throw new Error('Not authorized to edit this topic')
    if (!['draft', 'revision_required'].includes(existing.status)) {
      throw new Error('Cannot edit topic in current status')
    }

    const updateData: Record<string, unknown> = { updated_at: new Date().toISOString() }
    if (data.title !== undefined) updateData.title = data.title
    if (data.outline !== undefined) updateData.outline = data.outline
    if (data.contentType !== undefined) updateData.content_type = data.contentType
    if (data.teamMembers !== undefined) updateData.team_members = data.teamMembers
    if (data.attachments !== undefined) updateData.attachments = data.attachments
    if (data.estimatedDays !== undefined) updateData.estimated_days = data.estimatedDays
    if (data.deadline !== undefined) updateData.deadline = data.deadline

    const { data: topic, error } = await supabase
      .from('topics')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) throw new Error(`Failed to update topic: ${error.message}`)

    return toTopicResponse(topic)
  }

  // Delete topic (only drafts)
  async deleteTopic(id: string, userId: string): Promise<void> {
    const existing = await this.getTopic(id)
    if (!existing) throw new Error('Topic not found')
    if (existing.createdBy !== userId) throw new Error('Not authorized to delete this topic')
    if (existing.status !== 'draft') throw new Error('Only draft topics can be deleted')

    const { error } = await supabase.from('topics').delete().eq('id', id)
    if (error) throw new Error(`Failed to delete topic: ${error.message}`)
  }

  // Submit draft topic for approval
  async submitTopic(id: string, userId: string, userName?: string): Promise<TopicResponse> {
    const existing = await this.getTopic(id)
    if (!existing) throw new Error('Topic not found')
    if (existing.createdBy !== userId) throw new Error('Not authorized')
    if (!['draft', 'revision_required'].includes(existing.status)) {
      throw new Error('Topic is not in a submittable state')
    }

    const { data: topic, error } = await supabase
      .from('topics')
      .update({ status: 'pending', updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error) throw new Error(`Failed to submit topic: ${error.message}`)

    // Add to approval history
    await supabase.from('approval_history').insert({
      topic_id: id,
      user_id: userId,
      user_name: userName,
      action: 'submit',
    })

    return toTopicResponse(topic)
  }

  // Get topic statistics with trends
  async getTopicStats(): Promise<{
    total: { count: number; previousCount: number; trend: number }
    pending: { count: number; previousCount: number; trend: number }
    approved: { count: number; previousCount: number; trend: number }
    successRate: { rate: number; trend: number }
    lastUpdated: string
  }> {
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const startOfPreviousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const endOfPreviousMonth = new Date(now.getFullYear(), now.getMonth(), 0)

    // Get current month counts
    const { count: totalCurrent } = await supabase
      .from('topics')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', startOfMonth.toISOString())

    const { count: pendingCurrent } = await supabase
      .from('topics')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending')

    const { count: approvedCurrent } = await supabase
      .from('topics')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'approved')

    // Get previous month counts
    const { count: totalPrevious } = await supabase
      .from('topics')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', startOfPreviousMonth.toISOString())
      .lte('created_at', endOfPreviousMonth.toISOString())

    const { count: pendingPrevious } = await supabase
      .from('topics')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending')
      .gte('created_at', startOfPreviousMonth.toISOString())
      .lte('created_at', endOfPreviousMonth.toISOString())

    const { count: approvedPrevious } = await supabase
      .from('topics')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'approved')
      .gte('created_at', startOfPreviousMonth.toISOString())
      .lte('created_at', endOfPreviousMonth.toISOString())

    // Get total for success rate calculation
    const { count: totalAll } = await supabase
      .from('topics')
      .select('*', { count: 'exact', head: true })

    const { count: approvedAll } = await supabase
      .from('topics')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'approved')

    // Calculate trends (percentage change)
    const calcTrend = (current: number, previous: number): number => {
      if (previous === 0) return current > 0 ? 100 : 0
      return Math.round(((current - previous) / previous) * 100 * 10) / 10
    }

    const total = totalCurrent || 0
    const totalPrev = totalPrevious || 0
    const pending = pendingCurrent || 0
    const pendingPrev = pendingPrevious || 0
    const approved = approvedCurrent || 0
    const approvedPrev = approvedPrevious || 0

    const successRate = (totalAll || 0) > 0 
      ? Math.round(((approvedAll || 0) / (totalAll || 1)) * 100) 
      : 0

    const previousSuccessRate = (totalPrev) > 0 
      ? Math.round(((approvedPrev) / (totalPrev || 1)) * 100) 
      : 0

    return {
      total: {
        count: totalAll || 0,
        previousCount: totalPrev,
        trend: calcTrend(total, totalPrev),
      },
      pending: {
        count: pending,
        previousCount: pendingPrev,
        trend: calcTrend(pending, pendingPrev),
      },
      approved: {
        count: approvedAll || 0,
        previousCount: approvedPrev,
        trend: calcTrend(approved, approvedPrev),
      },
      successRate: {
        rate: successRate,
        trend: calcTrend(successRate, previousSuccessRate),
      },
      lastUpdated: now.toISOString(),
    }
  }
}

export const topicService = new TopicService()
