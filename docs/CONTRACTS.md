# Contratos desplegados – Indahouse Contracts v2

Documento de direcciones y ABIs de los contratos desplegados. La información se obtiene de `.deployment_state.json` y la estructura de despliegue de `broadcast/BatchDeployment.s.sol/`. Los ABIs provienen de la carpeta `out/` (artefactos de Forge).

- **Red (broadcast):** 80002 (Polygon Amoy)
- **Código de país:** CO
- **Último batch completado:** 5

Cada contrato tiene su ABI en la carpeta `abis/` con el nombre del address en minúsculas (ej: `abis/0x2c492144dc424b0172edb97e90b4e4cc8b1c4ed9.json`).

---

## Batch 1 – Infraestructura base

| Contrato               | Variable estado | Address | Archivo ABI |
|------------------------|-----------------|---------|-------------|
| CertificateFactory     | certFactory     | `0x1b8dBfD660984d0457c984282FC389556c4fcA77` | [abis/0x1b8dbfd660984d0457c984282fc389556c4fca77.json](abis/0x1b8dbfd660984d0457c984282fc389556c4fca77.json) |
| PropertyGovernorFactory| govFactory      | `0x101A7A4E8a37ffe0321f446b3d4275c58A6F548F` | [abis/0x101a7a4e8a37ffe0321f446b3d4275c58a6f548f.json](abis/0x101a7a4e8a37ffe0321f446b3d4275c58a6f548f.json) |
| ManagerFactory         | managerFactory  | `0xD4aE289b094261Fc43b7D19C6aD7F69440184572` | [abis/0xd4ae289b094261fc43b7d19c6ad7f69440184572.json](abis/0xd4ae289b094261fc43b7d19c6ad7f69440184572.json) |
| PoolFactory           | poolFactory     | `0x362C175AC5B165D5e6dCe2513a8f0A90B28BA92E` | [abis/0x362c175ac5b165d5e6dce2513a8f0a90b28ba92e.json](abis/0x362c175ac5b165d5e6dce2513a8f0a90b28ba92e.json) |
| IndahouseRegistry     | registry        | `0x2C492144dc424B0172eDb97E90b4E4cC8B1c4ed9` | [abis/0x2c492144dc424b0172edb97e90b4e4cc8b1c4ed9.json](abis/0x2c492144dc424b0172edb97e90b4e4cc8b1c4ed9.json) |
| TimelockController    | timeLock        | `0x693861c5AF551F654236b0146dd272682a4bC458` | [abis/0x693861c5af551f654236b0146dd272682a4bc458.json](abis/0x693861c5af551f654236b0146dd272682a4bc458.json) |
| TokenFactory          | tokenFactory    | `0xbe0611f08bB481f3394C0eC32a0e9c6b83a59B2e` | [abis/0xbe0611f08bb481f3394c0ec32a0e9c6b83a59b2e.json](abis/0xbe0611f08bb481f3394c0ec32a0e9c6b83a59b2e.json) |

---

## Batch 2 – Implementaciones (lógica)

| Contrato        | Variable estado       | Address | Archivo ABI |
|-----------------|------------------------|---------|-------------|
| CommitCampaign  | campaignImpl           | `0xCd9Da0a17Da274ae3438F67cAF1cbD06a785C98d` | [abis/0xcd9da0a17da274ae3438f67caf1cbd06a785c98d.json](abis/0xcd9da0a17da274ae3438f67caf1cbd06a785c98d.json) |
| IndaDistributor | distributorImpl        | `0x43b1C3aE275253f1E4DA8c6151718DB674CBBcbE` | [abis/0x43b1c3ae275253f1e4da8c6151718db674cbbcbe.json](abis/0x43b1c3ae275253f1e4da8c6151718db674cbbcbe.json) |
| IndaAdmin       | indaAdmin              | `0x18baA4B46C67De50a34684562C978dcD213CbF2a` | [abis/0x18baa4b46c67de50a34684562c978dcd213cbf2a.json](abis/0x18baa4b46c67de50a34684562c978dcd213cbf2a.json) |
| IndaProperties | indaProperties         | `0x2Fb5632a92F899682442f244B7A89c9E6c6CCec2` | [abis/0x2fb5632a92f899682442f244b7a89c9e6c6ccec2.json](abis/0x2fb5632a92f899682442f244b7a89c9e6c6ccec2.json) |
| IndaRoot        | indaRootImpl           | `0xF1e869E6Ece5B014efb9e70aeCaf8999209BFfD2` | [abis/0xf1e869e6ece5b014efb9e70aecaf8999209bffd2.json](abis/0xf1e869e6ece5b014efb9e70aecaf8999209bffd2.json) |
| PropertyRegistry| propertyRegistryImpl   | `0x522786BC407a0782c92dE3d35B1cF13845D5C6fF` | [abis/0x522786bc407a0782c92de3d35b1cf13845d5c6ff.json](abis/0x522786bc407a0782c92de3d35b1cf13845d5c6ff.json) |

---

## Batch 3 – Proxies y routers

| Contrato        | Variable estado         | Address | Archivo ABI |
|-----------------|--------------------------|---------|-------------|
| IndaAdminRouter | adminRouter              | `0xB81360FF45112a18e9507DAA5349684BB5f99323` | [abis/0xb81360ff45112a18e9507daa5349684bb5f99323.json](abis/0xb81360ff45112a18e9507daa5349684bb5f99323.json) |
| CommitFactory   | commitFactory            | `0x89d9e42FF264AcE25f702e6341bf0dB74113F446` | [abis/0x89d9e42ff264ace25f702e6341bf0db74113f446.json](abis/0x89d9e42ff264ace25f702e6341bf0db74113f446.json) |
| IndaDistributor (proxy) | distributorProxy | `0x5039053A4038BE5550b4379c58df7F2FEf23D3A1` | [abis/0x5039053a4038be5550b4379c58df7f2fef23d3a1.json](abis/0x5039053a4038be5550b4379c58df7f2fef23d3a1.json) |
| IndaRoot (proxy)| indaRootProxy            | `0x107291f56Fb6EeDB9FE78D0A39b6009C9A7EC214` | [abis/0x107291f56fb6eedb9fe78d0a39b6009c9a7ec214.json](abis/0x107291f56fb6eedb9fe78d0a39b6009c9a7ec214.json) |
| PropertyRegistry (proxy) | propertyRegistryProxy | `0xf316Da735789F90A4BeFE89193a11d76eB9EB99C` | [abis/0xf316da735789f90a4befe89193a11d76eb9eb99c.json](abis/0xf316da735789f90a4befe89193a11d76eb9eb99c.json) |
| TransactionRouter | router                 | `0x6fDA9ef9BbB46dc5d1e08a5dED4F5f6880F6CB32` | [abis/0x6fda9ef9bbb46dc5d1e08a5ded4f5f6880f6cb32.json](abis/0x6fda9ef9bbb46dc5d1e08a5ded4f5f6880f6cb32.json) |

---

## Batch 5 – Pool (Manager, token, distributor, vault)

| Contrato        | Variable estado   | Address | Archivo ABI |
|-----------------|-------------------|---------|-------------|
| Manager         | manager           | `0x1C00Abc7938251e72b3807e5f5285422a8F660C0` | [abis/0x1c00abc7938251e72b3807e5f5285422a8f660c0.json](abis/0x1c00abc7938251e72b3807e5f5285422a8f660c0.json) |
| IndaDistributor | poolDistributor   | `0xe74329F258062756c51CB050778cfC67058D53D6` | [abis/0xe74329f258062756c51cb050778cfc67058d53d6.json](abis/0xe74329f258062756c51cb050778cfc67058d53d6.json) |
| Indh (pool token) | poolToken       | `0x07E7a3F6c2ed35ba77e32a1c02edd6c4131C483a` | [abis/0x07e7a3f6c2ed35ba77e32a1c02edd6c4131c483a.json](abis/0x07e7a3f6c2ed35ba77e32a1c02edd6c4131c483a.json) |
| PoolVault       | poolVault         | `0xA0dFdDf152f28cAaF2585EA642Cfe83102C20D8E` | [abis/0xa0dfddf152f28caaf2585ea642cfe83102c20d8e.json](abis/0xa0dfddf152f28caaf2585ea642cfe83102c20d8e.json) |

---

## Estructura de carpetas

```
deployment-docs/
├── CONTRACTS.md          # Este documento (addresses + referencia al ABI)
└── abis/                 # Un archivo JSON por address (solo el array ABI)
    ├── 0x07e7a3f6c2ed35ba77e32a1c02edd6c4131c483a.json
    ├── 0x101a7a4e8a37ffe0321f446b3d4275c58a6f548f.json
    └── ... (23 archivos en total)
```

**Origen de datos:**
- Addresses: `.deployment_state.json`
- Estructura por batches: `broadcast/BatchDeployment.s.sol/80002/`
- ABIs: extraídos de `out/<Contrato>.sol/<Contrato>.json` (campo `abi`)
