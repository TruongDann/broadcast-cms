import { useState } from 'react'
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

// Mock data for topic registration trends
const generateChartData = (days: number) => {
  const data = []
  const now = new Date()
  for (let i = days; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)
    data.push({
      date: date.toLocaleDateString('vi-VN', { day: '2-digit', month: 'short' }),
      topics: Math.floor(Math.random() * 50) + 20,
      approved: Math.floor(Math.random() * 30) + 10,
    })
  }
  return data
}

const chartData7Days = generateChartData(7)
const chartData30Days = generateChartData(30)
const chartData90Days = generateChartData(90)

const chartConfig = {
  topics: {
    label: 'Đề tài đăng ký',
    color: 'hsl(var(--chart-1))',
  },
  approved: {
    label: 'Đã duyệt',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig

type TimePeriod = '7days' | '30days' | '90days'

export function TopicsChart() {
  const [period, setPeriod] = useState<TimePeriod>('30days')

  const getChartData = () => {
    switch (period) {
      case '7days':
        return chartData7Days
      case '90days':
        return chartData90Days
      default:
        return chartData30Days
    }
  }

  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between pb-2'>
        <div>
          <CardTitle>Tổng Đề Tài Đăng Ký</CardTitle>
          <CardDescription>Thống kê theo thời gian</CardDescription>
        </div>
        <Tabs value={period} onValueChange={(v) => setPeriod(v as TimePeriod)}>
          <TabsList className='h-8'>
            <TabsTrigger value='90days' className='text-xs px-3'>
              3 tháng
            </TabsTrigger>
            <TabsTrigger value='30days' className='text-xs px-3'>
              30 ngày
            </TabsTrigger>
            <TabsTrigger value='7days' className='text-xs px-3'>
              7 ngày
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent className='pt-0'>
        <ChartContainer config={chartConfig} className='h-[250px] w-full'>
          <AreaChart
            data={getChartData()}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id='fillTopics' x1='0' y1='0' x2='0' y2='1'>
                <stop
                  offset='5%'
                  stopColor='var(--color-topics)'
                  stopOpacity={0.8}
                />
                <stop
                  offset='95%'
                  stopColor='var(--color-topics)'
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id='fillApproved' x1='0' y1='0' x2='0' y2='1'>
                <stop
                  offset='5%'
                  stopColor='var(--color-approved)'
                  stopOpacity={0.8}
                />
                <stop
                  offset='95%'
                  stopColor='var(--color-approved)'
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray='3 3' className='stroke-muted' />
            <XAxis
              dataKey='date'
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              className='text-xs'
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              className='text-xs'
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator='dot' />}
            />
            <Area
              dataKey='approved'
              type='monotone'
              fill='url(#fillApproved)'
              stroke='var(--color-approved)'
              stackId='a'
            />
            <Area
              dataKey='topics'
              type='monotone'
              fill='url(#fillTopics)'
              stroke='var(--color-topics)'
              stackId='b'
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
