import { Download, Plus, TableProperties } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { ProjectImportDialog } from './project-import-dialog'
import { GoogleSheetsImportDialog } from './google-sheets-import-dialog'

export function ProjectsPrimaryButtons() {
  const navigate = useNavigate()
  const [importOpen, setImportOpen] = useState(false)
  const [sheetsOpen, setSheetsOpen] = useState(false)

  return (
    <div className='flex gap-2'>
      <Button
        variant='outline'
        size='sm'
        className='gap-2'
        onClick={() => setSheetsOpen(true)}
        title='Import from Google Sheets'
      >
        <TableProperties className='h-4 w-4 text-green-600' />
        Sheets
      </Button>

      <Button
        variant='outline'
        size='sm'
        className='gap-2'
        onClick={() => setImportOpen(true)}
      >
        Import <Download className='h-4 w-4' />
      </Button>

      <Button
        size='sm'
        className='gap-2'
        onClick={() => navigate({ to: '/projects/create' })}
      >
        Create <Plus className='h-4 w-4' />
      </Button>

      <ProjectImportDialog open={importOpen} onOpenChange={setImportOpen} />
      <GoogleSheetsImportDialog open={sheetsOpen} onOpenChange={setSheetsOpen} />
    </div>
  )
}
