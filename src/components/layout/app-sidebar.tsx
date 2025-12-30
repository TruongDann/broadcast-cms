import { useMemo } from 'react'
import { useLayout } from '@/context/layout-provider'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar'
import { sidebarData } from './data/sidebar-data'
import { NavGroup } from './nav-group'
import { NavUser } from './nav-user'
import { TeamSwitcher } from './team-switcher'
import { useAuthStore, hasRole } from '@/stores/auth-store'
import { type NavGroup as NavGroupType } from './types'

export function AppSidebar() {
  const { collapsible, variant } = useLayout()
  const { user } = useAuthStore()

  // Filter navigation groups and items based on user role
  const filteredNavGroups = useMemo(() => {
    if (!user) return []

    return sidebarData.navGroups
      .filter((group) => {
        // If group has roles defined, check if user has access
        if (group.roles) {
          return hasRole(user, group.roles)
        }
        return true
      })
      .map((group): NavGroupType => {
        // Filter items within the group
        const filteredItems = group.items.filter((item) => {
          if (item.roles) {
            return hasRole(user, item.roles)
          }
          return true
        })

        return {
          ...group,
          items: filteredItems,
        }
      })
      .filter((group) => group.items.length > 0) // Remove empty groups
  }, [user])

  return (
    <Sidebar collapsible={collapsible} variant={variant}>
      <SidebarHeader>
        <TeamSwitcher teams={sidebarData.teams} />
      </SidebarHeader>
      <SidebarContent>
        {filteredNavGroups.map((props) => (
          <NavGroup key={props.title} {...props} />
        ))}
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
