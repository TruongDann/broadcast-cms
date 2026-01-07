'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import type { OutputData } from '@editorjs/editorjs'
import { vi } from 'date-fns/locale'
import {
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
import { BlockEditor } from '@/components/ui/block-editor'
import { Button } from '@/components/ui/button'
import { DateTimePicker } from '@/components/ui/datetime-picker'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { ScrollArea } from '@/components/ui/scroll-area'
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
} from '../hooks/use-topics'
import { STATUS_CONFIG } from '../types'

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

interface TopicDetailModalProps {
  topicId: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function TopicDetailModal({
  topicId,
  open,
  onOpenChange,
}: TopicDetailModalProps) {
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
  const { data: topic, isLoading } = useTopic(topicId || '')

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
      const outlineValue =
        typeof editData.outline === 'string'
          ? editData.outline
          : editorDataToHtml(editData.outline)
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

  const statusConfig = topic ? STATUS_CONFIG[topic.status] : null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-h-[90vh] !max-w-6xl gap-0 p-0'>
        <DialogHeader className='border-b px-6 py-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-3'>
              <DialogTitle className='text-xl font-semibold'>
                Chi tiết đề tài
              </DialogTitle>
              {statusConfig && (
                <Badge
                  variant='outline'
                  className={cn('px-2 py-0.5 text-xs', statusConfig.color)}
                >
                  {statusConfig.label}
                </Badge>
              )}
            </div>
            <div className='flex gap-2 pr-4'>
              {!isEditing && canEdit && (
                <Button variant='outline' size='sm' onClick={handleStartEdit}>
                  <Edit className='mr-2 h-4 w-4' />
                  Chỉnh sửa
                </Button>
              )}
              {!isEditing && canSubmit && (
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
              {isEditing && (
                <>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={handleCancelEdit}
                  >
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
                </>
              )}
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className='max-h-[calc(90vh-140px)]'>
          {isLoading ? (
            <div className='flex h-64 items-center justify-center'>
              <Loader2 className='h-8 w-8 animate-spin text-primary' />
            </div>
          ) : !topic ? (
            <div className='flex h-64 items-center justify-center'>
              <p className='text-muted-foreground'>Không tìm thấy đề tài</p>
            </div>
          ) : (
            <div className='p-6'>
              <div className='grid grid-cols-1 gap-6 lg:grid-cols-12'>
                {/* Left Column - Form chính */}
                <div className='space-y-5 lg:col-span-8'>
                  {/* Tiêu đề */}
                  <div className='space-y-2'>
                    <Label>Tiêu đề đề tài</Label>
                    <Input
                      value={isEditing ? editData.title : topic.title}
                      onChange={(e) =>
                        setEditData((prev) => ({
                          ...prev,
                          title: e.target.value,
                        }))
                      }
                      disabled={!isEditing}
                      className={
                        !isEditing
                          ? 'disabled:cursor-default disabled:opacity-100'
                          : ''
                      }
                    />
                  </div>

                  {/* Mô tả */}
                  <div className='space-y-2'>
                    <Label>Mô tả chi tiết / Pitch</Label>
                    <BlockEditor
                      key={isEditing ? 'editing' : 'viewing'}
                      data={isEditing ? editData.outline : topic.outline}
                      onChange={(data) =>
                        setEditData((prev) => ({
                          ...prev,
                          outline: data,
                        }))
                      }
                      holderId='topic-modal-editor'
                      placeholder='Mô tả ý tưởng...'
                      minHeight={120}
                      readOnly={!isEditing}
                      showToolbar={isEditing}
                    />
                  </div>

                  {/* Tài liệu đính kèm */}
                  <div className='space-y-2'>
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
                            className='group flex items-center gap-3 rounded-lg border bg-card p-2.5 transition-colors hover:bg-muted/50'
                          >
                            <div
                              className={cn(
                                'flex h-8 w-8 items-center justify-center rounded-lg',
                                file.fileName.match(/\.(pdf)$/i)
                                  ? 'bg-red-100 text-red-600 dark:bg-red-950/50'
                                  : 'bg-blue-100 text-blue-600 dark:bg-blue-950/50'
                              )}
                            >
                              <FileText className='h-4 w-4' />
                            </div>
                            <div className='min-w-0 flex-1'>
                              <p className='truncate text-sm font-medium'>
                                {file.fileName}
                              </p>
                            </div>
                          </a>
                        ))}
                      </div>
                    ) : (
                      <div className='flex items-center justify-center gap-2 rounded-lg border-2 border-dashed bg-muted/30 py-4'>
                        <Paperclip className='h-4 w-4 text-muted-foreground' />
                        <p className='text-sm text-muted-foreground'>
                          Không có tài liệu
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Column - Sidebar */}
                <div className='space-y-4 lg:col-span-4'>
                  {/* Ngày bắt đầu */}
                  <div className='space-y-1.5'>
                    <Label className='text-xs'>Ngày bắt đầu</Label>
                    <DateTimePicker
                      value={
                        isEditing
                          ? editData.startDate
                          : topic.startDate
                            ? new Date(topic.startDate)
                            : undefined
                      }
                      onChange={(date) =>
                        setEditData((prev) => ({ ...prev, startDate: date }))
                      }
                      placeholder='Chọn ngày'
                      disabled={!isEditing}
                    />
                  </div>

                  {/* Ngày hoàn thành */}
                  <div className='space-y-1.5'>
                    <Label className='text-xs'>Ngày hoàn thành</Label>
                    <DateTimePicker
                      value={
                        isEditing
                          ? editData.endDate
                          : topic.deadline
                            ? new Date(topic.deadline)
                            : undefined
                      }
                      onChange={(date) =>
                        setEditData((prev) => ({ ...prev, endDate: date }))
                      }
                      placeholder='Chọn ngày'
                      disabled={!isEditing}
                    />
                  </div>

                  {/* Danh mục */}
                  <div className='space-y-1.5'>
                    <Label className='text-xs'>Danh mục</Label>
                    <Select
                      value={
                        isEditing ? editData.category : topic.category || ''
                      }
                      onValueChange={(value) =>
                        setEditData((prev) => ({ ...prev, category: value }))
                      }
                      disabled={!isEditing}
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
                  </div>

                  {/* Đăng ký với */}
                  <div className='space-y-1.5'>
                    <Label className='text-xs'>Đăng ký với</Label>
                    <RadioGroup
                      value={
                        isEditing ? editData.approver : topic.approver || ''
                      }
                      onValueChange={(value) =>
                        setEditData((prev) => ({ ...prev, approver: value }))
                      }
                      className='space-y-2'
                      disabled={!isEditing}
                    >
                      {APPROVER_OPTIONS.map((option) => (
                        <label
                          key={option.value}
                          htmlFor={`modal-${option.value}`}
                          className={cn(
                            'flex items-start gap-2 rounded-lg border p-2 transition-all',
                            isEditing
                              ? 'cursor-pointer hover:bg-muted/50'
                              : 'cursor-default',
                            (isEditing ? editData.approver : topic.approver) ===
                              option.value && 'border-primary bg-primary/5'
                          )}
                        >
                          <RadioGroupItem
                            value={option.value}
                            id={`modal-${option.value}`}
                            className='mt-0.5'
                            disabled={!isEditing}
                          />
                          <div className='flex-1'>
                            <p className='text-xs font-medium'>
                              {option.label}
                            </p>
                          </div>
                        </label>
                      ))}
                    </RadioGroup>
                  </div>

                  {/* Góp ý từ lãnh đạo */}
                  {topic.approvalHistory &&
                    topic.approvalHistory.length > 0 && (
                      <div className='space-y-2 border-t pt-3'>
                        <Label className='text-xs text-muted-foreground'>
                          Góp ý từ lãnh đạo
                        </Label>
                        <div className='space-y-2'>
                          {topic.approvalHistory
                            .filter(
                              (record) =>
                                (record.action === 'request_revision' ||
                                  record.action === 'reject') &&
                                record.comment
                            )
                            .map((record) => (
                              <div
                                key={record.id}
                                className='rounded-lg border bg-muted/30 p-3'
                              >
                                <div className='flex items-center justify-between text-xs'>
                                  <span
                                    className={cn(
                                      'font-medium',
                                      record.action === 'reject'
                                        ? 'text-red-600 dark:text-red-400'
                                        : 'text-amber-600 dark:text-amber-400'
                                    )}
                                  >
                                    {record.action === 'reject'
                                      ? 'Từ chối'
                                      : 'Yêu cầu chỉnh sửa'}
                                  </span>
                                  <span className='text-muted-foreground'>
                                    {record.createdAt &&
                                      format(
                                        new Date(record.createdAt),
                                        'dd/MM/yyyy HH:mm',
                                        { locale: vi }
                                      )}
                                  </span>
                                </div>
                                <p className='mt-2 text-sm'>{record.comment}</p>
                                <p className='mt-1 text-xs text-muted-foreground'>
                                  — {record.userName}
                                </p>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}
                </div>
              </div>
            </div>
          )}
        </ScrollArea>

        {/* Approval Action Bar */}
        {canApprove && topic && (
          <div className='border-t px-6 py-4'>
            <div className='flex flex-col items-center gap-3 sm:flex-row'>
              <Input
                placeholder='Nhập nhận xét...'
                value={approvalComment}
                onChange={(e) => setApprovalComment(e.target.value)}
                className='flex-1'
              />
              <div className='flex gap-2'>
                <Button
                  size='sm'
                  onClick={handleApprove}
                  disabled={approveTopic.isPending}
                  className='bg-emerald-600 hover:bg-emerald-700'
                >
                  {approveTopic.isPending ? (
                    <Loader2 className='mr-1 h-4 w-4 animate-spin' />
                  ) : (
                    <Check className='mr-1 h-4 w-4' />
                  )}
                  Duyệt
                </Button>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={handleRequestRevision}
                  disabled={requestRevision.isPending}
                  className='border-yellow-500/50 text-yellow-700'
                >
                  <RotateCcw className='mr-1 h-4 w-4' />
                  Sửa
                </Button>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={handleReject}
                  disabled={rejectTopic.isPending}
                  className='border-red-500/50 text-red-700'
                >
                  <X className='mr-1 h-4 w-4' />
                  Từ chối
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
