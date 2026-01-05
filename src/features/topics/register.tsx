'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { useNavigate, Link } from '@tanstack/react-router'
import { vi } from 'date-fns/locale'
import { Paperclip, Send, Save, FileText, X, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { UploadDropzone } from '@/lib/uploadthing'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DateTimePicker } from '@/components/ui/datetime-picker'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RichTextEditor } from '@/components/ui/rich-text-editor'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useCreateTopic, useMyTopics } from './hooks/use-topics'

interface UploadedFile {
  name: string
  url: string
  size?: number
}

interface TopicFormData {
  title: string
  category: string
  outline: string
  deadline?: Date
  attachments: UploadedFile[]
}

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

const statusConfig = {
  pending: {
    label: 'Chờ duyệt',
    color: 'text-amber-600',
    dot: 'bg-amber-500',
    bg: 'bg-amber-50 dark:bg-amber-950/30',
  },
  approved: {
    label: 'Đã duyệt',
    color: 'text-emerald-600',
    dot: 'bg-emerald-500',
    bg: 'bg-emerald-50 dark:bg-emerald-950/30',
  },
  draft: {
    label: 'Bản nháp',
    color: 'text-slate-500',
    dot: 'bg-slate-400',
    bg: 'bg-slate-50 dark:bg-slate-800/50',
  },
  rejected: {
    label: 'Từ chối',
    color: 'text-rose-600',
    dot: 'bg-rose-500',
    bg: 'bg-rose-50 dark:bg-rose-950/30',
  },
  revision_required: {
    label: 'Cần sửa',
    color: 'text-yellow-600',
    dot: 'bg-yellow-500',
    bg: 'bg-yellow-50 dark:bg-yellow-950/30',
  },
}

export function TopicRegisterPage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('all')
  const [formData, setFormData] = useState<TopicFormData>({
    title: '',
    category: '',
    outline: '',
    deadline: undefined,
    attachments: [],
  })

  // API Hooks
  const createTopic = useCreateTopic()
  const { data: myTopicsResponse, isLoading: isLoadingMyTopics } = useMyTopics()
  const myTopics = myTopicsResponse?.topics || []

  const removeAttachment = (url: string) => {
    setFormData((prev) => ({
      ...prev,
      attachments: prev.attachments.filter((f) => f.url !== url),
    }))
  }

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return ''
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const handleSubmit = async (e: React.FormEvent, isDraft: boolean = false) => {
    e.preventDefault()

    if (!formData.title.trim()) {
      toast.error('Vui lòng nhập tiêu đề đề tài')
      return
    }

    try {
      const attachmentsData = formData.attachments.map((file, index) => ({
        id: `att_${index}_${Date.now()}`,
        fileName: file.name,
        fileUrl: file.url,
        fileType: file.name.split('.').pop() || 'unknown',
        fileSize: file.size || 0,
        uploadedAt: new Date().toISOString(),
      }))

      await createTopic.mutateAsync({
        title: formData.title,
        outline: formData.outline,
        contentType: 'broadcast', // Default value
        attachments: attachmentsData,
        deadline: formData.deadline?.toISOString(),
        isDraft,
      })

      toast.success(isDraft ? 'Đã lưu bản nháp' : 'Đã gửi đề tài để duyệt')
      navigate({ to: '/topics' })
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Có lỗi xảy ra')
    }
  }
  return (
    <div className='flex flex-col gap-4 sm:gap-6'>
      {/* Page Header - giống tasks */}
      <div className='flex flex-wrap items-end justify-between gap-2'>
        <div className='flex flex-col items-start'>
          <h2 className='text-3xl font-bold tracking-tight'>Đăng Ký Đề Tài</h2>
          <p className='text-muted-foreground'>
            Điền thông tin để pitch topic cho BTV phụ trách.
          </p>
        </div>
        <div className='flex gap-2'>
          <Button
            variant='outline'
            onClick={(e) => handleSubmit(e, true)}
            disabled={createTopic.isPending}
          >
            {createTopic.isPending ? (
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
            ) : (
              <Save className='mr-2 h-4 w-4' />
            )}
            <span>Lưu nháp</span>
          </Button>
          <Button
            onClick={(e) => handleSubmit(e, false)}
            disabled={createTopic.isPending}
          >
            {createTopic.isPending ? (
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
            ) : (
              <Send className='mr-2 h-4 w-4' />
            )}
            <span>Gửi duyệt</span>
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className='grid grid-cols-1 gap-6 lg:grid-cols-12'>
        {/* Left Column - Form */}
        <div className='space-y-6 lg:col-span-8'>
          {/* Thông tin chung */}
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <FileText className='h-5 w-5 text-primary' />
                Thông tin chung
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-5'>
              {/* Tiêu đề */}
              <div className='space-y-2'>
                <Label htmlFor='title'>
                  Tiêu đề đề tài <span className='text-destructive'>*</span>
                </Label>
                <Input
                  id='title'
                  placeholder='VD: Phóng sự về đời sống người dân vùng lũ...'
                  value={formData.title}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }))
                  }
                />
              </div>

              {/* Chuyên mục & Thời hạn - cùng 1 hàng */}
              <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                {/* Chuyên mục */}
                <div className='space-y-2'>
                  <Label>
                    Chuyên mục <span className='text-destructive'>*</span>
                  </Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, category: value }))
                    }
                  >
                    <SelectTrigger className='w-full'>
                      <SelectValue placeholder='Chọn chuyên mục...' />
                    </SelectTrigger>
                    <SelectContent className='min-w-[var(--radix-select-trigger-width)]'>
                      {CATEGORY_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Thời hạn dự kiến */}
                <div className='space-y-2'>
                  <Label>
                    Thời hạn dự kiến <span className='text-destructive'>*</span>
                  </Label>
                  <DateTimePicker
                    value={formData.deadline}
                    onChange={(date) =>
                      setFormData((prev) => ({ ...prev, deadline: date }))
                    }
                    placeholder='Chọn ngày giờ'
                    disablePastDates={true}
                  />
                </div>
              </div>

              <Separator />

              {/* Mô tả */}
              <div className='space-y-2'>
                <Label htmlFor='outline'>
                  Mô tả chi tiết / Pitch{' '}
                  <span className='text-destructive'>*</span>
                </Label>
                <RichTextEditor
                  content={formData.outline}
                  onChange={(content) =>
                    setFormData((prev) => ({
                      ...prev,
                      outline: content,
                    }))
                  }
                  placeholder='Mô tả ý tưởng, góc nhìn, thông điệp muốn truyền tải...'
                />
              </div>
            </CardContent>
          </Card>

          {/* Tài liệu đính kèm */}
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Paperclip className='h-5 w-5 text-primary' />
                Tài liệu đính kèm
              </CardTitle>
            </CardHeader>
            <CardContent>
              <UploadDropzone
                endpoint='topicAttachment'
                onClientUploadComplete={(res) => {
                  const newFiles = res.map((file) => ({
                    name: file.name,
                    url: file.ufsUrl,
                    size: file.size,
                  }))
                  setFormData((prev) => ({
                    ...prev,
                    attachments: [...prev.attachments, ...newFiles],
                  }))
                }}
                onUploadError={(error: Error) => {
                  alert(`Lỗi tải lên: ${error.message}`)
                }}
                config={{ mode: 'auto' }}
                appearance={{
                  container:
                    'border-2 border-dashed rounded-lg p-8 transition-all hover:border-primary/50 hover:bg-muted/50 cursor-pointer',
                  uploadIcon: 'text-muted-foreground h-10 w-10',
                  label: 'text-foreground font-medium',
                  allowedContent: 'text-muted-foreground text-sm',
                  button:
                    'bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md text-sm font-medium',
                }}
                content={{
                  label: 'Kéo thả hoặc nhấn để tải lên',
                  allowedContent:
                    'PDF, DOC, DOCX, JPG, PNG (Tối đa 8MB mỗi file)',
                }}
              />

              {/* Uploaded files */}
              {formData.attachments.length > 0 && (
                <div className='mt-4 space-y-2'>
                  {formData.attachments.map((file) => (
                    <div
                      key={file.url}
                      className='flex items-center justify-between rounded-lg border p-3'
                    >
                      <div className='flex items-center gap-3'>
                        <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-red-100 text-red-600 dark:bg-red-950/50'>
                          <FileText className='h-5 w-5' />
                        </div>
                        <div>
                          <p className='font-medium'>{file.name}</p>
                          <p className='text-sm text-muted-foreground'>
                            {formatFileSize(file.size)} • Hoàn thành
                          </p>
                        </div>
                      </div>
                      <Button
                        variant='ghost'
                        size='icon'
                        onClick={() => removeAttachment(file.url)}
                      >
                        <X className='h-4 w-4' />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - My Topics */}
        <div className='lg:col-span-4'>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between'>
              <CardTitle>Đề tài của tôi</CardTitle>
              <Link
                to='/topics'
                className='text-sm font-medium text-primary hover:underline'
              >
                Xem tất cả
              </Link>
            </CardHeader>

            {/* Tabs using shadcn */}
            <div className='px-6'>
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className='w-full'
              >
                <TabsList className='w-full'>
                  <TabsTrigger value='all' className='flex-1'>
                    Tất cả
                  </TabsTrigger>
                  <TabsTrigger value='pending' className='flex-1'>
                    Chờ duyệt
                  </TabsTrigger>
                  <TabsTrigger value='draft' className='flex-1'>
                    Nháp
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <Separator />

            {/* Topics List */}
            <CardContent className='max-h-[400px] space-y-2 overflow-y-auto pt-4'>
              {isLoadingMyTopics ? (
                <div className='flex items-center justify-center py-8'>
                  <Loader2 className='h-6 w-6 animate-spin text-muted-foreground' />
                </div>
              ) : myTopics.length === 0 ? (
                <div className='py-8 text-center text-sm text-muted-foreground'>
                  Bạn chưa có đề tài nào
                </div>
              ) : (
                myTopics.map((topic) => {
                  const status =
                    statusConfig[topic.status as keyof typeof statusConfig] ||
                    statusConfig.draft
                  const createdDate = new Date(topic.createdAt)
                  return (
                    <div
                      key={topic.id}
                      className='group cursor-pointer rounded-lg border p-3 transition-all hover:bg-muted/50'
                    >
                      <div className='mb-2 flex items-center justify-between'>
                        <Badge
                          variant='outline'
                          className={cn(
                            'border-0 px-2 py-0.5 text-xs font-semibold',
                            status.bg,
                            status.color
                          )}
                        >
                          {status.label}
                        </Badge>
                        <span className='text-xs text-muted-foreground'>
                          {format(createdDate, 'dd/MM', { locale: vi })}
                        </span>
                      </div>
                      <h4 className='mb-2 line-clamp-2 leading-snug font-medium transition-colors group-hover:text-primary'>
                        {topic.title}
                      </h4>
                      <div className='flex items-center gap-2'>
                        <Badge variant='secondary' className='text-xs'>
                          {topic.contentType === 'broadcast'
                            ? 'Phát sóng'
                            : topic.contentType}
                        </Badge>
                      </div>
                    </div>
                  )
                })
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default TopicRegisterPage
