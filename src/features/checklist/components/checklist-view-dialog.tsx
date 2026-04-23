import * as React from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Checkbox } from '@/components/ui/checkbox'
import { useChecklist } from './checklist-provider'
import { updateChecklist } from '@/lib/checklist-service'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Building2, LayoutGrid, Package } from 'lucide-react'

export function ChecklistViewDialog() {
  const { open, setOpen, currentRow, setCurrentRow } = useChecklist()
  const queryClient = useQueryClient()

  // mutation to update a single item's state
  const { mutate } = useMutation({
    mutationFn: (data: any) => updateChecklist(currentRow!.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['checklists'] })
    },
    onError: (error: any) => {
      toast.error('Failed to update: ' + error.message)
    }
  })

  if (!currentRow) return null

  const handleToggle = (deptIndex: number, groupIndex: number, itemIndex: number, checked: boolean) => {
    // Deep clone to avoid direct mutation
    const newDepartments = JSON.parse(JSON.stringify(currentRow.departments))
    newDepartments[deptIndex].groups[groupIndex].items[itemIndex].isChecked = checked
    
    // Update local state optimistically for snappy UI
    const updatedRow = { ...currentRow, departments: newDepartments }
    setCurrentRow(updatedRow)
    
    mutate({ departments: newDepartments })
  }

  return (
    <Dialog open={open === 'view'} onOpenChange={(v) => !v && setOpen(null)}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] flex flex-col p-0 overflow-hidden border-none shadow-2xl">
        <div className="absolute inset-0 bg-grid-slate-200 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10 dark:bg-grid-slate-800" />
        
        <DialogHeader className="p-8 pb-4 bg-background/80 backdrop-blur-md border-b">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl font-black tracking-tight">{currentRow.modelNumber}</DialogTitle>
              <p className="text-sm text-muted-foreground mt-1">Product Assembly & Parts Checklist</p>
            </div>
            <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              {currentRow.status}
            </div>
          </div>
        </DialogHeader>
        
        <ScrollArea className="flex-1 p-8 pt-4">
          <div className="space-y-12">
            {currentRow.departments.map((dept, deptIdx) => (
              <div key={dept.id} className="space-y-6">
                <div className="flex items-center gap-3">
                  <Building2 className="size-6 text-primary" />
                  <h3 className="text-xl font-bold tracking-tight">{dept.name}</h3>
                </div>
                
                <div className="space-y-8 pl-9 border-l-2 border-muted/50">
                  {dept.groups.map((group, groupIdx) => (
                    <div key={group.id} className="space-y-4">
                      <div className="flex items-center gap-2">
                        <LayoutGrid className="size-4 text-muted-foreground" />
                        <h4 className="font-bold text-base tracking-tight">
                          {group.name}:
                        </h4>
                      </div>
                      
                      <div className="grid gap-3">
                        {group.items.map((item, itemIdx) => (
                          <div 
                            key={item.id} 
                            className="group flex items-center justify-between py-1 transition-all duration-200"
                          >
                            <span className="text-sm font-medium text-foreground/80 group-hover:text-primary transition-colors">
                              {item.name}
                            </span>
                            <Checkbox 
                              checked={item.isChecked} 
                              onCheckedChange={(checked) => 
                                handleToggle(deptIdx, groupIdx, itemIdx, !!checked)
                              }
                              className="size-5 rounded border-2 border-muted-foreground/30 data-[state=checked]:border-primary data-[state=checked]:bg-primary"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
        
        <div className="p-4 bg-muted/30 border-t text-center">
          <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">
            Last Updated: {new Date(currentRow.updatedAt).toLocaleString()}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
