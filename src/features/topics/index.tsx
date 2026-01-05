import { useState, useMemo } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { Plus, TrendingUp, TrendingDown, Settings2 } from 'lucide-react'
import { useAuthStore, hasRole } from '@/stores/auth-store'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { TopicResponse } from './api/topics-api'
import { TopicTable } from './components/topic-table'
import { TopicsChart } from './components/topics-chart'
import { useTopics, useTopicStats } from './hooks/use-topics'
import { type Topic } from './types'

// Helper to convert API response to Topic type
function toTopic(t: TopicResponse): Topic {
  return {
    id: t.id,
    title: t.title,
    outline: t.outline || '',
    contentType: t.contentType,
    teamMembers: t.teamMembers.map((m) => ({
      userId: m.userId,
      userName: m.userName,
      role: m.role as
        | 'admin'
        | 'leadership'
        | 'editor'
        | 'reporter'
        | 'technician',
      position: m.position,
    })),
    attachments: t.attachments.map((a) => ({
      id: a.id,
      fileName: a.fileName,
      fileUrl: a.fileUrl,
      fileType: a.fileType,
      fileSize: a.fileSize,
      uploadedAt: new Date(a.uploadedAt),
    })),
    estimatedDays: t.estimatedDays,
    deadline: t.deadline ? new Date(t.deadline) : undefined,
    createdBy: t.createdBy,
    createdByName: t.createdByName || '',
    departmentId: t.departmentId || '',
    departmentName: t.departmentName || '',
    status: t.status as Topic['status'],
    approvalHistory: [],
    createdAt: new Date(t.createdAt),
    updatedAt: new Date(t.updatedAt),
  }
}

// Stat card component with trend indicator
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

export function TopicsPage() {
  const { user } = useAuthStore()
  const [selectedTab, setSelectedTab] = useState<string>('all')
  const navigate = useNavigate()

  // Fetch topics from API
  const { data: topicsData } = useTopics()

  // Fetch topic statistics from API
  const { data: apiStats } = useTopicStats()

  // Convert API data to Topic type
  const allTopics = useMemo(() => {
    if (!topicsData?.topics) return []
    return topicsData.topics.map(toTopic)
  }, [topicsData])

  // Filter topics based on user role
  const filteredTopics = useMemo(() => {
    if (!user) return []

    // Admin and Leadership can see all
    if (hasRole(user, ['admin', 'leadership'])) {
      return allTopics
    }

    // Editor can see their department
    if (user.role === 'editor') {
      return allTopics.filter((t) => t.departmentId === user.departmentId)
    }

    // Reporter/Technician can only see their own
    return allTopics.filter((t) => t.createdBy === user.id)
  }, [user, allTopics])

  // Get topics by tab filter (updated for single-step approval)
  const getTopicsByTab = (tab: string): Topic[] => {
    switch (tab) {
      case 'pending':
        return filteredTopics.filter((t) => t.status === 'pending')
      case 'approved':
        return filteredTopics.filter((t) => t.status === 'approved')
      case 'rejected':
        return filteredTopics.filter((t) =>
          ['rejected', 'revision_required'].includes(t.status)
        )
      default:
        return filteredTopics
    }
  }

  // Calculate stats from real data
  const stats = useMemo(
    () => ({
      total: filteredTopics.length,
      pending: filteredTopics.filter((t) => t.status === 'pending').length,
      approved: filteredTopics.filter((t) => t.status === 'approved').length,
      rejected: filteredTopics.filter((t) =>
        ['rejected', 'revision_required'].includes(t.status)
      ).length,
    }),
    [filteredTopics]
  )

  const handleView = (topic: Topic) => {
    navigate({ to: '/topics/$id', params: { id: topic.id } })
  }

  const handleEdit = (topic: Topic) => {
    navigate({ to: '/topics/$id', params: { id: topic.id } })
  }

  const handleDelete = (topic: Topic) => {
    console.log('Delete topic:', topic.id)
  }

  return (
    <div className='space-y-6'>
      {/* Page Header */}
      <div className='flex flex-wrap items-end justify-between gap-2'>
        <div className='flex flex-col items-start'>
          <h2 className='text-3xl font-bold tracking-tight'>Quản lý Đề tài</h2>
          <p className='text-muted-foreground'>
            Quản lý và theo dõi tiến độ thực hiện các đề tài.
          </p>
        </div>
        <div className='flex gap-2'>
          <Button asChild>
            <Link to='/topics/register'>
              <Plus className='mr-2 h-4 w-4' />
              Đăng ký Đề tài
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards - Enhanced with trends */}
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        <StatCard
          title='Tổng đề tài'
          value={apiStats?.total.count ?? stats.total}
          subtitle='Tổng số lượng đề tài'
          trend={{
            value: Math.abs(apiStats?.total.trend ?? 0),
            isPositive: (apiStats?.total.trend ?? 0) >= 0,
          }}
          trendText={`${(apiStats?.total.trend ?? 0) >= 0 ? 'Tăng' : 'Giảm'} ${Math.abs(apiStats?.total.trend ?? 0)}% tháng này`}
        />
        <StatCard
          title='Chờ duyệt'
          value={apiStats?.pending.count ?? stats.pending}
          subtitle='Cần xem xét ngay'
          trend={{
            value: Math.abs(apiStats?.pending.trend ?? 0),
            isPositive: (apiStats?.pending.trend ?? 0) <= 0,
          }}
          trendText={`${(apiStats?.pending.trend ?? 0) >= 0 ? 'Tăng' : 'Giảm'} ${Math.abs(apiStats?.pending.trend ?? 0)}% tháng này`}
        />
        <StatCard
          title='Đã duyệt'
          value={apiStats?.approved.count ?? stats.approved}
          subtitle='Đã qua kiểm duyệt'
          trend={{
            value: Math.abs(apiStats?.approved.trend ?? 0),
            isPositive: (apiStats?.approved.trend ?? 0) >= 0,
          }}
          trendText={`${(apiStats?.approved.trend ?? 0) >= 0 ? 'Tăng' : 'Giảm'} ${Math.abs(apiStats?.approved.trend ?? 0)}% tháng này`}
        />
        <StatCard
          title='Tỷ lệ thành công'
          value={`${apiStats?.successRate.rate ?? (stats.total > 0 ? Math.round((stats.approved / stats.total) * 100) : 0)}%`}
          subtitle={`Cập nhật: ${apiStats?.lastUpdated ? new Date(apiStats.lastUpdated).toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' }) : '--'}`}
          trend={{
            value: Math.abs(apiStats?.successRate.trend ?? 0),
            isPositive: (apiStats?.successRate.trend ?? 0) >= 0,
          }}
          trendText={`${(apiStats?.successRate.trend ?? 0) >= 0 ? 'Tăng' : 'Giảm'} ${Math.abs(apiStats?.successRate.trend ?? 0)}% so với tháng trước`}
        />
      </div>

      {/* Chart Section */}
      <TopicsChart />

      {/* Topics Table Section */}
      <Card>
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <CardHeader className='pb-3'>
            <div className='flex items-center justify-between'>
              <TabsList>
                <TabsTrigger value='all'>
                  Tất cả ({filteredTopics.length})
                </TabsTrigger>
                <TabsTrigger value='pending'>
                  Chờ duyệt ({getTopicsByTab('pending').length})
                </TabsTrigger>
                <TabsTrigger value='approved'>
                  Đã duyệt ({getTopicsByTab('approved').length})
                </TabsTrigger>
                <TabsTrigger value='rejected'>
                  Từ chối ({getTopicsByTab('rejected').length})
                </TabsTrigger>
              </TabsList>
              <div className='flex items-center gap-2'>
                <Button variant='outline' size='sm'>
                  <Settings2 className='mr-2 h-4 w-4' />
                  Tùy chỉnh cột
                </Button>
                {hasRole(user, [
                  'admin',
                  'leadership',
                  'editor',
                  'reporter',
                ]) && (
                  <Button asChild size='sm'>
                    <Link to='/topics/register'>
                      <Plus className='mr-2 h-4 w-4' />
                      Đăng Ký Đề Tài
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className='pt-0'>
            <TabsContent value='all' className='mt-0'>
              <TopicTable
                data={getTopicsByTab('all')}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </TabsContent>
            <TabsContent value='pending' className='mt-0'>
              <TopicTable
                data={getTopicsByTab('pending')}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </TabsContent>
            <TabsContent value='approved' className='mt-0'>
              <TopicTable
                data={getTopicsByTab('approved')}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </TabsContent>
            <TabsContent value='rejected' className='mt-0'>
              <TopicTable
                data={getTopicsByTab('rejected')}
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

export default TopicsPage
