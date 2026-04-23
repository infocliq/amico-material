import { UseFormReturn } from 'react-hook-form'
import { z } from 'zod'
import { format } from 'date-fns'
import {
  Calendar as CalendarIcon,
  ALargeSmall,
  Hash,
  FileDigit,
  CalendarDays,
  Package,
  Factory,
  Headphones,
  FileText,
  Activity,
  Layout,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { projectStatuses } from '../data/data'

export const projectFormSchema = z.object({
  salesOrder: z.string().min(1, { message: 'Sales Order is required.' }),
  workOrder: z.string().min(1, { message: 'Work Order is required.' }),
  shipDate: z.date({ required_error: 'Ship date is required.' }),
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  quantity: z.coerce.number().min(1, { message: 'Quantity must be at least 1.' }),
  productionStart: z.date({ required_error: 'Production start date is required.' }),
  supportStart: z.date({ required_error: 'Support start date is required.' }),
  drawing: z.string().min(1, { message: 'Drawing reference is required.' }),
  productType: z.string().optional(),
  status: z.enum(['none', 'next', 'preparing', 'staged', 'done']),
})

export type ProjectFormValues = z.infer<typeof projectFormSchema>

interface ProjectFormProps {
  form: UseFormReturn<ProjectFormValues>
  onSubmit: (values: ProjectFormValues) => void
}

const FieldGroup = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <div role='group' data-slot='field' data-orientation='vertical' className={cn('group/field flex w-full gap-3 flex-col [&>*]:w-full [&>.sr-only]:w-auto', className)}>
    {children}
  </div>
)

const FieldLabel = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <label data-slot='field-label' className={cn('items-center text-sm font-medium select-none peer-disabled:cursor-not-allowed peer-disabled:opacity-50 flex w-fit gap-2 leading-snug group-data-[disabled=true]/field:opacity-50 has-[>[data-slot=field]]:w-full has-[>[data-slot=field]]:flex-col has-[>[data-slot=field]]:rounded-md has-[>[data-slot=field]]:border [&>*]:data-[slot=field]:p-4 has-data-[state=checked]:bg-primary/5 has-data-[state=checked]:border-primary dark:has-data-[state=checked]:bg-primary/10', className)}>
    {children}
  </label>
)

const FieldContent = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <div data-slot='field-content' className={cn('group/field-content flex flex-1 flex-col gap-1.5 leading-snug', className)}>
    {children}
  </div>
)

export function ProjectForm({ form, onSubmit }: ProjectFormProps) {
  return (
    <div className='mx-auto w-full max-w-4xl pb-20'>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} id='project-form' className='p-0'>
          <fieldset data-slot='field-set' className='flex flex-col gap-6'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <FormField
                control={form.control}
                name='salesOrder'
                render={({ field }) => (
                  <FieldGroup>
                    <FieldLabel><Hash className='size-4 text-muted-foreground' /> Sales Order</FieldLabel>
                    <FieldContent>
                      <FormControl>
                        <Input {...field} placeholder='SO-12345' className='h-10' />
                      </FormControl>
                      <FormMessage />
                    </FieldContent>
                  </FieldGroup>
                )}
              />
              <FormField
                control={form.control}
                name='workOrder'
                render={({ field }) => (
                  <FieldGroup>
                    <FieldLabel><FileDigit className='size-4 text-muted-foreground' /> Work Order</FieldLabel>
                    <FieldContent>
                      <FormControl>
                        <Input {...field} placeholder='WO-67890' className='h-10' />
                      </FormControl>
                      <FormMessage />
                    </FieldContent>
                  </FieldGroup>
                )}
              />
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FieldGroup>
                    <FieldLabel><ALargeSmall className='size-4 text-muted-foreground' /> Name</FieldLabel>
                    <FieldContent>
                      <FormControl>
                        <Input {...field} placeholder='Project Name' className='h-10' />
                      </FormControl>
                      <FormMessage />
                    </FieldContent>
                  </FieldGroup>
                )}
              />
              <FormField
                control={form.control}
                name='productType'
                render={({ field }) => (
                  <FieldGroup>
                    <FieldLabel><Layout className='size-4 text-muted-foreground' /> Product Type</FieldLabel>
                    <FieldContent>
                      <FormControl>
                        <Input {...field} placeholder='e.g. Mechanical, Medical' className='h-10' />
                      </FormControl>
                      <FormMessage />
                    </FieldContent>
                  </FieldGroup>
                )}
              />
              <FormField
                control={form.control}
                name='status'
                render={({ field }) => (
                  <FieldGroup>
                    <FieldLabel><Activity className='size-4 text-muted-foreground' /> Status</FieldLabel>
                    <FieldContent>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className='h-10'>
                            <SelectValue placeholder='Select status' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {projectStatuses.map(status => (
                            <SelectItem key={status.value} value={status.value}>
                              <div className='flex items-center gap-2'>
                                {status.icon && <status.icon className='size-3.5 text-muted-foreground' />}
                                {status.label}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FieldContent>
                  </FieldGroup>
                )}
              />
              <FormField
                control={form.control}
                name='quantity'
                render={({ field }) => (
                  <FieldGroup>
                    <FieldLabel><Package className='size-4 text-muted-foreground' /> Quantity</FieldLabel>
                    <FieldContent>
                      <FormControl>
                        <Input {...field} type='number' className='h-10' />
                      </FormControl>
                      <FormMessage />
                    </FieldContent>
                  </FieldGroup>
                )}
              />
              <FormField
                control={form.control}
                name='shipDate'
                render={({ field }) => (
                  <FieldGroup>
                    <FieldLabel><CalendarDays className='size-4 text-muted-foreground' /> Ship Date</FieldLabel>
                    <FieldContent>
                      <Popover modal={true}>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button variant='outline' className={cn('h-10 justify-start text-left font-normal', !field.value && 'text-muted-foreground')}>
                              <CalendarIcon className='mr-2 h-4 w-4' />
                              {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className='w-auto p-0' align='start'>
                          <Calendar mode='single' selected={field.value} onSelect={field.onChange} />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FieldContent>
                  </FieldGroup>
                )}
              />
              <FormField
                control={form.control}
                name='productionStart'
                render={({ field }) => (
                  <FieldGroup>
                    <FieldLabel><Factory className='size-4 text-muted-foreground' /> Production Start</FieldLabel>
                    <FieldContent>
                      <Popover modal={true}>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button variant='outline' className={cn('h-10 justify-start text-left font-normal', !field.value && 'text-muted-foreground')}>
                              <CalendarIcon className='mr-2 h-4 w-4' />
                              {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className='w-auto p-0' align='start'>
                          <Calendar mode='single' selected={field.value} onSelect={field.onChange} />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FieldContent>
                  </FieldGroup>
                )}
              />
              <FormField
                control={form.control}
                name='supportStart'
                render={({ field }) => (
                  <FieldGroup>
                    <FieldLabel><Headphones className='size-4 text-muted-foreground' /> Support Start</FieldLabel>
                    <FieldContent>
                      <Popover modal={true}>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button variant='outline' className={cn('h-10 justify-start text-left font-normal', !field.value && 'text-muted-foreground')}>
                              <CalendarIcon className='mr-2 h-4 w-4' />
                              {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className='w-auto p-0' align='start'>
                          <Calendar mode='single' selected={field.value} onSelect={field.onChange} />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FieldContent>
                  </FieldGroup>
                )}
              />
              <FormField
                control={form.control}
                name='drawing'
                render={({ field }) => (
                  <FieldGroup>
                    <FieldLabel><FileText className='size-4 text-muted-foreground' /> Drawing</FieldLabel>
                    <FieldContent>
                      <FormControl>
                        <Input {...field} placeholder='DWG-789' className='h-10' />
                      </FormControl>
                      <FormMessage />
                    </FieldContent>
                  </FieldGroup>
                )}
              />
            </div>
          </fieldset>
        </form>
      </Form>
    </div>
  )
}
