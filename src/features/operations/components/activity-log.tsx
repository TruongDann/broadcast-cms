import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { History, AlertTriangle } from 'lucide-react'
import { recentActivities } from '../data/mock-data'

export function ActivityLog() {
  return (
    <Card>
      <CardHeader className='pb-3'>
        <div className='flex items-center justify-between'>
          <CardTitle className='flex items-center gap-2 text-base'>
            <History className='h-4 w-4 text-primary' />
            Hoạt động gần đây
          </CardTitle>
          <button className='text-xs text-muted-foreground hover:text-foreground'>
            Xem tất cả
          </button>
        </div>
      </CardHeader>
      <CardContent>
        <div className='relative space-y-4 pl-4'>
          {/* Timeline line */}
          <div className='absolute bottom-0 left-1.5 top-2 w-px bg-border' />

          {recentActivities.map((activity, index) => (
            <div key={activity.id} className='relative'>
              {/* Timeline dot */}
              <div
                className={`absolute -left-[14px] top-1 h-3 w-3 rounded-full border-2 ${
                  activity.type === 'receive'
                    ? 'border-primary bg-primary'
                    : activity.type === 'warning'
                      ? 'border-orange-500 bg-background'
                      : 'border-muted-foreground bg-background'
                }`}
              />

              <p className='mb-0.5 text-xs text-muted-foreground'>
                {activity.time}
              </p>
              <p className='text-sm'>
                <strong>{activity.user}</strong>{' '}
                {activity.type === 'receive' && 'đã nhận bàn giao'}
                {activity.type === 'return' && 'đã trả'}
                {activity.type === 'warning' && 'cảnh báo trùng lịch xe'}{' '}
                <strong>{activity.item}</strong>.
              </p>
              {activity.note && (
                <p
                  className={`mt-0.5 text-xs italic ${
                    activity.type === 'return'
                      ? 'text-green-500'
                      : 'text-muted-foreground'
                  }`}
                >
                  {activity.note}
                </p>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
