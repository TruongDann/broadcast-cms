import { useState, useMemo } from 'react'
import { Link } from '@tanstack/react-router'
import {
  Plus,
  TrendingUp,
  TrendingDown,
  Settings2,
} from 'lucide-react'
import { useAuthStore, hasRole } from '@/stores/auth-store'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { TopicTable } from './components/topic-table'
import { TopicsChart } from './components/topics-chart'
import {
  mockTopics,
  getTopicsByUser,
  getTopicsByDepartment,
  getTopicStats,
} from './data/mock-topics'
import { type Topic } from './types'

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

function StatCard({
  title,
  value,
  subtitle,
  trend,
  trendText,
}: StatCardProps) {
  return (
    <Card className='bg-card border-border'>
      <CardContent>
        {/* Header: Title + Badge */}
        <div className='flex items-center justify-between'>
          <span className='text-sm text-muted-foreground'>{title}</span>
          {trend && (
            <Badge variant='outline' className='gap-1 border-muted-foreground/30 bg-transparent px-2 py-0.5'>
              {trend.isPositive ? (
                <TrendingUp className='h-3 w-3 text-muted-foreground' />
              ) : (
                <TrendingDown className='h-3 w-3 text-muted-foreground' />
              )}
              <span
                className={
                  trend.isPositive ? 'text-green-500' : 'text-red-500'
                }
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

  // Filter topics based on user role
  const filteredTopics = useMemo(() => {
    if (!user) return []

    // Admin and Leadership can see all
    if (hasRole(user, ['admin', 'leadership'])) {
      return mockTopics
    }

    // Editor can see their department
    if (user.role === 'editor') {
      return getTopicsByDepartment(user.departmentId || '')
    }

    // Reporter/Technician can only see their own
    return getTopicsByUser(user.id)
  }, [user])

  // Get topics by tab filter
  const getTopicsByTab = (tab: string): Topic[] => {
    switch (tab) {
      case 'pending':
        return filteredTopics.filter((t) =>
          ['pending_b1', 'pending_b2', 'pending_b3'].includes(t.status)
        )
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

  const stats = getTopicStats()

  const handleView = (topic: Topic) => {
    console.log('View topic:', topic.id)
  }

  const handleEdit = (topic: Topic) => {
    console.log('Edit topic:', topic.id)
  }

  const handleDelete = (topic: Topic) => {
    console.log('Delete topic:', topic.id)
  }

  return (
    <div className='space-y-6'>
      {/* Stats Cards - Enhanced with trends */}
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        <StatCard
          title='Tổng đề tài'
          value={stats.total}
          subtitle='Tổng số lượng đề tài'
          trend={{ value: 12.5, isPositive: true }}
          trendText='Tăng 12.5% tháng này'
        />
        <StatCard
          title='Chờ duyệt'
          value={stats.pending}
          subtitle='Cần xem xét ngay'
          trend={{ value: 20, isPositive: false }}
          trendText='Giảm 20% tuần qua'
        />
        <StatCard
          title='Đã duyệt'
          value={stats.approved}
          subtitle='Đã qua kiểm duyệt'
          trend={{ value: 15.8, isPositive: true }}
          trendText='Tăng trưởng tích cực'
        />
        <StatCard
          title='Tỷ lệ thành công'
          value={`${stats.total > 0 ? Math.round((stats.approved / stats.total) * 100) : 0}%`}
          subtitle='So với mục tiêu'
          trend={{ value: 4.5, isPositive: true }}
          trendText='Duy trì mức ổn định'
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
                {hasRole(user, ['admin', 'leadership', 'editor', 'reporter']) && (
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
