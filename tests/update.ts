import * as anchor from "@project-serum/anchor";
import { Program, Wallet } from "@project-serum/anchor";
import { expect } from 'chai';
import { CandyMachine } from "../target/types/candy_machine";
import * as test from "./helpers"

describe("Update (Candy Machine)", () => {
    // configure the client to use the local cluster
    anchor.setProvider(anchor.AnchorProvider.env());
    // candy machine for the tests
    const keypair = anchor.web3.Keypair.generate();
    // candy machine program
    const program = anchor.workspace.CandyMachine as Program<CandyMachine>;
    // payer for transactions
    const payer = (program.provider as anchor.AnchorProvider).wallet as Wallet;

    /**
     * Initializes a candy machine.
     */
    it("initialize", async () => {
        const items = 10;
        const data = test.defaultCandyMachineSettings(items, payer.publicKey, false);

        await test.createCandyMachine(program, keypair, payer, data);

        let candyMachine = await program.account.candyMachine.fetch(keypair.publicKey);

        expect(candyMachine.itemsRedeemed.toNumber()).to.equal(0);
        expect(candyMachine.data.itemsAvailable.toNumber()).to.equal(items);
    });

    /**
     * Add a collection mint.
     */
    it("update", async () => {
        let candyMachine = await program.account.candyMachine.fetch(keypair.publicKey);
        let data = candyMachine.data;

        data.itemsAvailable = new anchor.BN(100);

        // we cannot change the number of items

        let fail = false;
        try {
            await program.methods.update(data).accounts({
                candyMachine: keypair.publicKey,
                authority: payer.publicKey,
                wallet: candyMachine.wallet
            }).rpc();
        } catch {
            fail = true;
        }

        expect(fail).equal(true);

        // we can update the symbol

        data.itemsAvailable = new anchor.BN(10);
        data.symbol = "UPDATED";
        data.retainAuthority = false;
        data.isMutable = false;

        await program.methods.update(data).accounts({
            candyMachine: keypair.publicKey,
            authority: payer.publicKey,
            wallet: candyMachine.wallet
        }).rpc();

        candyMachine = await program.account.candyMachine.fetch(keypair.publicKey);
        expect(candyMachine.data.symbol.replace(/\0+$/, '')).to.equal("UPDATED");
        expect(candyMachine.data.retainAuthority).equal(false);
        expect(candyMachine.data.isMutable).equal(false);
    });

    /**
     * Adds config lines to the candy machine.
     */
    it("add_config_lines", async () => {
        let candyMachine = await program.account.candyMachine.fetch(keypair.publicKey);
        const lines = [];

        for (let i = 0; i < candyMachine.data.itemsAvailable.toNumber(); i++) {
            const line = JSON.parse(`{\
                "name": "NFT #${i + 1}",\
                "uri": "uJSdJIsz_tYTcjUEWdeVSj0aR90K-hjDauATWZSi-tQ"\
            }`);

            lines[i] = line;
        }

        await program.methods.addConfigLines(0, lines).accounts({
            candyMachine: keypair.publicKey,
            authority: payer.publicKey,
        }).rpc();
    });

    /**
     * Mint an item from the candy machine.
     */
    it("mint", async () => {
        const signature = await test.mintFromCandyMachine(program, keypair, payer);
        console.log(signature);
    });

    /**
     * Add a collection mint.
     */
    it("update (is_sequential)", async () => {
        let candyMachine = await program.account.candyMachine.fetch(keypair.publicKey);
        let data = test.defaultCandyMachineSettings(
            candyMachine.data.itemsAvailable.toNumber(),
            payer.publicKey,
            true
        );

        // we cannot change the isSequential after minting has started

        let fail = false;
        try {
            await program.methods.update(data).accounts({
                candyMachine: keypair.publicKey,
                authority: payer.publicKey,
                wallet: candyMachine.wallet
            }).rpc();
        } catch {
            fail = true;
        }

        expect(fail).equal(true);
    });

    /**
     * Withdraw the rent from the candy machine.
     */
    it("withdraw", async () => {
        await program.methods.withdraw().accounts({
            candyMachine: keypair.publicKey,
            authority: payer.publicKey,
        }).rpc();
    });
});