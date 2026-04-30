import { useState } from 'react'
import {
  TableProperties,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Link2,
  ChevronDown,
} from 'lucide-react'
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
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { createProject } from '@/lib/projects-service'
import { fetchProjectsFromSheet, fetchSheetNames } from '@/lib/google-sheets-service'

const DEFAULT_SPREADSHEET_ID = import.meta.env.VITE_GOOGLE_SHEETS_SPREADSHEET_ID as string
const DEFAULT_API_KEY = import.meta.env.VITE_GOOGLE_SHEETS_API_KEY as string

/** Parse a date string safely — returns ISO string or null for invalid/empty values. */
function safeIso(value: string | null | undefined): string | null {
  if (!value) return null
  const d = new Date(value)
  if (isNaN(d.getTime())) return null
  return d.toISOString()
}

interface GoogleSheetsImportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function GoogleSheetsImportDialog({
  open,
  onOpenChange,
}: GoogleSheetsImportDialogProps) {
  const queryClient = useQueryClient()

  const [spreadsheetId, setSpreadsheetId] = useState(DEFAULT_SPREADSHEET_ID)
  const [apiKey, setApiKey] = useState(DEFAULT_API_KEY)
  const [sheetNames, setSheetNames] = useState<string[]>([])
  const [selectedSheet, setSelectedSheet] = useState('masterData')
  const [preview, setPreview] = useState<{ count: number; first: string } | null>(null)

  const [isLoadingSheets, setIsLoadingSheets] = useState(false)
  const [isImporting, setIsImporting] = useState(false)
  const [step, setStep] = useState<'connect' | 'preview' | 'done'>('connect')

  const handleConnect = async () => {
    if (!spreadsheetId.trim() || !apiKey.trim()) {
      toast.error('Please enter both a Spreadsheet ID and an API key.')
      return
    }
    setIsLoadingSheets(true)
    try {
      const names = await fetchSheetNames(spreadsheetId.trim(), apiKey.trim())
      setSheetNames(names)
      if (names.length > 0 && !names.includes(selectedSheet)) {
        setSelectedSheet(names[0])
      }
      toast.success(`Connected! Found ${names.length} sheet(s).`)
      setStep('preview')
    } catch (err: any) {
      toast.error(err?.message ?? 'Failed to connect to Google Sheets.')
    } finally {
      setIsLoadingSheets(false)
    }
  }

  const handlePreview = async () => {
    setIsLoadingSheets(true)
    try {
      const { rows } = await fetchProjectsFromSheet(
        spreadsheetId.trim(),
        apiKey.trim(),
        selectedSheet,
      )
      setPreview({
        count: rows.length,
        first: rows[0]?.name ?? '—',
      })
    } catch (err: any) {
      toast.error(err?.message ?? 'Failed to fetch sheet data.')
    } finally {
      setIsLoadingSheets(false)
    }
  }

  const handleImport = async () => {
    setIsImporting(true)
    try {
      const { rows } = await fetchProjectsFromSheet(
        spreadsheetId.trim(),
        apiKey.trim(),
        selectedSheet,
      )

      if (rows.length === 0) {
        toast.error('No data rows found in the selected sheet.')
        return
      }

      let successCount = 0
      let skipCount = 0
      for (const row of rows) {
        try {
          await createProject({
            salesOrder: row.salesOrder,
            productionOrder: row.productionOrder,
            asBuiltDate: safeIso(row.asBuiltDate) as any,
            shipDate: safeIso(row.shipDate) as any,
            supervisors: row.supervisors,
            line: row.line,
            plNumber: row.plNumber,
            name: row.name,
            product: row.product,
            productionStart: safeIso(row.productionStart) as any,
            productionEnd: safeIso(row.productionEnd) as any,
            phase: row.phase,
            drawing: row.drawing,
            supportStart: safeIso(row.supportStart) as any,
            panelMaterial: row.panelMaterial,
            hollyMaterial: row.hollyMaterial,
            blueFolderFredG: row.blueFolderFredG,
            firstOffJay: row.firstOffJay,
            uvKitting: row.uvKitting,
            woodshopPanel: row.woodshopPanel,
            robertoSub: row.robertoSub,
            alexSumelEmtPipe: row.alexSumelEmtPipe,
            jaysonBox: row.jaysonBox,
            jaysonWire: row.jaysonWire,
            arnoldCut: row.arnoldCut,
            arnoldCnc: row.arnoldCnc,
            kevinMaterialHandling: row.kevinMaterialHandling,
            status: 'none',
            assignee: '',
            tasks: [],
            workOrder: '',
          })
          successCount++
        } catch (rowErr) {
          console.warn('[Google Sheets Import] Skipped row:', row, rowErr)
          skipCount++
        }
      }
      if (skipCount > 0) {
        toast.warning(`${skipCount} row(s) were skipped due to errors. Check the console for details.`)
      }

      toast.success(`Successfully imported ${successCount} project(s) from Google Sheets.`)
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      setStep('done')
    } catch (err: any) {
      toast.error(err?.message ?? 'Import failed. Check the console for details.')
      console.error('[Google Sheets Import]', err)
    } finally {
      setIsImporting(false)
    }
  }

  const handleClose = () => {
    onOpenChange(false)
    // Reset after close animation
    setTimeout(() => {
      setStep('connect')
      setPreview(null)
      setSheetNames([])
    }, 300)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className='sm:max-w-[480px]'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <TableProperties className='h-5 w-5 text-green-600' />
            Import from Google Sheets
          </DialogTitle>
          <DialogDescription>
            Pull projects directly from your Google Spreadsheet into the system.
          </DialogDescription>
        </DialogHeader>

        <div className='grid gap-5 py-2'>
          {/* ── Step 1 – Credentials ── */}
          <div className='flex flex-col gap-3 p-4 rounded-lg border bg-muted/30'>
            <h4 className='text-sm font-semibold flex items-center gap-2'>
              <Link2 className='h-4 w-4' />
              1. Spreadsheet Connection
            </h4>

            <div className='grid gap-2'>
              <Label htmlFor='spreadsheet-id' className='text-xs'>
                Spreadsheet ID
              </Label>
              <Input
                id='spreadsheet-id'
                value={spreadsheetId}
                onChange={(e) => setSpreadsheetId(e.target.value)}
                placeholder='1ssreH2b...'
                className='font-mono text-xs'
              />
            </div>

            <div className='grid gap-2'>
              <Label htmlFor='api-key' className='text-xs'>
                API Key
              </Label>
              <Input
                id='api-key'
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder='AIzaSy...'
                className='font-mono text-xs'
                type='password'
              />
            </div>

            <Button
              variant='outline'
              size='sm'
              className='mt-1 w-fit gap-2'
              onClick={handleConnect}
              disabled={isLoadingSheets || isImporting}
            >
              {isLoadingSheets && step === 'connect' ? (
                <>
                  <RefreshCw className='h-3.5 w-3.5 animate-spin' />
                  Connecting…
                </>
              ) : (
                <>
                  <Link2 className='h-3.5 w-3.5' />
                  Connect
                </>
              )}
            </Button>
          </div>

          {/* ── Step 2 – Sheet Picker + Preview ── */}
          {step !== 'connect' && (
            <div className='flex flex-col gap-3 p-4 rounded-lg border border-dashed border-primary/50 bg-primary/5'>
              <h4 className='text-sm font-semibold flex items-center gap-2'>
                <TableProperties className='h-4 w-4' />
                2. Select Sheet &amp; Preview
              </h4>

              <div className='flex items-center gap-2'>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant='outline' size='sm' className='gap-2 min-w-[140px] justify-between'>
                      {selectedSheet}
                      <ChevronDown className='h-3.5 w-3.5 opacity-60' />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align='start'>
                    {sheetNames.map((name) => (
                      <DropdownMenuItem key={name} onClick={() => setSelectedSheet(name)}>
                        {name}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                <Button
                  variant='outline'
                  size='sm'
                  className='gap-2'
                  onClick={handlePreview}
                  disabled={isLoadingSheets || isImporting}
                >
                  {isLoadingSheets && step === 'preview' ? (
                    <RefreshCw className='h-3.5 w-3.5 animate-spin' />
                  ) : (
                    <RefreshCw className='h-3.5 w-3.5' />
                  )}
                  Preview
                </Button>
              </div>

              {preview && (
                <div className='text-xs text-muted-foreground bg-background rounded p-2 border'>
                  <span className='font-medium text-foreground'>{preview.count}</span> rows found.
                  First project:{' '}
                  <span className='font-medium text-foreground'>{preview.first}</span>
                </div>
              )}
            </div>
          )}

          {/* ── Done state ── */}
          {step === 'done' && (
            <div className='flex items-center gap-2 text-sm text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-950/20 p-3 rounded-lg border border-green-200 dark:border-green-900/30'>
              <CheckCircle2 className='h-4 w-4 shrink-0' />
              Import complete! The projects list has been refreshed.
            </div>
          )}
        </div>

        {/* ── Warning ── */}
        <div className='flex items-start gap-2 text-[10px] text-muted-foreground bg-amber-50 dark:bg-amber-950/20 p-2 rounded border border-amber-100 dark:border-amber-900/30'>
          <AlertCircle className='h-3 w-3 text-amber-600 shrink-0 mt-0.5' />
          <p>
            Importing will create new project entries. Duplicate detection is not performed — run
            this once per import batch.
          </p>
        </div>

        <DialogFooter className='gap-2'>
          <Button variant='ghost' onClick={handleClose}>
            Close
          </Button>
          {step !== 'connect' && step !== 'done' && (
            <Button
              onClick={handleImport}
              disabled={isImporting || isLoadingSheets}
              className='gap-2'
            >
              {isImporting ? (
                <>
                  <RefreshCw className='h-3.5 w-3.5 animate-spin' />
                  Importing…
                </>
              ) : (
                <>
                  <TableProperties className='h-3.5 w-3.5' />
                  Import All
                </>
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
