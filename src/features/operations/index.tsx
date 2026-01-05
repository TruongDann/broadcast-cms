import { useState } from 'react'
import {
  Plus,
  TrendingUp,
  TrendingDown,
  Calendar,
  HelpCircle,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { AllocationCard } from './components/allocation-card'
import { AvailabilityChecker } from './components/availability-checker'
import { ActivityLog } from './components/activity-log'
import { mockAllocationRequests, getOperationsStats } from './data/mock-data'

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

export function VehiclesPage() {
  const [filter, setFilter] = useState<'today' | 'week' | 'month'>('today')
  const stats = getOperationsStats()

  return (
    <div className='space-y-6'>
      {/* Page Header - matching Topics page style */}
      <div className='flex flex-wrap items-end justify-between gap-2'>
        <div className='flex flex-col items-start'>
          <h2 className='text-3xl font-bold tracking-tight'>
            Quản lý Cấp phát Phương tiện & Thiết bị
          </h2>
          <p className='text-muted-foreground'>
            Theo dõi và quản lý việc cấp phát xe, thiết bị cho các lịch công tác.
          </p>
        </div>
        <div className='flex gap-2'>
          <Button>
            <Plus className='mr-2 h-4 w-4' />
            Đăng ký cấp phát
          </Button>
        </div>
      </div>

      {/* Stats Cards - matching Topics page style */}
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        <StatCard
          title='Chờ duyệt'
          value={String(stats.pending).padStart(2, '0')}
          subtitle='Yêu cầu cần xử lý'
          trend={{ value: 15, isPositive: false }}
          trendText='Giảm 15% tuần qua'
        />
        <StatCard
          title='Đang sử dụng'
          value={String(stats.inUse).padStart(2, '0')}
          subtitle='Đang triển khai'
          trend={{ value: 8, isPositive: true }}
          trendText='Tăng 8% so với hôm qua'
        />
        <StatCard
          title='Cảnh báo trùng lịch'
          value={String(stats.conflict).padStart(2, '0')}
          subtitle='Cần xử lý ngay'
          trend={{ value: 25, isPositive: false }}
          trendText='Cần chú ý giảm thiểu'
        />
        <StatCard
          title='Hoàn thành hôm nay'
          value={stats.completed}
          subtitle='Đã trả thiết bị'
          trend={{ value: 12.5, isPositive: true }}
          trendText='Tăng trưởng tốt'
        />
      </div>

      {/* Main Content Grid */}
      <div className='grid gap-6 xl:grid-cols-12'>
        {/* Left: Allocation Requests */}
        <div className='space-y-6 xl:col-span-8'>
          {/* Section Header */}
          <div className='flex items-center justify-between'>
            <h3 className='flex items-center gap-2 text-lg font-bold'>
              <Calendar className='h-5 w-5 text-primary' />
              Danh sách yêu cầu theo Lịch công tác
            </h3>
            <div className='flex rounded border border-border bg-muted p-0.5'>
              <button
                onClick={() => setFilter('today')}
                className={`rounded px-3 py-1 text-xs ${
                  filter === 'today'
                    ? 'bg-background font-bold text-foreground shadow'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Hôm nay
              </button>
              <button
                onClick={() => setFilter('week')}
                className={`rounded px-3 py-1 text-xs ${
                  filter === 'week'
                    ? 'bg-background font-bold text-foreground shadow'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Tuần này
              </button>
              <button
                onClick={() => setFilter('month')}
                className={`rounded px-3 py-1 text-xs ${
                  filter === 'month'
                    ? 'bg-background font-bold text-foreground shadow'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Tháng này
              </button>
            </div>
          </div>

          {/* Allocation Cards */}
          {mockAllocationRequests.map((request) => (
            <AllocationCard
              key={request.id}
              request={request}
              onApprove={() => console.log('Approve', request.id)}
              onReject={() => console.log('Reject', request.id)}
              onReturn={() => console.log('Return', request.id)}
              onReport={() => console.log('Report', request.id)}
            />
          ))}
        </div>

        {/* Right: Sidebar */}
        <div className='space-y-6 xl:col-span-4'>
          <AvailabilityChecker />
          <ActivityLog />

          {/* Help Card */}
          <Card className='border-blue-500/20 bg-blue-500/10'>
            <CardContent className='flex items-start gap-3'>
              <HelpCircle className='mt-0.5 h-5 w-5 shrink-0 text-blue-500' />
              <div>
                <h4 className='mb-1 text-sm font-bold text-blue-500'>
                  Quy định Cấp phát
                </h4>
                <ul className='list-inside list-disc space-y-1 text-xs text-muted-foreground'>
                  <li>Đăng ký xe trước ít nhất 24h đối với lịch công tác tỉnh.</li>
                  <li>
                    Kiểm tra kỹ tình trạng thiết bị khi nhận bàn giao (Check-out).
                  </li>
                  <li>
                    Báo cáo ngay nếu có sự cố hỏng hóc trong quá trình sử dụng.
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
