import { createFileRoute } from '@tanstack/react-router'
import TopicsPage from '@/features/topics'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { ConfigDrawer } from '@/components/config-drawer'

export const Route = createFileRoute('/_authenticated/topics/')({
  component: TopicsRoute,
})

function TopicsRoute() {
  return (
    <>
      <Header>
        <div className='flex items-center gap-2'>
          <span className='text-lg font-semibold'>Quản Lý Đề Tài</span>
        </div>
        <div className='ms-auto flex items-center space-x-4'>
          <Search />
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>
      <Main>
        <TopicsPage />
      </Main>
    </>
  )
}
