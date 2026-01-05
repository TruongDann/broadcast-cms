import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Car,
  Camera,
  Mic,
  Lightbulb,
  AlertTriangle,
  Check,
  Clock,
  KeyRound,
  RotateCcw,
  AlertCircle,
} from 'lucide-react'
import {
  type AllocationRequest,
  type Vehicle,
  type Equipment,
  SCHEDULE_TYPE_CONFIG,
} from '../types'

interface AllocationCardProps {
  request: AllocationRequest
  onApprove?: () => void
  onReject?: () => void
  onReturn?: () => void
  onReport?: () => void
}

// Get icon for equipment type
function getEquipmentIcon(type: Equipment['type']) {
  switch (type) {
    case 'camera':
      return Camera
    case 'microphone':
      return Mic
    case 'lighting':
      return Lightbulb
    default:
      return Camera
  }
}

// Status badge config
function getStatusBadge(status: AllocationRequest['status']) {
  switch (status) {
    case 'in_use':
      return { label: 'ĐANG SỬ DỤNG', className: 'bg-primary text-primary-foreground' }
    case 'conflict':
      return { label: 'CẢNH BÁO TRÙNG', className: 'bg-orange-500 text-white' }
    case 'pending':
      return { label: 'CHỜ DUYỆT', className: 'bg-muted text-muted-foreground' }
    case 'approved':
      return { label: 'ĐÃ DUYỆT', className: 'bg-blue-500 text-white' }
    case 'returned':
      return { label: 'ĐÃ TRẢ', className: 'bg-green-500 text-white' }
    default:
      return { label: status, className: 'bg-muted' }
  }
}

// Workflow step icon
function getStepIcon(step: string, status: string) {
  if (status === 'completed') {
    return <Check className='h-3 w-3' />
  }
  switch (step) {
    case 'register':
      return <Check className='h-3 w-3' />
    case 'approve':
      return status === 'current' ? <Clock className='h-3 w-3' /> : null
    case 'receive':
      return status === 'current' ? <KeyRound className='h-3 w-3' /> : null
    case 'return':
      return <RotateCcw className='h-3 w-3' />
    default:
      return null
  }
}

export function AllocationCard({
  request,
  onApprove,
  onReject,
  onReturn,
  onReport,
}: AllocationCardProps) {
  const statusBadge = getStatusBadge(request.status)
  const isConflict = request.status === 'conflict'
  const isPending = request.status === 'pending'
  const isInUse = request.status === 'in_use'

  // Format date display
  const dateLabel =
    request.date.toDateString() === new Date().toDateString()
      ? 'Hôm nay'
      : request.date.toDateString() ===
          new Date(Date.now() + 86400000).toDateString()
        ? 'Ngày mai'
        : request.date.toLocaleDateString('vi-VN')

  return (
    <Card
      className={cn(
        'relative overflow-hidden',
        isConflict && 'border-orange-500/50',
        isInUse && 'border-primary/50'
      )}
    >
      {/* Status Badge */}
      <div
        className={cn(
          'absolute right-0 top-0 rounded-bl px-3 py-1 text-xs font-bold',
          statusBadge.className
        )}
      >
        {isConflict && <AlertTriangle className='mr-1 inline h-3 w-3' />}
        {statusBadge.label}
      </div>

      <CardContent className='p-5'>
        <div className='flex flex-col gap-6 md:flex-row'>
          {/* Left: Schedule Info */}
          <div className='min-w-[160px] md:border-r md:border-border md:pr-6'>
            <div className='mb-1 text-sm font-bold text-blue-500'>
              {dateLabel}
            </div>
            <div className='mb-2 text-xl font-bold'>
              {request.startTime} - {request.endTime}
            </div>
            <div className='text-xs text-muted-foreground'>
              {SCHEDULE_TYPE_CONFIG[request.scheduleType]}:{' '}
              <span className='text-foreground'>{request.scheduleName}</span>
            </div>
            <div className='mt-3 flex items-center gap-2'>
              <div
                className='h-6 w-6 rounded-full border border-border bg-cover bg-center'
                style={{
                  backgroundImage: `url(${request.requesterAvatar || '/avatars/default.png'})`,
                }}
              />
              <span className='text-xs text-muted-foreground'>
                {request.requesterName} (ĐK)
              </span>
            </div>
          </div>

          {/* Right: Resources and Workflow */}
          <div className='flex-1 space-y-4'>
            {/* Resources */}
            <div className='flex flex-wrap gap-2'>
              {request.vehicles.map((vehicle: Vehicle) => (
                <div
                  key={vehicle.id}
                  className={cn(
                    'flex items-center gap-2 rounded border px-2 py-1',
                    isConflict
                      ? 'border-orange-500/30 bg-orange-500/10'
                      : 'border-border bg-muted'
                  )}
                >
                  <Car
                    className={cn(
                      'h-4 w-4',
                      isConflict ? 'text-orange-500' : 'text-primary'
                    )}
                  />
                  <div>
                    <div className='text-xs font-bold'>{vehicle.name}</div>
                    <div
                      className={cn(
                        'font-mono text-[10px]',
                        isConflict
                          ? 'font-bold text-orange-500'
                          : 'text-muted-foreground'
                      )}
                    >
                      {isConflict ? 'TRÙNG LỊCH' : vehicle.licensePlate}
                    </div>
                  </div>
                </div>
              ))}
              {request.equipment.map((equip: Equipment) => {
                const Icon = getEquipmentIcon(equip.type)
                return (
                  <div
                    key={equip.id}
                    className='flex items-center gap-2 rounded border border-border bg-muted px-2 py-1'
                  >
                    <Icon className='h-4 w-4 text-blue-500' />
                    <div>
                      <div className='text-xs font-bold'>{equip.name}</div>
                      <div className='font-mono text-[10px] text-muted-foreground'>
                        {equip.code}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Conflict Warning */}
            {isConflict && request.conflictReason && (
              <div className='flex items-start gap-3 rounded border border-border bg-muted p-3'>
                <AlertCircle className='mt-0.5 h-4 w-4 shrink-0 text-orange-500' />
                <div className='text-xs'>
                  <span className='font-bold text-orange-500'>
                    Xung đột tài nguyên:
                  </span>{' '}
                  {request.conflictReason}
                  <div className='mt-1'>
                    <button className='font-medium text-primary hover:underline'>
                      Xem lịch xe này
                    </button>
                    <span className='mx-1 text-muted-foreground'>|</span>
                    <button className='font-medium text-foreground hover:underline'>
                      Chọn xe khác
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Workflow Stepper */}
            <div className={cn('pt-2', isConflict && 'pointer-events-none opacity-50')}>
              <div className='relative flex w-full items-center justify-between text-xs'>
                {/* Connector Line */}
                <div className='absolute left-0 right-0 top-1/2 z-0 h-0.5 -translate-y-1/2 bg-border' />

                {request.workflow.map((step, index) => (
                  <div
                    key={index}
                    className='relative z-10 flex flex-col items-center gap-1'
                  >
                    <div
                      className={cn(
                        'flex h-5 w-5 items-center justify-center rounded-full border-2',
                        step.status === 'completed' &&
                          'border-primary bg-primary text-primary-foreground',
                        step.status === 'current' &&
                          'border-primary bg-background text-primary',
                        step.status === 'pending' &&
                          'border-border bg-background text-muted-foreground',
                        step.status === 'current' && 'animate-pulse'
                      )}
                    >
                      {getStepIcon(step.step, step.status)}
                    </div>
                    <span
                      className={cn(
                        step.status === 'completed' && 'font-medium text-primary',
                        step.status === 'current' && 'font-bold text-primary',
                        step.status === 'pending' && 'text-muted-foreground'
                      )}
                    >
                      {step.label}
                      {step.note && ` (${step.note})`}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className='flex justify-end gap-2 border-t border-border/50 pt-2'>
              {isInUse && (
                <>
                  <Button
                    variant='ghost'
                    size='sm'
                    className='text-xs text-muted-foreground'
                    onClick={onReport}
                  >
                    <AlertTriangle className='mr-1 h-3 w-3' />
                    Báo cáo sự cố
                  </Button>
                  <Button
                    variant='outline'
                    size='sm'
                    className='border-primary/20 bg-primary/10 text-xs text-primary'
                    onClick={onReturn}
                  >
                    <RotateCcw className='mr-1 h-3 w-3' />
                    Trả thiết bị
                  </Button>
                </>
              )}
              {isPending && (
                <>
                  <Button
                    variant='ghost'
                    size='sm'
                    className='text-xs font-bold text-primary'
                    onClick={onApprove}
                  >
                    Duyệt nhanh
                  </Button>
                  <Button
                    variant='ghost'
                    size='sm'
                    className='text-xs text-destructive'
                    onClick={onReject}
                  >
                    Từ chối
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
