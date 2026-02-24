# Entornos: QA vs Production

- **Rama `main`** → **Production** (Polygon Mainnet, chain 137)
- **Rama `develop`** → **QA** (Polygon Amoy testnet, chain 80002)

El entorno se define con la variable **`NEXT_PUBLIC_APP_ENV`**:

- `NEXT_PUBLIC_APP_ENV=production` → contratos y chain de producción (Polygon)
- `NEXT_PUBLIC_APP_ENV=qa` o sin definir → QA (Polygon Amoy)

## Archivos de ejemplo

- **`.env.qa.example`** – Variables para QA (develop). Copia a `.env.local` en local.
- **`.env.production.example`** – Variables para Production (main). Usar como referencia; **no subir secretos**. Configurar en Vercel → Project → Settings → Environment Variables.

## Vercel

1. **Production** (deploys desde `main`): en Environment Variables, asignar a **Production** y definir `NEXT_PUBLIC_APP_ENV=production` más las variables de API, Wallet, Google Maps, etc.
2. **Preview** (deploys desde `develop` u otras ramas): asignar a **Preview** y definir `NEXT_PUBLIC_APP_ENV=qa` (o dejarlo sin definir) y las URLs/keys de QA.

## Contratos

- **QA**: direcciones en `src/config/contracts.ts` bajo `CONTRACTS.polygonAmoy` (Polygon Amoy).
- **Production**: placeholders en `CONTRACTS.polygon`. Sustituir por las direcciones reales de Polygon Mainnet cuando estén listas.

En código se usan **`currentContracts`** y **`DEFAULT_CHAIN_ID`** (definidos según `NEXT_PUBLIC_APP_ENV`), no `CONTRACTS.polygonAmoy` directamente.
