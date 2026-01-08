import { useState, useMemo } from 'react'
import { useNavigate } from '@tanstack/react-router'
import {
  Plus,
  TrendingUp,
  TrendingDown,
  Settings2,
  FileDown,
  AlertTriangle,
} from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ArticleTable } from './components/article-table'
import {
  mockArticles,
  getArticleStats,
  getArticlesByType,
} from './data/mock-data'
import { type Article, type ArticleType } from './types'

// Stat card component - matching Topics page style
interface StatCardProps {
  title: string
  value: number | string
  subtitle: string
  trend?: {
    value: number
    isPositive: boolean
  }
  trendText?: string
}

function StatCard({ title, value, subtitle, trend, trendText }: StatCardProps) {
  return (
    <Card className='border-border bg-card'>
      <CardContent>
        {/* Header: Title + Badge */}
        <div className='flex items-center justify-between'>
          <span className='text-sm text-muted-foreground'>{title}</span>
          {trend && (
            <Badge
              variant='outline'
              className='gap-1 border-muted-foreground/30 bg-transparent px-2 py-0.5'
            >
              {trend.isPositive ? (
                <TrendingUp className='h-3 w-3 text-muted-foreground' />
              ) : (
                <TrendingDown className='h-3 w-3 text-muted-foreground' />
              )}
              <span
                className={trend.isPositive ? 'text-green-500' : 'text-red-500'}
              >
                {trend.isPositive ? '+' : ''}
                {trend.value}%
              </span>
            </Badge>
          )}
        </div>

        {/* Value */}
        <div className='mt-2 text-3xl font-bold tracking-tight'>{value}</div>

        {/* Trend Text with Arrow */}
        {trendText && (
          <div className='mt-3 flex items-center gap-1.5 text-sm'>
            <span>{trendText}</span>
            {trend?.isPositive ? (
              <TrendingUp className='h-4 w-4' />
            ) : (
              <TrendingDown className='h-4 w-4' />
            )}
          </div>
        )}

        {/* Subtitle */}
        <div className='mt-1 text-xs text-muted-foreground'>{subtitle}</div>
      </CardContent>
    </Card>
  )
}

export function ArticlesPage() {
  const [selectedTab, setSelectedTab] = useState<string>('all')

  // Get statistics
  const stats = getArticleStats()

  // Get articles by tab filter (by article type)
  const getArticlesByTab = (tab: string): Article[] => {
    switch (tab) {
      case 'ptth':
        return getArticlesByType('ptth')
      case 'bao_in':
        return getArticlesByType('bao_in')
      case 'bao_dien_tu':
        return getArticlesByType('bao_dien_tu')
      case 'noi_dung_so':
        return getArticlesByType('noi_dung_so')
      default:
        return mockArticles
    }
  }

  // Calculate warnings - articles approaching deadline
  const deadlineWarnings = useMemo(() => {
    const now = new Date()
    const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
    return mockArticles.filter(
      (a) =>
        a.deadline >= now &&
        a.deadline <= weekFromNow &&
        a.status !== 'da_xuat_ban'
    )
  }, [])

  // Articles pending approval
  const pendingApproval = useMemo(() => {
    return mockArticles.filter(
      (a) => a.status === 'cho_duyet_cap_1' || a.status === 'cho_duyet_cap_2'
    )
  }, [])

  const navigate = useNavigate()

  const handleView = (article: Article) => {
    navigate({
      to: '/operations/articles/$articleId',
      params: { articleId: article.id },
    })
  }

  const handleEdit = (_article: Article) => {
    // TODO: Implement edit
  }

  const handleDelete = (_article: Article) => {
    // TODO: Implement delete
  }

  return (
    <div className='space-y-6'>
      {/* Page Header - matching Topics page style */}
      <div className='flex flex-wrap items-end justify-between gap-2'>
        <div className='flex flex-col items-start'>
          <h2 className='text-3xl font-bold tracking-tight'>Quản Lý Tin Bài</h2>
          <p className='text-muted-foreground'>
            Quản lý quy trình sản xuất tin bài từ phân công đến xuất bản (PTTH,
            Báo in, Báo điện tử, Nội dung số).
          </p>
        </div>
        <div className='flex gap-2'>
          <Button variant='outline'>
            <FileDown className='mr-2 h-4 w-4' />
            Xuất Excel
          </Button>
          <Button>
            <Plus className='mr-2 h-4 w-4' />
            Tạo tin bài mới
          </Button>
        </div>
      </div>

      {/* Warning Alert */}
      {(deadlineWarnings.length > 0 || pendingApproval.length > 0) && (
        <Alert className='border-yellow-500/50 bg-yellow-500/10'>
          <AlertTriangle className='h-4 w-4 text-yellow-500' />
          <AlertDescription className='flex items-center gap-4'>
            <span className='font-medium text-yellow-500'>
              Cảnh báo deadline
            </span>
            <span>
              Có <strong>{deadlineWarnings.length}</strong> tin bài sắp đến hạn
              trong tuần này và <strong>{pendingApproval.length}</strong> tin
              bài chờ duyệt.
            </span>
            <Button variant='link' className='h-auto p-0 text-yellow-500'>
              Xem chi tiết
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Stats Cards - matching Topics page style */}
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-5'>
        <StatCard
          title='Đang tác nghiệp'
          value={String(stats.tacNghiep).padStart(2, '0')}
          subtitle='PV/BTV đang thu thập tin'
          trend={{ value: 15, isPositive: true }}
          trendText='Tăng 15% tuần qua'
        />
        <StatCard
          title='Chờ duyệt cấp 1'
          value={String(stats.choDuyetCap1).padStart(2, '0')}
          subtitle='Chờ lãnh đạo phòng duyệt'
          trend={{ value: 8, isPositive: false }}
          trendText='Giảm 8% so với hôm qua'
        />
        <StatCard
          title='Chờ duyệt cấp 2'
          value={String(stats.choDuyetCap2).padStart(2, '0')}
          subtitle='Chờ Ban biên tập duyệt'
          trend={{ value: 5, isPositive: false }}
          trendText='Cần xử lý nhanh'
        />
        <StatCard
          title='Đang xử lý hậu kỳ'
          value={String(stats.hauKy).padStart(2, '0')}
          subtitle='Dựng video/Dàn trang'
          trend={{ value: 12, isPositive: true }}
          trendText='Đang trong tiến độ'
        />
        <StatCard
          title='Đã xuất bản'
          value={String(stats.daXuatBan).padStart(2, '0')}
          subtitle='Phát sóng/In/Đăng tải'
          trend={{ value: 12.5, isPositive: true }}
          trendText='Tăng trưởng tốt'
        />
      </div>

      {/* Articles Table Section - Quản lý theo loại tin bài */}
      <Card>
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <CardHeader className='pb-3'>
            <div className='flex items-center justify-between'>
              <TabsList>
                <TabsTrigger value='all'>
                  Tất cả ({mockArticles.length})
                </TabsTrigger>
                <TabsTrigger value='ptth'>
                  PTTH ({stats.byType.ptth})
                </TabsTrigger>
                <TabsTrigger value='bao_in'>
                  Báo in ({stats.byType.baoIn})
                </TabsTrigger>
                <TabsTrigger value='bao_dien_tu'>
                  Báo điện tử ({stats.byType.baoDienTu})
                </TabsTrigger>
                <TabsTrigger value='noi_dung_so'>
                  Nội dung số ({stats.byType.noiDungSo})
                </TabsTrigger>
              </TabsList>
              <div className='flex items-center gap-2'>
                <Button variant='outline' size='sm'>
                  <Settings2 className='mr-2 h-4 w-4' />
                  Bộ lọc
                </Button>
                <Button size='sm'>
                  <Plus className='mr-2 h-4 w-4' />
                  Tạo tin bài mới
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className='pt-0'>
            <TabsContent value='all' className='mt-0'>
              <ArticleTable
                data={getArticlesByTab('all')}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </TabsContent>
            <TabsContent value='ptth' className='mt-0'>
              <ArticleTable
                data={getArticlesByTab('ptth')}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </TabsContent>
            <TabsContent value='bao_in' className='mt-0'>
              <ArticleTable
                data={getArticlesByTab('bao_in')}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </TabsContent>
            <TabsContent value='bao_dien_tu' className='mt-0'>
              <ArticleTable
                data={getArticlesByTab('bao_dien_tu')}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </TabsContent>
            <TabsContent value='noi_dung_so' className='mt-0'>
              <ArticleTable
                data={getArticlesByTab('noi_dung_so')}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </TabsContent>
          </CardContent>
        </Tabs>
      </Card>
    </div>
  )
}

export default ArticlesPage
