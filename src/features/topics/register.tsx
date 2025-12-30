'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { useNavigate, Link } from '@tanstack/react-router'
import { vi } from 'date-fns/locale'
import {
  CalendarIcon,
  Users,
  Paperclip,
  Send,
  Save,
  FileText,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { UploadDropzone } from '@/lib/uploadthing'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { RichTextEditor } from '@/components/ui/rich-text-editor'
import { MultiSelect } from '@/components/ui/multi-select'
import { CONTENT_TYPE_CONFIG, type ContentType } from './types'

interface UploadedFile {
  name: string
  url: string
  size?: number
}

interface TopicFormData {
  title: string
  source: string
  contentType: ContentType
  outline: string
  teamMembers: string[]
  estimatedDays: number
  deadline?: Date
  attachments: UploadedFile[]
}

// Mock team members data
const mockTeamMembers = [
  { id: '1', name: 'Nguyễn Văn A', role: 'Phóng viên' },
  { id: '2', name: 'Trần Thị B', role: 'Biên tập viên' },
  { id: '3', name: 'Lê Văn C', role: 'Quay phim' },
  { id: '4', name: 'Phạm Thị D', role: 'Kỹ thuật viên' },
  { id: '5', name: 'Hoàng Văn E', role: 'Đạo diễn' },
]

// Mock my topics data
const myTopicsData = [
  {
    id: '1',
    title: 'Phóng sự: Thực trạng ô nhiễm kênh rạch tại Ninh Kiều',
    category: 'Thời sự',
    status: 'pending',
    date: '25/10',
    time: '10:45 AM',
  },
  {
    id: '2',
    title: 'Phỏng vấn độc quyền: Giám đốc sở Y Tế về vắc xin mới',
    category: 'Y Tế',
    status: 'approved',
    date: '22/10',
    time: 'Hôm qua',
  },
  {
    id: '3',
    title: 'Dự thảo quy hoạch giao thông công cộng 2025',
    category: 'Giao thông',
    status: 'draft',
    date: '20/10',
    time: '20/10',
  },
  {
    id: '4',
    title: 'Lễ hội trái cây Nam Bộ lần thứ 15 - Tin vắn',
    category: 'Văn hóa',
    status: 'rejected',
    date: '18/10',
    time: '18/10',
  },
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
}

export function TopicRegisterPage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('all')
  const [formData, setFormData] = useState<TopicFormData>({
    title: '',
    source: '',
    contentType: 'broadcast',
    outline: '',
    teamMembers: [],
    estimatedDays: 1,
    deadline: undefined,
    attachments: [],
  })

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

  const handleSubmit = (e: React.FormEvent, _isDraft: boolean = false) => {
    e.preventDefault()
    navigate({ to: '/topics' })
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
          <Button variant='outline' onClick={(e) => handleSubmit(e, true)}>
            <Save className='mr-2 h-4 w-4' />
            <span>Lưu nháp</span>
          </Button>
          <Button onClick={(e) => handleSubmit(e, false)}>
            <Send className='mr-2 h-4 w-4' />
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

              <Separator />

              {/* Loại nội dung & Deadline */}
              <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                <div className='space-y-2'>
                  <Label>
                    Loại nội dung <span className='text-destructive'>*</span>
                  </Label>
                  <Select
                    value={formData.contentType}
                    onValueChange={(value: ContentType) =>
                      setFormData((prev) => ({ ...prev, contentType: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder='Chọn loại nội dung...' />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(CONTENT_TYPE_CONFIG).map(
                        ([key, config]) => (
                          <SelectItem key={key} value={key}>
                            {config.label}
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div className='space-y-2'>
                  <Label>
                    Thời hạn dự kiến <span className='text-destructive'>*</span>
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant='outline'
                        className={cn(
                          'w-full justify-start text-left font-normal',
                          !formData.deadline && 'text-muted-foreground'
                        )}
                      >
                        <CalendarIcon className='mr-2 h-4 w-4' />
                        {formData.deadline
                          ? format(formData.deadline, 'dd/MM/yyyy', {
                              locale: vi,
                            })
                          : 'Chọn ngày'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className='w-auto p-0' align='start'>
                      <Calendar
                        mode='single'
                        selected={formData.deadline}
                        onSelect={(date) =>
                          setFormData((prev) => ({ ...prev, deadline: date }))
                        }
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
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

              <Separator />

              {/* Ekip */}
              <div className='space-y-2'>
                <Label className='flex items-center gap-2'>
                  <Users className='h-4 w-4' />
                  Ekip thực hiện
                </Label>
                <MultiSelect
                  options={mockTeamMembers.map((member) => ({
                    label: `${member.name} - ${member.role}`,
                    value: member.id,
                  }))}
                  defaultValue={formData.teamMembers}
                  onValueChange={(values) =>
                    setFormData((prev) => ({
                      ...prev,
                      teamMembers: values,
                    }))
                  }
                  placeholder='Chọn thành viên ekip...'
                  maxCount={3}
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
                  allowedContent: 'PDF, DOC, DOCX, JPG, PNG (Tối đa 8MB mỗi file)',
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
            <div className='px-6 pb-4'>
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
              {myTopicsData.map((topic) => {
                const status =
                  statusConfig[topic.status as keyof typeof statusConfig]
                return (
                  <div
                    key={topic.id}
                    className='group cursor-pointer rounded-lg border p-3 transition-all hover:bg-muted/50'
                  >
                    <div className='mb-2 flex items-center justify-between'>
                      <Badge
                        variant='outline'
                        className={cn(
                          'gap-1 border-0 px-2 py-0.5 text-xs font-semibold',
                          status.bg,
                          status.color
                        )}
                      >
                        <span
                          className={cn('h-1.5 w-1.5 rounded-full', status.dot)}
                        />
                        {status.label}
                      </Badge>
                      <span className='text-xs text-muted-foreground'>
                        {topic.time}
                      </span>
                    </div>
                    <h4 className='mb-2 line-clamp-2 leading-snug font-medium transition-colors group-hover:text-primary'>
                      {topic.title}
                    </h4>
                    <div className='flex items-center gap-2'>
                      <Badge variant='secondary' className='text-xs'>
                        {topic.category}
                      </Badge>
                      <span className='text-xs text-muted-foreground'>
                        {topic.date}
                      </span>
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default TopicRegisterPage
