
import { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
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
import { createRole } from '@/lib/auth-service'

const roleSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters.'),
  description: z.string().optional(),
})

type RoleFormValues = z.infer<typeof roleSchema>

export function RoleActionDialog() {
  const [open, setOpen] = useState(false)
  const queryClient = useQueryClient()
  
  const form = useForm<RoleFormValues>({
    resolver: zodResolver(roleSchema),
    defaultValues: {
      title: '',
      description: '',
    },
  })

  async function onSubmit(data: RoleFormValues) {
    try {
      await createRole({
        title: data.title,
        description: data.description,
        permissions: [], // Start with no permissions
      })
      
      toast.success('Role created successfully')
      await queryClient.invalidateQueries({ queryKey: ['roles'] })
      setOpen(false)
      form.reset()
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      toast.error('Failed to create role', {
        description: message
      })
      console.error('Role creation error:', error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className='flex h-full min-h-[110px] flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-slate-200 p-4 transition-colors hover:bg-slate-50 hover:border-slate-300'>
          <div className='flex h-8 w-8 items-center justify-center rounded-full bg-slate-100'>
            <Plus className='h-4 w-4 text-slate-600' />
          </div>
          <span className='text-sm font-semibold text-slate-600'>Add new role</span>
        </button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Add New Role</DialogTitle>
          <DialogDescription>
            Create a new administrative role. You can configure its permissions later.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='title'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role Title</FormLabel>
                  <FormControl>
                    <Input placeholder='e.g. Moderator' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder='Briefly describe the responsibilities of this role...' 
                      className='resize-none'
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type='button' variant='outline' onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type='submit' disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'Creating...' : 'Create Role'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
