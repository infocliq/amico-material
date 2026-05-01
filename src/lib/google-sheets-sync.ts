import { fetchProjectsFromSheet } from './google-sheets-service'
import { getProjects, createProject, updateProject, updateProjectHeaders } from './projects-service'

export interface SyncResult {
  created: number
  updated: number
  unchanged: number
  skipped: number
  lastSyncAt: Date
}

/** Safe ISO converter — returns null for empty / invalid dates */
function safeIso(value: string | null | undefined): string | null {
  if (!value) return null
  const d = new Date(value)
  return isNaN(d.getTime()) ? null : d.toISOString()
}

/**
 * Pulls every row from the "masterData" Google Sheet and upserts them into
 * Firestore using `salesOrder` as the unique key:
 */
export async function syncSheetToFirestore(): Promise<SyncResult> {
  const [sheetRes, existingProjects] = await Promise.all([
    fetchProjectsFromSheet(),
    getProjects(),
  ])

  const { rows: sheetRows, headers } = sheetRes

  if (headers.length > 0) {
    const headerMap: Record<string, string> = {
      salesOrder: headers[0] || 'Sales Order',
      productionOrder: headers[1] || 'Production Order',
      asBuiltDate: headers[2] || 'As-Built Date',
      shipDate: headers[3] || 'Ship Date',
      supervisors: headers[4] || 'Supervisors',
      line: headers[5] || 'Line',
      plNumber: headers[6] || 'PL#',
      name: headers[7] || 'Project Name',
      product: headers[8] || 'Product',
      productionStart: headers[9] || 'Prod Start',
      productionEnd: headers[10] || 'Prod End',
      phase: headers[11] || 'Phase',
      drawing: headers[12] || 'Drawing',
      supportStart: headers[13] || 'Support Start Date',
      panelMaterial: headers[14] || 'Panel Material',
      hollyMaterial: headers[15] || 'Holly - Material',
      blueFolderFredG: headers[16] || 'Blue folder- Fred G.',
      firstOffJay: headers[17] || '1st Off- Jay',
      uvKitting: headers[18] || 'UV - Kitting',
      woodshopPanel: headers[19] || 'Woodshop - Panel',
      robertoSub: headers[20] || 'Roberto- SUB',
      alexSumelEmtPipe: headers[21] || 'Alex/Sumel- EMT pipe',
      jaysonBox: headers[22] || 'Jayson - Box',
      jaysonWire: headers[23] || 'Jayson Wire',
      arnoldCut: headers[24] || 'Arnold Cut',
      arnoldCnc: headers[25] || 'Arnold CNC',
      kevinMaterialHandling: headers[26] || 'Kevin- Material Handling',
    }
    await updateProjectHeaders(headerMap)
  }

  // Build a lookup map: salesOrder → existing Firebase project
  const byOrder = new Map(existingProjects.map((p) => [p.salesOrder, p]))

  let created = 0
  let updated = 0
  let unchanged = 0
  let skipped = 0

  for (const row of sheetRows) {
    if (!row.salesOrder) {
      skipped++
      continue
    }

    const asBuiltDate = safeIso(row.asBuiltDate)
    const shipDate = safeIso(row.shipDate)
    const productionStart = safeIso(row.productionStart)
    const productionEnd = safeIso(row.productionEnd)
    const supportStart = safeIso(row.supportStart)

    try {
      const existing = byOrder.get(row.salesOrder)

      if (!existing) {
        // ── New project: create it ──────────────────────────────────────
        await createProject({
          ...row,
          asBuiltDate: asBuiltDate as any,
          shipDate: shipDate as any,
          productionStart: productionStart as any,
          productionEnd: productionEnd as any,
          supportStart: supportStart as any,
          status: 'none',
          assignee: '',
          tasks: [],
          productionOrder: row.productionOrder,
          workOrder: row.productionOrder, // SYNC TO BOTH FIELDS
        } as any)
        created++
      } else {
        // ── Existing project: update only if something changed ──────────
        const changes: Record<string, any> = {}

        // Helper to check for changes
        const check = (key: string, newVal: any) => {
          if (newVal !== undefined && newVal !== (existing as any)[key]) {
            changes[key] = newVal
          }
        }

        check('productionOrder', row.productionOrder)
        check('workOrder', row.productionOrder)
        check('name', row.name)
        check('product', row.product)
        check('supervisors', row.supervisors)
        check('line', row.line)
        check('plNumber', row.plNumber)
        check('phase', row.phase)
        check('drawing', row.drawing)
        check('panelMaterial', row.panelMaterial)
        check('hollyMaterial', row.hollyMaterial)
        check('blueFolderFredG', row.blueFolderFredG)
        check('firstOffJay', row.firstOffJay)
        check('uvKitting', row.uvKitting)
        check('woodshopPanel', row.woodshopPanel)
        check('robertoSub', row.robertoSub)
        check('alexSumelEmtPipe', row.alexSumelEmtPipe)
        check('jaysonBox', row.jaysonBox)
        check('jaysonWire', row.jaysonWire)
        check('arnoldCut', row.arnoldCut)
        check('arnoldCnc', row.arnoldCnc)
        check('kevinMaterialHandling', row.kevinMaterialHandling)

        if (asBuiltDate && asBuiltDate !== (existing.asBuiltDate as string))
          changes.asBuiltDate = asBuiltDate
        if (shipDate && shipDate !== (existing.shipDate as string))
          changes.shipDate = shipDate
        if (productionStart && productionStart !== (existing.productionStart as string))
          changes.productionStart = productionStart
        if (productionEnd && productionEnd !== (existing.productionEnd as string))
          changes.productionEnd = productionEnd
        if (supportStart && supportStart !== (existing.supportStart as string))
          changes.supportStart = supportStart

        if (Object.keys(changes).length > 0) {
          await updateProject(existing.id, changes)
          updated++
        } else {
          unchanged++
        }
      }
    } catch (err) {
      console.warn('[Sheet Sync] Skipped row:', row.salesOrder, err)
      skipped++
    }
  }

  return { created, updated, unchanged, skipped, lastSyncAt: new Date() }
}
