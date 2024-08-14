import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { toNano } from '@ton/core';
import { Counter } from '../wrappers/Counter';
import '@ton/test-utils';

describe('Counter', () => {
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let counterContract: SandboxContract<Counter>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        counterContract = blockchain.openContract(await Counter.fromInit(BigInt(12345)));

        deployer = await blockchain.treasury('deployer');

        const deployResult = await counterContract.send(
            deployer.getSender(),
            {
                value: toNano('0.05'),
            },
            {
                $$type: 'Deploy',
                queryId: 0n,
            }
        );

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: counterContract.address,
            deploy: true,
            success: true,
        });
    });

    it('should increment the counter', async () => {
        const counterBefore = await counterContract.getCounter();
        console.log(counterBefore);

        await counterContract.send(
            deployer.getSender(),
            {
                value: toNano('0.05'),
            },
            "increment"
        );

        const counterAfter = await counterContract.getCounter();
        console.log(counterAfter);

        expect(counterAfter-counterBefore).toEqual(BigInt(1));
    });

    it('should increment the counter by a value', async () => {
        const incrementBy = BigInt(10);
        const counterBefore = await counterContract.getCounter();
        console.log(counterBefore);

        await counterContract.send(
            deployer.getSender(),
            {
                value: toNano('0.05'),
            },
            {
                $$type: 'IncrementBy',
                value: incrementBy,
            }
        );

        const counterAfter = await counterContract.getCounter();
        console.log(counterAfter);

        expect(counterAfter-counterBefore).toEqual(incrementBy);
    });
});
