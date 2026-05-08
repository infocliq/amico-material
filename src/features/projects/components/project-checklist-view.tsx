import * as React from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import { updateProject } from '@/lib/projects-service'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Project } from '../data/schema'
import { cn } from '@/lib/utils'
import { Truck, PackageCheck } from 'lucide-react'

interface ProjectChecklistViewProps {
  project: Project
}

export function ProjectChecklistView({ project }: ProjectChecklistViewProps) {
  const queryClient = useQueryClient()
  const [localChecklist, setLocalChecklist] = React.useState(project.checklist)
  const [mode, setMode] = React.useState<'transfer' | 'staging'>('transfer')

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

  const getItemChecked = (item: any) => {
    if (mode === 'transfer') return !!item.isReceived
    return !!item.isStaged
  }

  const setItemChecked = (item: any, checked: boolean) => {
    if (mode === 'transfer') {
      item.isReceived = checked
    } else {
      item.isStaged = checked
      // Update legacy isChecked to match isStaged for dashboard progress
      item.isChecked = checked
    }
  }

  const handleToggleItem = (deptIndex: number, groupIndex: number, itemIndex: number, checked: boolean) => {
    const newChecklist = JSON.parse(JSON.stringify(localChecklist))
    const item = newChecklist.departments[deptIndex].groups[groupIndex].items[itemIndex]
    setItemChecked(item, checked)
    
    setLocalChecklist(newChecklist)
    mutate(newChecklist)
  }

  const handleToggleGroup = (deptIndex: number, groupIndex: number, checked: boolean) => {
    const newChecklist = JSON.parse(JSON.stringify(localChecklist))
    const group = newChecklist.departments[deptIndex].groups[groupIndex]
    
    if (mode === 'transfer') group.isReceived = checked
    else group.isStaged = checked

    group.items.forEach((item: any) => {
      setItemChecked(item, checked)
    })
    
    setLocalChecklist(newChecklist)
    mutate(newChecklist)
  }

  const handleToggleDepartment = (deptIndex: number, checked: boolean) => {
    const newChecklist = JSON.parse(JSON.stringify(localChecklist))
    const dept = newChecklist.departments[deptIndex]
    
    if (mode === 'transfer') dept.isReceived = checked
    else dept.isStaged = checked

    dept.groups.forEach((group: any) => {
      if (mode === 'transfer') group.isReceived = checked
      else group.isStaged = checked

      group.items.forEach((item: any) => {
        setItemChecked(item, checked)
      })
    })
    
    setLocalChecklist(newChecklist)
    mutate(newChecklist)
  }

  const isGroupChecked = (deptIndex: number, groupIndex: number) => {
    const group = localChecklist.departments[deptIndex].groups[groupIndex]
    if (!group.items || group.items.length === 0) {
       return mode === 'transfer' ? !!group.isReceived : !!group.isStaged
    }
    return group.items.every((item: any) => getItemChecked(item))
  }

  const isGroupIndeterminate = (deptIndex: number, groupIndex: number) => {
    const group = localChecklist.departments[deptIndex].groups[groupIndex]
    if (!group.items || group.items.length === 0) return false
    const checkedCount = group.items.filter((item: any) => getItemChecked(item)).length
    return checkedCount > 0 && checkedCount < group.items.length
  }

  const isDeptChecked = (deptIndex: number) => {
    const dept = localChecklist.departments[deptIndex]
    const allGroups = dept.groups || []
    if (allGroups.length === 0) {
      return mode === 'transfer' ? !!dept.isReceived : !!dept.isStaged
    }
    
    const allItems = allGroups.flatMap((g: any) => g.items || [])
    if (allItems.length === 0) {
      return allGroups.every((g: any, gIdx: number) => isGroupChecked(deptIndex, gIdx))
    }
    return allItems.every((item: any) => getItemChecked(item))
  }

  const isDeptIndeterminate = (deptIndex: number) => {
    const dept = localChecklist.departments[deptIndex]
    const allGroups = dept.groups || []
    const allItems = allGroups.flatMap((g: any) => g.items || [])
    
    if (allItems.length === 0) {
      const checkedGroups = allGroups.filter((g: any, gIdx: number) => isGroupChecked(deptIndex, gIdx)).length
      return checkedGroups > 0 && checkedGroups < allGroups.length
    }
    
    const checkedCount = allItems.filter((item: any) => getItemChecked(item)).length
    return checkedCount > 0 && checkedCount < allItems.length
  }

  const calculateModeProgress = (m: 'transfer' | 'staging') => {
    if (!localChecklist || !localChecklist.departments) return { completed: 0, total: 0 }
    let total = 0
    let completed = 0
    
    localChecklist.departments.forEach((dept: any) => {
      const groups = dept.groups || []
      if (groups.length === 0) {
        total++
        if (m === 'transfer' ? dept.isReceived : dept.isStaged) completed++
      } else {
        groups.forEach((group: any) => {
          const items = group.items || []
          if (items.length === 0) {
            total++
            if (m === 'transfer' ? group.isReceived : group.isStaged) completed++
          } else {
            items.forEach((item: any) => {
              total++
              if (m === 'transfer' ? item.isReceived : item.isStaged) completed++
            })
          }
        })
      }
    })
    return { completed, total }
  }

  const transferProgress = calculateModeProgress('transfer')
  const stagingProgress = calculateModeProgress('staging')

  return (
    <div className="text-black px-1 -mt-2">
      <div className="space-y-3 pb-4">
        <div className="flex items-center justify-center p-1 bg-black/5 rounded-lg">
          <Tabs value={mode} onValueChange={(v: any) => setMode(v)} className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-transparent h-9">
              <TabsTrigger 
                value="transfer" 
                className={cn(
                  "text-[10px] sm:text-xs font-bold uppercase tracking-wider gap-2 transition-all",
                  "data-[state=active]:bg-black data-[state=active]:text-white"
                )}
              >
                <Truck className="size-3.5" />
                Transfer List
              </TabsTrigger>
              <TabsTrigger 
                value="staging"
                className={cn(
                  "text-[10px] sm:text-xs font-bold uppercase tracking-wider gap-2 transition-all",
                  "data-[state=active]:bg-black data-[state=active]:text-white"
                )}
              >
                <PackageCheck className="size-3.5" />
                Staging List
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="grid grid-cols-2 gap-4 px-1">
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <span className="text-[8px] font-bold text-blue-600 uppercase tracking-widest">Received</span>
              <span className="text-[10px] font-bold">{transferProgress.completed}/{transferProgress.total}</span>
            </div>
            <div className="h-1 bg-blue-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-600 transition-all duration-500" 
                style={{ width: `${(transferProgress.completed / transferProgress.total) * 100}%` }}
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <span className="text-[8px] font-bold text-orange-600 uppercase tracking-widest">Staged</span>
              <span className="text-[10px] font-bold">{stagingProgress.completed}/{stagingProgress.total}</span>
            </div>
            <div className="h-1 bg-orange-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-orange-600 transition-all duration-500" 
                style={{ width: `${(stagingProgress.completed / stagingProgress.total) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between px-1 border-t border-black/5 pt-4">
        <h4 className="text-[10px] font-bold text-black/40 uppercase tracking-widest">
          Action: <span className="text-black">{mode === 'transfer' ? 'Confirm Receipt' : 'Confirm Staging'}</span>
        </h4>
        <div className="flex items-center gap-1.5">
          <div className={cn("size-1.5 rounded-full", mode === 'transfer' ? "bg-blue-500 animate-pulse" : "bg-orange-500 animate-pulse")} />
          <span className="text-[10px] font-bold text-black uppercase tracking-wider">
            {mode === 'transfer' ? 'Receiving Mode' : 'Staging Mode'}
          </span>
        </div>
      </div>

      <Accordion type="multiple" className="w-full">
        {localChecklist.departments.map((dept: any, deptIdx: number) => (
          <AccordionItem key={dept.id} value={dept.id} className="border-b border-black/10">
            <div className="flex items-center justify-between relative group">
              <AccordionTrigger className="hover:no-underline py-3 flex-1 justify-start gap-3 [&[data-state=open]>svg]:rotate-180">
                <h3 className="text-xs font-bold tracking-wide text-black text-left">
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
                              onClick={() => handleToggleItem(deptIdx, groupIdx, itemIdx, !getItemChecked(item))}
                            >
                              <Checkbox 
                                id={`item-${item.id}`}
                                checked={getItemChecked(item)} 
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
                                <div className="flex flex-wrap items-center gap-2">
                                  {item.comment && (
                                    <p className="text-[11px] text-black italic leading-none">{item.comment}</p>
                                  )}
                                </div>
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
