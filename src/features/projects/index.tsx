import { useState } from 'react'
import { LayoutGrid, Table as TableIcon, RefreshCw, CheckCircle2, AlertCircle, Clock } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { getRouteApi } from '@tanstack/react-router'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { getProjects } from '@/lib/projects-service'
import { ProjectsTable } from './components/projects-table'
import { ProjectsKanban } from './components/projects-kanban'
import { ProjectsPrimaryButtons } from './components/projects-primary-buttons'
import { type Project } from './data/schema'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { useGoogleSheetSync } from '@/hooks/use-google-sheet-sync'
import { cn } from '@/lib/utils'

const route = getRouteApi('/_authenticated/projects/')

export function Projects() {
  const search = route.useSearch()
  const navigate = route.useNavigate()
  const [view, setView] = useState<'table' | 'kanban'>('table')

  const { data: projects, isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: getProjects,
  })

  const { status: syncStatus, lastResult, lastError, syncNow } = useGoogleSheetSync()

  const syncLabel =
    syncStatus === 'syncing'  ? 'Syncing from Sheets…' :
    syncStatus === 'success'  ? `Synced — ${lastResult?.created ?? 0} new, ${lastResult?.updated ?? 0} updated` :
    syncStatus === 'error'    ? `Sync failed: ${lastError}` :
    lastResult
      ? `Last sync: ${lastResult.lastSyncAt.toLocaleTimeString()}`
      : 'Auto-sync every 10 min'

  return (
    <>
      <Header fixed shadow>
        <Search />
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-2 border-b pb-6'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Projects</h2>
            <p className='text-muted-foreground'>
              Manage and track your design projects across different stages.
            </p>

            {/* ── Sync status badge ── */}
            <div className='mt-2 flex items-center gap-2'>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={syncNow}
                    disabled={syncStatus === 'syncing'}
                    className={cn(
                      'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium transition-colors',
                      'disabled:cursor-not-allowed',
                      syncStatus === 'syncing' && 'border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950/40 dark:text-blue-300',
                      syncStatus === 'success' && 'border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950/40 dark:text-green-300',
                      syncStatus === 'error'   && 'border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950/40 dark:text-red-300',
                      syncStatus === 'idle'    && 'border-muted bg-muted/40 text-muted-foreground hover:bg-muted',
                    )}
                    aria-label='Sheet sync status — click to sync now'
                  >
                    {syncStatus === 'syncing' && <RefreshCw className='h-3 w-3 animate-spin' />}
                    {syncStatus === 'success' && <CheckCircle2 className='h-3 w-3' />}
                    {syncStatus === 'error'   && <AlertCircle className='h-3 w-3' />}
                    {syncStatus === 'idle'    && <Clock className='h-3 w-3' />}
                    {syncLabel}
                  </button>
                </TooltipTrigger>
                <TooltipContent side='bottom' className='max-w-[240px] text-xs'>
                  {syncStatus === 'error'
                    ? lastError
                    : 'Google Sheets auto-syncs every 10 min. Click to sync now.'}
                  {lastResult && syncStatus !== 'error' && (
                    <span className='block mt-1 opacity-70'>
                      {lastResult.created} created · {lastResult.updated} updated · {lastResult.unchanged} unchanged · {lastResult.skipped} skipped
                    </span>
                  )}
                </TooltipContent>
              </Tooltip>
            </div>
          </div>

          <div className='flex items-center gap-4'>
            <Tabs value={view} onValueChange={(v) => setView(v as any)} className='w-full'>
              <TabsList className='grid h-9 w-[200px] grid-cols-2'>
                <TabsTrigger value='table' className='text-xs gap-2'>
                  <TableIcon className='size-3.5' /> Table
                </TabsTrigger>
                <TabsTrigger value='kanban' className='text-xs gap-2'>
                  <LayoutGrid className='size-3.5' /> Kanban
                </TabsTrigger>
              </TabsList>
            </Tabs>
            <ProjectsPrimaryButtons />
          </div>
        </div>

        {!isLoading && projects && (
          <div className='flex flex-1 flex-col'>
            {view === 'table' ? (
              <ProjectsTable data={projects as unknown as Project[]} search={search} navigate={navigate} />
            ) : (
              <ProjectsKanban data={projects as unknown as Project[]} />
            )}
          </div>
        )}

        {isLoading && (
          <div className='flex flex-1 items-center justify-center'>
            <div className='flex flex-col items-center gap-2'>
              <div className='h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent'></div>
              <p className='text-xs text-muted-foreground'>Loading projects...</p>
            </div>
          </div>
        )}
      </Main>
    </>
  )
}
