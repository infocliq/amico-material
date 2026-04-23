import { useState } from 'react'
import { Download, Upload, FileSpreadsheet, AlertCircle } from 'lucide-react'
import * as XLSX from 'xlsx'
import { toast } from 'sonner'
import { useQueryClient } from '@tanstack/react-query'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { createProject } from '@/lib/projects-service'
import { cn } from '@/lib/utils'

interface ProjectImportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProjectImportDialog({ open, onOpenChange }: ProjectImportDialogProps) {
  const [isUploading, setIsUploading] = useState(false)
  const queryClient = useQueryClient()

  const handleDownloadTemplate = () => {
    const headers = [
      'Sales Order',
      'Work Order',
      'Ship Date',
      'Production Start',
      'Name',
      'Product Type',
      'Quantity',
      'Status'
    ]
    
    const sampleData = [
      ['101345678', '30109898', '2026-04-16', '2026-04-01', 'Sample Project', 'HW096-567-M96', '15', 'preparing']
    ]

    const ws = XLSX.utils.aoa_to_sheet([headers, ...sampleData])
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Projects')
    XLSX.writeFile(wb, 'projects_template.xlsx')
    toast.success('Template downloaded')
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    const reader = new FileReader()

    reader.onload = async (event) => {
      try {
        const data = event.target?.result
        const workbook = XLSX.read(data, { type: 'binary' })
        const sheetName = workbook.SheetNames[0]
        const sheet = workbook.Sheets[sheetName]
        const rows = XLSX.utils.sheet_to_json(sheet) as any[]

        if (rows.length === 0) {
           toast.error('The excel file is empty')
           return
        }

        let successCount = 0
        for (const row of rows) {
          const projectData = {
            salesOrder: row['Sales Order']?.toString() || '',
            workOrder: row['Work Order']?.toString() || '',
            shipDate: row['Ship Date'] ? new Date(row['Ship Date']).toISOString() : null,
            productionStart: row['Production Start'] ? new Date(row['Production Start']).toISOString() : null,
            name: row['Name']?.toString() || 'Unnamed Project',
            productType: row['Product Type']?.toString() || '',
            quantity: parseInt(row['Quantity']?.toString() || '0'),
            status: row['Status']?.toString().toLowerCase() || 'none',
            createdAt: new Date().toISOString(),
          }

          await createProject(projectData as any)
          successCount++
        }

        toast.success(`Successfully imported ${successCount} projects`)
        queryClient.invalidateQueries({ queryKey: ['projects'] })
        onOpenChange(false)
      } catch (error) {
        console.error('Import error:', error)
        toast.error('Failed to parse excel file. Please check the template format.')
      } finally {
        setIsUploading(false)
        e.target.value = ''
      }
    }

    reader.onerror = () => {
      toast.error('Failed to read file')
      setIsUploading(false)
    }

    reader.readAsBinaryString(file)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5 text-green-600" />
            Import Projects
          </DialogTitle>
          <DialogDescription>
            Import multiple projects at once using an Excel file.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <div className="flex flex-col gap-2 p-4 rounded-lg border bg-muted/30">
            <h4 className="text-sm font-semibold flex items-center gap-2">
              <Download className="h-4 w-4" />
              1. Download Template
            </h4>
            <p className="text-xs text-muted-foreground">
              Get the correctly formatted Excel file to ensure your data imports correctly.
            </p>
            <Button variant="outline" size="sm" onClick={handleDownloadTemplate} className="mt-2">
              Download Template (.xlsx)
            </Button>
          </div>

          <div className="flex flex-col gap-2 p-4 rounded-lg border border-dashed border-primary/50 bg-primary/5">
            <h4 className="text-sm font-semibold flex items-center gap-2">
              <Upload className="h-4 w-4" />
              2. Upload Excel
            </h4>
            <p className="text-xs text-muted-foreground">
              Upload your completed Excel file to start the import process.
            </p>
            <div className="mt-2 relative">
              <input
                type="file"
                accept=".xlsx, .xls"
                onChange={handleFileUpload}
                disabled={isUploading}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
              />
              <Button 
                variant="default" 
                className="w-full gap-2" 
                disabled={isUploading}
              >
                {isUploading ? (
                  <>
                    <div className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <FileSpreadsheet className="h-4 w-4" />
                    Select Excel File
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        <div className="flex items-start gap-2 text-[10px] text-muted-foreground bg-amber-50 dark:bg-amber-950/20 p-2 rounded border border-amber-100 dark:border-amber-900/30">
           <AlertCircle className="h-3 w-3 text-amber-600 shrink-0 mt-0.5" />
           <p>
             Ensure the columns match the template exactly. Dates should be in YYYY-MM-DD format.
           </p>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
