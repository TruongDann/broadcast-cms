import { Navigate } from '@tanstack/react-router'
import { useAuthStore, Role, hasRole } from '@/stores/auth-store'

interface RoleGuardProps {
  allowedRoles: Role[]
  children: React.ReactNode
  fallback?: React.ReactNode
}

/**
 * RoleGuard - Protects routes based on user roles
 * 
 * Usage:
 * <RoleGuard allowedRoles={['admin', 'leadership']}>
 *   <ProtectedContent />
 * </RoleGuard>
 */
export function RoleGuard({
  allowedRoles,
  children,
  fallback,
}: RoleGuardProps) {
  const { user, isAuthenticated } = useAuthStore()

  // Not authenticated - redirect to login
  if (!isAuthenticated || !user) {
    return <Navigate to="/sign-in" />
  }

  // Check if user has required role
  if (!hasRole(user, allowedRoles)) {
    // Use custom fallback or redirect to 403
    if (fallback) {
      return <>{fallback}</>
    }
    return <Navigate to="/403" />
  }

  return <>{children}</>
}

/**
 * Hook to check if current user has specific roles
 */
export function useRoleCheck(allowedRoles: Role[]): boolean {
  const { user } = useAuthStore()
  return hasRole(user, allowedRoles)
}

/**
 * Component that renders content conditionally based on role
 */
interface RoleBasedProps {
  allowedRoles: Role[]
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function RoleBased({
  allowedRoles,
  children,
  fallback = null,
}: RoleBasedProps) {
  const hasAccess = useRoleCheck(allowedRoles)
  return hasAccess ? <>{children}</> : <>{fallback}</>
}
