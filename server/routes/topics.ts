import { Router, type Request, type Response } from 'express'
import { topicService } from '../services/topic-service'
import { approvalService } from '../services/approval-service'
import type { CreateTopicDTO, UpdateTopicDTO, ApprovalDTO, ApiResponse } from '../types/topic'

const router = Router()

// Helper for async route handlers
const asyncHandler = (fn: (req: Request, res: Response) => Promise<void>) => {
  return (req: Request, res: Response) => {
    Promise.resolve(fn(req, res)).catch((error) => {
      // eslint-disable-next-line no-console
      console.error('Route error:', error)
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      } as ApiResponse<never>)
    })
  }
}

// Get user ID from request (placeholder - replace with real auth)
const getUserFromRequest = (req: Request) => {
  // TODO: Replace with real authentication
  return {
    id: req.headers['x-user-id'] as string || 'user_1',
    name: req.headers['x-user-name'] as string || 'Phóng viên Demo',
    role: req.headers['x-user-role'] as string || 'reporter',
  }
}

// GET /api/topics/stats - Get topic statistics
router.get(
  '/stats',
  asyncHandler(async (_req, res) => {
    const stats = await topicService.getTopicStats()
    res.json({ success: true, data: stats })
  })
)

// GET /api/topics - List all topics
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const { status, contentType, createdBy } = req.query
    const topics = await topicService.getTopics({
      status: status as string,
      contentType: contentType as string,
      createdBy: createdBy as string,
    })
    res.json({ success: true, data: { topics, total: topics.length } })
  })
)

// GET /api/topics/my - Get current user's topics
router.get(
  '/my',
  asyncHandler(async (req, res) => {
    const user = getUserFromRequest(req)
    const topics = await topicService.getTopicsByUser(user.id)
    res.json({ success: true, data: { topics, total: topics.length } })
  })
)

// GET /api/topics/:id - Get single topic
router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const topic = await topicService.getTopic(req.params.id)
    if (!topic) {
      res.status(404).json({ success: false, error: 'Topic not found' })
      return
    }
    res.json({ success: true, data: topic })
  })
)

// POST /api/topics - Create new topic
router.post(
  '/',
  asyncHandler(async (req, res) => {
    const user = getUserFromRequest(req)
    const data: CreateTopicDTO = req.body
    const topic = await topicService.createTopic(data, user.id, user.name)
    res.status(201).json({ success: true, data: topic })
  })
)

// PUT /api/topics/:id - Update topic
router.put(
  '/:id',
  asyncHandler(async (req, res) => {
    const user = getUserFromRequest(req)
    const data: UpdateTopicDTO = req.body
    const topic = await topicService.updateTopic(req.params.id, data, user.id)
    res.json({ success: true, data: topic })
  })
)

// DELETE /api/topics/:id - Delete topic (drafts only)
router.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    const user = getUserFromRequest(req)
    await topicService.deleteTopic(req.params.id, user.id)
    res.json({ success: true })
  })
)

// POST /api/topics/:id/submit - Submit for approval
router.post(
  '/:id/submit',
  asyncHandler(async (req, res) => {
    const user = getUserFromRequest(req)
    const topic = await topicService.submitTopic(req.params.id, user.id, user.name)
    res.json({ success: true, data: topic })
  })
)

// POST /api/topics/:id/approve - Approve topic (leadership)
router.post(
  '/:id/approve',
  asyncHandler(async (req, res) => {
    const user = getUserFromRequest(req)
    const { comment } = req.body as ApprovalDTO
    const topic = await approvalService.approveTopic(
      req.params.id,
      user.id,
      user.name,
      user.role,
      comment
    )
    res.json({ success: true, data: topic })
  })
)

// POST /api/topics/:id/reject - Reject topic
router.post(
  '/:id/reject',
  asyncHandler(async (req, res) => {
    const user = getUserFromRequest(req)
    const { comment } = req.body as ApprovalDTO
    const topic = await approvalService.rejectTopic(
      req.params.id,
      user.id,
      user.name,
      user.role,
      comment
    )
    res.json({ success: true, data: topic })
  })
)

// POST /api/topics/:id/request-revision - Request revision
router.post(
  '/:id/request-revision',
  asyncHandler(async (req, res) => {
    const user = getUserFromRequest(req)
    const { comment } = req.body as ApprovalDTO
    const topic = await approvalService.requestRevision(
      req.params.id,
      user.id,
      user.name,
      user.role,
      comment
    )
    res.json({ success: true, data: topic })
  })
)

// GET /api/topics/:id/history - Get approval history
router.get(
  '/:id/history',
  asyncHandler(async (req, res) => {
    const history = await approvalService.getApprovalHistory(req.params.id)
    res.json({ success: true, data: history })
  })
)

export default router
