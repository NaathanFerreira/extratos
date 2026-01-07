import { Movimento } from '../types'
import { parseBRLToNumber, parseYYYYMMDD } from './format'

const SPLIT_SEMI_OUTSIDE_QUOTES = /;(?=(?:[^"]*"[^"]*")*[^"]*$)/

function stripQuotes(s: string): string {
  return s.trim().replace(/^"(.*)"$/, '$1')
}

export function parseExtrato(raw: string): Movimento[] {
  const text = raw.replace(/^\uFEFF/, '').trim()
  if (!text) return []

  const lines = text.split(/\r?\n/).filter(l => l.trim().length > 0)
  if (lines.length < 2) return []

  const header = lines[0].split(SPLIT_SEMI_OUTSIDE_QUOTES).map(stripQuotes)
  const expected = ["Conta","Data_Mov","Nr_Doc","Historico","Valor","Deb_Cred"]
  const looksOk = expected.every((col, i) => header[i]?.toLowerCase() === col.toLowerCase())
  if (!looksOk && header.length !== 6) {
    throw new Error('Cabeçalho inválido. Esperado: "Conta";"Data_Mov";"Nr_Doc";"Historico";"Valor";"Deb_Cred"')
  }

  const rows: Movimento[] = []
  for (let i = 1; i < lines.length; i++) {
    const parts = lines[i].split(SPLIT_SEMI_OUTSIDE_QUOTES).map(s => s.trim())
    if (parts.length !== 6) continue

    const Conta      = stripQuotes(parts[0])
    const Data_Mov   = stripQuotes(parts[1])
    const Nr_Doc     = stripQuotes(parts[2])
    const Historico  = stripQuotes(parts[3])
    const Valor      = parseBRLToNumber(stripQuotes(parts[4]))
    const Deb_Cred   = stripQuotes(parts[5]).toUpperCase() as 'D'|'C'
    const Data       = parseYYYYMMDD(Data_Mov)

    if (!Data_Mov || Number.isNaN(Valor) || (Deb_Cred !== 'D' && Deb_Cred !== 'C')) continue

    rows.push({ Conta, Data_Mov, Nr_Doc, Historico, Valor, Deb_Cred, Data })
  }

  rows.sort((a,b) => {
    const d = b.Data.getTime() - a.Data.getTime()
    if (d !== 0) return d
    const na = Number(a.Nr_Doc), nb = Number(b.Nr_Doc)
    if (!Number.isNaN(na) && !Number.isNaN(nb)) return nb - na
    return b.Nr_Doc.localeCompare(a.Nr_Doc)
  })

  return rows
}
