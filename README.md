# Extrato Viewer (React + Vite) — GitHub Pages

Frontend sem backend para colar o extrato em texto (formato com `;` e `"`), ver em tabela, filtrar e somar.
Publicação automática via GitHub Pages.

URL (após merge na main e execução do workflow):  
https://naathanferreira.github.io/extratos/

## Funcionalidades
- Colar o conteúdo do extrato direto do Bloco de Notas
- Parse robusto (aspas, `;`, números em pt-BR)
- Filtros: Todos, Créditos, Débitos, Somente PIX, PIX + Débito
- Intervalo de datas
- Totais (Créditos, Débitos, Saldo, PIX Débito)
- Exportar CSV do filtrado
- Exemplo de novembro pré-carregado

## Rodar localmente
```bash
npm ci
npm run dev
```

## Build
```bash
npm run build
npm run preview
```

## Deploy (GitHub Pages)
- O workflow `.github/workflows/deploy.yml` publica automaticamente em cada push na `main`.
- O `vite.config.ts` está com `base: '/extratos/'` para funcionar em Pages.

## Formato esperado (cabeçalho)
```
"Conta";"Data_Mov";"Nr_Doc";"Historico";"Valor";"Deb_Cred"
```
- Datas: `YYYYMMDD`
- Valores: pt-BR, ex: `1.060,00`
