import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Role types for the broadcast management system
export type Role = 'admin' | 'leadership' | 'editor' | 'reporter' | 'technician'

export interface User {
  id: string
  name: string
  email: string
  role: Role
  departmentId?: string
  departmentName?: string
  avatar?: string
}

export const MOCK_USERS: User[] = [
  {
    id: '1',
    name: 'Nguyễn Văn Admin',
    email: 'admin@canthotv.vn',
    role: 'admin',
    departmentId: 'it',
    departmentName: 'Phòng IT',
    avatar: '',
  },
  {
    id: '2',
    name: 'Trần Thị Lãnh Đạo',
    email: 'lanhdao@canthotv.vn',
    role: 'leadership',
    departmentId: 'editorial',
    departmentName: 'Ban Biên Tập',
    avatar: '',
  },
  {
    id: '3',
    name: 'Lê Văn Biên Tập',
    email: 'bientap@canthotv.vn',
    role: 'editor',
    departmentId: 'news',
    departmentName: 'Phòng Thời Sự',
    avatar: '',
  },
  {
    id: '4',
    name: 'Phạm Thị Phóng Viên',
    email: 'phongvien@canthotv.vn',
    role: 'reporter',
    departmentId: 'news',
    departmentName: 'Phòng Thời Sự',
    avatar: '',
  },
  {
    id: '5',
    name: 'Hoàng Văn Kỹ Thuật',
    email: 'kythuat@canthotv.vn',
    role: 'technician',
    departmentId: 'technical',
    departmentName: 'Phòng Kỹ Thuật',
    avatar: '',
  },
]

// Role display names in Vietnamese
export const ROLE_LABELS: Record<Role, string> = {
  admin: 'Quản trị viên',
  leadership: 'Lãnh đạo',
  editor: 'Biên tập viên',
  reporter: 'Phóng viên',
  technician: 'Kỹ thuật viên',
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  setUser: (user: User | null) => void
  login: (userId: string) => boolean
  logout: () => void
  switchRole: (userId: string) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: MOCK_USERS[0], // Default to admin for development
      isAuthenticated: true, // Auto-authenticated for mock

      setUser: (user) =>
        set(() => ({
          user,
          isAuthenticated: !!user,
        })),

      login: (userId: string) => {
        const user = MOCK_USERS.find((u) => u.id === userId)
        if (user) {
          set({ user, isAuthenticated: true })
          return true
        }
        return false
      },

      logout: () =>
        set(() => ({
          user: null,
          isAuthenticated: false,
        })),

      // Quick role switching for testing
      switchRole: (userId: string) => {
        const user = MOCK_USERS.find((u) => u.id === userId)
        if (user) {
          set({ user })
        }
      },
    }),
    {
      name: 'auth-storage',
    }
  )
)

// Helper function to check if user has required role
export function hasRole(user: User | null, allowedRoles: Role[]): boolean {
  if (!user) return false
  return allowedRoles.includes(user.role)
}

// Helper function to check if user can access department data
export function canAccessDepartment(
  user: User | null,
  departmentId: string
): boolean {
  if (!user) return false
  if (user.role === 'admin' || user.role === 'leadership') return true
  return user.departmentId === departmentId
}
