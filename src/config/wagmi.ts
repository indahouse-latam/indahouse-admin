import { http, createConfig } from 'wagmi';
import { base, baseSepolia, polygon, polygonAmoy } from 'wagmi/chains';

/** Chains: QA = polygonAmoy (80002), Production = polygon (137). Base se mantienen por compatibilidad. */
export const config = createConfig({
    chains: [polygonAmoy, polygon, base, baseSepolia],
    transports: {
        [polygonAmoy.id]: http('https://rpc-amoy.polygon.technology'),
        [polygon.id]: http('https://polygon.drpc.org'),
        [base.id]: http(),
        [baseSepolia.id]: http(),
    },
    ssr: true,
});
