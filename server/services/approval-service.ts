import { supabase } from '../db/supabase'
import type { TopicResponse, ApprovalHistoryResponse } from '../types/topic'
import { topicService } from './topic-service'

export class ApprovalService {
  // Approve topic - single step approval
  async approveTopic(
    topicId: string,
    userId: string,
    userName?: string,
    userRole?: string,
    comment?: string
  ): Promise<TopicResponse> {
    const topic = await topicService.getTopic(topicId)
    if (!topic) throw new Error('Topic not found')
    if (topic.status !== 'pending') throw new Error('Topic is not pending approval')

    const { error } = await supabase
      .from('topics')
      .update({ status: 'approved', updated_at: new Date().toISOString() })
      .eq('id', topicId)

    if (error) throw new Error(`Failed to approve topic: ${error.message}`)

    await supabase.from('approval_history').insert({
      topic_id: topicId,
      user_id: userId,
      user_name: userName,
      user_role: userRole,
      action: 'approve',
      comment: comment || null,
    })

    return topicService.getTopic(topicId) as Promise<TopicResponse>
  }

  // Reject topic
  async rejectTopic(
    topicId: string,
    userId: string,
    userName?: string,
    userRole?: string,
    comment?: string
  ): Promise<TopicResponse> {
    const topic = await topicService.getTopic(topicId)
    if (!topic) throw new Error('Topic not found')
    if (topic.status !== 'pending') throw new Error('Topic is not pending approval')

    const { error } = await supabase
      .from('topics')
      .update({ status: 'rejected', updated_at: new Date().toISOString() })
      .eq('id', topicId)

    if (error) throw new Error(`Failed to reject topic: ${error.message}`)

    await supabase.from('approval_history').insert({
      topic_id: topicId,
      user_id: userId,
      user_name: userName,
      user_role: userRole,
      action: 'reject',
      comment: comment || null,
    })

    return topicService.getTopic(topicId) as Promise<TopicResponse>
  }

  // Request revision
  async requestRevision(
    topicId: string,
    userId: string,
    userName?: string,
    userRole?: string,
    comment?: string
  ): Promise<TopicResponse> {
    const topic = await topicService.getTopic(topicId)
    if (!topic) throw new Error('Topic not found')
    if (topic.status !== 'pending') throw new Error('Topic is not pending approval')

    const { error } = await supabase
      .from('topics')
      .update({ status: 'revision_required', updated_at: new Date().toISOString() })
      .eq('id', topicId)

    if (error) throw new Error(`Failed to request revision: ${error.message}`)

    await supabase.from('approval_history').insert({
      topic_id: topicId,
      user_id: userId,
      user_name: userName,
      user_role: userRole,
      action: 'request_revision',
      comment: comment || null,
    })

    return topicService.getTopic(topicId) as Promise<TopicResponse>
  }

  // Get approval history for a topic
  async getApprovalHistory(topicId: string): Promise<ApprovalHistoryResponse[]> {
    const { data: history, error } = await supabase
      .from('approval_history')
      .select('*')
      .eq('topic_id', topicId)
      .order('created_at', { ascending: true })

    if (error) throw new Error(`Failed to fetch approval history: ${error.message}`)

    return (history || []).map((h) => ({
      id: h.id,
      userId: h.user_id,
      userName: h.user_name,
      userRole: h.user_role,
      action: h.action,
      level: h.level,
      comment: h.comment,
      createdAt: h.created_at,
    }))
  }
}

export const approvalService = new ApprovalService()
