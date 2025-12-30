import {
  LayoutDashboard,
  FileText,
  ScrollText,
  Database,
  Video,
  Share2,
  BarChart3,
  Settings,
  Users,
  Building2,
  Calculator,
  Wrench,
  Shield,
  Bell,
  Palette,
  Monitor,
  UserCog,
  Radio,
} from 'lucide-react'
import { type SidebarData } from '../types'

export const sidebarData: SidebarData = {
  user: {
    name: 'Loading...',
    email: '',
    avatar: '/avatars/shadcn.jpg',
  },
  teams: [
    {
      name: 'Đài PTTH Cần Thơ',
      logo: Radio,
      plan: 'Hệ thống số hóa',
    },
  ],
  navGroups: [
    {
      title: 'Tổng quan',
      items: [
        {
          title: 'Dashboard',
          url: '/',
          icon: LayoutDashboard,
        },
      ],
    },
    {
      title: 'Quy trình sản xuất',
      items: [
        {
          title: 'Đề Tài',
          icon: FileText,
          roles: ['admin', 'leadership', 'editor', 'reporter'],
          items: [
            {
              title: 'Danh Sách',
              url: '/topics',
            },
            {
              title: 'Đăng Ký Mới',
              url: '/topics/register',
            },
            {
              title: 'Duyệt Đề Tài',
              url: '/topics/review',
              roles: ['admin', 'leadership', 'editor'],
            },
          ],
        },
        {
          title: 'Kịch Bản',
          icon: ScrollText,
          roles: ['admin', 'leadership', 'editor', 'reporter'],
          items: [
            {
              title: 'Danh Sách',
              url: '/scripts',
            },
            {
              title: 'Tạo Kịch Bản',
              url: '/scripts/create',
            },
            {
              title: 'Duyệt Kịch Bản',
              url: '/scripts/review',
              roles: ['admin', 'leadership', 'editor'],
            },
          ],
        },
        {
          title: 'Kho Dữ Liệu',
          url: '/media-library',
          icon: Database,
        },
        {
          title: 'Thành Phẩm',
          icon: Video,
          items: [
            {
              title: 'Danh Sách',
              url: '/productions',
            },
            {
              title: 'Upload',
              url: '/productions/upload',
              roles: ['admin', 'leadership', 'editor', 'technician'],
            },
            {
              title: 'Duyệt & Phản Hồi',
              url: '/productions/review',
              roles: ['admin', 'leadership', 'editor'],
            },
          ],
        },
      ],
    },
    {
      title: 'Xuất bản & Báo cáo',
      items: [
        {
          title: 'Xuất Bản',
          icon: Share2,
          roles: ['admin', 'leadership', 'editor'],
          items: [
            {
              title: 'Tạo Bài Đăng',
              url: '/publishing/create',
            },
            {
              title: 'Duyệt & Xuất Bản',
              url: '/publishing/review',
              roles: ['admin', 'leadership'],
            },
            {
              title: 'Đã Xuất Bản',
              url: '/publishing/published',
            },
          ],
        },
        {
          title: 'Báo Cáo',
          icon: BarChart3,
          roles: ['admin', 'leadership', 'editor', 'reporter'],
          items: [
            {
              title: 'Tổng Hợp',
              url: '/reports',
            },
            {
              title: 'Nhuận Bút',
              url: '/reports/royalties',
            },
            {
              title: 'Cá Nhân',
              url: '/reports/personal',
            },
          ],
        },
      ],
    },
    {
      title: 'Quản trị',
      roles: ['admin'],
      items: [
        {
          title: 'Người Dùng',
          url: '/admin/users',
          icon: Users,
          roles: ['admin'],
        },
        {
          title: 'Phòng Ban',
          url: '/admin/departments',
          icon: Building2,
          roles: ['admin'],
        },
        {
          title: 'Công Thức Nhuận Bút',
          url: '/admin/royalty-formula',
          icon: Calculator,
          roles: ['admin'],
        },
        {
          title: 'Cấu Hình Hệ Thống',
          url: '/admin/settings',
          icon: Wrench,
          roles: ['admin'],
        },
      ],
    },
    {
      title: 'Cài đặt',
      items: [
        {
          title: 'Cài Đặt',
          icon: Settings,
          items: [
            {
              title: 'Hồ Sơ',
              url: '/settings',
              icon: UserCog,
            },
            {
              title: 'Tài Khoản',
              url: '/settings/account',
              icon: Shield,
            },
            {
              title: 'Giao Diện',
              url: '/settings/appearance',
              icon: Palette,
            },
            {
              title: 'Thông Báo',
              url: '/settings/notifications',
              icon: Bell,
            },
            {
              title: 'Hiển Thị',
              url: '/settings/display',
              icon: Monitor,
            },
          ],
        },
      ],
    },
  ],
}
