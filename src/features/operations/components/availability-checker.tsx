import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Calendar, CheckCircle, Clock, Search } from 'lucide-react'
import { getVehicleAvailability } from '../data/mock-data'

export function AvailabilityChecker() {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [startTime, setStartTime] = useState('08:00')
  const [endTime, setEndTime] = useState('12:00')

  const availability = getVehicleAvailability()

  const getProgressColor = (available: number, total: number) => {
    const ratio = available / total
    if (ratio === 0) return 'bg-destructive'
    if (ratio < 0.3) return 'bg-orange-500'
    return 'bg-primary'
  }

  const getStatusText = (available: number, total: number) => {
    if (available === 0) return { text: 'Hết xe', className: 'text-destructive font-bold' }
    if (available < total * 0.3) return { text: `Còn ${available}/${total}`, className: 'text-orange-500 font-bold' }
    return { text: `Còn ${available}/${total}`, className: 'text-primary font-bold' }
  }

  return (
    <Card>
      <CardHeader className='pb-3'>
        <CardTitle className='flex items-center gap-2 text-base'>
          <CheckCircle className='h-4 w-4 text-primary' />
          Kiểm tra khả dụng
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        {/* Date Input */}
        <div>
          <Label className='mb-1 text-xs font-bold uppercase text-muted-foreground'>
            Ngày sử dụng
          </Label>
          <div className='flex items-center rounded border border-border bg-muted p-2'>
            <Calendar className='mr-2 h-4 w-4 text-muted-foreground' />
            <Input
              type='date'
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className='border-none bg-transparent p-0 text-sm focus-visible:ring-0'
            />
          </div>
        </div>

        {/* Time Range */}
        <div>
          <Label className='mb-1 text-xs font-bold uppercase text-muted-foreground'>
            Khung giờ
          </Label>
          <div className='flex gap-2'>
            <Input
              type='time'
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className='text-sm'
            />
            <Input
              type='time'
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className='text-sm'
            />
          </div>
        </div>

        {/* Check Button */}
        <Button variant='outline' className='w-full border-primary/20 bg-primary/10 text-primary'>
          <Search className='mr-2 h-4 w-4' />
          Kiểm tra nhanh
        </Button>

        {/* Availability Results */}
        <div className='space-y-3 border-t border-border pt-4'>
          <p className='mb-2 text-xs text-muted-foreground'>Tình trạng dự kiến:</p>

          {/* Car 4-7 seats */}
          <div>
            <div className='mb-1 flex items-center justify-between text-sm'>
              <span>Xe 4-7 chỗ</span>
              <span className={getStatusText(availability.car47.available, availability.car47.total).className}>
                {getStatusText(availability.car47.available, availability.car47.total).text}
              </span>
            </div>
            <Progress
              value={(1 - availability.car47.available / availability.car47.total) * 100}
              className='h-1.5'
            />
          </div>

          {/* Car 16 seats */}
          <div>
            <div className='mb-1 flex items-center justify-between text-sm'>
              <span>Xe 16 chỗ</span>
              <span className={getStatusText(availability.car16.available, availability.car16.total).className}>
                {getStatusText(availability.car16.available, availability.car16.total).text}
              </span>
            </div>
            <Progress
              value={(1 - availability.car16.available / availability.car16.total) * 100}
              className='h-1.5'
            />
          </div>

          {/* Cameras */}
          <div>
            <div className='mb-1 flex items-center justify-between text-sm'>
              <span>Máy quay chuyên dụng</span>
              <span className={getStatusText(availability.cameras.available, availability.cameras.total).className}>
                {getStatusText(availability.cameras.available, availability.cameras.total).text}
              </span>
            </div>
            <Progress
              value={(1 - availability.cameras.available / availability.cameras.total) * 100}
              className='h-1.5'
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
