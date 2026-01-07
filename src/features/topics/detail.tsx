'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { useParams, useNavigate } from '@tanstack/react-router'
import type { OutputData } from '@editorjs/editorjs'
import { vi } from 'date-fns/locale'
import {
  ArrowLeft,
  Check,
  Edit,
  FileText,
  Loader2,
  RotateCcw,
  Save,
  Send,
  X,
  Paperclip,
} from 'lucide-react'
import { toast } from 'sonner'
import { useAuthStore, hasRole } from '@/stores/auth-store'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { BlockEditor, EditorJsRenderer } from '@/components/ui/block-editor'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { DateTimePicker } from '@/components/ui/datetime-picker'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  useTopic,
  useUpdateTopic,
  useSubmitTopic,
  useApproveTopic,
  useRejectTopic,
  useRequestRevision,
} from './hooks/use-topics'
import { STATUS_CONFIG } from './types'

// Category options
const CATEGORY_OPTIONS = [
  { value: 'thoi_su', label: 'Thời sự' },
  { value: 'van_hoa', label: 'Văn hóa' },
  { value: 'kinh_te', label: 'Kinh tế' },
  { value: 'xa_hoi', label: 'Xã hội' },
  { value: 'the_thao', label: 'Thể thao' },
  { value: 'giao_duc', label: 'Giáo dục' },
  { value: 'y_te', label: 'Y tế' },
  { value: 'giai_tri', label: 'Giải trí' },
  { value: 'khac', label: 'Khác' },
]

// Approver options
const APPROVER_OPTIONS = [
  {
    value: 'bbt',
    label: 'Ban Biên tập (BBT)',
    description: 'Gửi đề tài trực tiếp lên Ban Biên tập để duyệt',
  },
  {
    value: 'truong_pho_phong',
    label: 'Trưởng/Phó phòng',
    description: 'Gửi đề tài cho Trưởng hoặc Phó phòng xem xét trước',
  },
]

export function TopicDetailPage() {
  const { id } = useParams({ from: '/_authenticated/topics/$id' })
  const navigate = useNavigate()
  const { user } = useAuthStore()

  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState<{
    title: string
    outline: OutputData | string
    category: string
    startDate?: Date
    endDate?: Date
    approver: string
  }>({ title: '', outline: '', category: '', approver: '' })
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
      setEditData({
        title: topic.title,
        outline: topic.outline || '',
        category: topic.category || '',
        startDate: topic.startDate ? new Date(topic.startDate) : undefined,
        endDate: topic.deadline ? new Date(topic.deadline) : undefined,
        approver: topic.approver || '',
      })
      setIsEditing(true)
    }
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    setEditData({ title: '', outline: '', category: '', approver: '' })
  }

  const handleSaveEdit = async () => {
    if (!topic) return
    try {
      // Lưu dữ liệu dạng JSON string của Editor.js
      const outlineValue =
        typeof editData.outline === 'string'
          ? editData.outline
          : JSON.stringify(editData.outline)
      await updateTopic.mutateAsync({
        id: topic.id,
        data: {
          title: editData.title,
          outline: outlineValue,
          category: editData.category || undefined,
          startDate: editData.startDate?.toISOString(),
          deadline: editData.endDate?.toISOString(),
          approver:
            (editData.approver as 'bbt' | 'truong_pho_phong') || undefined,
        },
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

  return (
    <div className='flex flex-col gap-4 sm:gap-6'>
      {/* Page Header */}
      <div className='flex flex-wrap items-end justify-between gap-2'>
        <div className='flex flex-col items-start gap-2'>
          <Button
            variant='ghost'
            size='sm'
            className='h-8 gap-1.5 px-2 text-muted-foreground hover:text-foreground'
            onClick={() => navigate({ to: '/topics' })}
          >
            <ArrowLeft className='h-4 w-4' />
            Quay lại
          </Button>
          <div className='flex items-center gap-3'>
            <h2 className='text-3xl font-bold tracking-tight'>
              Chi Tiết Đề Tài
            </h2>
            <Badge
              variant='outline'
              className={cn(
                'px-3 py-1 text-xs font-medium',
                statusConfig?.color
              )}
            >
              {statusConfig?.label}
            </Badge>
          </div>
        </div>
        <div className='flex gap-2'>
          {!isEditing && canEdit && (
            <Button variant='outline' onClick={handleStartEdit}>
              <Edit className='mr-2 h-4 w-4' />
              Chỉnh sửa
            </Button>
          )}
          {!isEditing && canSubmit && (
            <Button onClick={handleSubmit} disabled={submitTopic.isPending}>
              {submitTopic.isPending ? (
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              ) : (
                <Send className='mr-2 h-4 w-4' />
              )}
              Gửi duyệt
            </Button>
          )}
          {isEditing && (
            <>
              <Button variant='outline' onClick={handleCancelEdit}>
                Hủy
              </Button>
              <Button onClick={handleSaveEdit} disabled={updateTopic.isPending}>
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

      {/* Main Content - 2 columns */}
      <div className='grid grid-cols-1 gap-6 lg:grid-cols-12'>
        {/* Left Column - Form chính */}
        <div className='space-y-6 lg:col-span-8'>
          <Card>
            <CardContent className='space-y-5 pt-6'>
              {/* Tiêu đề */}
              <div className='space-y-2'>
                <Label htmlFor='title'>Tiêu đề đề tài</Label>
                {isEditing ? (
                  <Input
                    id='title'
                    value={editData.title}
                    onChange={(e) =>
                      setEditData((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                  />
                ) : (
                  <p className='text-lg font-medium'>{topic.title}</p>
                )}
              </div>

              {/* Mô tả */}
              <div className='space-y-2'>
                <Label htmlFor='outline'>Mô tả chi tiết / Pitch</Label>
                {isEditing ? (
                  <BlockEditor
                    data={editData.outline}
                    onChange={(data) =>
                      setEditData((prev) => ({
                        ...prev,
                        outline: data,
                      }))
                    }
                    holderId='topic-detail-editor'
                    placeholder='Mô tả ý tưởng, góc nhìn, thông điệp muốn truyền tải...'
                    minHeight={150}
                  />
                ) : (
                  <div className='rounded-lg border bg-muted/30 p-4'>
                    {topic.outline ? (
                      <EditorJsRenderer data={topic.outline} />
                    ) : (
                      <p className='text-sm text-muted-foreground italic'>
                        Chưa có mô tả chi tiết.
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Tài liệu đính kèm */}
              <div className='space-y-3'>
                <Label>
                  Tài liệu đính kèm ({topic.attachments?.length || 0})
                </Label>
                {topic.attachments && topic.attachments.length > 0 ? (
                  <div className='space-y-2'>
                    {topic.attachments.map((file) => (
                      <a
                        key={file.id}
                        href={file.fileUrl}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='group flex items-center gap-3 rounded-lg border bg-card p-3 transition-colors hover:bg-muted/50'
                      >
                        <div
                          className={cn(
                            'flex h-9 w-9 items-center justify-center rounded-lg',
                            file.fileName.match(/\.(pdf)$/i)
                              ? 'bg-red-100 text-red-600 dark:bg-red-950/50'
                              : file.fileName.match(/\.(doc|docx)$/i)
                                ? 'bg-blue-100 text-blue-600 dark:bg-blue-950/50'
                                : 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950/50'
                          )}
                        >
                          <FileText className='h-4 w-4' />
                        </div>
                        <div className='min-w-0 flex-1'>
                          <p className='truncate text-sm font-medium'>
                            {file.fileName}
                          </p>
                          <p className='text-xs text-muted-foreground'>
                            {(file.fileSize / 1024).toFixed(1)} KB
                          </p>
                        </div>
                      </a>
                    ))}
                  </div>
                ) : (
                  <div className='flex items-center justify-center gap-3 rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/30 px-4 py-6'>
                    <Paperclip className='h-5 w-5 text-muted-foreground' />
                    <p className='text-sm text-muted-foreground'>
                      Không có tài liệu đính kèm
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Sidebar cài đặt */}
        <div className='lg:col-span-4'>
          <Card className='sticky top-4'>
            <CardContent className='space-y-4 pt-6'>
              {/* Ngày bắt đầu */}
              <div className='space-y-2'>
                <Label>Ngày bắt đầu</Label>
                {isEditing ? (
                  <DateTimePicker
                    value={editData.startDate}
                    onChange={(date) =>
                      setEditData((prev) => ({ ...prev, startDate: date }))
                    }
                    placeholder='Chọn ngày'
                  />
                ) : (
                  <p className='text-sm'>
                    {topic.startDate
                      ? format(new Date(topic.startDate), 'dd/MM/yyyy', {
                          locale: vi,
                        })
                      : '—'}
                  </p>
                )}
              </div>

              {/* Ngày hoàn thành */}
              <div className='space-y-2'>
                <Label>Ngày hoàn thành</Label>
                {isEditing ? (
                  <DateTimePicker
                    value={editData.endDate}
                    onChange={(date) =>
                      setEditData((prev) => ({ ...prev, endDate: date }))
                    }
                    placeholder='Chọn ngày'
                    disablePastDates={true}
                  />
                ) : (
                  <p className='text-sm'>
                    {topic.deadline
                      ? format(new Date(topic.deadline), 'dd/MM/yyyy', {
                          locale: vi,
                        })
                      : '—'}
                  </p>
                )}
              </div>

              {/* Danh mục */}
              <div className='space-y-2'>
                <Label>Danh mục</Label>
                {isEditing ? (
                  <Select
                    value={editData.category}
                    onValueChange={(value) =>
                      setEditData((prev) => ({ ...prev, category: value }))
                    }
                  >
                    <SelectTrigger className='w-full'>
                      <SelectValue placeholder='Chọn danh mục...' />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORY_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <p className='text-sm'>
                    {CATEGORY_OPTIONS.find((c) => c.value === topic.category)
                      ?.label || '—'}
                  </p>
                )}
              </div>

              {/* Đăng ký với */}
              <div className='space-y-3'>
                <Label>Đăng ký với</Label>
                {isEditing ? (
                  <RadioGroup
                    value={editData.approver}
                    onValueChange={(value) =>
                      setEditData((prev) => ({ ...prev, approver: value }))
                    }
                    className='space-y-2'
                  >
                    {APPROVER_OPTIONS.map((option) => (
                      <label
                        key={option.value}
                        htmlFor={`detail-${option.value}`}
                        className={cn(
                          'flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-all hover:bg-muted/50',
                          editData.approver === option.value &&
                            'border-primary bg-primary/5'
                        )}
                      >
                        <RadioGroupItem
                          value={option.value}
                          id={`detail-${option.value}`}
                          className='mt-0.5'
                        />
                        <div className='flex-1 space-y-0.5'>
                          <p className='mb-2 text-sm leading-none font-medium'>
                            {option.label}
                          </p>
                          <p className='text-xs text-muted-foreground'>
                            {option.description}
                          </p>
                        </div>
                      </label>
                    ))}
                  </RadioGroup>
                ) : (
                  <p className='text-sm'>
                    {APPROVER_OPTIONS.find((a) => a.value === topic.approver)
                      ?.label || '—'}
                  </p>
                )}
              </div>

              {/* Thông tin tạo */}
              <div className='space-y-2 border-t pt-4'>
                <Label className='text-muted-foreground'>Thông tin</Label>
                <div className='space-y-1 text-sm'>
                  <p>
                    <span className='text-muted-foreground'>Người tạo:</span>{' '}
                    {topic.createdByName}
                  </p>
                  <p>
                    <span className='text-muted-foreground'>Ngày tạo:</span>{' '}
                    {format(new Date(topic.createdAt), 'dd/MM/yyyy HH:mm', {
                      locale: vi,
                    })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
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
