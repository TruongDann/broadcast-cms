'use client'

import { useState, useRef } from 'react'
import { useNavigate } from '@tanstack/react-router'
import type { OutputData } from '@editorjs/editorjs'
import { Paperclip, Send, Save, FileText, X, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { BlockEditor } from '@/components/ui/block-editor'
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
import { useCreateTopic } from './hooks/use-topics'

interface UploadedFile {
  name: string
  url: string
  size?: number
}

interface TopicFormData {
  title: string
  category: string
  outline: OutputData | string
  startDate?: Date
  endDate?: Date
  approver: string
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

export function TopicRegisterPage() {
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [formData, setFormData] = useState<TopicFormData>({
    title: '',
    category: '',
    outline: '',
    startDate: undefined,
    endDate: undefined,
    approver: '',
    attachments: [],
  })

  // API Hooks
  const createTopic = useCreateTopic()

  const removeAttachment = (url: string) => {
    setFormData((prev) => ({
      ...prev,
      attachments: prev.attachments.filter((f) => f.url !== url),
    }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    const newFiles = Array.from(files).map((file) => ({
      name: file.name,
      url: URL.createObjectURL(file),
      size: file.size,
      file,
    }))

    setFormData((prev) => ({
      ...prev,
      attachments: [...prev.attachments, ...newFiles],
    }))

    e.target.value = ''
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

      // Lưu dữ liệu dạng JSON string của Editor.js
      const outlineValue =
        typeof formData.outline === 'string'
          ? formData.outline
          : JSON.stringify(formData.outline)

      await createTopic.mutateAsync({
        title: formData.title,
        outline: outlineValue,
        contentType: 'broadcast',
        category: formData.category || undefined,
        attachments: attachmentsData,
        startDate: formData.startDate?.toISOString(),
        deadline: formData.endDate?.toISOString(),
        approver:
          (formData.approver as 'bbt' | 'truong_pho_phong') || undefined,
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
      {/* Page Header */}
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

      {/* Main Content - 2 columns */}
      <div className='grid grid-cols-1 gap-6 lg:grid-cols-12'>
        {/* Left Column - Form chính */}
        <div className='space-y-6 lg:col-span-8'>
          <Card>
            <CardContent className='space-y-5 pt-6'>
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

              {/* Mô tả */}
              <div className='space-y-2'>
                <Label htmlFor='outline'>
                  Mô tả chi tiết / Pitch{' '}
                  <span className='text-destructive'>*</span>
                </Label>
                <BlockEditor
                  data={formData.outline}
                  onChange={(data) =>
                    setFormData((prev) => ({
                      ...prev,
                      outline: data,
                    }))
                  }
                  holderId='topic-register-editor'
                  placeholder='Mô tả ý tưởng, góc nhìn, thông điệp muốn truyền tải...'
                  minHeight={150}
                />
              </div>

              {/* Tài liệu đính kèm */}
              <div className='space-y-3'>
                <Label>Tài liệu đính kèm</Label>
                <div
                  className='group relative flex cursor-pointer items-center justify-center gap-3 rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/30 px-4 py-4 transition-all hover:border-primary/50 hover:bg-primary/5'
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className='flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary transition-transform group-hover:scale-110'>
                    <Paperclip className='h-5 w-5' />
                  </div>
                  <div className='text-center'>
                    <p className='text-sm font-medium'>
                      Nhấn để chọn file hoặc kéo thả vào đây
                    </p>
                    <p className='text-xs text-muted-foreground'>
                      PDF, DOC, DOCX, JPG, PNG • Tối đa 8MB mỗi file
                    </p>
                  </div>
                  <input
                    ref={fileInputRef}
                    type='file'
                    multiple
                    accept='.pdf,.doc,.docx,.jpg,.jpeg,.png'
                    className='hidden'
                    onChange={handleFileChange}
                  />
                </div>

                {formData.attachments.length > 0 && (
                  <div className='space-y-2'>
                    {formData.attachments.map((file) => (
                      <div
                        key={file.url}
                        className='group flex items-center gap-3 rounded-lg border bg-card p-3 transition-colors hover:bg-muted/50'
                      >
                        <div
                          className={cn(
                            'flex h-9 w-9 items-center justify-center rounded-lg',
                            file.name.match(/\.(pdf)$/i)
                              ? 'bg-red-100 text-red-600 dark:bg-red-950/50'
                              : file.name.match(/\.(doc|docx)$/i)
                                ? 'bg-blue-100 text-blue-600 dark:bg-blue-950/50'
                                : 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950/50'
                          )}
                        >
                          <FileText className='h-4 w-4' />
                        </div>
                        <div className='min-w-0 flex-1'>
                          <p className='truncate text-sm font-medium'>
                            {file.name}
                          </p>
                          <p className='text-xs text-muted-foreground'>
                            {file.size
                              ? `${(file.size / 1024).toFixed(1)} KB`
                              : 'Đã chọn'}
                          </p>
                        </div>
                        <Button
                          type='button'
                          variant='ghost'
                          size='icon'
                          className='h-7 w-7 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive'
                          onClick={() => removeAttachment(file.url)}
                        >
                          <X className='h-4 w-4' />
                        </Button>
                      </div>
                    ))}
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
                <DateTimePicker
                  value={formData.startDate}
                  onChange={(date) =>
                    setFormData((prev) => ({ ...prev, startDate: date }))
                  }
                  placeholder='Chọn ngày'
                />
              </div>

              {/* Ngày hoàn thành */}
              <div className='space-y-2'>
                <Label>
                  Ngày hoàn thành <span className='text-destructive'>*</span>
                </Label>
                <DateTimePicker
                  value={formData.endDate}
                  onChange={(date) =>
                    setFormData((prev) => ({ ...prev, endDate: date }))
                  }
                  placeholder='Chọn ngày'
                  disablePastDates={true}
                />
              </div>

              {/* Danh mục */}
              <div className='space-y-2'>
                <Label>
                  Danh mục <span className='text-destructive'>*</span>
                </Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, category: value }))
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
              </div>

              {/* Đăng ký với */}
              <div className='space-y-3'>
                <Label>
                  Đăng ký với <span className='text-destructive'>*</span>
                </Label>
                <RadioGroup
                  value={formData.approver}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, approver: value }))
                  }
                  className='space-y-2'
                >
                  {APPROVER_OPTIONS.map((option) => (
                    <label
                      key={option.value}
                      htmlFor={option.value}
                      className={cn(
                        'flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-all hover:bg-muted/50',
                        formData.approver === option.value &&
                          'border-primary bg-primary/5'
                      )}
                    >
                      <RadioGroupItem
                        value={option.value}
                        id={option.value}
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
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default TopicRegisterPage
