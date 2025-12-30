'use client'

import { ExternalLink } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

// Data cho Top 5 nhân viên có nhuận bút cao nhất
const topEmployeesData = [
  {
    id: 1,
    name: 'Hoàng Văn E',
    department: 'Ban Thời sự',
    mail: 'hoangvan@viettel.com',
    amount: 15000000,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=HoangE',
  },
  {
    id: 2,
    name: 'Trần Thị B',
    department: 'Ban Văn nghệ',
    mail: 'tranthi@viettel.com',
    amount: 12300000,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=TranB',
  },
  {
    id: 3,
    name: 'Phạm Thị D',
    department: 'Kỹ thuật',
    mail: 'phamthi@viettel.com',
    amount: 9800000,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=PhamD',
  },
]

const departmentColors: Record<string, string> = {
  'Ban Thời sự':
    'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  'Ban Văn nghệ':
    'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  'Ban Kinh tế':
    'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  'Kỹ thuật':
    'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
}

export function TopEmployeesCard() {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN').format(amount) + 'đ'
  }

  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between pb-3'>
        <CardTitle className='text-base'>Top Nhân Viên Nhuận Bút</CardTitle>
        <Button variant='outline' size='sm' className='gap-1.5 text-xs'>
          <ExternalLink className='size-3.5' />
          Xem chi tiết
        </Button>
      </CardHeader>
      <CardContent className='pt-0'>
        {/* Table Header */}
        <div className='grid grid-cols-12 gap-2 bg-muted/50 px-3 py-2 text-xs font-medium text-muted-foreground'>
          <div className='col-span-6'>Nhân viên</div>
          <div className='col-span-3'>Phòng ban</div>
          <div className='col-span-3 text-right'>Nhuận bút</div>
        </div>
        {/* Table Body */}
        <div className='divide-y'>
          {topEmployeesData.map((employee) => (
            <div
              key={employee.id}
              className='grid grid-cols-12 gap-2 px-3 py-3 transition-colors hover:bg-muted/30'
            >
              {/* Avatar + Name */}
              <div className='col-span-6 flex items-center gap-2.5'>
                <div className='relative'>
                  <Avatar className='size-9'>
                    <AvatarImage src={employee.avatar} alt={employee.name} />
                    <AvatarFallback className='bg-primary/10 text-xs font-medium'>
                      {employee.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .slice(-2)}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className='min-w-0'>
                  <p className='truncate text-sm font-medium'>
                    {employee.name}
                  </p>
                  <p className='text-xs text-muted-foreground'>
                    {employee.mail}
                  </p>
                </div>
              </div>
              {/* Department */}
              <div className='col-span-3 flex items-center'>
                <span
                  className={`inline-flex items-center rounded-full px-4 py-2 text-xs font-medium ${departmentColors[employee.department] || 'bg-gray-100 text-gray-700'}`}
                >
                  {employee.department}
                </span>
              </div>
              {/* Amount */}
              <div className='col-span-3 flex items-center justify-end'>
                <span className='text-dark text-sm font-semibold dark:text-white'>
                  {formatCurrency(employee.amount)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
