type Cell = string | number

function escapeCell(cell: Cell): string {
  const text = String(cell)
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text
}

/** Client-side CSV download (UTF-8 with BOM so Excel opens it correctly). */
export function downloadCsv(filename: string, rows: Cell[][]): void {
  const csv = rows.map((row) => row.map(escapeCell).join(',')).join('\r\n')
  const blob = new Blob(['﻿', csv], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}
