'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { useParams, useNavigate } from '@tanstack/react-router'
import type { OutputData } from '@editorjs/editorjs'
import { vi } from 'date-fns/locale'
import {
  ArrowLeft,
  Check,
  Clock,
  Edit,
  FileText,
  Loader2,
  RotateCcw,
  Save,
  Send,
  User,
  X,
  Calendar,
  Layers,
  Printer,
  MoreHorizontal,
  Download,
} from 'lucide-react'
import { toast } from 'sonner'
import { useAuthStore, hasRole } from '@/stores/auth-store'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { BlockEditor, editorDataToHtml } from '@/components/ui/block-editor'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  useTopic,
  useUpdateTopic,
  useSubmitTopic,
  useApproveTopic,
  useRejectTopic,
  useRequestRevision,
} from './hooks/use-topics'
import { STATUS_CONFIG, CONTENT_TYPE_CONFIG } from './types'

export function TopicDetailPage() {
  const { id } = useParams({ from: '/_authenticated/topics/$id' })
  const navigate = useNavigate()
  const { user } = useAuthStore()

  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState<{
    title: string
    outline: OutputData | string
  }>({ title: '', outline: '' })
  const [approvalComment, setApprovalComment] = useState('')

  // Fetch topic data
  const { data: topic, isLoading, error } = useTopic(id)

  // Mutations
  const updateTopic = useUpdateTopic()
  const submitTopic = useSubmitTopic()
  const approveTopic = useApproveTopic()
  const rejectTopic = useRejectTopic()
  const requestRevision = useRequestRevision()

  const isOwner = topic?.createdBy === user?.id
  const canEdit =
    (isOwner && ['draft', 'revision_required'].includes(topic?.status || '')) ||
    (hasRole(user, ['admin', 'leadership']) &&
      ['draft', 'pending', 'revision_required'].includes(topic?.status || ''))
  const canSubmit =
    isOwner && ['draft', 'revision_required'].includes(topic?.status || '')
  const canApprove =
    hasRole(user, ['admin', 'leadership']) && topic?.status === 'pending'

  const handleStartEdit = () => {
    if (topic) {
      setEditData({ title: topic.title, outline: topic.outline || '' })
      setIsEditing(true)
    }
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    setEditData({ title: '', outline: '' })
  }

  const handleSaveEdit = async () => {
    if (!topic) return
    try {
      const outlineValue =
        typeof editData.outline === 'string'
          ? editData.outline
          : editorDataToHtml(editData.outline)
      await updateTopic.mutateAsync({
        id: topic.id,
        data: { title: editData.title, outline: outlineValue },
      })
      toast.success('Đã lưu thay đổi')
      setIsEditing(false)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Lỗi khi lưu')
    }
  }

  const handleSubmit = async () => {
    if (!topic) return
    try {
      await submitTopic.mutateAsync(topic.id)
      toast.success('Đã gửi đề tài để duyệt')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Lỗi khi gửi')
    }
  }

  const handleApprove = async () => {
    if (!topic) return
    try {
      await approveTopic.mutateAsync({ id: topic.id, comment: approvalComment })
      toast.success('Đã phê duyệt đề tài')
      setApprovalComment('')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Lỗi khi duyệt')
    }
  }

  const handleReject = async () => {
    if (!topic || !approvalComment.trim()) {
      toast.error('Vui lòng nhập lý do từ chối')
      return
    }
    try {
      await rejectTopic.mutateAsync({ id: topic.id, comment: approvalComment })
      toast.success('Đã từ chối đề tài')
      setApprovalComment('')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Lỗi khi từ chối')
    }
  }

  const handleRequestRevision = async () => {
    if (!topic || !approvalComment.trim()) {
      toast.error('Vui lòng nhập yêu cầu chỉnh sửa')
      return
    }
    try {
      await requestRevision.mutateAsync({
        id: topic.id,
        comment: approvalComment,
      })
      toast.success('Đã yêu cầu chỉnh sửa')
      setApprovalComment('')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Lỗi')
    }
  }

  if (isLoading) {
    return (
      <div className='flex h-96 items-center justify-center'>
        <Loader2 className='h-8 w-8 animate-spin text-primary' />
      </div>
    )
  }

  if (error || !topic) {
    return (
      <div className='flex h-96 flex-col items-center justify-center gap-4'>
        <p className='text-lg font-medium text-muted-foreground'>
          Không tìm thấy đề tài yêu cầu
        </p>
        <Button variant='outline' onClick={() => navigate({ to: '/topics' })}>
          <ArrowLeft className='mr-2 h-4 w-4' />
          Quay lại danh sách
        </Button>
      </div>
    )
  }

  const statusConfig = STATUS_CONFIG[topic.status]
  const contentTypeConfig = CONTENT_TYPE_CONFIG[topic.contentType]

  return (
    <div className='space-y-6'>
      {/* Page Header */}
      <div className='flex flex-wrap items-start justify-between gap-4'>
        {/* Left: Breadcrumb, Badges, Title, Metadata */}
        <div className='min-w-0 flex-1 space-y-4'>
          {/* Breadcrumb and Badges Row */}
          <div className='flex flex-wrap items-center gap-3'>
            <Button
              variant='ghost'
              size='sm'
              className='h-8 gap-1.5 px-2 text-muted-foreground hover:text-foreground'
              onClick={() => navigate({ to: '/topics' })}
            >
              <ArrowLeft className='h-4 w-4' />
              Quay lại
            </Button>
            <div className='h-1 w-1 rounded-full bg-muted-foreground/30' />
            <Badge
              variant='outline'
              className={cn(
                'border px-3 py-1 text-xs font-medium',
                statusConfig.color
              )}
            >
              {statusConfig.label}
            </Badge>
            <Badge variant='outline' className='px-3 py-1 text-xs font-medium'>
              {contentTypeConfig?.label}
            </Badge>
          </div>

          {/* Title */}
          {isEditing ? (
            <Input
              value={editData.title}
              onChange={(e) =>
                setEditData((p) => ({ ...p, title: e.target.value }))
              }
              className='h-auto w-full border-0 border-b-2 border-muted bg-transparent px-0 py-2 text-3xl font-bold tracking-tight focus-visible:border-primary focus-visible:ring-0'
              placeholder='Nhập tiêu đề...'
            />
          ) : (
            <h1 className='text-3xl font-bold tracking-tight'>{topic.title}</h1>
          )}

          {/* Metadata Row */}
          <div className='flex flex-wrap items-center gap-6 text-sm text-muted-foreground'>
            <div className='flex items-center gap-2'>
              <User className='h-4 w-4' />
              <span>{topic.createdByName}</span>
            </div>
            <div className='flex items-center gap-2'>
              <Calendar className='h-4 w-4' />
              <span>{format(new Date(topic.createdAt), 'dd/MM/yyyy')}</span>
            </div>
            {topic.deadline && (
              <div className='flex items-center gap-2'>
                <Clock className='h-4 w-4' />
                <span>
                  Hạn: {format(new Date(topic.deadline), 'dd/MM/yyyy')}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Right: Action Buttons */}
        <div className='flex shrink-0 items-center gap-2'>
          {!isEditing && (
            <>
              <Button variant='outline' size='icon' title='In'>
                <Printer className='h-4 w-4' />
              </Button>
              <Button variant='outline' size='icon' title='Thêm thao tác'>
                <MoreHorizontal className='h-4 w-4' />
              </Button>
              {canEdit && (
                <Button variant='outline' onClick={handleStartEdit}>
                  <Edit className='mr-2 h-4 w-4' />
                  Chỉnh sửa
                </Button>
              )}
              {canSubmit && (
                <Button
                  onClick={handleSubmit}
                  disabled={submitTopic.isPending}
                  className='bg-blue-600 text-white hover:bg-blue-700'
                >
                  {submitTopic.isPending ? (
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  ) : (
                    <Send className='mr-2 h-4 w-4' />
                  )}
                  Gửi duyệt
                </Button>
              )}
            </>
          )}
          {isEditing && (
            <>
              <Button variant='outline' onClick={handleCancelEdit}>
                Hủy
              </Button>
              <Button
                onClick={handleSaveEdit}
                disabled={updateTopic.isPending}
                className='bg-blue-600 text-white hover:bg-blue-700'
              >
                {updateTopic.isPending ? (
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                ) : (
                  <Save className='mr-2 h-4 w-4' />
                )}
                Lưu thay đổi
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className='grid gap-6 lg:grid-cols-12'>
        {/* Left Column - Content */}
        <div className='space-y-6 lg:col-span-8'>
          {/* Content Section */}
          <div>
            <h2 className='mb-4 flex items-center gap-2 text-lg font-semibold'>
              <FileText className='h-5 w-5 text-primary' />
              Nội dung chi tiết
            </h2>
            <Card>
              <CardContent className='p-6 md:p-8'>
                {isEditing ? (
                  <BlockEditor
                    data={editData.outline}
                    onChange={(data) =>
                      setEditData((p) => ({ ...p, outline: data }))
                    }
                    holderId='topic-detail-editor'
                    placeholder='Nhập mô tả chi tiết cho đề tài...'
                  />
                ) : (
                  <div
                    className='prose prose-slate dark:prose-invert max-w-none'
                    dangerouslySetInnerHTML={{
                      __html:
                        topic.outline ||
                        '<p class="text-muted-foreground italic">Chưa có mô tả chi tiết.</p>',
                    }}
                  />
                )}
              </CardContent>
            </Card>
          </div>

          {/* Attachments */}
          <div>
            <h2 className='mb-4 flex items-center gap-2 text-lg font-semibold'>
              <Layers className='h-5 w-5 text-primary' />
              Tài liệu đính kèm ({topic.attachments?.length || 0})
            </h2>
            <div className='space-y-3'>
              {topic.attachments && topic.attachments.length > 0 ? (
                topic.attachments.map((att) => (
                  <a
                    key={att.id}
                    href={att.fileUrl}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='group flex items-center gap-4 rounded-xl border bg-card p-4 transition-all hover:border-primary/50 hover:shadow-md'
                  >
                    <div className='flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary'>
                      <FileText className='h-6 w-6' />
                    </div>
                    <div className='min-w-0 flex-1'>
                      <p className='truncate font-medium'>{att.fileName}</p>
                      <div className='mt-1 flex items-center gap-2 text-xs text-muted-foreground'>
                        <span className='uppercase'>
                          {att.fileType.split('/')[1] || 'FILE'}
                        </span>
                        <span>•</span>
                        <span>
                          {(att.fileSize / (1024 * 1024)).toFixed(1)} MB
                        </span>
                      </div>
                    </div>
                    <Download className='h-5 w-5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100' />
                  </a>
                ))
              ) : (
                <Card className='border-dashed'>
                  <CardContent className='flex flex-col items-center justify-center py-8 text-center'>
                    <p className='text-sm text-muted-foreground'>
                      Không có tài liệu đính kèm.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Sidebar */}
        <div className='lg:col-span-4'>
          <div className='sticky top-8 space-y-6'>
            {/* Timeline History */}
            {topic.approvalHistory && topic.approvalHistory.length > 0 && (
              <div>
                <h2 className='mb-4 flex items-center gap-2 text-lg font-semibold'>
                  <Clock className='h-5 w-5 text-primary' />
                  Lịch sử xử lý
                </h2>
                <Card>
                  <CardContent className='p-6'>
                    <div className='relative space-y-6'>
                      {/* Connecting Line */}
                      <div className='absolute top-3 bottom-3 left-[7px] w-px bg-border' />

                      {topic.approvalHistory.map((record, idx) => (
                        <div key={idx} className='relative pl-8'>
                          {/* Dot */}
                          <div
                            className={cn(
                              'absolute top-1 left-0 h-4 w-4 rounded-full border-2 border-background',
                              idx === 0
                                ? 'bg-primary'
                                : 'bg-muted-foreground/30'
                            )}
                          />

                          <div className='space-y-2'>
                            <span className='font-medium'>
                              {record.action === 'approve' && '✓ Đã phê duyệt'}
                              {record.action === 'reject' && '✗ Đã từ chối'}
                              {record.action === 'submit' && '→ Đã gửi duyệt'}
                              {record.action === 'request_revision' &&
                                '↻ Yêu cầu chỉnh sửa'}
                            </span>
                            <p className='text-xs text-muted-foreground'>
                              {format(
                                new Date(record.createdAt),
                                'HH:mm, dd/MM/yyyy',
                                { locale: vi }
                              )}
                            </p>
                            <div className='flex items-center gap-2'>
                              <Avatar className='h-5 w-5'>
                                <AvatarFallback className='text-[8px]'>
                                  {record.userName?.charAt(0) || 'U'}
                                </AvatarFallback>
                              </Avatar>
                              <span className='text-sm text-muted-foreground'>
                                {record.userName}
                              </span>
                            </div>
                            {record.comment && (
                              <div className='mt-2 rounded-lg bg-muted/50 p-3 text-sm text-muted-foreground italic'>
                                "{record.comment}"
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Floating Approval Action Bar */}
      {canApprove && (
        <div className='sticky bottom-6 z-50 mx-auto w-full max-w-4xl'>
          <div className='rounded-2xl border border-primary/20 bg-background/80 p-4 shadow-2xl ring-1 ring-black/5 backdrop-blur-xl dark:ring-white/10'>
            <div className='flex flex-col items-center gap-4 sm:flex-row'>
              <div className='w-full flex-1 sm:w-auto'>
                <Input
                  placeholder='Nhập nhận xét (bắt buộc khi từ chối/yêu cầu sửa)...'
                  value={approvalComment}
                  onChange={(e) => setApprovalComment(e.target.value)}
                  className='border-muted-foreground/20 bg-background/50 focus-visible:ring-primary/30'
                />
              </div>
              <div className='flex w-full items-center gap-2 sm:w-auto'>
                <Button
                  onClick={handleApprove}
                  disabled={approveTopic.isPending}
                  className='flex-1 bg-emerald-600 shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 sm:flex-none'
                >
                  {approveTopic.isPending ? (
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  ) : (
                    <Check className='mr-2 h-4 w-4' />
                  )}
                  Duyệt
                </Button>
                <Button
                  variant='outline'
                  onClick={handleRequestRevision}
                  disabled={requestRevision.isPending}
                  className='flex-1 border-yellow-500/50 text-yellow-700 hover:border-yellow-600 hover:bg-yellow-50 sm:flex-none dark:text-yellow-400 dark:hover:bg-yellow-950/30'
                >
                  <RotateCcw className='mr-2 h-4 w-4' />
                  Sửa
                </Button>
                <Button
                  variant='outline'
                  onClick={handleReject}
                  disabled={rejectTopic.isPending}
                  className='flex-1 border-red-500/50 text-red-700 hover:border-red-600 hover:bg-red-50 sm:flex-none dark:text-red-400 dark:hover:bg-red-950/30'
                >
                  <X className='mr-2 h-4 w-4' />
                  Từ chối
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TopicDetailPage
