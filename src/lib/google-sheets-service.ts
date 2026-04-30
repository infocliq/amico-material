const SHEETS_API_KEY = import.meta.env.VITE_GOOGLE_SHEETS_API_KEY as string
const SPREADSHEET_ID = import.meta.env.VITE_GOOGLE_SHEETS_SPREADSHEET_ID as string

const BASE_URL = 'https://sheets.googleapis.com/v4/spreadsheets'

export interface SheetProject {
  salesOrder: string
  productionOrder: string
  asBuiltDate: string | null
  shipDate: string | null
  supervisors: string
  line: string
  plNumber: string
  name: string
  product: string
  productionStart: string | null
  productionEnd: string | null
  phase: string
  drawing: string
  supportStart: string | null
  panelMaterial: string
  hollyMaterial: string
  blueFolderFredG: string
  firstOffJay: string
  uvKitting: string
  woodshopPanel: string
  robertoSub: string
  alexSumelEmtPipe: string
  jaysonBox: string
  jaysonWire: string
  arnoldCut: string
  arnoldCnc: string
  kevinMaterialHandling: string
}

export interface SheetResponse {
  headers: string[];
  rows: SheetProject[];
}

/**
 * Fetches all rows from the "masterData" sheet tab and maps them
 * to the internal SheetProject shape, alongside the headers.
 */
export async function fetchProjectsFromSheet(
  spreadsheetId: string = SPREADSHEET_ID,
  apiKey: string = SHEETS_API_KEY,
  sheetName: string = 'masterData',
): Promise<SheetResponse> {
  const url = `${BASE_URL}/${spreadsheetId}/values/${encodeURIComponent(sheetName)}?key=${apiKey}`
  const res = await fetch(url)

  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body?.error?.message ?? `Google Sheets API error: ${res.status}`)
  }

  const json = await res.json()
  const rows: string[][] = json.values ?? []

  if (rows.length === 0) return { headers: [], rows: [] }

  // First row is the header
  const [header, ...dataRows] = rows

  // Using indices based on the user's requested order
  const data = dataRows
    .filter((row) => row.some((cell) => cell?.trim()))  // skip empty rows
    .map((row) => ({
      salesOrder:      row[0]   ?? '',
      productionOrder: row[1]   ?? '',
      asBuiltDate:     row[2]   || null,
      shipDate:        row[3]   || null,
      supervisors:     row[4]   ?? '',
      line:            row[5]   ?? '',
      plNumber:        row[6]   ?? '',
      name:            row[7]   || 'Unnamed Project',
      product:         row[8]   ?? '',
      productionStart: row[9]   || null,
      productionEnd:   row[10]  || null,
      phase:           row[11]  ?? '',
      drawing:         row[12]  ?? '',
      supportStart:    row[13]  || null,
      panelMaterial:   row[14]  ?? '',
      hollyMaterial:   row[15]  ?? '',
      blueFolderFredG: row[16]  ?? '',
      firstOffJay:     row[17]  ?? '',
      uvKitting:       row[18]  ?? '',
      woodshopPanel:   row[19]  ?? '',
      robertoSub:      row[20]  ?? '',
      alexSumelEmtPipe:row[21]  ?? '',
      jaysonBox:       row[22]  ?? '',
      jaysonWire:      row[23]  ?? '',
      arnoldCut:       row[24]  ?? '',
      arnoldCnc:       row[25]  ?? '',
      kevinMaterialHandling: row[26] ?? '',
    }))

  return { headers: header.map(h => h.trim()), rows: data }
}

/**
 * Fetches all sheets (tabs) in the spreadsheet and returns their names.
 */
export async function fetchSheetNames(
  spreadsheetId: string = SPREADSHEET_ID,
  apiKey: string = SHEETS_API_KEY,
): Promise<string[]> {
  const url = `${BASE_URL}/${spreadsheetId}?key=${apiKey}`
  const res = await fetch(url)

  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body?.error?.message ?? `Google Sheets API error: ${res.status}`)
  }

  const json = await res.json()
  return (json.sheets ?? []).map((s: any) => s.properties?.title as string).filter(Boolean)
}
