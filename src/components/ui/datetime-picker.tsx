'use client'

import * as React from 'react'
import { format, setHours, setMinutes } from 'date-fns'
import { vi } from 'date-fns/locale'
import { CalendarIcon, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'

interface DateTimePickerProps {
  value?: Date
  onChange?: (date: Date | undefined) => void
  disabled?: boolean
  placeholder?: string
  disablePastDates?: boolean
}

export function DateTimePicker({
  value,
  onChange,
  disabled,
  placeholder = 'Chọn ngày giờ',
  disablePastDates = true,
}: DateTimePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false)

  const hours = Array.from({ length: 24 }, (_, i) => i)
  const minutes = Array.from({ length: 12 }, (_, i) => i * 5)

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      // Preserve existing time or set to current time
      const newDate = new Date(date)
      if (value) {
        newDate.setHours(value.getHours())
        newDate.setMinutes(value.getMinutes())
      } else {
        // Set to current time rounded to nearest 5 minutes
        const now = new Date()
        newDate.setHours(now.getHours())
        newDate.setMinutes(Math.ceil(now.getMinutes() / 5) * 5)
      }
      onChange?.(newDate)
    } else {
      onChange?.(undefined)
    }
  }

  const handleTimeChange = (type: 'hour' | 'minute', val: number) => {
    const newDate = value ? new Date(value) : new Date()
    if (type === 'hour') {
      onChange?.(setHours(newDate, val))
    } else {
      onChange?.(setMinutes(newDate, val))
    }
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          disabled={disabled}
          className={cn(
            'w-full justify-start text-left font-normal',
            !value && 'text-muted-foreground'
          )}
        >
          <CalendarIcon className='mr-2 h-4 w-4' />
          {value ? (
            format(value, 'dd/MM/yyyy HH:mm', { locale: vi })
          ) : (
            <span>{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-auto p-0' align='start'>
        <div className='flex'>
          {/* Calendar */}
          <Calendar
            mode='single'
            selected={value}
            onSelect={handleDateSelect}
            disabled={
              disablePastDates
                ? (date) => date < new Date(new Date().setHours(0, 0, 0, 0))
                : undefined
            }
            initialFocus
          />

          {/* Time Picker */}
          <div className='flex flex-col border-l'>
            <div className='flex items-center justify-center gap-1 border-b px-3 py-2'>
              <Clock className='h-4 w-4 text-muted-foreground' />
              <span className='text-sm font-medium'>Giờ</span>
            </div>
            <div className='flex divide-x'>
              {/* Hours */}
              <ScrollArea className='h-[280px] w-[60px]'>
                <div className='flex flex-col p-1'>
                  {hours.map((hour) => (
                    <Button
                      key={hour}
                      variant={value?.getHours() === hour ? 'default' : 'ghost'}
                      size='sm'
                      className={cn(
                        'w-full justify-center text-sm',
                        value?.getHours() === hour &&
                          'bg-primary text-primary-foreground'
                      )}
                      onClick={() => handleTimeChange('hour', hour)}
                    >
                      {String(hour).padStart(2, '0')}
                    </Button>
                  ))}
                </div>
              </ScrollArea>

              {/* Minutes */}
              <ScrollArea className='h-[280px] w-[60px]'>
                <div className='flex flex-col p-1'>
                  {minutes.map((minute) => (
                    <Button
                      key={minute}
                      variant={
                        value?.getMinutes() === minute ? 'default' : 'ghost'
                      }
                      size='sm'
                      className={cn(
                        'w-full justify-center text-sm',
                        value?.getMinutes() === minute &&
                          'bg-primary text-primary-foreground'
                      )}
                      onClick={() => handleTimeChange('minute', minute)}
                    >
                      {String(minute).padStart(2, '0')}
                    </Button>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className='flex items-center justify-between border-t p-3'>
          <Button
            variant='ghost'
            size='sm'
            onClick={() => {
              const now = new Date()
              now.setMinutes(Math.ceil(now.getMinutes() / 5) * 5)
              onChange?.(now)
            }}
          >
            Bây giờ
          </Button>
          <Button size='sm' onClick={() => setIsOpen(false)}>
            Xong
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
