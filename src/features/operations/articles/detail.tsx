import React, { useState } from 'react'
import {
  LayoutGrid,
  PencilLine,
  FileText,
  FolderOpen,
  BarChart2,
  Image as ImageIcon,
  Settings,
  Bell,
  Search,
  ChevronRight,
  CloudUpload,
  Send,
  Eye,
  Trash2,
  Plus,
  Check,
  X,
  Play,
  Paperclip,
  Network,
  PlusCircle,
  Info,
  Quote,
  Undo2,
  Redo2,
  AlignLeft,
  AlignCenter,
  Bold,
  Italic,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
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
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'

export default function ArticleDetailPage() {
  const [articleType, setArticleType] = useState('print')
  const [tags, setTags] = useState(['Hà Nội', 'Quy hoạch'])
  const [mediaFilter, setMediaFilter] = useState('all')

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  return (
    <div className='-m-4 flex h-[calc(100vh-4rem)] flex-col bg-background text-foreground sm:-m-6 lg:-m-8'>
      {/* Sub Header / Toolbar */}
      <div className='z-10 flex h-12 shrink-0 items-center justify-between border-b border-border bg-background/95 px-6 backdrop-blur'>
        <div className='flex items-center gap-2 text-xs text-muted-foreground'>
          <span className='cursor-pointer hover:text-foreground'>
            Dashboard
          </span>
          <ChevronRight size={12} />
          <span className='font-medium text-foreground'>
            Soạn thảo bài viết
          </span>
          <Badge
            variant='outline'
            className='ml-3 border-primary/20 bg-primary/10 font-normal text-primary'
          >
            <CloudUpload size={10} className='mr-1' />
            Đã lưu 2 phút trước
          </Badge>
        </div>
        <div className='flex items-center gap-2'>
          <Button
            variant='ghost'
            size='sm'
            className='text-xs text-muted-foreground hover:text-foreground'
          >
            Lưu nháp
          </Button>
          <Button
            variant='outline'
            size='sm'
            className='border-border bg-card text-xs text-foreground hover:bg-accent hover:text-accent-foreground'
          >
            Xem trước
          </Button>
          <Button
            size='sm'
            className='border-0 bg-primary text-xs text-primary-foreground shadow-sm hover:bg-primary/90'
          >
            Nộp bài
            <Send size={12} className='ml-1.5' />
          </Button>
        </div>
      </div>

      {/* Scrollable Workspace */}
      <div className='flex-1 overflow-y-auto bg-background'>
        <main className='mx-auto max-w-[1400px] p-6'>
          <div className='grid grid-cols-12 gap-6'>
            {/* EDITOR COLUMN */}
            <div className='col-span-12 flex flex-col gap-6 lg:col-span-9'>
              {/* Main Writing Area */}
              <div className='min-h-[800px] w-full max-w-4xl'>
                <div className='mb-6'>
                  <Label className='mb-2 text-[10px] font-semibold tracking-wider text-muted-foreground uppercase'>
                    Nhập nội dung và thông tin tác nghiệp
                  </Label>
                  <h1 className='mb-1 text-3xl font-semibold tracking-tight text-foreground'>
                    Soạn thảo bài viết mới
                  </h1>
                </div>

                {/* Ghost Title & Sapo */}
                <div className='group relative mb-2'>
                  <Label className='mb-1 text-[10px] font-bold tracking-widest text-muted-foreground uppercase'>
                    Tiêu đề bài viết
                  </Label>
                  <Input
                    disabled
                    placeholder='Nhập tiêu đề bài viết tại đây...'
                    className='h-auto w-full border-none bg-transparent px-0 py-4 font-serif text-4xl font-bold tracking-tight text-foreground shadow-none placeholder:text-muted-foreground/50 focus-visible:ring-0'
                  />
                </div>

                <div className='group relative mb-8 border-b border-border pb-8'>
                  <Label className='mb-1 text-[10px] font-bold tracking-widest text-muted-foreground uppercase'>
                    Sapo / Tóm tắt
                  </Label>
                  <Textarea
                    disabled
                    rows={2}
                    placeholder='Nhập tóm tắt nội dung chính (Sapo)...'
                    className='w-full resize-none border-none bg-transparent px-0 text-lg text-foreground shadow-none placeholder:text-muted-foreground/50 focus-visible:ring-0'
                  />
                </div>

                {/* Editor Toolbar */}
                <div className='sticky top-0 z-20 mx-auto mb-6 flex w-fit items-center gap-1 rounded-lg border border-border bg-background/80 p-1 shadow-sm backdrop-blur-sm'>
                  <Button
                    variant='ghost'
                    size='icon'
                    className='h-7 w-7 text-muted-foreground hover:bg-accent hover:text-foreground'
                  >
                    <AlignLeft size={16} />
                  </Button>
                  <Button
                    variant='ghost'
                    size='icon'
                    className='h-7 w-7 text-muted-foreground hover:bg-accent hover:text-foreground'
                  >
                    <AlignCenter size={16} />
                  </Button>
                  <Separator
                    orientation='vertical'
                    className='mx-1 h-4 bg-border'
                  />
                  <Button
                    variant='ghost'
                    size='icon'
                    className='h-7 w-7 text-muted-foreground hover:bg-accent hover:text-foreground'
                  >
                    <Bold size={16} />
                  </Button>
                  <Button
                    variant='ghost'
                    size='icon'
                    className='h-7 w-7 text-muted-foreground hover:bg-accent hover:text-foreground'
                  >
                    <Italic size={16} />
                  </Button>
                  <Button
                    variant='ghost'
                    size='icon'
                    className='h-7 w-7 text-muted-foreground hover:bg-accent hover:text-foreground'
                  >
                    <Quote size={16} />
                  </Button>
                  <Button
                    variant='ghost'
                    size='icon'
                    className='h-7 w-7 text-muted-foreground hover:bg-accent hover:text-foreground'
                  >
                    <Info size={16} />
                  </Button>
                  <Button
                    variant='ghost'
                    size='icon'
                    className='h-7 w-7 text-muted-foreground hover:bg-accent hover:text-foreground'
                  >
                    <ImageIcon size={16} />
                  </Button>
                  <Separator
                    orientation='vertical'
                    className='mx-1 h-4 bg-border'
                  />
                  <Button
                    variant='ghost'
                    size='icon'
                    className='h-7 w-7 text-muted-foreground hover:bg-accent hover:text-foreground'
                  >
                    <Undo2 size={16} />
                  </Button>
                  <Button
                    variant='ghost'
                    size='icon'
                    className='h-7 w-7 text-muted-foreground hover:bg-accent hover:text-foreground'
                  >
                    <Redo2 size={16} />
                  </Button>
                </div>

                {/* Content Body */}
                <div className='space-y-6 text-foreground/90'>
                  <div>
                    <div className='mb-3 flex items-center gap-2'>
                      <span className='h-2 w-2 rounded-full bg-primary'></span>
                      <span className='text-xs font-bold tracking-widest text-primary uppercase'>
                        Chuyên đề du lịch
                      </span>
                    </div>
                    <h2 className='mb-4 font-serif text-4xl leading-tight font-bold text-foreground'>
                      Khai mạc Tuần lễ Văn hóa – Du lịch Mù Cang Chải 2024
                    </h2>
                    <div className='border-l-[3px] border-primary py-1 pl-4 text-lg text-primary/90 italic'>
                      Sự kiện thường niên thu hút hàng vạn du khách đến với rẻo
                      cao Tây Bắc vào mùa lúa chín vàng rực rỡ.
                    </div>
                  </div>

                  <p className='text-base leading-relaxed'>
                    Sáng ngày 25/5, tại huyện Mù Cang Chải đã diễn ra lễ khai
                    mạc Tuần lễ Văn hóa – Du lịch danh thắng quốc gia Ruộng bậc
                    thang...
                  </p>

                  {/* Image Block */}
                  <Card className='group my-8 overflow-hidden border-border bg-card shadow-sm'>
                    <div className='relative'>
                      <Badge className='absolute top-4 left-4 z-10 border border-white/10 bg-black/60 text-[10px] font-bold text-white uppercase backdrop-blur hover:bg-black/70'>
                        <ImageIcon size={10} className='mr-1' />
                        Ảnh tin
                      </Badge>
                      <div className='aspect-video w-full overflow-hidden bg-muted'>
                        <img
                          src='https://images.unsplash.com/photo-1565610222536-ef125c59da2e?q=80&w=2070'
                          className='h-full w-full object-cover transition-transform duration-700 group-hover:scale-105'
                          alt='News'
                        />
                      </div>
                    </div>
                    <CardContent className='p-3'>
                      <div className='flex items-start gap-3'>
                        <div className='flex-1'>
                          <span className='mr-2 text-xs font-bold text-foreground'>
                            Hình 1:{' '}
                          </span>
                          <Input
                            defaultValue='Ruộng bậc thang Mù Cang Chải vào mùa nước đổ...'
                            className='inline-block h-auto w-full border-none bg-transparent p-0 text-xs text-muted-foreground shadow-none focus-visible:ring-0'
                          />
                        </div>
                        <div className='flex gap-1 rounded border border-border bg-muted p-0.5'>
                          <Button
                            variant='ghost'
                            size='sm'
                            className='h-6 px-2 text-[10px] text-muted-foreground hover:text-foreground'
                          >
                            Small
                          </Button>
                          <Button
                            variant='ghost'
                            size='sm'
                            className='h-6 px-2 text-[10px] text-muted-foreground hover:text-foreground'
                          >
                            Medium
                          </Button>
                          <Button
                            size='sm'
                            className='h-6 border-0 bg-primary px-2 text-[10px] text-primary-foreground hover:bg-primary/90'
                          >
                            Full
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Add Content Button */}
                  <Button
                    variant='outline'
                    className='h-12 w-full border-dashed border-border bg-transparent text-muted-foreground hover:border-primary hover:bg-accent hover:text-primary'
                  >
                    <PlusCircle size={16} className='mr-2' />
                    Thêm khối nội dung mới
                  </Button>
                </div>
              </div>

              {/* Media Attachments Section */}
              <div className='mt-8 border-t border-border pt-6'>
                <div className='mb-4 flex items-center justify-between'>
                  <h3 className='flex items-center gap-2 text-xs font-bold text-foreground uppercase'>
                    <FolderOpen size={14} className='text-primary' />
                    Quản lý Multimedia
                  </h3>
                  <div className='flex items-center gap-2'>
                    <div className='flex rounded-md border border-border bg-muted p-0.5'>
                      <Button
                        size='sm'
                        variant={mediaFilter === 'all' ? 'default' : 'ghost'}
                        onClick={() => setMediaFilter('all')}
                        className={
                          mediaFilter === 'all'
                            ? 'h-7 bg-background px-3 text-[10px] shadow-sm hover:bg-background/80'
                            : 'h-7 px-3 text-[10px] text-muted-foreground hover:bg-transparent hover:text-foreground'
                        }
                      >
                        Tất cả
                      </Button>
                      <Button
                        size='sm'
                        variant={mediaFilter === 'image' ? 'default' : 'ghost'}
                        onClick={() => setMediaFilter('image')}
                        className={
                          mediaFilter === 'image'
                            ? 'h-7 bg-background px-3 text-[10px] shadow-sm hover:bg-background/80'
                            : 'h-7 px-3 text-[10px] text-muted-foreground hover:bg-transparent hover:text-foreground'
                        }
                      >
                        Ảnh
                      </Button>
                      <Button
                        size='sm'
                        variant={mediaFilter === 'video' ? 'default' : 'ghost'}
                        onClick={() => setMediaFilter('video')}
                        className={
                          mediaFilter === 'video'
                            ? 'h-7 bg-background px-3 text-[10px] shadow-sm hover:bg-background/80'
                            : 'h-7 px-3 text-[10px] text-muted-foreground hover:bg-transparent hover:text-foreground'
                        }
                      >
                        Video
                      </Button>
                    </div>
                    <Button
                      size='sm'
                      variant='outline'
                      className='h-7 border-border bg-background px-3 text-[10px] font-bold text-foreground hover:bg-accent'
                    >
                      <Plus size={12} className='mr-1.5' />
                      Tải lên
                    </Button>
                  </div>
                </div>

                <Card className='overflow-hidden border-border bg-card shadow-sm'>
                  {/* Upload Dropzone */}
                  <div className='group cursor-pointer border-b border-dashed border-border border-b-transparent bg-muted/30 px-4 py-3 transition-colors hover:bg-muted/50'>
                    <div className='flex items-center gap-3'>
                      <div className='flex h-8 w-8 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition-colors group-hover:border-primary/50 group-hover:text-primary'>
                        <CloudUpload size={16} />
                      </div>
                      <div className='flex-1'>
                        <div className='text-xs font-medium text-foreground group-hover:text-primary'>
                          Kéo thả file vào đây hoặc nhấn để chọn
                        </div>
                        <div className='text-[10px] text-muted-foreground'>
                          Hỗ trợ: .jpg, .png, .mp4 (Max 50MB)
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Media Grid */}
                  <CardContent className='p-4'>
                    <div className='grid grid-cols-4 gap-4'>
                      {/* Media Cards ... */}
                      <Card className='group cursor-pointer overflow-hidden border-border bg-card shadow-sm transition-all hover:border-primary/50'>
                        <div className='relative aspect-[4/3] overflow-hidden bg-muted'>
                          <img
                            src='https://images.unsplash.com/photo-1542281286-9e0a16bb7366?q=80&w=2070'
                            className='h-full w-full object-cover opacity-90 transition-transform duration-500 group-hover:scale-110 group-hover:opacity-100'
                            alt='Media'
                          />
                          <Badge className='absolute top-2 right-2 border-white/10 bg-black/60 text-[9px] text-white backdrop-blur'>
                            JPG
                          </Badge>
                          <div className='absolute top-2 left-2 flex h-4 w-4 items-center justify-center rounded border border-primary bg-primary'>
                            <Check
                              size={10}
                              className='text-primary-foreground'
                            />
                          </div>
                        </div>
                        <CardContent className='p-2'>
                          <div className='truncate text-[11px] font-medium text-foreground'>
                            IMG_5502_M.jpg
                          </div>
                        </CardContent>
                      </Card>

                      {/* Add More Card */}
                      <Card className='group cursor-pointer border-dashed border-border bg-card shadow-none hover:bg-accent/50'>
                        <CardContent className='flex h-full flex-col items-center justify-center p-4'>
                          <div className='mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors group-hover:bg-primary/10 group-hover:text-primary'>
                            <Plus size={16} />
                          </div>
                          <div className='text-[10px] font-medium text-muted-foreground group-hover:text-foreground'>
                            Thêm
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* RIGHT SETTINGS COLUMN */}
            <div className='col-span-12 border-l border-border pl-6 lg:col-span-3'>
              <div className='sticky top-0 space-y-8 pr-2'>
                {/* Classification Section */}
                <div>
                  <h3 className='mb-4 text-xs font-bold text-foreground uppercase'>
                    Phân loại
                  </h3>
                  <div className='space-y-4'>
                    <div className='space-y-3'>
                      <div className='flex items-center gap-2 text-xs font-medium text-primary'>
                        <Network size={14} />
                        Chọn loại tin bài
                      </div>
                      <RadioGroup
                        value={articleType}
                        onValueChange={setArticleType}
                      >
                        {['online', 'print', 'broadcast', 'digital'].map(
                          (type) => (
                            <div
                              key={type}
                              className='group flex items-center space-x-3'
                            >
                              <RadioGroupItem
                                value={type}
                                id={type}
                                className='border-muted-foreground text-primary data-[state=checked]:border-primary data-[state=checked]:text-primary'
                              />
                              <Label
                                htmlFor={type}
                                className='cursor-pointer text-xs font-normal text-muted-foreground capitalize group-hover:text-foreground'
                              >
                                {type}
                              </Label>
                            </div>
                          )
                        )}
                      </RadioGroup>
                    </div>

                    <Separator className='bg-border' />

                    <div>
                      <Label className='mb-2 block text-[10px] font-semibold text-muted-foreground uppercase'>
                        Chuyên mục chính
                      </Label>
                      <Select defaultValue='news'>
                        <SelectTrigger className='h-9 w-full border-border bg-card text-xs text-foreground focus:border-primary focus:ring-primary/50'>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className='border-border bg-card text-foreground'>
                          <SelectItem value='news'>Thời sự</SelectItem>
                          <SelectItem value='economy'>Kinh tế</SelectItem>
                          <SelectItem value='tourism'>Du lịch</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className='mb-2 block text-[10px] font-semibold text-muted-foreground uppercase'>
                        Tags (Từ khóa)
                      </Label>
                      <div className='flex min-h-[40px] flex-wrap gap-2 rounded-md border border-border bg-card p-2'>
                        {tags.map((tag, index) => (
                          <Badge
                            key={index}
                            variant='secondary'
                            className='h-6 gap-1 border-0 bg-muted p-0 pr-1 pl-2 text-[10px] font-normal text-primary hover:bg-muted/80'
                          >
                            {tag}
                            <button
                              onClick={() => removeTag(tag)}
                              className='ml-0.5 rounded-full p-0.5 hover:text-foreground'
                            >
                              <X size={10} />
                            </button>
                          </Badge>
                        ))}
                        <Input
                          placeholder='Nhập...'
                          className='h-6 min-w-[50px] flex-1 border-none bg-transparent p-0 text-xs text-foreground shadow-none placeholder:text-muted-foreground focus-visible:ring-0'
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Metadata Section */}
                <div>
                  <h3 className='mb-4 text-xs font-bold text-foreground uppercase'>
                    Thông tin tác nghiệp
                  </h3>
                  <div className='space-y-4'>
                    <div>
                      <Label className='mb-2 block text-[10px] font-semibold text-muted-foreground uppercase'>
                        Nguồn tin
                      </Label>
                      <Input
                        placeholder='VD: Phỏng vấn trực tiếp...'
                        className='h-9 w-full border-border bg-card text-xs text-foreground placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-primary/50'
                      />
                    </div>

                    <div>
                      <Label className='mb-2 block text-[10px] font-semibold text-muted-foreground uppercase'>
                        Ghi chú cho Biên tập viên
                      </Label>
                      <Textarea
                        rows={3}
                        placeholder='Ghi chú về bản quyền ảnh, lưu ý kiểm chứng...'
                        className='min-h-[80px] w-full resize-none border-border bg-card text-xs text-foreground placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-primary/50'
                      />
                    </div>

                    <div>
                      <Label className='mb-2 block text-[10px] font-semibold text-muted-foreground uppercase'>
                        File đính kèm (Tài liệu)
                      </Label>
                      <Button
                        variant='outline'
                        className='h-9 w-full justify-start gap-2 border-border bg-card text-xs text-muted-foreground hover:bg-accent hover:text-foreground'
                      >
                        <Paperclip size={14} />
                        Tải lên tài liệu (.doc, .pdf)
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
