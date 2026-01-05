'use client'

import { useState, useMemo } from 'react'
import { format } from 'date-fns'
import { useParams, useNavigate } from '@tanstack/react-router'
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
} from 'lucide-react'
import { toast } from 'sonner'
import { useAuthStore, hasRole } from '@/stores/auth-store'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { RichTextEditor } from '@/components/ui/rich-text-editor'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  useTopic,
  useTopics,
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
  const [editData, setEditData] = useState({ title: '', outline: '' })
  const [approvalComment, setApprovalComment] = useState('')
  const [selectedTab, setSelectedTab] = useState<string>('all')

  // Fetch topic data
  const { data: topic, isLoading, error } = useTopic(id)
  const { data: topicsData } = useTopics()

  // Filter topics for sidebar
  const filteredTopics = useMemo(() => {
    const topics = topicsData?.topics || []
    if (selectedTab === 'all') return topics
    if (selectedTab === 'pending')
      return topics.filter((t) => t.status === 'pending')
    if (selectedTab === 'approved')
      return topics.filter((t) => t.status === 'approved')
    return topics
  }, [topicsData, selectedTab])

  // Mutations
  const updateTopic = useUpdateTopic()
  const submitTopic = useSubmitTopic()
  const approveTopic = useApproveTopic()
  const rejectTopic = useRejectTopic()
  const requestRevision = useRequestRevision()

  const isOwner = topic?.createdBy === user?.id
  const canEdit =
    isOwner && ['draft', 'revision_required'].includes(topic?.status || '')
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
      await updateTopic.mutateAsync({
        id: topic.id,
        data: { title: editData.title, outline: editData.outline },
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
      <div className='flex h-[50vh] items-center justify-center'>
        <Loader2 className='h-8 w-8 animate-spin text-muted-foreground' />
      </div>
    )
  }

  if (error || !topic) {
    return (
      <div className='flex h-[50vh] flex-col items-center justify-center gap-4'>
        <p className='text-muted-foreground'>Không tìm thấy đề tài</p>
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
    <>
      <div className='grid grid-cols-1 gap-6 pb-24 lg:grid-cols-12'>
        {/* Left Sidebar - Topic List */}
        <div className='lg:col-span-4'>
          <Card className='sticky top-20'>
            <CardHeader className='pb-3'>
              <Tabs value={selectedTab} onValueChange={setSelectedTab}>
                <TabsList className='grid w-full grid-cols-3'>
                  <TabsTrigger value='all' className='text-xs'>
                    Tất cả ({topicsData?.topics?.length || 0})
                  </TabsTrigger>
                  <TabsTrigger value='pending' className='text-xs'>
                    Chờ duyệt (
                    {topicsData?.topics?.filter((t) => t.status === 'pending')
                      .length || 0}
                    )
                  </TabsTrigger>
                  <TabsTrigger value='approved' className='text-xs'>
                    Đã duyệt
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            <CardContent className='max-h-[calc(100vh-240px)] space-y-2 overflow-y-auto pt-0'>
              {filteredTopics.map((t) => {
                const status =
                  STATUS_CONFIG[t.status as keyof typeof STATUS_CONFIG] ||
                  STATUS_CONFIG.draft
                const isSelected = t.id === id
                return (
                  <div
                    key={t.id}
                    onClick={() =>
                      navigate({ to: '/topics/$id', params: { id: t.id } })
                    }
                    className={cn(
                      'cursor-pointer rounded-lg border p-3 transition-all hover:bg-muted/50',
                      isSelected && 'border-primary bg-primary/5'
                    )}
                  >
                    <div className='mb-2 flex items-center gap-2'>
                      <Avatar className='h-8 w-8'>
                        <AvatarFallback className='text-xs'>
                          {t.createdByName?.charAt(0) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div className='min-w-0 flex-1'>
                        <p className='truncate text-xs font-medium'>
                          {t.createdByName}
                        </p>
                        <p className='text-xs text-muted-foreground'>
                          {format(new Date(t.createdAt), 'HH:mm', {
                            locale: vi,
                          })}
                        </p>
                      </div>
                      <Badge
                        variant='outline'
                        className={cn(
                          'border-0 px-2 py-0.5 text-xs font-semibold',
                          status.color
                        )}
                      >
                        {status.label}
                      </Badge>
                    </div>
                    <h4 className='line-clamp-2 text-sm font-semibold text-primary'>
                      {t.title}
                    </h4>
                    <p className='mt-1 line-clamp-2 text-xs text-muted-foreground'>
                      {t.outline?.replace(/<[^>]*>/g, '') || 'Chưa có mô tả'}
                    </p>
                  </div>
                )
              })}
              {filteredTopics.length === 0 && (
                <p className='py-8 text-center text-sm text-muted-foreground'>
                  Không có đề tài nào
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Content - Topic Detail */}
        <div className='relative space-y-6 pb-48 lg:col-span-8'>
          {/* Status Badge */}
          <Badge
            className={cn(
              'w-fit px-3 py-1 text-sm font-semibold',
              topic.status === 'pending' && 'bg-amber-600 hover:bg-amber-700',
              topic.status === 'approved' &&
                'bg-emerald-600 hover:bg-emerald-700',
              topic.status === 'draft' && 'bg-slate-600 hover:bg-slate-700',
              topic.status === 'rejected' && 'bg-rose-600 hover:bg-rose-700',
              topic.status === 'revision_required' &&
                'bg-yellow-600 hover:bg-yellow-700'
            )}
          >
            {statusConfig.label}
          </Badge>

          {/* Title */}
          <div>
            {isEditing ? (
              <Input
                value={editData.title}
                onChange={(e) =>
                  setEditData((p) => ({ ...p, title: e.target.value }))
                }
                className='text-2xl font-bold'
              />
            ) : (
              <h1 className='text-2xl font-bold text-primary'>{topic.title}</h1>
            )}
          </div>

          {/* Info Row */}
          <div className='grid grid-cols-2 gap-4 md:grid-cols-4'>
            <div className='space-y-1'>
              <p className='text-xs text-muted-foreground'>NGƯỜI ĐỀ XUẤT</p>
              <div className='flex items-center gap-2'>
                <Avatar className='h-6 w-6'>
                  <AvatarFallback className='text-xs'>
                    {topic.createdByName?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <span className='text-sm font-medium'>
                  {topic.createdByName}
                </span>
              </div>
            </div>
            <div className='space-y-1'>
              <p className='text-xs text-muted-foreground'>LOẠI HÌNH</p>
              <Badge variant='secondary' className='mt-1'>
                {contentTypeConfig?.label || topic.contentType}
              </Badge>
            </div>
            <div className='space-y-1'>
              <p className='text-xs text-muted-foreground'>THỜI GIAN GỬI</p>
              <p className='text-sm font-medium'>
                {format(new Date(topic.createdAt), 'dd/MM/yyyy HH:mm', {
                  locale: vi,
                })}
              </p>
            </div>
            <div className='space-y-1'>
              <p className='text-xs text-muted-foreground'>THỜI HẠN</p>
              <p className='text-sm font-medium'>
                {topic.deadline
                  ? format(new Date(topic.deadline), 'dd/MM/yyyy HH:mm', {
                      locale: vi,
                    })
                  : 'Chưa xác định'}
              </p>
            </div>
          </div>

          <Separator />

          {/* Description */}
          <Card>
            <CardHeader className='pb-3'>
              <CardTitle className='text-base'>Mô tả tóm tắt</CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <RichTextEditor
                  content={editData.outline}
                  onChange={(content) =>
                    setEditData((p) => ({ ...p, outline: content }))
                  }
                />
              ) : (
                <div
                  className='prose prose-sm dark:prose-invert max-w-none'
                  dangerouslySetInnerHTML={{
                    __html:
                      topic.outline ||
                      '<p class="text-muted-foreground">Chưa có mô tả</p>',
                  }}
                />
              )}
            </CardContent>
          </Card>

          {/* Attachments */}
          {topic.attachments && topic.attachments.length > 0 && (
            <div className='grid grid-cols-2 gap-3'>
              {topic.attachments.map((att) => (
                <a
                  key={att.id}
                  href={att.fileUrl}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='flex items-center gap-3 rounded-lg border border-dashed p-3 transition-colors hover:bg-muted/50'
                >
                  <div className='flex h-10 w-10 items-center justify-center rounded bg-red-100 text-red-600 dark:bg-red-950/50'>
                    <FileText className='h-5 w-5' />
                  </div>
                  <div className='min-w-0 flex-1'>
                    <p className='truncate text-sm font-medium'>
                      {att.fileName}
                    </p>
                    <p className='text-xs text-muted-foreground'>
                      {(att.fileSize / (1024 * 1024)).toFixed(1)} MB
                    </p>
                  </div>
                </a>
              ))}
            </div>
          )}

          {/* Approval Section - Sticky Bottom */}
          <Card className='sticky bottom-4 z-40 border-primary/20 bg-background/95 shadow-lg backdrop-blur'>
            <CardContent className='flex flex-wrap items-center gap-3 py-4'>
              <h3 className='text-sm font-semibold'>Phê duyệt</h3>

              <Input
                placeholder='Nhập ghi chú...'
                value={approvalComment}
                onChange={(e) => setApprovalComment(e.target.value)}
                className='max-w-xs flex-1'
              />

              {canApprove && (
                <>
                  <Button
                    onClick={handleApprove}
                    disabled={approveTopic.isPending}
                    size='sm'
                    className='bg-emerald-600 hover:bg-emerald-700'
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
                    size='sm'
                    className='border-yellow-500 text-yellow-600 hover:bg-yellow-50'
                  >
                    {requestRevision.isPending ? (
                      <Loader2 className='h-4 w-4 animate-spin' />
                    ) : (
                      <RotateCcw className='h-4 w-4' />
                    )}
                  </Button>
                  <Button
                    variant='outline'
                    onClick={handleReject}
                    disabled={rejectTopic.isPending}
                    size='sm'
                    className='border-red-500 text-red-600 hover:bg-red-50'
                  >
                    {rejectTopic.isPending ? (
                      <Loader2 className='h-4 w-4 animate-spin' />
                    ) : (
                      <X className='h-4 w-4' />
                    )}
                  </Button>
                </>
              )}
              {canEdit && !isEditing && (
                <Button variant='outline' size='sm' onClick={handleStartEdit}>
                  <Edit className='mr-2 h-4 w-4' />
                  Sửa
                </Button>
              )}
              {isEditing && (
                <>
                  <Button variant='ghost' size='sm' onClick={handleCancelEdit}>
                    Hủy
                  </Button>
                  <Button
                    size='sm'
                    onClick={handleSaveEdit}
                    disabled={updateTopic.isPending}
                  >
                    {updateTopic.isPending ? (
                      <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    ) : (
                      <Save className='mr-2 h-4 w-4' />
                    )}
                    Lưu
                  </Button>
                </>
              )}
              {canSubmit && !isEditing && (
                <Button
                  size='sm'
                  onClick={handleSubmit}
                  disabled={submitTopic.isPending}
                >
                  {submitTopic.isPending ? (
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  ) : (
                    <Send className='mr-2 h-4 w-4' />
                  )}
                  Gửi duyệt
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Approval History */}
          {topic.approvalHistory && topic.approvalHistory.length > 0 && (
            <Card>
              <CardHeader className='pb-3'>
                <CardTitle className='flex items-center gap-2 text-base'>
                  <Clock className='h-4 w-4' />
                  Lịch sử duyệt
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-3'>
                  {topic.approvalHistory.map((record, idx) => (
                    <div
                      key={record.id || idx}
                      className='relative border-l-2 border-muted pb-3 pl-4 last:pb-0'
                    >
                      <div className='absolute top-0 -left-1.5 h-3 w-3 rounded-full bg-primary' />
                      <div className='flex items-center gap-2'>
                        <User className='h-3 w-3 text-muted-foreground' />
                        <span className='text-sm font-medium'>
                          {record.userName}
                        </span>
                        <span className='text-xs text-muted-foreground'>
                          {format(
                            new Date(record.createdAt),
                            'dd/MM/yyyy HH:mm',
                            { locale: vi }
                          )}
                        </span>
                      </div>
                      <p className='mt-1 text-sm text-muted-foreground'>
                        {record.action === 'approve' && 'Đã phê duyệt'}
                        {record.action === 'reject' && 'Đã từ chối'}
                        {record.action === 'submit' && 'Đã gửi duyệt'}
                        {record.action === 'request_revision' &&
                          'Yêu cầu chỉnh sửa'}
                      </p>
                      {record.comment && (
                        <p className='mt-1 text-sm text-muted-foreground italic'>
                          "{record.comment}"
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </>
  )
}

export default TopicDetailPage
