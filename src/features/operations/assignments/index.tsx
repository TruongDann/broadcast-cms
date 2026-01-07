import { useState, useMemo } from 'react'
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
import { AssignmentTable } from './components/assignment-table'
import { mockAssignments, getAssignmentStats } from './data/mock-data'
import { type Assignment } from './types'

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

export function AssignmentsPage() {
  const [selectedTab, setSelectedTab] = useState<string>('all')

  // Get statistics
  const stats = getAssignmentStats()

  // Get assignments by tab filter
  const getAssignmentsByTab = (tab: string): Assignment[] => {
    switch (tab) {
      case 'pending':
        return mockAssignments.filter((a) => a.status === 'pending')
      case 'in_progress':
        return mockAssignments.filter((a) => a.status === 'in_progress')
      case 'completed':
        return mockAssignments.filter((a) => a.status === 'completed')
      case 'overdue':
        return mockAssignments.filter((a) => a.status === 'overdue')
      default:
        return mockAssignments
    }
  }

  // Calculate warnings
  const deadlineWarnings = useMemo(() => {
    const now = new Date()
    const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
    return mockAssignments.filter(
      (a) =>
        a.deadline >= now &&
        a.deadline <= weekFromNow &&
        a.status !== 'completed'
    )
  }, [])

  const overduePayments = useMemo(() => {
    return mockAssignments.filter((a) => a.status === 'overdue')
  }, [])

  const handleView = (_assignment: Assignment) => {
    // TODO: Open detail modal
  }

  const handleEdit = (_assignment: Assignment) => {
    // TODO: Implement edit
  }

  const handleDelete = (_assignment: Assignment) => {
    // TODO: Implement delete
  }

  const handleAssign = (_assignment: Assignment) => {
    // TODO: Implement assign
  }

  return (
    <div className='space-y-6'>
      {/* Page Header - matching Topics page style */}
      <div className='flex flex-wrap items-end justify-between gap-2'>
        <div className='flex flex-col items-start'>
          <h2 className='text-3xl font-bold tracking-tight'>
            Quản Lý Đơn Hàng
          </h2>
          <p className='text-muted-foreground'>
            Phân công và theo dõi tiến độ thực hiện các đề tài, đơn hàng.
          </p>
        </div>
        <div className='flex gap-2'>
          <Button variant='outline'>
            <FileDown className='mr-2 h-4 w-4' />
            Xuất Excel
          </Button>
          <Button>
            <Plus className='mr-2 h-4 w-4' />
            Tạo đơn hàng mới
          </Button>
        </div>
      </div>

      {/* Warning Alert */}
      {(deadlineWarnings.length > 0 || overduePayments.length > 0) && (
        <Alert className='border-yellow-500/50 bg-yellow-500/10'>
          <AlertTriangle className='h-4 w-4 text-yellow-500' />
          <AlertDescription className='flex items-center gap-4'>
            <span className='font-medium text-yellow-500'>
              Cảnh báo hạn chót
            </span>
            <span>
              Có <strong>{deadlineWarnings.length}</strong> đơn hàng sắp đến hạn
              nghiệm thu trong tuần này và{' '}
              <strong>{overduePayments.length}</strong> đơn hàng quá hạn thanh
              toán.
            </span>
            <Button variant='link' className='h-auto p-0 text-yellow-500'>
              Xem chi tiết
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Stats Cards - matching Topics page style */}
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        <StatCard
          title='Chờ phân công'
          value={String(stats.pending).padStart(2, '0')}
          subtitle='Đơn hàng cần xử lý'
          trend={{ value: 15, isPositive: false }}
          trendText='Giảm 15% tuần qua'
        />
        <StatCard
          title='Đang thực hiện'
          value={String(stats.inProgress).padStart(2, '0')}
          subtitle='Đang triển khai'
          trend={{ value: 8, isPositive: true }}
          trendText='Tăng 8% so với hôm qua'
        />
        <StatCard
          title='Quá hạn'
          value={String(stats.overdue).padStart(2, '0')}
          subtitle='Cần xử lý ngay'
          trend={{ value: 25, isPositive: false }}
          trendText='Cần chú ý giảm thiểu'
        />
        <StatCard
          title='Hoàn thành'
          value={String(stats.completed).padStart(2, '0')}
          subtitle='Đã nghiệm thu'
          trend={{ value: 12.5, isPositive: true }}
          trendText='Tăng trưởng tốt'
        />
      </div>

      {/* Assignments Table Section - matching Topics page style */}
      <Card>
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <CardHeader className='pb-3'>
            <div className='flex items-center justify-between'>
              <TabsList>
                <TabsTrigger value='all'>
                  Tất cả ({mockAssignments.length})
                </TabsTrigger>
                <TabsTrigger value='pending'>
                  Chờ phân công ({getAssignmentsByTab('pending').length})
                </TabsTrigger>
                <TabsTrigger value='in_progress'>
                  Đang thực hiện ({getAssignmentsByTab('in_progress').length})
                </TabsTrigger>
                <TabsTrigger value='completed'>
                  Hoàn thành ({getAssignmentsByTab('completed').length})
                </TabsTrigger>
                <TabsTrigger value='overdue'>
                  Quá hạn ({getAssignmentsByTab('overdue').length})
                </TabsTrigger>
              </TabsList>
              <div className='flex items-center gap-2'>
                <Button variant='outline' size='sm'>
                  <Settings2 className='mr-2 h-4 w-4' />
                  Bộ lọc
                </Button>
                <Button size='sm'>
                  <Plus className='mr-2 h-4 w-4' />
                  Tạo đơn hàng mới
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className='pt-0'>
            <TabsContent value='all' className='mt-0'>
              <AssignmentTable
                data={getAssignmentsByTab('all')}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onAssign={handleAssign}
              />
            </TabsContent>
            <TabsContent value='pending' className='mt-0'>
              <AssignmentTable
                data={getAssignmentsByTab('pending')}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onAssign={handleAssign}
              />
            </TabsContent>
            <TabsContent value='in_progress' className='mt-0'>
              <AssignmentTable
                data={getAssignmentsByTab('in_progress')}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onAssign={handleAssign}
              />
            </TabsContent>
            <TabsContent value='completed' className='mt-0'>
              <AssignmentTable
                data={getAssignmentsByTab('completed')}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onAssign={handleAssign}
              />
            </TabsContent>
            <TabsContent value='overdue' className='mt-0'>
              <AssignmentTable
                data={getAssignmentsByTab('overdue')}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onAssign={handleAssign}
              />
            </TabsContent>
          </CardContent>
        </Tabs>
      </Card>
    </div>
  )
}

export default AssignmentsPage
