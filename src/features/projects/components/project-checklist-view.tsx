import * as React from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import { updateProject } from '@/lib/projects-service'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Project } from '../data/schema'

interface ProjectChecklistViewProps {
  project: Project
}

export function ProjectChecklistView({ project }: ProjectChecklistViewProps) {
  const queryClient = useQueryClient()
  const [localChecklist, setLocalChecklist] = React.useState(project.checklist)

  // Keep local state in sync with prop
  React.useEffect(() => {
    setLocalChecklist(project.checklist)
  }, [project.checklist])

  const { mutate, isPending } = useMutation({
    mutationFn: (newChecklist: any) => {
      return updateProject(project.id, { checklist: newChecklist } as any)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      toast.success('Checklist updated')
    },
    onError: (error: any) => {
      toast.error('Failed to update: ' + error.message)
    }
  })

  // Auto-initialize if checklistId exists but checklist data is missing
  React.useEffect(() => {
    if (!project.checklist && project.checklistId && !isPending) {
      const initChecklist = async () => {
        const { getChecklist } = await import('@/lib/checklist-service')
        const template = await getChecklist(project.checklistId!)
        if (template) {
          mutate(template)
        }
      }
      initChecklist()
    }
  }, [project.checklist, project.checklistId, mutate, isPending])

  if (!localChecklist && !isPending) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-muted-foreground">No checklist assigned to this project.</p>
        <p className="text-xs text-muted-foreground mt-1">Assign a checklist in the table view first.</p>
      </div>
    )
  }

  if (isPending && !localChecklist) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-muted-foreground">Initializing checklist...</p>
      </div>
    )
  }

  const handleToggleItem = (deptIndex: number, groupIndex: number, itemIndex: number, checked: boolean) => {
    const newChecklist = JSON.parse(JSON.stringify(localChecklist))
    newChecklist.departments[deptIndex].groups[groupIndex].items[itemIndex].isChecked = checked
    
    setLocalChecklist(newChecklist)
    mutate(newChecklist)
  }

  const handleToggleGroup = (deptIndex: number, groupIndex: number, checked: boolean) => {
    const newChecklist = JSON.parse(JSON.stringify(localChecklist))
    const group = newChecklist.departments[deptIndex].groups[groupIndex]
    
    group.isChecked = checked
    group.items.forEach((item: any) => {
      item.isChecked = checked
    })
    
    setLocalChecklist(newChecklist)
    mutate(newChecklist)
  }

  const handleToggleDepartment = (deptIndex: number, checked: boolean) => {
    const newChecklist = JSON.parse(JSON.stringify(localChecklist))
    const dept = newChecklist.departments[deptIndex]
    
    dept.isChecked = checked
    dept.groups.forEach((group: any) => {
      group.isChecked = checked
      group.items.forEach((item: any) => {
        item.isChecked = checked
      })
    })
    
    setLocalChecklist(newChecklist)
    mutate(newChecklist)
  }

  const isGroupChecked = (deptIndex: number, groupIndex: number) => {
    const group = localChecklist.departments[deptIndex].groups[groupIndex]
    if (!group.items || group.items.length === 0) return !!group.isChecked
    return group.items.every((item: any) => item.isChecked)
  }

  const isGroupIndeterminate = (deptIndex: number, groupIndex: number) => {
    const group = localChecklist.departments[deptIndex].groups[groupIndex]
    if (!group.items || group.items.length === 0) return false
    const checkedCount = group.items.filter((item: any) => item.isChecked).length
    return checkedCount > 0 && checkedCount < group.items.length
  }

  const isDeptChecked = (deptIndex: number) => {
    const dept = localChecklist.departments[deptIndex]
    const allGroups = dept.groups || []
    if (allGroups.length === 0) return !!dept.isChecked
    
    const allItems = allGroups.flatMap((g: any) => g.items || [])
    if (allItems.length === 0) {
      return allGroups.every((g: any) => g.isChecked)
    }
    return allItems.every((item: any) => item.isChecked)
  }

  const isDeptIndeterminate = (deptIndex: number) => {
    const dept = localChecklist.departments[deptIndex]
    const allGroups = dept.groups || []
    const allItems = allGroups.flatMap((g: any) => g.items || [])
    
    if (allItems.length === 0) {
      const checkedGroups = allGroups.filter((g: any) => g.isChecked).length
      return checkedGroups > 0 && checkedGroups < allGroups.length
    }
    
    const checkedCount = allItems.filter((item: any) => item.isChecked).length
    return checkedCount > 0 && checkedCount < allItems.length
  }

  return (
    <div className="space-y-6 text-black px-1">
      <Accordion type="multiple" className="w-full">
        {localChecklist.departments.map((dept: any, deptIdx: number) => (
          <AccordionItem key={dept.id} value={dept.id} className="border-b border-black/10">
            <div className="flex items-center justify-between relative group">
              <AccordionTrigger className="hover:no-underline py-4 flex-1 justify-start gap-3 [&[data-state=open]>svg]:rotate-180">
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
                {dept.groups.map((group: any, groupIdx: number) => {
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
                          {group.items.map((item: any, itemIdx: number) => (
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
  )
}
