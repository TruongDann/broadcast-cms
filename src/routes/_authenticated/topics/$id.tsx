import { createFileRoute } from '@tanstack/react-router'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import TopicDetailPage from '@/features/topics/detail'

export const Route = createFileRoute('/_authenticated/topics/$id')({
  component: TopicDetailRoute,
})

function TopicDetailRoute() {
  return (
    <>
      <Header>
        <div className='flex items-center gap-2'>
          <span className='text-lg font-semibold'>Chi Tiết Đề Tài</span>
        </div>
        <div className='ms-auto flex items-center space-x-4'>
          <Search />
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>
      <Main>
        <TopicDetailPage />
      </Main>
    </>
  )
}
