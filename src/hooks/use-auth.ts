// src/hooks/use-auth.ts
// Separated from auth-provider.tsx to satisfy Vite Fast Refresh:
// files must export only components OR only non-components, not both.

export { useAuth, useRequirePermission, useRequireRole } from '@/context/auth-provider'
