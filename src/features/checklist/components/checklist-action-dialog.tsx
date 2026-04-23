import * as React from 'react'
import { useForm, useFieldArray, Control } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus, Trash2, Loader2, ChevronRight, LayoutGrid, Building2, Package } from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { Checkbox } from '@/components/ui/checkbox'
import { useChecklist } from './checklist-provider'
import { checklistSchema, ChecklistItem } from '../data/schema'
import { cn } from '@/lib/utils'
import { ScrollArea } from '@/components/ui/scroll-area'
import { createChecklist, updateChecklist } from '@/lib/checklist-service'
import { toast } from 'sonner'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

export function ChecklistActionDialog() {
  const { open, setOpen, currentRow, setCurrentRow } = useChecklist()
  const isEdit = open === 'edit'
  const queryClient = useQueryClient()

  const form = useForm<ChecklistItem>({
    resolver: zodResolver(checklistSchema),
    defaultValues: {
      modelNumber: '',
      departments: [],
      status: 'pending',
    }
  })

  const { fields: deptFields, append: appendDept, remove: removeDept } = useFieldArray({
    control: form.control,
    name: 'departments',
  })

  React.useEffect(() => {
    if (open === 'edit' && currentRow) {
      form.reset(currentRow)
    } else if (open === 'create') {
      form.reset({
        id: '',
        modelNumber: '',
        departments: [
          {
            id: Math.random().toString(36).substring(7),
            name: 'Subs',
            groups: [
              {
                id: Math.random().toString(36).substring(7),
                name: 'pipes',
                items: [
                  { id: Math.random().toString(36).substring(7), name: '1" emt pipe', isChecked: false, comment: '' },
                  { id: Math.random().toString(36).substring(7), name: '1.2: emt pipe', isChecked: false, comment: '' }
                ]
              },
              {
                id: Math.random().toString(36).substring(7),
                name: 'boxes',
                items: [
                   { id: Math.random().toString(36).substring(7), name: 'Standard Box', isChecked: false, comment: '' }
                ]
              },
              {
                id: Math.random().toString(36).substring(7),
                name: 'wires',
                items: [
                   { id: Math.random().toString(36).substring(7), name: 'Copper Wire', isChecked: false, comment: '' }
                ]
              }
            ]
          }
        ],
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
    }
  }, [open, currentRow, form])

  const { mutate, isPending } = useMutation({
    mutationFn: (data: ChecklistItem) => {
      if (isEdit && currentRow) {
        return updateChecklist(currentRow.id, data)
      }
      const { id, createdAt, updatedAt, ...rest } = data
      return createChecklist(rest as any)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['checklists'] })
      setOpen(null)
      setCurrentRow(null)
      form.reset()
      toast.success(isEdit ? 'Checklist updated' : 'Checklist created')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Something went wrong.')
    },
  })

  function onSubmit(data: ChecklistItem) {
    mutate(data)
  }

  return (
    <Dialog
      open={open === 'create' || open === 'edit'}
      onOpenChange={(v) => {
        if (!v) {
          setOpen(null)
          setCurrentRow(null)
          form.reset()
        }
      }}
    >
      <DialogContent className='sm:max-w-4xl max-h-[90vh] flex flex-col'>
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Checklist' : 'Create New Checklist'}</DialogTitle>
          <DialogDescription>
            Configure departments, groups, and parts for the model.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6 flex-1 overflow-hidden flex flex-col'>
            <div className='flex-1 overflow-y-auto px-1'>
              <FormField
                control={form.control}
                name='modelNumber'
                render={({ field }) => (
                  <FormItem className='mb-6'>
                    <FormLabel>Model Number</FormLabel>
                    <FormControl>
                      <Input placeholder='e.g. Modal4593' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className='space-y-4'>
                <div className='flex items-center justify-between border-b pb-2'>
                  <h3 className='text-lg font-semibold flex items-center gap-2'>
                    <Building2 className='size-5 text-primary' />
                    Departments
                  </h3>
                  <Button
                    type='button'
                    variant='outline'
                    size='sm'
                    className='h-8 gap-1.5'
                    onClick={() => appendDept({
                      id: Math.random().toString(36).substring(7),
                      name: '',
                      groups: [{
                        id: Math.random().toString(36).substring(7),
                        name: '',
                        items: [{ id: Math.random().toString(36).substring(7), name: '', isChecked: false }]
                      }]
                    })}
                  >
                    <Plus className='size-3.5' />
                    Add Department
                  </Button>
                </div>

                <Accordion type='multiple' className='w-full'>
                  {deptFields.map((dept, deptIndex) => (
                    <AccordionItem key={dept.id} value={dept.id} className='border rounded-lg mb-4 px-4 bg-muted/30'>
                      <div className='flex items-center gap-4 py-2'>
                        <AccordionTrigger className='hover:no-underline py-2 flex-1'>
                          <div className='flex items-center gap-2'>
                             <span className='font-bold text-primary'>#{deptIndex + 1}</span>
                             <span>{form.watch(`departments.${deptIndex}.name`) || 'New Department'}</span>
                          </div>
                        </AccordionTrigger>
                        <Button
                          type='button'
                          variant='ghost'
                          size='icon'
                          className='size-8 text-destructive hover:bg-destructive/10'
                          onClick={() => removeDept(deptIndex)}
                          disabled={deptFields.length === 1}
                        >
                          <Trash2 className='size-4' />
                        </Button>
                      </div>
                      <AccordionContent>
                        <div className='space-y-6 pb-4'>
                          <FormField
                            control={form.control}
                            name={`departments.${deptIndex}.name`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Department Name</FormLabel>
                                <FormControl>
                                  <Input placeholder='e.g. Subs' {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <GroupsArray
                            control={form.control}
                            deptIndex={deptIndex}
                            form={form}
                          />
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </div>

            <DialogFooter className='pt-4 border-t'>
              <Button variant='outline' type='button' onClick={() => setOpen(null)}>Cancel</Button>
              <Button type='submit' className='gap-2' disabled={isPending}>
                {isPending && <Loader2 className='size-4 animate-spin' />}
                {isEdit ? 'Save Changes' : 'Create Checklist'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

function GroupsArray({ control, deptIndex, form }: { control: Control<ChecklistItem>, deptIndex: number, form: any }) {
  const { fields: groupFields, append: appendGroup, remove: removeGroup } = useFieldArray({
    control,
    name: `departments.${deptIndex}.groups`,
  })

  return (
    <div className='space-y-4 pl-4 border-l-2 border-primary/20'>
      <div className='flex items-center justify-between'>
        <h4 className='text-sm font-semibold flex items-center gap-2'>
          <LayoutGrid className='size-4 text-primary' />
          Groups / Categories
        </h4>
        <Button
          type='button'
          variant='secondary'
          size='sm'
          className='h-7 gap-1'
          onClick={() => appendGroup({
            id: Math.random().toString(36).substring(7),
            name: '',
            items: [{ id: Math.random().toString(36).substring(7), name: '', isChecked: false }]
          })}
        >
          <Plus className='size-3' />
          Add Group
        </Button>
      </div>

      {groupFields.map((group, groupIndex) => (
        <div key={group.id} className='bg-background border rounded-md p-4 space-y-4 shadow-sm'>
          <div className='flex items-center gap-3'>
            <FormField
              control={control}
              name={`departments.${deptIndex}.groups.${groupIndex}.name`}
              render={({ field }) => (
                <FormItem className='flex-1'>
                  <FormControl>
                    <Input placeholder='Group name (e.g. pipes)' {...field} className='h-8 font-medium' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type='button'
              variant='ghost'
              size='icon'
              className='size-8 text-destructive hover:bg-destructive/10'
              onClick={() => removeGroup(groupIndex)}
              disabled={groupFields.length === 1}
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
    </div>
  )
}

function ItemsArray({ control, deptIndex, groupIndex }: { control: Control<ChecklistItem>, deptIndex: number, groupIndex: number }) {
  const { fields: itemFields, append: appendItem, remove: removeItem } = useFieldArray({
    control,
    name: `departments.${deptIndex}.groups.${groupIndex}.items`,
  })

  return (
    <div className='space-y-2'>
       <div className='flex items-center justify-between px-1'>
        <span className='text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1'>
          <Package className='size-3' />
          Checklist Items
        </span>
        <Button
          type='button'
          variant='ghost'
          size='sm'
          className='h-6 px-2 text-[10px] gap-1'
          onClick={() => appendItem({ id: Math.random().toString(36).substring(7), name: '', isChecked: false, comment: '' })}
        >
          <Plus className='size-3' />
          Add Item
        </Button>
      </div>

      <div className='rounded-md border overflow-hidden bg-muted/10'>
        <table className='w-full text-xs'>
          <thead className='bg-muted/50 border-b'>
            <tr>
              <th className='w-10 py-2 px-2 text-left'>Check</th>
              <th className='py-2 px-2 text-left'>Item Name</th>
              <th className='py-2 px-2 text-left'>Comment</th>
              <th className='w-10 py-2 px-2'></th>
            </tr>
          </thead>
          <tbody className='divide-y'>
            {itemFields.map((item, itemIndex) => (
              <tr key={item.id} className='hover:bg-muted/5'>
                <td className='py-2 px-2 text-center align-middle'>
                  <FormField
                    control={control}
                    name={`departments.${deptIndex}.groups.${groupIndex}.items.${itemIndex}.isChecked`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </td>
                <td className='py-2 px-2'>
                  <FormField
                    control={control}
                    name={`departments.${deptIndex}.groups.${groupIndex}.items.${itemIndex}.name`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input {...field} placeholder='Item name' className='h-7 text-xs border-transparent hover:border-input focus:border-input bg-transparent' />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </td>
                <td className='py-2 px-2'>
                  <FormField
                    control={control}
                    name={`departments.${deptIndex}.groups.${groupIndex}.items.${itemIndex}.comment`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input {...field} placeholder='Comment' className='h-7 text-xs border-transparent hover:border-input focus:border-input bg-transparent' />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </td>
                <td className='py-2 px-2 text-center'>
                   <Button
                    type='button'
                    variant='ghost'
                    size='icon'
                    className='size-6 text-destructive hover:bg-destructive/10'
                    onClick={() => removeItem(itemIndex)}
                    disabled={itemFields.length === 1}
                  >
                    <Trash2 className='size-3' />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
