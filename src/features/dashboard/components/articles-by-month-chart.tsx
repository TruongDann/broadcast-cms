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

// Data cho biểu đồ tin bài theo tháng
const articlesByMonthData = [
  { name: 'T1', approved: 45, pending: 12, needFix: 5 },
  { name: 'T2', approved: 52, pending: 8, needFix: 3 },
  { name: 'T3', approved: 48, pending: 15, needFix: 7 },
  { name: 'T4', approved: 61, pending: 10, needFix: 4 },
  { name: 'T5', approved: 55, pending: 12, needFix: 6 },
  { name: 'T6', approved: 67, pending: 9, needFix: 2 },
  { name: 'T7', approved: 72, pending: 14, needFix: 5 },
  { name: 'T8', approved: 65, pending: 11, needFix: 4 },
  { name: 'T9', approved: 78, pending: 8, needFix: 3 },
  { name: 'T10', approved: 82, pending: 13, needFix: 6 },
  { name: 'T11', approved: 75, pending: 10, needFix: 4 },
  { name: 'T12', approved: 88, pending: 15, needFix: 5 },
]

const articleChartConfig = {
  approved: {
    label: 'Đã duyệt',
    color: 'var(--chart-2)',
  },
  pending: {
    label: 'Chờ duyệt',
    color: 'var(--chart-4)',
  },
  needFix: {
    label: 'Cần bổ sung',
    color: 'var(--chart-5)',
  },
} satisfies ChartConfig

export function ArticlesByMonthChart() {
  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between pb-2'>
        <CardTitle className='text-base'>Tin Bài Theo Tháng</CardTitle>
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
        <ChartContainer
          config={articleChartConfig}
          className='h-[300px] w-full'
        >
          <BarChart accessibilityLayer data={articlesByMonthData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey='name'
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Bar dataKey='approved' fill='var(--color-approved)' radius={4} />
            <Bar dataKey='pending' fill='var(--color-pending)' radius={4} />
            <Bar dataKey='needFix' fill='var(--color-needFix)' radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
