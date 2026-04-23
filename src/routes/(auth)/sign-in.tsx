import { z } from 'zod'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { SignIn2 as SignIn } from '@/features/auth/sign-in/sign-in-2'
import { redirectIfAuth } from '@/lib/auth-guards'

const searchSchema = z.object({
  redirect: z.string().optional(),
})

export const Route = createFileRoute('/(auth)/sign-in')({
  beforeLoad: () => redirectIfAuth(),
  component: SignIn,
  validateSearch: searchSchema,
})
