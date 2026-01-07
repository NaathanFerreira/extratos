export const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

export function parseBRLToNumber(s: string): number {
  const trimmed = s.trim().replace(/^"(.*)"$/, '$1')
  const normalized = trimmed.replace(/\./g, '').replace(',', '.')
  const n = Number(normalized)
  if (Number.isNaN(n)) return 0
  return n
}

export function formatDateYMD(ymd: string): string {
  if (!/^\d{8}$/.test(ymd)) return ymd
  const y = ymd.slice(0, 4)
  const m = ymd.slice(4, 6)
  const d = ymd.slice(6, 8)
  return `${d}/${m}/${y}`
}

export function parseYYYYMMDD(ymd: string): Date {
  const y = Number(ymd.slice(0, 4))
  const m = Number(ymd.slice(4, 6)) - 1
  const d = Number(ymd.slice(6, 8))
  return new Date(Date.UTC(y, m, d))
}
