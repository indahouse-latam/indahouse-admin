# Entornos: QA vs Production

- **Rama `main`** → **Production** (Polygon Mainnet, chain 137)
- **Rama `develop`** → **QA** (Polygon Amoy testnet, chain 80002)

El entorno se define con la variable **`NEXT_PUBLIC_APP_ENV`**:

- `NEXT_PUBLIC_APP_ENV=production` → contratos y chain de producción (Polygon)
- `NEXT_PUBLIC_APP_ENV=qa` o sin definir → QA (Polygon Amoy)

La variable **`NEXT_PUBLIC_POLYGON_AMOY_RPC_URL`** es obligatoria en Development, Preview y Production. Debe contener una URL HTTPS activa para Polygon Amoy.

Los valores `NEXT_PUBLIC_*` se incorporan durante el build. Cualquier cambio requiere volver a desplegar la aplicación.

Todo proveedor privado configurado en una variable `NEXT_PUBLIC_*` queda visible en el navegador. Debe restringirse por dominio y cuota desde el panel del proveedor.

## Archivos de ejemplo

- **`.env.qa.example`** – Variables para QA (develop). Copia a `.env.local` en local.
- **`.env.production.example`** – Variables para Production (main). Usar como referencia; **no subir secretos**. Configurar en Vercel → Project → Settings → Environment Variables.

## Vercel

1. **Production** (deploys desde `main`): en Environment Variables, asignar a **Production** y definir `NEXT_PUBLIC_APP_ENV=production`, `NEXT_PUBLIC_POLYGON_AMOY_RPC_URL`, `NYX_API_BASE`, `NYX_V3_CLIENT_API_KEY` y las variables de API / Google Maps.
2. **Preview** (deploys desde `develop` u otras ramas): asignar a **Preview** y definir `NEXT_PUBLIC_APP_ENV=qa` (o dejarlo sin definir), `NEXT_PUBLIC_POLYGON_AMOY_RPC_URL`, `NYX_API_BASE`, `NYX_V3_CLIENT_API_KEY` y las URLs de QA.
3. **Development**: definir `NEXT_PUBLIC_POLYGON_AMOY_RPC_URL` y `NYX_*` en `.env.local` junto con las demás variables locales.

## Nyx Wallet V3

El admin ya no usa Ledgit V2 (`NEXT_PUBLIC_WALLET_URL` / private-key proxy). Login Google y custody van contra Nyx V3 vía `/api/nyx` (same-origin).

`NYX_V3_CLIENT_API_KEY` es **solo servidor**. WebAuthn exige que Nyx tenga `WEBAUTHN_ORIGIN` (y CORS) igual a `NEXT_PUBLIC_APP_URL`. Si la PWA usa `app-qa.indahouse.com.co` y el admin otro host, hay que:

- añadir el origin del admin en Nyx, o
- bajar `WEBAUTHN_RP_ID` a `indahouse.com.co` para ambas apps.

Google OAuth V3 también necesita el callback/redirect del admin en la allowlist de Nyx.

## Tras el primer alta V3 (operativo)

La Safe es una address **nueva**. `msg.sender` ya no es la EOA Ledgit.

1. Confirmar `GET /auth/wallet/bootstrap` → `needsWalletBootstrap: false` y `address` = Safe.
2. El alta llama `POST /whitelistWallets` (no GET) con esa address.
3. Volver a otorgar roles on-chain (`CERTIFICATE_MANAGER`, owners de campaña, etc.) a la Safe, no a la EOA V2.
4. CountryManagers / create-for-country siguen usando la **master PK** pegada; no cambian.

## Contratos

- **QA**: direcciones en `src/config/contracts.ts` bajo `CONTRACTS.polygonAmoy` (Polygon Amoy).
- **Production**: placeholders en `CONTRACTS.polygon`. Sustituir por las direcciones reales de Polygon Mainnet cuando estén listas.

En código se usan **`currentContracts`** y **`DEFAULT_CHAIN_ID`** (definidos según `NEXT_PUBLIC_APP_ENV`), no `CONTRACTS.polygonAmoy` directamente.
