import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { createTicket, updateTicket } from '@/lib/tickets-service'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { type Ticket } from '../data/schema'
import { useAuth } from '@/hooks/use-auth'
import { useUsers } from '@/hooks/use-users'
import {
  CircleCheck,
  Clock,
  ArrowRight,
  CircleHelp,
  MessageSquare,
  LifeBuoy,
  Mail
} from 'lucide-react'

const stagingFormSchema = z.object({
  title: z.string().min(5, {
    message: 'Title must be at least 5 characters.',
  }),
  description: z.string().min(10, {
    message: 'Description must be at least 10 characters.',
  }),
  status: z.enum(['none', 'next', 'preparing', 'staged', 'done']).optional(),
  priority: z.string(),
  category: z.string(),
  assignee: z.string().optional(),
})

type StagingFormValues = z.infer<typeof stagingFormSchema>

export function StagingActionForm({
  initialData,
  onSuccess
}: {
  initialData?: Ticket | null
  onSuccess?: () => void
}) {
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [submittedId, setSubmittedId] = useState('')
  const queryClient = useQueryClient()
  const { user } = useAuth()
  const { data: users = [] } = useUsers()

  const activeUsers = users.filter(u => u.isActive)

  const form = useForm<StagingFormValues>({
    resolver: zodResolver(stagingFormSchema),
    defaultValues: initialData ? {
      title: initialData.title,
      description: initialData.description,
      status: initialData.status as any,
      priority: initialData.priority,
      category: initialData.category,
      assignee: initialData.assignee || '',
    } : {
      title: '',
      description: '',
      status: 'none',
      priority: 'medium',
      category: 'technical',
      assignee: '',
    },
  })

  async function onSubmit(data: StagingFormValues) {
    setIsLoading(true)
    try {
      if (initialData) {
        await updateTicket(initialData.id, data as any)
        toast.success('Staging record updated successfully.')
        queryClient.invalidateQueries({ queryKey: ['tickets'] })
        onSuccess?.()
      } else {
        const newId = await createTicket({
          ...data,
          status: data.status || 'next',
          requestedBy: user?.displayName || 'Unknown',
          requestedByEmail: user?.email || '',
          createdBy: user?.uid || 'system',
        } as any)
        setSubmittedId(newId)
        setIsSubmitted(true)
        queryClient.invalidateQueries({ queryKey: ['tickets'] })
      }
    } catch (error) {
      toast.error((error as Error).message || 'Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className='animate-in fade-in slide-in-from-bottom-4 duration-500'>
        <div className='overflow-hidden rounded-lg bg-card text-card-foreground'>
          <div className='border-b px-4 py-5 text-center sm:text-left'>
            <div className='flex flex-col items-center gap-4 sm:flex-row'>
              <div className='flex size-10 items-center justify-center rounded-full bg-primary/10'>
                <CircleCheck className='size-5 text-primary' />
              </div>
              <div className='flex-1'>
                <h2 className='text-sm font-medium text-foreground'>Staging Entry Created</h2>
                <p className='mt-1 text-xs text-muted-foreground leading-relaxed'>
                  The record has been added to the staging pipeline. Our team will review the requirements and move it forward.
                </p>
              </div>
              <div className='hidden sm:block'>
                <div className='rounded-md border bg-muted/50 px-2.5 py-1'>
                  <p className='text-[10px] font-medium uppercase tracking-wider text-muted-foreground'>Record ID</p>
                  <p className='text-sm font-mono font-bold'>#{submittedId.slice(0, 6).toUpperCase()}</p>
                </div>
              </div>
            </div>
          </div>

          <div className='border-b px-4 py-4 bg-muted/20'>
            <div className='flex items-start gap-4'>
              <div className='flex size-8 shrink-0 items-center justify-center rounded-lg border bg-background text-muted-foreground'>
                <Clock className='size-4' />
              </div>
              <div className='space-y-1'>
                <p className='text-sm font-medium leading-none'>Pipeline Integration</p>
                <p className='text-xs text-muted-foreground leading-relaxed'>
                  This entry is now visible in the <span className='font-bold text-foreground'>Staging Dashboard</span>. You can track its progress and assign team members from the main view.
                </p>
              </div>
            </div>
          </div>

          <div className='border-b px-4 py-4'>
            <div className='mb-4'>
              <span className='text-[10px] font-semibold text-muted-foreground'>Next Steps</span>
            </div>
            <div className='grid gap-3'>
              <div className='flex items-center gap-4 rounded-md border p-3 transition-colors hover:bg-muted/50 cursor-pointer group'>
                <div className='flex size-8 shrink-0 items-center justify-center rounded-full bg-muted'>
                  <CircleHelp className='size-4 text-muted-foreground' />
                </div>
                <div className='flex-1'>
                  <p className='text-sm font-medium leading-none'>Review Guidelines</p>
                  <p className='mt-1 text-xs text-muted-foreground'>Check the production staging standards.</p>
                </div>
                <ArrowRight className='size-3 text-muted-foreground/50 group-hover:text-primary' />
              </div>

              <div className='flex items-center gap-4 rounded-md border p-3 transition-colors hover:bg-muted/50 cursor-pointer group'>
                <div className='flex size-8 shrink-0 items-center justify-center rounded-full bg-muted'>
                  <MessageSquare className='size-4 text-muted-foreground' />
                </div>
                <div className='flex-1'>
                  <p className='text-sm font-medium leading-none'>Internal Discussion</p>
                  <p className='mt-1 text-xs text-muted-foreground'>Collaborate with the team on this record.</p>
                </div>
                <ArrowRight className='size-3 text-muted-foreground/50 group-hover:text-primary' />
              </div>

              <div className='flex items-center gap-4 rounded-md border p-3 transition-colors hover:bg-muted/50 cursor-pointer group'>
                <div className='flex size-8 shrink-0 items-center justify-center rounded-full bg-muted'>
                  <LifeBuoy className='size-4 text-muted-foreground' />
                </div>
                <div className='flex-1'>
                  <p className='text-sm font-medium leading-none'>System Resources</p>
                  <p className='mt-1 text-xs text-muted-foreground'>Access manufacturing drawings and specs.</p>
                </div>
                <ArrowRight className='size-3 text-muted-foreground/50 group-hover:text-primary' />
              </div>
            </div>
          </div>

          <div className='px-4 py-3 flex items-center justify-between bg-muted/50'>
            <div className='flex items-center gap-2'>
              <div className='size-1.5 rounded-full bg-emerald-500 animate-pulse' />
              <p className='text-[10px] text-muted-foreground uppercase opacity-80'>System Operational</p>
            </div>
            <Button variant='outline' size='sm' className='h-8 text-xs gap-1.5' onClick={() => onSuccess?.()}>
              View Dashboard
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
        <div className='grid gap-6 py-4'>
          <FormField
            control={form.control}
            name='title'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
                  Entry Title
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder='Describe the staging requirement'
                    className='bg-muted/30 focus-visible:ring-1'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className='grid grid-cols-2 gap-4'>
            <FormField
              control={form.control}
              name='priority'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
                    Priority
                  </FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className='bg-muted/30'>
                        <SelectValue placeholder='Select priority' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value='urgent'>
                        <div className='flex items-center gap-2'>
                          <span className='size-1.5 rounded-full bg-red-500' /> Urgent
                        </div>
                      </SelectItem>
                      <SelectItem value='high'>
                        <div className='flex items-center gap-2'>
                          <span className='size-1.5 rounded-full bg-amber-500' /> High
                        </div>
                      </SelectItem>
                      <SelectItem value='medium'>
                        <div className='flex items-center gap-2'>
                          <span className='size-1.5 rounded-full bg-blue-500' /> Medium
                        </div>
                      </SelectItem>
                      <SelectItem value='low'>
                        <div className='flex items-center gap-2'>
                          <span className='size-1.5 rounded-full bg-zinc-400' /> Low
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='category'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
                    Category
                  </FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className='bg-muted/30'>
                        <SelectValue placeholder='Select category' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value='billing'>Billing</SelectItem>
                      <SelectItem value='technical'>Technical</SelectItem>
                      <SelectItem value='account'>Account</SelectItem>
                      <SelectItem value='feature-request'>Feature Request</SelectItem>
                      <SelectItem value='other'>Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name='assignee'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
                  Assign To
                </FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className='bg-muted/30'>
                      <SelectValue placeholder='Select team member' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value='unassigned'>
                      <span className='text-muted-foreground'>Unassigned</span>
                    </SelectItem>
                    {activeUsers.map((u) => (
                      <SelectItem key={u.uid} value={u.displayName || u.email}>
                        {u.displayName || u.email}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {initialData && (
            <FormField
              control={form.control}
              name='status'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
                    Status
                  </FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className='bg-muted/30'>
                        <SelectValue placeholder='Select status' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value='none'>None</SelectItem>
                      <SelectItem value='next'>Next</SelectItem>
                      <SelectItem value='preparing'>Preparing</SelectItem>
                      <SelectItem value='staged'>Staged</SelectItem>
                      <SelectItem value='done'>Done</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <FormField
            control={form.control}
            name='description'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
                  Description
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder='Provide details about the staging requirement...'
                    className='min-h-[120px] resize-none bg-muted/30 focus-visible:ring-1'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className='flex gap-3 justify-end pt-4 border-t'>
          <Button type='submit' className='w-full sm:w-auto px-8 font-medium' disabled={isLoading}>
            {isLoading ? 'Saving...' : initialData ? 'Update Record' : 'Create Record'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
