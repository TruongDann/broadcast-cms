'use client'

import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

// Data cho biểu đồ nhuận bút theo tháng (stacked bar)
const royaltyByMonthData = [
  { name: 'T1', ekip: 45, caNhan: 28 },
  { name: 'T2', ekip: 52, caNhan: 35 },
  { name: 'T3', ekip: 48, caNhan: 32 },
  { name: 'T4', ekip: 61, caNhan: 40 },
  { name: 'T5', ekip: 55, caNhan: 38 },
  { name: 'T6', ekip: 67, caNhan: 45 },
  { name: 'T7', ekip: 72, caNhan: 48 },
]

const royaltyChartConfig = {
  ekip: {
    label: 'Ekip',
    color: 'var(--chart-2)',
  },
  caNhan: {
    label: 'Cá nhân',
    color: 'var(--chart-5)',
  },
} satisfies ChartConfig

export function RoyaltyByMonthChart() {
  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between pb-2'>
        <CardTitle className='text-base'>Nhuận Bút Theo Tháng</CardTitle>
        <Select defaultValue='2024'>
          <SelectTrigger className='h-8 w-[100px]'>
            <SelectValue placeholder='Năm' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='2024'>2024</SelectItem>
            <SelectItem value='2023'>2023</SelectItem>
            <SelectItem value='2022'>2022</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        {/* Legend */}
        <div className='mb-4 flex items-center gap-4'>
          <div className='flex items-center gap-1.5'>
            <span
              className='size-2.5 rounded-full'
              style={{ backgroundColor: 'var(--chart-2)' }}
            />
            <span className='text-xs text-muted-foreground'>Ekip</span>
          </div>
          <div className='flex items-center gap-1.5'>
            <span
              className='size-2.5 rounded-full'
              style={{ backgroundColor: 'var(--chart-5)' }}
            />
            <span className='text-xs text-muted-foreground'>Cá nhân</span>
          </div>
        </div>

        {/* Chart */}
        <ChartContainer
          config={royaltyChartConfig}
          className='h-[200px] w-full'
        >
          <BarChart accessibilityLayer data={royaltyByMonthData}>
            <CartesianGrid vertical={false} strokeDasharray='3 3' />
            <XAxis
              dataKey='name'
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              fontSize={12}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Bar
              dataKey='ekip'
              stackId='a'
              fill='var(--color-ekip)'
              radius={[0, 0, 0, 0]}
            />
            <Bar
              dataKey='caNhan'
              stackId='a'
              fill='var(--color-caNhan)'
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
