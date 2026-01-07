import { useMemo, useState } from 'react'
import { parseExtrato } from './utils/parse'
import { brl, formatDateYMD } from './utils/format'
import type { Movimento } from './types'

type FilterMode = 'all' | 'credits' | 'debits' | 'pix' | 'pix-debits'

function useFiltered(rows: Movimento[], mode: FilterMode, start?: string, end?: string) {
  const startNum = start && /^\d{4}-\d{2}-\d{2}$/.test(start) ? Number(start.replaceAll('-', '')) : undefined
  const endNum = end && /^\d{4}-\d{2}-\d{2}$/.test(end) ? Number(end.replaceAll('-', '')) : undefined

  return useMemo(() => {
    let list = rows
    if (startNum !== undefined) list = list.filter(r => Number(r.Data_Mov) >= startNum)
    if (endNum !== undefined) list = list.filter(r => Number(r.Data_Mov) <= endNum)

    switch (mode) {
      case 'credits': return list.filter(r => r.Deb_Cred === 'C')
      case 'debits': return list.filter(r => r.Deb_Cred === 'D')
      case 'pix': return list.filter(r => /pix/i.test(r.Historico))
      case 'pix-debits': return list.filter(r => /pix/i.test(r.Historico) && r.Deb_Cred === 'D')
      default: return list
    }
  }, [rows, mode, startNum, endNum])
}

function sum(rows: Movimento[], predicate?: (r: Movimento) => boolean) {
  return rows.reduce((acc, r) => acc + (predicate ? (predicate(r) ? r.Valor : 0) : r.Valor), 0)
}

function downloadCSV(filename: string, rows: Movimento[]) {
  const header = `"Conta";"Data_Mov";"Nr_Doc";"Historico";"Valor";"Deb_Cred"`
  const body = rows.map(r => {
    const valor = r.Valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    return `"${r.Conta}";"${r.Data_Mov}";"${r.Nr_Doc}";"${r.Historico}";"${valor}";"${r.Deb_Cred}"`
  }).join('\n')
  const blob = new Blob([header + '\n' + body], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

const exemploNovembro = `"Conta";"Data_Mov";"Nr_Doc";"Historico";"Valor";"Deb_Cred"
"0007620524925";"20251201";"011822";"PIX RECEBIDO";"188,00";"C"
"0007620524925";"20251201";"000000";"CREDITO JUROS";"0,01";"C"
"0007620524925";"20251201";"000000";"CORRECAO MONETARIA";"0,00";"C"
"0007620524925";"20251128";"281911";"PIX ENVIADO";"290,00";"D"
"0007620524925";"20251128";"281719";"PIX RECEBIDO";"181,00";"C"
"0007620524925";"20251128";"281521";"PIX ENVIADO";"187,00";"D"
"0007620524925";"20251128";"281224";"PIX RECEBIDO";"257,00";"C"
"0007620524925";"20251128";"281113";"PIX ENVIADO";"500,00";"D"
"0007620524925";"20251128";"280945";"DEPOSITO DINH LOTERICO";"150,00";"C"
"0007620524925";"20251128";"280623";"PIX RECEBIDO";"316,00";"C"
"0007620524925";"20251127";"271908";"PIX ENVIADO";"300,00";"D"
"0007620524925";"20251127";"271245";"PIX RECEBIDO";"300,00";"C"
"0007620524925";"20251126";"262113";"PIX ENVIADO";"900,00";"D"
"0007620524925";"20251126";"262111";"PIX ENVIADO";"100,00";"D"
"0007620524925";"20251126";"262110";"PIX RECEBIDO";"1.060,00";"C"
"0007620524925";"20251125";"252216";"PIX ENVIADO";"500,00";"D"
"0007620524925";"20251125";"251922";"PIX RECEBIDO";"487,00";"C"
"0007620524925";"20251125";"251253";"PIX ENVIADO";"94,00";"D"
"0007620524925";"20251125";"251004";"PIX ENVIADO";"10,50";"D"
"0007620524925";"20251125";"250930";"PIX ENVIADO";"1.040,00";"D"
"0007620524925";"20251125";"250928";"PIX ENVIADO";"100,00";"D"
"0007620524925";"20251125";"250927";"PIX ENVIADO";"1.000,00";"D"
"0007620524925";"20251125";"250922";"PIX RECEBIDO";"801,46";"C"
"0007620524925";"20251125";"250856";"PIX RECEBIDO";"1.033,24";"C"
"0007620524925";"20251125";"250603";"PIX ENVIADO";"100,00";"D"
"0007620524925";"20251124";"242016";"PIX ENVIADO";"1.000,00";"D"
"0007620524925";"20251124";"241916";"PIX RECEBIDO";"1.422,00";"C"
"0007620524925";"20251124";"241628";"PIX ENVIADO";"200,00";"D"
"0007620524925";"20251124";"221558";"PIX ENVIADO";"90,00";"D"
"0007620524925";"20251124";"221359";"PIX ENVIADO";"94,50";"D"
"0007620524925";"20251124";"221153";"PIX RECEBIDO";"500,00";"C"
"0007620524925";"20251121";"211837";"PIX ENVIADO";"690,00";"D"
"0007620524925";"20251121";"211726";"PIX RECEBIDO";"661,20";"C"
"0007620524925";"20251121";"211341";"PIX ENVIADO";"1.500,00";"D"
"0007620524925";"20251121";"211334";"PIX RECEBIDO";"1.500,00";"C"
"0007620524925";"20251121";"202335";"PIX ENVIADO";"300,00";"D"
"0007620524925";"20251121";"202059";"PIX RECEBIDO";"312,00";"C"
"0007620524925";"20251119";"191227";"PIX ENVIADO";"700,00";"D"
"0007620524925";"20251119";"191224";"PIX RECEBIDO";"252,00";"C"
"0007620524925";"20251119";"190841";"PIX RECEBIDO";"250,00";"C"
"0007620524925";"20251118";"182027";"PIX RECEBIDO";"189,00";"C"
"0007620524925";"20251118";"181123";"PIX ENVIADO";"2.000,00";"D"
"0007620524925";"20251118";"181057";"PIX RECEBIDO";"1.499,27";"C"
"0007620524925";"20251118";"181039";"PIX RECEBIDO";"200,00";"C"
"0007620524925";"20251118";"181019";"PIX RECEBIDO";"305,00";"C"
"0007620524925";"20251117";"172041";"PIX ENVIADO";"100,00";"D"
"0007620524925";"20251117";"172040";"PIX ENVIADO";"400,00";"D"
"0007620524925";"20251117";"171848";"PIX RECEBIDO";"518,60";"C"
"0007620524925";"20251117";"171540";"PIX ENVIADO";"2.350,00";"D"
"0007620524925";"20251117";"171437";"DEPOSITO DINH LOTERICO";"1.900,00";"C"
"0007620524925";"20251117";"171344";"PIX RECEBIDO";"188,00";"C"
"0007620524925";"20251117";"171238";"PIX RECEBIDO";"262,00";"C"
"0007620524925";"20251114";"141845";"PIX ENVIADO";"300,00";"D"
"0007620524925";"20251114";"141300";"PIX RECEBIDO";"300,00";"C"
"0007620524925";"20251113";"131203";"PIX ENVIADO";"830,00";"D"
"0007620524925";"20251112";"121211";"PIX RECEBIDO";"585,00";"C"
"0007620524925";"20251111";"111820";"PIX RECEBIDO";"238,00";"C"
"0007620524925";"20251111";"111549";"PIX ENVIADO";"150,00";"D"
"0007620524925";"20251111";"111320";"PAG BOLETO IBC";"1.731,30";"D"
"0007620524925";"20251111";"111245";"PIX ENVIADO";"100,00";"D"
"0007620524925";"20251111";"111241";"PIX ENVIADO";"1.590,00";"D"
"0007620524925";"20251111";"110918";"PIX RECEBIDO";"200,00";"C"
"0007620524925";"20251111";"110854";"PIX RECEBIDO";"1.000,00";"C"
"0007620524925";"20251111";"110742";"PIX ENVIADO";"30,70";"D"
"0007620524925";"20251111";"110729";"PIX RECEBIDO";"897,00";"C"
"0007620524925";"20251111";"110721";"PIX RECEBIDO";"567,00";"C"
"0007620524925";"20251111";"110633";"PIX RECEBIDO";"313,00";"C"
"0007620524925";"20251110";"102132";"PIX ENVIADO";"1.000,00";"D"
"0007620524925";"20251110";"102103";"PIX RECEBIDO";"524,00";"C"
"0007620524925";"20251110";"102033";"PIX RECEBIDO";"185,00";"C"
"0007620524925";"20251110";"101947";"PIX RECEBIDO";"874,45";"C"
"0007620524925";"20251110";"101817";"PIX ENVIADO";"100,00";"D"
"0007620524925";"20251110";"101816";"PIX ENVIADO";"1.800,00";"D"
"0007620524925";"20251110";"101651";"PIX RECEBIDO";"1.242,00";"C"
"0007620524925";"20251110";"101332";"PIX RECEBIDO";"40,00";"C"
"0007620524925";"20251110";"101332";"PIX RECEBIDO";"84,00";"C"
"0007620524925";"20251110";"101327";"PIX RECEBIDO";"383,00";"C"
"0007620524925";"20251110";"101324";"PIX RECEBIDO";"127,50";"C"
"0007620524925";"20251110";"101039";"PIX ENVIADO";"1.000,00";"D"
"0007620524925";"20251110";"100900";"PIX RECEBIDO";"190,00";"C"
"0007620524925";"20251110";"080956";"PIX RECEBIDO";"168,50";"C"
"0007620524925";"20251107";"071727";"PIX RECEBIDO";"105,00";"C"
"0007620524925";"20251107";"071240";"PIX RECEBIDO";"298,00";"C"
"0007620524925";"20251107";"070939";"PIX RECEBIDO";"300,00";"C"
"0007620524925";"20251106";"061233";"PIX ENVIADO";"100,00";"D"
"0007620524925";"20251106";"061226";"PIX ENVIADO";"1.050,00";"D"
"0007620524925";"20251106";"061027";"PIX ENVIADO";"24,98";"D"
"0007620524925";"20251106";"061026";"PIX RECEBIDO";"130,00";"C"
"0007620524925";"20251106";"060944";"PIX RECEBIDO";"160,65";"C"
"0007620524925";"20251106";"060927";"PIX RECEBIDO";"661,30";"C"
"0007620524925";"20251105";"052220";"PIX ENVIADO";"1.000,00";"D"
"0007620524925";"20251105";"051900";"PIX RECEBIDO";"1.229,00";"C"
"0007620524925";"20251105";"051635";"PIX ENVIADO";"420,00";"D"
"0007620524925";"20251105";"051311";"PIX RECEBIDO";"275,00";"C"
"0007620524925";"20251103";"032038";"PIX RECEBIDO";"144,50";"C"
"0007620524925";"20251103";"031654";"PIX ENVIADO";"880,00";"D"
"0007620524925";"20251103";"031639";"PIX RECEBIDO";"181,00";"C"
"0007620524925";"20251103";"031636";"PIX RECEBIDO";"538,00";"C"
"0007620524925";"20251103";"030258";"PIX RECEBIDO";"167,00";"C"
"0007620524925";"20251101";"000000";"CREDITO JUROS";"0,02";"C"
"0007620524925";"20251101";"000000";"CORRECAO MONETARIA";"0,01";"C"
`

export default function App() {
  const [raw, setRaw] = useState('')
  const [rows, setRows] = useState<Movimento[]>([])
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<FilterMode>('all')
  const [start, setStart] = useState<string>('') // yyyy-mm-dd
  const [end, setEnd] = useState<string>('')     // yyyy-mm-dd

  const filtered = useFiltered(rows, filter, start, end)

  const totals = useMemo(() => {
    const credits = sum(filtered, r => r.Deb_Cred === 'C')
    const debits = sum(filtered, r => r.Deb_Cred === 'D')
    const pixDebits = sum(filtered, r => /pix/i.test(r.Historico) && r.Deb_Cred === 'D')
    return { credits, debits, pixDebits, net: credits - debits }
  }, [filtered])

  function onParse() {
    try {
      const parsed = parseExtrato(raw)
      setRows(parsed)
      setError(null)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Erro ao processar arquivo')
      setRows([])
    }
  }

  function loadExample() {
    setRaw(exemploNovembro)
  }

  function resetAll() {
    setRaw('')
    setRows([])
    setError(null)
    setFilter('all')
    setStart('')
    setEnd('')
  }

  return (
    <div className="container">
      <h1>Extrato Viewer</h1>
      <p className="muted">Cole abaixo o conteúdo do seu extrato (como no Bloco de Notas) e clique em "Processar".</p>

      <div className="card">
        <div className="row">
          <div>
            <label>Conteúdo do extrato</label>
            <textarea
              placeholder='Exemplo de cabeçalho:\n"Conta";"Data_Mov";"Nr_Doc";"Historico";"Valor";"Deb_Cred"\n...'
              value={raw}
              onChange={e => setRaw(e.target.value)}
            />
            <div className="spacer"></div>
            <div className="toolbar">
              <button className="btn-primary" onClick={onParse}>Processar</button>
              <button onClick={loadExample}>Carregar exemplo (Nov/2025)</button>
              <button onClick={resetAll}>Limpar</button>
            </div>
            {error && <p style={{ color: '#f87171' }}>Erro: {error}</p>}
          </div>

          <div>
            <h3>Filtros</h3>
            <div className="toolbar" role="group" aria-label="Filtros rápidos">
              <button onClick={() => setFilter('all')} className={filter==='all' ? 'btn btn-primary' : 'btn'}>Todos</button>
              <button onClick={() => setFilter('credits')} className={filter==='credits' ? 'btn btn-primary' : 'btn'}>Somente créditos</button>
              <button onClick={() => setFilter('debits')} className={filter==='debits' ? 'btn btn-primary' : 'btn'}>Somente débitos</button>
              <button onClick={() => setFilter('pix')} className={filter==='pix' ? 'btn btn-primary' : 'btn'}>Somente PIX</button>
              <button onClick={() => setFilter('pix-debits')} className={filter==='pix-debits' ? 'btn btn-primary' : 'btn'}>PIX + Débito</button>
            </div>

            <div className="spacer"></div>

            <div className="grid-3">
              <div>
                <label>Data inicial</label><br/>
                <input type="date" value={start} onChange={e => setStart(e.target.value)} />
              </div>
              <div>
                <label>Data final</label><br/>
                <input type="date" value={end} onChange={e => setEnd(e.target.value)} />
              </div>
              <div style={{ alignSelf: 'end' }}>
                <button onClick={() => { setStart(''); setEnd('') }}>Limpar datas</button>
              </div>
            </div>

            <div className="spacer"></div>

            <h3>Totais (após filtros)</h3>
            <div className="toolbar" style={{ gap: 12 }}>
              <span className="chip">Créditos: <strong>{brl.format(totals.credits)}</strong></span>
              <span className="chip">Débitos: <strong>{brl.format(totals.debits)}</strong></span>
              <span className="chip">Saldo: <strong>{brl.format(totals.net)}</strong></span>
              <span className="chip">PIX + Débito: <strong>{brl.format(totals.pixDebits)}</strong></span>
            </div>

            <div className="spacer"></div>

            <div className="toolbar">
              <button onClick={() => downloadCSV('extrato_filtrado.csv', filtered)}>Exportar CSV (filtrado)</button>
            </div>
          </div>
        </div>
      </div>

      <div className="spacer"></div>

      <div className="card" style={{ overflow: 'auto', maxHeight: '60vh' }}>
        <table>
          <thead>
            <tr>
              <th style={{ minWidth: 110 }}>Data</th>
              <th style={{ minWidth: 100 }}>Nr_Doc</th>
              <th style={{ minWidth: 240 }}>Histórico</th>
              <th style={{ minWidth: 140 }}>Valor</th>
              <th style={{ minWidth: 90 }}>Tipo</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r, idx) => (
              <tr key={idx}>
                <td>{formatDateYMD(r.Data_Mov)}</td>
                <td>{r.Nr_Doc}</td>
                <td>{r.Historico}</td>
                <td className={r.Deb_Cred === 'C' ? 'credit' : 'debit'}>
                  {brl.format(r.Valor)}
                </td>
                <td>{r.Deb_Cred === 'C' ? 'Crédito' : 'Débito'}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="muted">Nenhum dado para exibir. Cole o extrato e clique em Processar.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="spacer"></div>
      <p className="muted">Dica: use "Somente créditos" para somar entradas e "PIX + Débito" para somar saídas via PIX.</p>
    </div>
  )
}
