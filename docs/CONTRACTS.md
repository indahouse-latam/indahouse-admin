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
| CertificateFactory     | certFactory     | `0xBaBec9C5ef8Cab422975F46E5020f773DEb07552` | [abis/0xbabec9c5ef8cab422975f46e5020f773deb07552.json](abis/0xbabec9c5ef8cab422975f46e5020f773deb07552.json) |
| PropertyGovernorFactory| govFactory      | `0xd8315a88980c29A332c12707977F07e28f69f278` | [abis/0xd8315a88980c29a332c12707977f07e28f69f278.json](abis/0xd8315a88980c29a332c12707977f07e28f69f278.json) |
| ManagerFactory         | managerFactory  | `0xa6B27216E781aE79C67cAB0Ac470083713Cb3c0E` | [abis/0xa6b27216e781ae79c67cab0ac470083713cb3c0e.json](abis/0xa6b27216e781ae79c67cab0ac470083713cb3c0e.json) |
| PoolFactory           | poolFactory     | `0xd61a2EB8bE544945979b821B7e0909a5fD22D7BD` | [abis/0xd61a2eb8be544945979b821b7e0909a5fd22d7bd.json](abis/0xd61a2eb8be544945979b821b7e0909a5fd22d7bd.json) |
| IndahouseRegistry     | registry        | `0xec375793e3628b25547CE375Ea3B1598D85cd362` | [abis/0xec375793e3628b25547ce375ea3b1598d85cd362.json](abis/0xec375793e3628b25547ce375ea3b1598d85cd362.json) |
| TimelockController    | timeLock        | `0x35A50701FF23552b90f605b3a3E30785EA30eB92` | [abis/0x35a50701ff23552b90f605b3a3e30785ea30eb92.json](abis/0x35a50701ff23552b90f605b3a3e30785ea30eb92.json) |
| TokenFactory          | tokenFactory    | `0x8e05870E1aAcC6105A711D710F62399F8236d360` | [abis/0x8e05870e1aacc6105a711d710f62399f8236d360.json](abis/0x8e05870e1aacc6105a711d710f62399f8236d360.json) |

---

## Batch 2 – Implementaciones (lógica)

| Contrato        | Variable estado       | Address | Archivo ABI |
|-----------------|------------------------|---------|-------------|
| CommitCampaign  | campaignImpl           | `0xa11b503760Eaf0fc210f44EbD0366Aed3696e0ee` | [abis/0xa11b503760eaf0fc210f44ebd0366aed3696e0ee.json](abis/0xa11b503760eaf0fc210f44ebd0366aed3696e0ee.json) |
| IndaDistributor | distributorImpl        | `0x95ABE41a05d96801EDD66E87C61d1CEa24Ec7fc1` | [abis/0x95abe41a05d96801edd66e87c61d1cea24ec7fc1.json](abis/0x95abe41a05d96801edd66e87c61d1cea24ec7fc1.json) |
| IndaAdmin       | indaAdmin              | `0x2Fc5C212b455d67EA08b4b1508df54548BAFAb40` | [abis/0x2fc5c212b455d67ea08b4b1508df54548bafab40.json](abis/0x2fc5c212b455d67ea08b4b1508df54548bafab40.json) |
| IndaProperties | indaProperties         | `0xF619060F2F32B91e036cff996cB58b6Fa0F65Ad0` | [abis/0xf619060f2f32b91e036cff996cb58b6fa0f65ad0.json](abis/0xf619060f2f32b91e036cff996cb58b6fa0f65ad0.json) |
| IndaRoot        | indaRootImpl           | `0xec76762c747D167d4ccefc49643919364b21a5EB` | [abis/0xec76762c747d167d4ccefc49643919364b21a5eb.json](abis/0xec76762c747d167d4ccefc49643919364b21a5eb.json) |
| PropertyRegistry| propertyRegistryImpl   | `0xB1E85A2ffE02D8363c49254781eAb3dcc9295F9C` | [abis/0xb1e85a2ffe02d8363c49254781eab3dcc9295f9c.json](abis/0xb1e85a2ffe02d8363c49254781eab3dcc9295f9c.json) |

---

## Batch 3 – Proxies y routers

| Contrato        | Variable estado         | Address | Archivo ABI |
|-----------------|--------------------------|---------|-------------|
| IndaAdminRouter | adminRouter              | `0xfbB1274D9D23C218DDb4f11a1D772e3d301B844A` | [abis/0xfbb1274d9d23c218ddb4f11a1d772e3d301b844a.json](abis/0xfbb1274d9d23c218ddb4f11a1d772e3d301b844a.json) |
| CommitFactory   | commitFactory            | `0xa0Ef410ff79A469EDf1fe7978087104D5150E4f3` | [abis/0xa0ef410ff79a469edf1fe7978087104d5150e4f3.json](abis/0xa0ef410ff79a469edf1fe7978087104d5150e4f3.json) |
| IndaDistributor (proxy) | distributorProxy | `0x39bDfE6fc43e756cDf26a5011FfD7B7FD48523B6` | [abis/0x39bdfe6fc43e756cdf26a5011ffd7b7fd48523b6.json](abis/0x39bdfe6fc43e756cdf26a5011ffd7b7fd48523b6.json) |
| IndaRoot (proxy)| indaRootProxy            | `0x543F7dF0EBD524b3bE66277E18514B44BAC4b4e1` | [abis/0x543f7df0ebd524b3be66277e18514b44bac4b4e1.json](abis/0x543f7df0ebd524b3be66277e18514b44bac4b4e1.json) |
| PropertyRegistry (proxy) | propertyRegistryProxy | `0x195aaBd7AC85E4FF364b59Cc7A6f5f46e4B45702` | [abis/0x195aabD7ac85e4ff364b59cc7a6f5f46e4b45702.json](abis/0x195aabD7ac85e4ff364b59cc7a6f5f46e4b45702.json) |
| TransactionRouter | router                 | `0x7594A0b010AF7c5e0FBDc0823df4889d509ae50f` | [abis/0x7594a0b010af7c5e0fdbc0823df4889d509ae50f.json](abis/0x7594a0b010af7c5e0fdbc0823df4889d509ae50f.json) |

---

## Batch 5 – Pool (Manager, token, distributor, vault)

| Contrato        | Variable estado   | Address | Archivo ABI |
|-----------------|-------------------|---------|-------------|
| Manager         | manager           | `0x54c59644FA651091038F144E15d0952Ce1BC9558` | [abis/0x54c59644fa651091038f144e15d0952ce1bc9558.json](abis/0x54c59644fa651091038f144e15d0952ce1bc9558.json) |
| IndaDistributor | poolDistributor   | `0xb1b243f5Cc3f579cAf49ee2df4ECd14C76726C80` | [abis/0xb1b243f5cc3f579caf49ee2df4ecd14c76726c80.json](abis/0xb1b243f5cc3f579caf49ee2df4ecd14c76726c80.json) |
| Indh (pool token) | poolToken       | `0xA5b4E347eB2aC837E15AdDD973aA8c93A6487325` | [abis/0xa5b4e347eb2ac837e15addd973aa8c93a6487325.json](abis/0xa5b4e347eb2ac837e15addd973aa8c93a6487325.json) |
| PoolVault       | poolVault         | `0xD7b450420Be6e6d90fB3a9d31506EFEE546972eb` | [abis/0xd7b450420be6e6d90fb3a9d31506efee546972eb.json](abis/0xd7b450420be6e6d90fb3a9d31506efee546972eb.json) |

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
