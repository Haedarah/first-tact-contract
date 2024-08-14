import { toNano } from '@ton/core';
import { Counter } from '../wrappers/Counter';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const counter = provider.open(await Counter.fromInit(BigInt(12345)));

    await counter.send(
        provider.sender(),
        {
            value: toNano('0.05'),
        },
        {
            $$type: 'Deploy',
            queryId: 0n,
        }
    );

    await provider.waitForDeploy(counter.address);
}

// deployed at testnet: EQAk5eokM7uDccGU4n36IRKIWgq6wg_17ucKbjXr9RI_hVnE