import { useState } from 'react'
import { Download, RefreshCw, Clock } from 'lucide-react'
import { useAuthStore } from '@/stores/auth-store'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import {
  ContractsTable,
  CostsTable,
  RoyaltyTable,
  TopicsTable,
} from './components/data-tables'
import {
  ArticlesByMonthChart,
  TopEmployeesCard,
  RoyaltyByMonthChart,
} from './components/overview-charts'

const tabs = [
  { id: 'overview', label: 'Tổng quan' },
  { id: 'topics', label: 'Đề tài' },
  { id: 'royalty', label: 'Nhuận bút/Thù lao' },
  { id: 'costs', label: 'Chi phí Doanh số' },
  { id: 'contracts', label: 'Hợp đồng' },
]

export function Dashboard() {
  const { user } = useAuthStore()
  const [activeTab, setActiveTab] = useState('overview')

  return (
    <>
      {/* ===== Top Heading ===== */}
      <Header>
        <div className='flex items-center gap-2'>
          <span className='text-lg font-semibold'>
            Xin chào, {user?.name?.split(' ').pop()}!
          </span>
        </div>
        <div className='ms-auto flex items-center space-x-4'>
          <Search />
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      {/* ===== Main ===== */}
      <Main>
        <div className='mb-6 flex flex-wrap items-end justify-between gap-4'>
          <div>
            <div className='flex items-center gap-3'>
              <h1 className='text-2xl leading-tight font-bold tracking-tight'>
                Thống kê Quản lý Đề tài
              </h1>
            </div>
            <div className='mt-1.5 flex items-center gap-2 text-sm text-muted-foreground'>
              <p>Theo dõi &amp; báo cáo hoạt động của toàn soạn</p>
            </div>
          </div>
          <div className='flex gap-3'>
            <div className='mr-2 flex items-center gap-2 rounded-lg border bg-muted/50 px-3 py-2 text-xs font-medium text-muted-foreground'>
              <Clock className='h-4 w-4' />
              Cập nhật lần cuối:{' '}
              <span className='font-bold text-foreground'>10:45 AM</span>
            </div>
            <Button variant='outline' size='sm'>
              <Download className='h-4 w-4' />
              Xuất Excel
            </Button>
            <Button size='sm'>
              <RefreshCw className='h-4 w-4' />
              Làm mới dữ liệu
            </Button>
          </div>
        </div>

        {/* Tab Navigation + Filter Bar */}
        <div className='mt-4 flex items-center justify-between gap-4 border-b'>
          {/* Tabs */}
          <div className='flex shrink-0 gap-6 overflow-x-auto'>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'relative px-1 pb-3 text-sm whitespace-nowrap transition-colors',
                  activeTab === tab.id
                    ? 'font-bold text-primary'
                    : 'font-medium text-muted-foreground hover:text-foreground'
                )}
              >
                {tab.label}
                <span
                  className={cn(
                    'absolute bottom-0 left-0 h-[3px] rounded-t-full transition-all',
                    activeTab === tab.id
                      ? 'w-full bg-primary'
                      : 'w-0 bg-muted-foreground/30 opacity-0 group-hover:w-full group-hover:opacity-100'
                  )}
                />
              </button>
            ))}
          </div>

          {/* Filter Bar */}
          <div className='flex flex-wrap items-center gap-2 pb-3'>
            <Button variant='outline' size='sm' className='h-7 gap-1.5 text-xs'>
              <span className='text-muted-foreground'>Thời gian:</span>
              <span className='font-semibold'>Tháng này</span>
              <svg
                className='h-3 w-3'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M19 9l-7 7-7-7'
                />
              </svg>
            </Button>
            <Button variant='outline' size='sm' className='h-7 gap-1.5 text-xs'>
              <span className='text-muted-foreground'>Phòng ban:</span>
              <span className='font-semibold'>Tất cả</span>
              <svg
                className='h-3 w-3'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M19 9l-7 7-7-7'
                />
              </svg>
            </Button>
            <Button variant='outline' size='sm' className='h-7 gap-1.5 text-xs'>
              <span className='text-muted-foreground'>Trạng thái:</span>
              <span className='font-semibold'>Tất cả</span>
              <svg
                className='h-3 w-3'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M19 9l-7 7-7-7'
                />
              </svg>
            </Button>
          </div>
        </div>

        {/* Tab Content */}
        <div className='mt-6'>
          {activeTab === 'overview' && (
            <div className='space-y-4'>
              {/* Stats Cards */}
              <div className='grid grid-cols-2 gap-4 lg:grid-cols-4'>
                {/* Card 1 - Tổng đề tài */}
                <div className='rounded-xl border bg-card p-5 shadow-sm'>
                  <div className='flex h-full flex-col justify-between'>
                    <div className='mb-4 flex items-start justify-between'>
                      <div>
                        <p className='mb-1 text-[11px] font-bold tracking-wider text-muted-foreground uppercase'>
                          TỔNG ĐỀ TÀI
                        </p>
                        <h3 className='text-4xl font-extrabold tracking-tight'>
                          48
                        </h3>
                      </div>
                      <div className='rounded-lg border bg-muted/50 p-2.5 text-muted-foreground'>
                        <svg
                          className='h-6 w-6'
                          fill='none'
                          stroke='currentColor'
                          viewBox='0 0 24 24'
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2'
                          />
                        </svg>
                      </div>
                    </div>
                    <div className='flex items-center gap-2'>
                      <span className='flex items-center gap-1 text-xs font-bold text-emerald-600'>
                        <svg
                          className='h-4 w-4'
                          fill='none'
                          stroke='currentColor'
                          viewBox='0 0 24 24'
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M13 7h8m0 0v8m0-8l-8 8-4-4-6 6'
                          />
                        </svg>
                        +12%
                      </span>
                      <span className='text-xs text-muted-foreground'>
                        so với tháng trước
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card 2 - Tổng tin bài */}
                <div className='rounded-xl border bg-card p-5 shadow-sm'>
                  <div className='flex h-full flex-col justify-between'>
                    <div className='mb-4 flex items-start justify-between'>
                      <div>
                        <p className='mb-1 text-[11px] font-bold tracking-wider text-muted-foreground uppercase'>
                          TỔNG TIN BÀI
                        </p>
                        <h3 className='text-4xl font-extrabold tracking-tight'>
                          256
                        </h3>
                      </div>
                      <div className='rounded-lg border bg-muted/50 p-2.5 text-muted-foreground'>
                        <svg
                          className='h-6 w-6'
                          fill='none'
                          stroke='currentColor'
                          viewBox='0 0 24 24'
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z'
                          />
                        </svg>
                      </div>
                    </div>
                    <div className='flex items-center gap-2'>
                      <span className='flex items-center gap-1 text-xs font-bold text-emerald-600'>
                        <svg
                          className='h-4 w-4'
                          fill='none'
                          stroke='currentColor'
                          viewBox='0 0 24 24'
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M13 7h8m0 0v8m0-8l-8 8-4-4-6 6'
                          />
                        </svg>
                        +8%
                      </span>
                      <span className='text-xs text-muted-foreground'>
                        so với tháng trước
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card 3 - Nhuận bút */}
                <div className='rounded-xl border bg-card p-5 shadow-sm'>
                  <div className='flex h-full flex-col justify-between'>
                    <div className='mb-4 flex items-start justify-between'>
                      <div>
                        <p className='mb-1 text-[11px] font-bold tracking-wider text-muted-foreground uppercase'>
                          NHUẬN BÚT
                        </p>
                        <h3 className='text-4xl font-extrabold tracking-tight'>
                          125.5M
                        </h3>
                      </div>
                      <div className='rounded-lg border bg-muted/50 p-2.5 text-muted-foreground'>
                        <svg
                          className='h-6 w-6'
                          fill='none'
                          stroke='currentColor'
                          viewBox='0 0 24 24'
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                          />
                        </svg>
                      </div>
                    </div>
                    <div className='flex items-center gap-2'>
                      <span className='text-xs text-muted-foreground'>
                        VNĐ trong tháng
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card 4 - Doanh số HĐ */}
                <div className='rounded-xl border bg-card p-5 shadow-sm'>
                  <div className='flex h-full flex-col justify-between'>
                    <div className='mb-4 flex items-start justify-between'>
                      <div>
                        <p className='mb-1 text-[11px] font-bold tracking-wider text-muted-foreground uppercase'>
                          DOANH SỐ HĐ
                        </p>
                        <h3 className='text-4xl font-extrabold tracking-tight'>
                          890M
                        </h3>
                      </div>
                      <div className='rounded-lg border bg-muted/50 p-2.5 text-muted-foreground'>
                        <svg
                          className='h-6 w-6'
                          fill='none'
                          stroke='currentColor'
                          viewBox='0 0 24 24'
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
                          />
                        </svg>
                      </div>
                    </div>
                    <div className='flex items-center gap-2'>
                      <span className='text-xs text-muted-foreground'>
                        VNĐ trong tháng
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Chart Tin bài */}
              <ArticlesByMonthChart />

              {/* Top employees + Royalty chart */}
              <div className='grid gap-4 lg:grid-cols-2'>
                <TopEmployeesCard />
                <RoyaltyByMonthChart />
              </div>
            </div>
          )}
          {activeTab === 'topics' && <TopicsTable />}
          {activeTab === 'royalty' && <RoyaltyTable />}
          {activeTab === 'costs' && <CostsTable />}
          {activeTab === 'contracts' && <ContractsTable />}
        </div>
      </Main>
    </>
  )
}
