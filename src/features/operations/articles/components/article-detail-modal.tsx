'use client'

import { useState } from 'react'
import { format } from 'date-fns'
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
  Users,
  Calendar,
  Building2,
  Clock,
  Link as LinkIcon,
  Video,
  FileEdit,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import {
  type Article,
  ARTICLE_STATUS_CONFIG,
  ARTICLE_TYPE_CONFIG,
} from '../types'

interface ArticleDetailModalProps {
  article: Article | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

// Workflow steps for different article types
const WORKFLOW_STEPS = {
  ptth: [
    { key: 'tac_nghiep', label: 'Tác nghiệp' },
    { key: 'cho_duyet_cap_1', label: 'Duyệt cấp 1' },
    { key: 'cho_duyet_cap_2', label: 'Duyệt cấp 2' },
    { key: 'hau_ky', label: 'Hậu kỳ' },
    { key: 'cho_duyet_hau_ky', label: 'Duyệt thành phẩm' },
    { key: 'da_xuat_ban', label: 'Phát sóng' },
  ],
  bao_in: [
    { key: 'tac_nghiep', label: 'Tác nghiệp' },
    { key: 'cho_duyet_cap_1', label: 'Duyệt cấp 1' },
    { key: 'cho_duyet_cap_2', label: 'Duyệt cấp 2' },
    { key: 'hau_ky', label: 'Dàn trang' },
    { key: 'cho_duyet_hau_ky', label: 'Duyệt dàn trang' },
    { key: 'da_xuat_ban', label: 'In ấn' },
  ],
  bao_dien_tu: [
    { key: 'tac_nghiep', label: 'Tác nghiệp' },
    { key: 'cho_duyet_cap_1', label: 'Duyệt cấp 1' },
    { key: 'cho_duyet_cap_2', label: 'Duyệt cấp 2' },
    { key: 'da_xuat_ban', label: 'Xuất bản' },
  ],
  noi_dung_so: [
    { key: 'tac_nghiep', label: 'Tác nghiệp' },
    { key: 'cho_duyet_cap_1', label: 'Duyệt cấp 1' },
    { key: 'cho_duyet_cap_2', label: 'Duyệt cấp 2' },
    { key: 'da_xuat_ban', label: 'Đăng tải' },
  ],
}

export function ArticleDetailModal({
  article,
  open,
  onOpenChange,
}: ArticleDetailModalProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [approvalComment, setApprovalComment] = useState('')

  if (!article) return null

  const statusConfig = ARTICLE_STATUS_CONFIG[article.status]
  const typeConfig = ARTICLE_TYPE_CONFIG[article.articleType]
  const workflowSteps = WORKFLOW_STEPS[article.articleType]

  // Calculate workflow progress
  const currentStepIndex = workflowSteps.findIndex(
    (step) => step.key === article.status
  )
  const progressPercent =
    article.status === 'da_xuat_ban'
      ? 100
      : article.status === 'tu_choi'
        ? 0
        : ((currentStepIndex + 1) / workflowSteps.length) * 100

  // Check deadline status
  const now = new Date()
  const isOverdue = article.deadline < now && article.status !== 'da_xuat_ban'
  const daysUntilDeadline = Math.ceil(
    (article.deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-h-[90vh] !max-w-5xl gap-0 p-0'>
        <DialogHeader className='border-b px-6 py-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-3'>
              <DialogTitle className='text-xl font-semibold'>
                Chi tiết tin bài
              </DialogTitle>
              <Badge
                variant='outline'
                className={cn(
                  'px-2 py-0.5 text-xs',
                  statusConfig.color,
                  statusConfig.bgColor
                )}
              >
                {statusConfig.label}
              </Badge>
              <Badge
                variant='outline'
                className={cn(
                  'px-2 py-0.5 text-xs',
                  typeConfig.color,
                  typeConfig.bgColor
                )}
              >
                {typeConfig.label}
              </Badge>
            </div>
            <div className='flex gap-2 pr-4'>
              {!isEditing && article.status !== 'da_xuat_ban' && (
                <>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit className='mr-2 h-4 w-4' />
                    Chỉnh sửa
                  </Button>
                  <Button size='sm'>
                    <Send className='mr-2 h-4 w-4' />
                    Gửi duyệt
                  </Button>
                </>
              )}
              {isEditing && (
                <>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => setIsEditing(false)}
                  >
                    Hủy
                  </Button>
                  <Button size='sm'>
                    <Save className='mr-2 h-4 w-4' />
                    Lưu
                  </Button>
                </>
              )}
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className='max-h-[calc(90vh-180px)]'>
          <div className='p-6'>
            <div className='grid grid-cols-1 gap-6 lg:grid-cols-12'>
              {/* Left Column - Main Content */}
              <div className='space-y-5 lg:col-span-8'>
                {/* Article Code & Title */}
                <div className='space-y-3'>
                  <div className='flex items-center gap-2'>
                    <span className='text-sm font-medium text-primary'>
                      {article.code}
                    </span>
                    <span className='text-muted-foreground'>•</span>
                    <span className='text-sm text-muted-foreground'>
                      Đề tài: {article.topicTitle}
                    </span>
                  </div>
                  <div className='space-y-2'>
                    <Label>Tiêu đề</Label>
                    <Input
                      value={article.title}
                      disabled={!isEditing}
                      className={
                        !isEditing
                          ? 'disabled:cursor-default disabled:opacity-100'
                          : ''
                      }
                    />
                  </div>
                </div>

                {/* Description */}
                <div className='space-y-2'>
                  <Label>Mô tả nội dung</Label>
                  <Textarea
                    value={article.description}
                    disabled={!isEditing}
                    rows={3}
                    className={
                      !isEditing
                        ? 'disabled:cursor-default disabled:opacity-100'
                        : ''
                    }
                  />
                </div>

                {/* Content / Script based on article type */}
                {article.articleType === 'ptth' && article.scriptContent && (
                  <div className='space-y-2'>
                    <Label className='flex items-center gap-2'>
                      <FileEdit className='h-4 w-4' />
                      Kịch bản
                    </Label>
                    <Textarea
                      value={article.scriptContent}
                      disabled={!isEditing}
                      rows={6}
                      className={
                        !isEditing
                          ? 'font-mono text-sm disabled:cursor-default disabled:opacity-100'
                          : 'font-mono text-sm'
                      }
                    />
                  </div>
                )}

                {article.content && (
                  <div className='space-y-2'>
                    <Label className='flex items-center gap-2'>
                      <FileText className='h-4 w-4' />
                      Nội dung bài viết
                    </Label>
                    <Textarea
                      value={article.content}
                      disabled={!isEditing}
                      rows={8}
                      className={
                        !isEditing
                          ? 'disabled:cursor-default disabled:opacity-100'
                          : ''
                      }
                    />
                  </div>
                )}

                {/* Post-production file */}
                {article.postProductionFile && (
                  <div className='space-y-2'>
                    <Label className='flex items-center gap-2'>
                      <Video className='h-4 w-4' />
                      File thành phẩm
                    </Label>
                    <div className='rounded-lg border bg-muted/30 p-4'>
                      <a
                        href={article.postProductionFile}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='flex items-center gap-3 text-primary hover:underline'
                      >
                        <Video className='h-5 w-5' />
                        <span>Xem file thành phẩm</span>
                      </a>
                    </div>
                  </div>
                )}

                {/* Published URL */}
                {article.publishUrl && (
                  <div className='space-y-2'>
                    <Label className='flex items-center gap-2'>
                      <LinkIcon className='h-4 w-4' />
                      Link xuất bản
                    </Label>
                    <a
                      href={article.publishUrl}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='flex items-center gap-2 text-primary hover:underline'
                    >
                      {article.publishUrl}
                    </a>
                  </div>
                )}

                {/* Workflow Progress */}
                <div className='space-y-3'>
                  <Label>Tiến độ thực hiện</Label>
                  <div className='rounded-lg border p-4'>
                    <div className='mb-3 flex items-center justify-between'>
                      <span className='text-sm font-medium'>
                        {article.status === 'tu_choi'
                          ? 'Bị từ chối'
                          : statusConfig.label}
                      </span>
                      <span className='text-sm text-muted-foreground'>
                        {Math.round(progressPercent)}%
                      </span>
                    </div>
                    <Progress value={progressPercent} className='h-2' />
                    <div className='mt-4 flex justify-between'>
                      {workflowSteps.map((step, index) => {
                        const isCompleted =
                          index < currentStepIndex ||
                          article.status === 'da_xuat_ban'
                        const isCurrent = step.key === article.status
                        return (
                          <div
                            key={step.key}
                            className={cn(
                              'flex flex-col items-center gap-1',
                              index === 0 && 'items-start',
                              index === workflowSteps.length - 1 && 'items-end'
                            )}
                          >
                            <div
                              className={cn(
                                'h-3 w-3 rounded-full',
                                isCompleted && 'bg-green-500',
                                isCurrent &&
                                  !isCompleted &&
                                  'bg-primary ring-2 ring-primary/30',
                                !isCompleted &&
                                  !isCurrent &&
                                  'bg-muted-foreground/30'
                              )}
                            />
                            <span
                              className={cn(
                                'text-xs',
                                isCurrent
                                  ? 'font-medium text-primary'
                                  : 'text-muted-foreground'
                              )}
                            >
                              {step.label}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Sidebar */}
              <div className='space-y-4 lg:col-span-4'>
                {/* Deadline */}
                <div className='rounded-lg border p-4'>
                  <div className='flex items-center gap-2 text-sm font-medium'>
                    <Calendar className='h-4 w-4' />
                    <span>Deadline</span>
                  </div>
                  <div className='mt-2'>
                    <p
                      className={cn(
                        'text-lg font-semibold',
                        isOverdue && 'text-red-500'
                      )}
                    >
                      {format(article.deadline, 'dd/MM/yyyy', { locale: vi })}
                    </p>
                    {article.status !== 'da_xuat_ban' && (
                      <p
                        className={cn(
                          'text-sm',
                          isOverdue
                            ? 'text-red-500'
                            : daysUntilDeadline <= 3
                              ? 'text-yellow-500'
                              : 'text-muted-foreground'
                        )}
                      >
                        {isOverdue
                          ? `Quá hạn ${Math.abs(daysUntilDeadline)} ngày`
                          : `Còn ${daysUntilDeadline} ngày`}
                      </p>
                    )}
                  </div>
                </div>

                {/* Department */}
                <div className='rounded-lg border p-4'>
                  <div className='flex items-center gap-2 text-sm font-medium'>
                    <Building2 className='h-4 w-4' />
                    <span>Phòng ban</span>
                  </div>
                  <p className='mt-2 text-sm'>{article.departmentName}</p>
                </div>

                {/* Assigned Members */}
                <div className='rounded-lg border p-4'>
                  <div className='flex items-center gap-2 text-sm font-medium'>
                    <Users className='h-4 w-4' />
                    <span>
                      Người thực hiện ({article.assignedMembers.length})
                    </span>
                  </div>
                  <div className='mt-3 space-y-2'>
                    {article.assignedMembers.length === 0 ? (
                      <p className='text-sm text-muted-foreground'>
                        Chưa phân công
                      </p>
                    ) : (
                      article.assignedMembers.map((member) => (
                        <div
                          key={member.userId}
                          className='flex items-center gap-2'
                        >
                          <Avatar className='h-8 w-8'>
                            <AvatarImage src={member.avatar} />
                            <AvatarFallback className='bg-primary/10 text-xs'>
                              {member.userName.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className='text-sm font-medium'>
                              {member.userName}
                            </p>
                            <p className='text-xs text-muted-foreground capitalize'>
                              {member.position}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Timestamps */}
                <div className='rounded-lg border p-4'>
                  <div className='flex items-center gap-2 text-sm font-medium'>
                    <Clock className='h-4 w-4' />
                    <span>Thời gian</span>
                  </div>
                  <div className='mt-3 space-y-2 text-sm'>
                    <div className='flex justify-between'>
                      <span className='text-muted-foreground'>Tạo lúc:</span>
                      <span>
                        {format(article.createdAt, 'dd/MM/yyyy HH:mm', {
                          locale: vi,
                        })}
                      </span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='text-muted-foreground'>Cập nhật:</span>
                      <span>
                        {format(article.updatedAt, 'dd/MM/yyyy HH:mm', {
                          locale: vi,
                        })}
                      </span>
                    </div>
                    {article.publishedAt && (
                      <div className='flex justify-between'>
                        <span className='text-muted-foreground'>Xuất bản:</span>
                        <span>
                          {format(article.publishedAt, 'dd/MM/yyyy HH:mm', {
                            locale: vi,
                          })}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Approval History */}
                {(article.approvalLevel1 || article.approvalLevel2) && (
                  <div className='rounded-lg border p-4'>
                    <div className='text-sm font-medium'>Lịch sử duyệt</div>
                    <div className='mt-3 space-y-3'>
                      {article.approvalLevel1 && (
                        <div className='rounded-lg bg-green-500/10 p-3'>
                          <div className='flex items-center gap-1 text-xs font-medium text-green-600'>
                            <Check className='h-3 w-3' />
                            Duyệt cấp 1
                          </div>
                          <p className='mt-1 text-sm'>
                            {article.approvalLevel1.approvedBy}
                          </p>
                          <p className='text-xs text-muted-foreground'>
                            {format(
                              article.approvalLevel1.approvedAt,
                              'dd/MM/yyyy HH:mm',
                              { locale: vi }
                            )}
                          </p>
                          {article.approvalLevel1.comment && (
                            <p className='mt-2 text-sm italic'>
                              "{article.approvalLevel1.comment}"
                            </p>
                          )}
                        </div>
                      )}
                      {article.approvalLevel2 && (
                        <div className='rounded-lg bg-green-500/10 p-3'>
                          <div className='flex items-center gap-1 text-xs font-medium text-green-600'>
                            <Check className='h-3 w-3' />
                            Duyệt cấp 2
                          </div>
                          <p className='mt-1 text-sm'>
                            {article.approvalLevel2.approvedBy}
                          </p>
                          <p className='text-xs text-muted-foreground'>
                            {format(
                              article.approvalLevel2.approvedAt,
                              'dd/MM/yyyy HH:mm',
                              { locale: vi }
                            )}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </ScrollArea>

        {/* Approval Action Bar - Show for pending approval statuses */}
        {(article.status === 'cho_duyet_cap_1' ||
          article.status === 'cho_duyet_cap_2' ||
          article.status === 'cho_duyet_hau_ky') && (
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
                  className='bg-emerald-600 hover:bg-emerald-700'
                >
                  <Check className='mr-1 h-4 w-4' />
                  Duyệt
                </Button>
                <Button
                  variant='outline'
                  size='sm'
                  className='border-yellow-500/50 text-yellow-700 hover:bg-yellow-50'
                >
                  <RotateCcw className='mr-1 h-4 w-4' />
                  Yêu cầu sửa
                </Button>
                <Button
                  variant='outline'
                  size='sm'
                  className='border-red-500/50 text-red-700 hover:bg-red-50'
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
