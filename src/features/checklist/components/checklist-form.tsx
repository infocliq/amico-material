import * as React from 'react'
import { useForm, useFieldArray, Control } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus, Trash2, Loader2, Save, ArrowLeft, Ellipsis } from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
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
import { Checkbox } from '@/components/ui/checkbox'
import { checklistSchema, ChecklistItem } from '../data/schema'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { createChecklist, updateChecklist } from '@/lib/checklist-service'
import { toast } from 'sonner'
import { useNavigate } from '@tanstack/react-router'
import { Badge } from '@/components/ui/badge'

interface ChecklistFormProps {
  initialData?: ChecklistItem
  isEdit?: boolean
}

export function ChecklistForm({ initialData, isEdit }: ChecklistFormProps) {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const form = useForm<ChecklistItem>({
    resolver: zodResolver(checklistSchema) as any,
    defaultValues: initialData || {
      id: '',
      modelNumber: '',
      departments: [
        {
          id: Math.random().toString(36).substring(7),
          name: 'Subs',
          isChecked: false,
          groups: [
            {
              id: Math.random().toString(36).substring(7),
              name: 'pipes',
              isChecked: false,
              items: [
                { id: Math.random().toString(36).substring(7), name: '1" emt pipe', isChecked: false, comment: '' },
                { id: Math.random().toString(36).substring(7), name: '1.2: emt pipe', isChecked: false, comment: '' }
              ]
            }
          ]
        }
      ],
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  })

  // Debug log for validation errors
  React.useEffect(() => {
    if (Object.keys(form.formState.errors).length > 0) {
      console.log('Form Validation Errors:', form.formState.errors)
    }
  }, [form.formState.errors])

  const { fields: deptFields, append: appendDept, remove: removeDept } = useFieldArray({
    control: form.control,
    name: 'departments',
  })

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: any) => {
      if (isEdit && initialData) {
        await updateChecklist(initialData.id || '', data)
        return
      }
      const { id, createdAt, updatedAt, ...rest } = data
      await createChecklist(rest as any)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['checklists'] })
      toast.success(isEdit ? 'Checklist updated' : 'Checklist created')
      navigate({ to: '/checklist' })
    },
    onError: (error: any) => {
      toast.error(error.message || 'Something went wrong.')
    },
  })

  function onSubmit(data: ChecklistItem) {
    mutate(data)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit as any)} className='space-y-8 max-w-5xl mx-auto text-black pb-20'>
        {/* Header matching Create page screenshot */}
        <div>
          <Button
            variant='ghost'
            size='sm'
            type="button"
            className='mb-3 h-7 gap-1 px-2 text-xs -ml-2 text-black font-medium'
            onClick={() => navigate({ to: '/checklist' })}
          >
            <ArrowLeft className='size-3' />
            Back to List
          </Button>

          <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
            <div className="flex-1">
              <div className='flex items-center gap-2'>
                <h2 className='text-3xl font-bold tracking-tight text-black'>
                  {isEdit ? 'Edit Checklist' : 'New Checklist'}
                </h2>
                <Badge variant='outline' className='rounded-full font-medium h-fit border-black text-black'>
                  {isEdit ? 'Active' : 'Draft'}
                </Badge>
              </div>
              <FormField
                control={form.control as any}
                name='modelNumber'
                render={({ field }) => (
                  <FormItem className='mt-2'>
                    <FormControl>
                      <Input 
                        placeholder='Model Number (e.g. HW)' 
                        {...field} 
                        className='h-8 text-md font-bold border-none p-0 focus-visible:ring-0 w-full max-w-md placeholder:text-black/30' 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className='flex gap-2 items-center'>
              <Button 
                type='submit'
                className='gap-1.5 bg-black text-white hover:bg-black/90 px-6 h-10 rounded-md font-bold'
                disabled={isPending}
              >
                {isPending ? <Loader2 className='size-4 animate-spin' /> : <Save className='size-4' />}
                {isEdit ? 'Save Changes' : 'Create Checklist'}
              </Button>
              <Button variant='outline' size='icon' className='border-black text-black size-10' type="button">
                <Ellipsis className='size-5' />
              </Button>
            </div>
          </div>
        </div>

        <div className='space-y-6 pt-6 border-t border-black/10'>
          <div className='flex items-center justify-between'>
            <h3 className='text-sm font-bold uppercase tracking-wider text-black'>
              DEPARTMENTS
            </h3>
            <Button
              type='button'
              variant='outline'
              size="sm"
              onClick={() => appendDept({
                id: Math.random().toString(36).substring(7),
                name: '',
                isChecked: false,
                groups: []
              })}
              className='h-8 text-xs border-black text-black px-4 rounded-md font-bold'
            >
              Add Department
            </Button>
          </div>

          <Accordion type='multiple' defaultValue={deptFields.map(d => d.id)} className='w-full'>
            {deptFields.map((dept, deptIndex) => (
              <AccordionItem key={dept.id} value={dept.id} className='border-none'>
                <div className='flex items-center gap-4'>
                  <AccordionTrigger className='hover:no-underline py-4 flex-1 justify-start gap-2'>
                    <FormField
                      control={form.control as any}
                      name={`departments.${deptIndex}.name`}
                      render={({ field }) => (
                        <FormItem className="flex-1 text-left" onClick={(e) => e.stopPropagation()}>
                          <FormControl>
                            <Input 
                              placeholder='Department Name' 
                              {...field} 
                              className='h-7 text-sm font-bold border-none p-0 focus-visible:ring-0' 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </AccordionTrigger>
                  <Button
                    type='button'
                    variant='ghost'
                    size='icon'
                    className='size-8 text-black hover:bg-black/5'
                    onClick={() => removeDept(deptIndex)}
                  >
                    <Trash2 className='size-4' />
                  </Button>
                </div>
                <AccordionContent>
                  <div className='py-4'>
                    <GroupsArray
                      control={form.control as any}
                      deptIndex={deptIndex}
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </form>
    </Form>
  )
}

function GroupsArray({ control, deptIndex }: { control: any, deptIndex: number }) {
  const { fields: groupFields, append: appendGroup, remove: removeGroup } = useFieldArray({
    control,
    name: `departments.${deptIndex}.groups`,
  })

  return (
    <div className='space-y-8'>
      {groupFields.map((group, groupIndex) => (
        <div key={group.id} className='space-y-4'>
          <div className='flex items-center justify-between group/header'>
            <FormField
              control={control}
              name={`departments.${deptIndex}.groups.${groupIndex}.name`}
              render={({ field }) => (
                <FormItem className='flex-1'>
                  <FormControl>
                    <Input 
                      placeholder='Sub Category name' 
                      {...field} 
                      className='h-7 text-xs font-bold border-none p-0 focus-visible:ring-0 tracking-widest' 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type='button'
              variant='ghost'
              size='icon'
              className='size-8 text-black opacity-0 group-hover/header:opacity-100 transition-opacity'
              onClick={() => removeGroup(groupIndex)}
            >
              <Trash2 className='size-4' />
            </Button>
          </div>

          <ItemsArray
            control={control}
            deptIndex={deptIndex}
            groupIndex={groupIndex}
          />
        </div>
      ))}

      <div className="flex justify-start pt-6 border-t border-black/5">
        <Button
          type='button'
          variant='link'
          size='sm'
          className='text-[10px] h-auto p-0 font-bold uppercase tracking-tighter text-black'
          onClick={() => appendGroup({
            id: Math.random().toString(36).substring(7),
            name: '',
            isChecked: false,
            items: []
          })}
        >
          + ADD SUB CATEGORY
        </Button>
      </div>
    </div>
  )
}

function ItemsArray({ control, deptIndex, groupIndex }: { control: any, deptIndex: number, groupIndex: number }) {
  const { fields: itemFields, append: appendItem, remove: removeItem } = useFieldArray({
    control,
    name: `departments.${deptIndex}.groups.${groupIndex}.items`,
  })

  return (
    <div className='space-y-2'>
      {itemFields.length > 0 && (
        <div className='border border-black/[0.03] rounded-md overflow-hidden bg-black/[0.01]'>
          {itemFields.map((item, itemIndex) => (
            <div key={item.id} className='flex items-center gap-2 group px-3 py-2 border-b border-black/[0.03] last:border-none'>
              <div className='w-8 flex justify-center'>
                <FormField
                  control={control}
                  name={`departments.${deptIndex}.groups.${groupIndex}.items.${itemIndex}.isChecked`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className='size-4 rounded-none border-black/40 data-[state=checked]:bg-black'
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={control}
                name={`departments.${deptIndex}.groups.${groupIndex}.items.${itemIndex}.name`}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input 
                        {...field} 
                        placeholder='Item name' 
                        className='h-6 text-sm font-medium border-none p-0 focus-visible:ring-0 bg-transparent' 
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name={`departments.${deptIndex}.groups.${groupIndex}.items.${itemIndex}.comment`}
                render={({ field }) => (
                  <FormItem className="w-1/3">
                    <FormControl>
                      <Input 
                        {...field} 
                        placeholder='Comment' 
                        className='h-6 text-[11px] border-none p-0 focus-visible:ring-0 italic bg-transparent text-right pr-2 text-black/40' 
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button
                type='button'
                variant='ghost'
                size='icon'
                className='size-6 text-black opacity-0 group-hover:opacity-100 transition-opacity'
                onClick={() => removeItem(itemIndex)}
              >
                <Trash2 className='size-3' />
              </Button>
            </div>
          ))}
        </div>
      )}
      <div className="pl-12">
        <Button
          type='button'
          variant='link'
          size='sm'
          className='text-[9px] h-auto p-0 font-bold uppercase tracking-tighter text-black'
          onClick={() => appendItem({ id: Math.random().toString(36).substring(7), name: '', isChecked: false, comment: '' })}
        >
          + ADD LINE ITEM
        </Button>
      </div>
    </div>
  )
}
