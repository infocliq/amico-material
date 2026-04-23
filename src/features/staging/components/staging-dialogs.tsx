import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { useStagingContext } from './staging-provider'
import { StagingActionForm } from './create-staging-form'
import { StagingDeleteDialog } from './staging-delete-dialog'
import { ShieldAlert } from 'lucide-react'

export function StagingDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useStagingContext()

  return (
    <>
      <Sheet
        open={open === 'create' || open === 'edit'}
        onOpenChange={(val) => {
          if (!val) {
            setOpen(null)
            setTimeout(() => setCurrentRow(null), 500)
          }
        }}
      >
        <SheetContent className='sm:max-w-[600px] p-0 overflow-y-auto'>
          <div className='p-6'>
            <SheetHeader className='text-left mb-6'>
              <div className='flex items-center gap-2 mb-1'>
                <ShieldAlert className='size-5 text-primary' />
                <SheetTitle className='text-2xl font-bold'>
                  {open === 'edit' ? 'Edit Staging Entry' : 'Create Staging Entry'}
                </SheetTitle>
              </div>
              <SheetDescription className='text-muted-foreground'>
                {open === 'edit'
                  ? 'Update the details of this staging record.'
                  : 'Fill in the details below to log a new staging entry.'}
              </SheetDescription>
            </SheetHeader>
            <StagingActionForm
              key={currentRow?.id || 'new-staging'}
              initialData={currentRow}
              onSuccess={() => setOpen(null)}
            />
          </div>
        </SheetContent>
      </Sheet>

      <StagingDeleteDialog />
    </>
  )
}
