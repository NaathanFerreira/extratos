export type DebCred = 'D' | 'C'

export interface Movimento {
  Conta: string
  Data_Mov: string     // "YYYYMMDD"
  Nr_Doc: string
  Historico: string
  Valor: number        // em BRL (ex: 1060.00)
  Deb_Cred: DebCred
  Data: Date           // derivado de Data_Mov
}
