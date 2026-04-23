import * as React from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import { updateChecklist } from '@/lib/checklist-service'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { ChecklistItem } from '../data/schema'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useNavigate, Link } from '@tanstack/react-router'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { ArrowLeft, Save, Ellipsis } from 'lucide-react'

interface ChecklistViewProps {
  data: ChecklistItem
}

export function ChecklistView({ data }: ChecklistViewProps) {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const [localData, setLocalData] = React.useState(data)

  // Keep local data in sync with query data
  React.useEffect(() => {
    setLocalData(data)
  }, [data])

  const { mutate } = useMutation({
    mutationFn: (updateData: any) => {
      return updateChecklist(data.id || '', updateData)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['checklist', data.id] })
      toast.success('Sync successful')
    },
    onError: (error: any) => {
      toast.error('Failed to update: ' + error.message)
    }
  })

  const handleToggleItem = (deptIndex: number, groupIndex: number, itemIndex: number, checked: boolean) => {
    const newDepartments = JSON.parse(JSON.stringify(localData.departments))
    newDepartments[deptIndex].groups[groupIndex].items[itemIndex].isChecked = checked
    
    setLocalData({ ...localData, departments: newDepartments })
    mutate({ departments: newDepartments })
  }

  const handleToggleGroup = (deptIndex: number, groupIndex: number, checked: boolean) => {
    const newDepartments = JSON.parse(JSON.stringify(localData.departments))
    const group = newDepartments[deptIndex].groups[groupIndex]
    
    group.isChecked = checked
    group.items.forEach((item: any) => {
      item.isChecked = checked
    })
    
    setLocalData({ ...localData, departments: newDepartments })
    mutate({ departments: newDepartments })
  }

  const handleToggleDepartment = (deptIndex: number, checked: boolean) => {
    const newDepartments = JSON.parse(JSON.stringify(localData.departments))
    const dept = newDepartments[deptIndex]
    
    dept.isChecked = checked
    dept.groups.forEach((group: any) => {
      group.isChecked = checked
      group.items.forEach((item: any) => {
        item.isChecked = checked
      })
    })
    
    setLocalData({ ...localData, departments: newDepartments })
    mutate({ departments: newDepartments })
  }

  const isGroupChecked = (deptIndex: number, groupIndex: number) => {
    const group = localData.departments[deptIndex].groups[groupIndex]
    if (!group.items || group.items.length === 0) return !!group.isChecked
    return group.items.every(item => item.isChecked)
  }

  const isGroupIndeterminate = (deptIndex: number, groupIndex: number) => {
    const group = localData.departments[deptIndex].groups[groupIndex]
    if (!group.items || group.items.length === 0) return false
    const checkedCount = group.items.filter(item => item.isChecked).length
    return checkedCount > 0 && checkedCount < group.items.length
  }

  const isDeptChecked = (deptIndex: number) => {
    const dept = localData.departments[deptIndex]
    const allGroups = dept.groups || []
    if (allGroups.length === 0) return !!dept.isChecked
    
    const allItems = allGroups.flatMap(g => g.items || [])
    if (allItems.length === 0) {
      return allGroups.every(g => g.isChecked)
    }
    return allItems.every(item => item.isChecked)
  }

  const isDeptIndeterminate = (deptIndex: number) => {
    const dept = localData.departments[deptIndex]
    const allGroups = dept.groups || []
    const allItems = allGroups.flatMap(g => g.items || [])
    
    if (allItems.length === 0) {
      const checkedGroups = allGroups.filter(g => g.isChecked).length
      return checkedGroups > 0 && checkedGroups < allGroups.length
    }
    
    const checkedCount = allItems.filter(item => item.isChecked).length
    return checkedCount > 0 && checkedCount < allItems.length
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Page Header matching Project View */}
      <div>
        <Button
          variant='ghost'
          size='sm'
          className='mb-3 h-7 gap-1 px-2 text-xs -ml-2 text-black font-medium'
          onClick={() => navigate({ to: '/checklist' })}
        >
          <ArrowLeft className='size-3' />
          Back to List
        </Button>

        <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
          <div>
            <div className='flex items-center gap-2'>
              <h2 className='text-3xl font-bold tracking-tight text-black'>
                {localData.modelNumber}
              </h2>
              <Badge variant='outline' className='rounded-full font-medium h-fit border-black text-black'>
                {localData.status === 'completed' ? 'Completed' : 'Active'}
              </Badge>
            </div>
            <p className='mt-1 text-black/60 text-sm'>
              Detailed manufacturing and parts verification checklist.
            </p>
          </div>
          <div className='flex gap-2 items-center'>
            <Button 
              className='gap-1.5 bg-black text-white hover:bg-black/90'
              asChild
            >
              <Link to='/checklist/$id/edit' params={{ id: localData.id || '' }}>
                <Save className='size-4' />
                Edit Checklist
              </Link>
            </Button>
            <Button variant='outline' size='icon' className='border-black text-black'>
              <Ellipsis className='size-5' />
            </Button>
          </div>
        </div>
      </div>

      <div className="pt-4">
        <Accordion type="multiple" className="w-full">
          {localData.departments.map((dept, deptIdx) => (
            <AccordionItem key={dept.id} value={dept.id} className="border-b border-black/10">
              <div className="flex items-center justify-between relative group">
                <AccordionTrigger className="hover:no-underline py-6 flex-1 justify-start gap-3 [&[data-state=open]>svg]:rotate-180">
                  <h3 className="text-sm font-bold tracking-wide text-black text-left">
                    {dept.name}
                  </h3>
                </AccordionTrigger>
                <Checkbox 
                  id={`dept-${dept.id}`}
                  checked={isDeptChecked(deptIdx) ? true : isDeptIndeterminate(deptIdx) ? 'indeterminate' : false}
                  onCheckedChange={(checked) => 
                    handleToggleDepartment(deptIdx, !!checked)
                  }
                  className="size-5 rounded-none border-black data-[state=checked]:bg-black data-[state=checked]:text-white absolute right-12 top-1/2 -translate-y-1/2 z-10"
                />
              </div>
              <AccordionContent>
                <Accordion type="multiple" className="w-full">
                  {dept.groups.map((group, groupIdx) => {
                    const hasItems = group.items && group.items.length > 0
                    
                    if (!hasItems) {
                      return (
                        <div key={group.id} className="flex items-center justify-between py-3 border-none relative">
                           <div className="flex-1 py-1">
                              <h4 className="text-sm font-bold text-black">{group.name}</h4>
                           </div>
                           <Checkbox 
                              id={`group-${group.id}`}
                              checked={isGroupChecked(deptIdx, groupIdx)}
                              onCheckedChange={(checked) => 
                                handleToggleGroup(deptIdx, groupIdx, !!checked)
                              }
                              className="size-5 rounded-none border-black data-[state=checked]:bg-black data-[state=checked]:text-white absolute right-12 top-1/2 -translate-y-1/2 z-10"
                            />
                        </div>
                      )
                    }

                    return (
                      <AccordionItem key={group.id} value={group.id} className="border-none">
                        <div className="flex items-center justify-between relative group">
                          <AccordionTrigger className="hover:no-underline py-2 flex-1 justify-start gap-3 [&[data-state=open]>svg]:rotate-180">
                            <label 
                              htmlFor={`group-${group.id}`}
                              className="text-sm font-bold text-black cursor-pointer"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {group.name}
                            </label>
                          </AccordionTrigger>
                          <Checkbox 
                            id={`group-${group.id}`}
                            checked={isGroupChecked(deptIdx, groupIdx) ? true : isGroupIndeterminate(deptIdx, groupIdx) ? 'indeterminate' : false}
                            onCheckedChange={(checked) => 
                              handleToggleGroup(deptIdx, groupIdx, !!checked)
                            }
                            className="size-5 rounded-none border-black data-[state=checked]:bg-black data-[state=checked]:text-white absolute right-12 top-1/2 -translate-y-1/2 z-10"
                          />
                        </div>
                        
                        <AccordionContent className="pb-4">
                          <div className="grid gap-1">
                            {group.items.map((item, itemIdx) => (
                              <div 
                                key={item.id} 
                                className="flex items-center gap-3 py-1 group cursor-pointer"
                                onClick={() => handleToggleItem(deptIdx, groupIdx, itemIdx, !item.isChecked)}
                              >
                                <Checkbox 
                                  id={`item-${item.id}`}
                                  checked={item.isChecked} 
                                  onCheckedChange={(checked) => 
                                    handleToggleItem(deptIdx, groupIdx, itemIdx, !!checked)
                                  }
                                  className="size-4 rounded-none border-black data-[state=checked]:bg-black data-[state=checked]:text-white"
                                  onClick={(e) => e.stopPropagation()}
                                />
                                <div className="space-y-0 text-left border-b border-black/5 flex-1">
                                  <label 
                                    htmlFor={`item-${item.id}`}
                                    className="text-sm font-medium text-black cursor-pointer"
                                  >
                                    {item.name}
                                  </label>
                                  {item.comment && (
                                    <p className="text-[11px] text-black italic leading-none pb-1">{item.comment}</p>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    )
                  })}
                </Accordion>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      <div className="pt-12 text-center">
        <p className="text-[10px] text-black font-bold tracking-widest uppercase">
          Last Synchronized: {new Date(localData.updatedAt || Date.now()).toLocaleTimeString()}
        </p>
      </div>
    </div>
  )
}
