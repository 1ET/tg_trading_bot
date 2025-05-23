import {
    Connection,
    PublicKey,
    Keypair,
    Transaction,
    VersionedTransaction,
    TransactionMessage,
    GetProgramAccountsResponse,
} from '@solana/web3.js'
import {
    Liquidity,
    LiquidityPoolKeys,
    jsonInfo2PoolKeys,
    LiquidityPoolJsonInfo,
    TokenAccount,
    Token,
    TokenAmount,
    TOKEN_PROGRAM_ID,
    Percent,
    SPL_ACCOUNT_LAYOUT,
    LIQUIDITY_STATE_LAYOUT_V4,
    MARKET_STATE_LAYOUT_V3,
    Market,
} from '@raydium-io/raydium-sdk'
import { Wallet } from '@project-serum/anchor'
import base58 from 'bs58'

class RaydiumSwap {
    RAYDIUM_V4_PROGRAM_ID: String
    allPoolKeysJson: LiquidityPoolJsonInfo[]
    connection: Connection
    wallet: Wallet

    constructor(RPC: Connection, WALLET_PRIVATE_KEY: string, RAYDIUM_V4_PROGRAM_ID) {
        this.RAYDIUM_V4_PROGRAM_ID = RAYDIUM_V4_PROGRAM_ID
        this.connection = RPC
        this.wallet = new Wallet(Keypair.fromSecretKey(base58.decode(WALLET_PRIVATE_KEY)))
        this.allPoolKeysJson = []
    }

    async loadPoolKeys() {
        try {
            // 目前写死，后面要改
            this.allPoolKeysJson = [{
                id: "59VtDHQrcDKswbaStjTsjNiqLngjX72UHFqChnpAb93p",
                baseMint: "So11111111111111111111111111111111111111112",
                quoteMint: "HZ1JovNiVvGrGNiiYvEozEVgZ58xaU3RKwX8eACQBCt3",
                lpMint: "EMTRJDCFK2Q9bkwjMrRdvVKc3Wm6QCHDJgLGjVvDePJx",
                baseDecimals: 9,
                quoteDecimals: 6,
                lpDecimals: 9,
                version: 4,
                programId: "675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8",
                authority: "5Q544fKrFoe6tsEbD7S8EmxGTJYAKtTVhAW5Q5pge4j1",
                baseVault: "HLX4E1BbDfoX4e5rzhw7Wwd1pArPzXd8XdZ3DaBXY9BR",
                quoteVault: "5vqxzbPytvVm58vPkA2WYWvoAYfa8AoxD9i1UXCdqzCN",
                lpVault: "11111111111111111111111111111111",
                openOrders: "8Cv8eC4PscdjZmiN1v9oVU7KtDXLd6zbGJkiofjN2Jcf",
                targetOrders: "9JJuvtJFYspS6jQktjFs3Uyr4k6GmsDSX6TKVBzct3xc",
                withdrawQueue: "11111111111111111111111111111111",
                marketVersion: 4,
                marketProgramId: "srmqPvymJeFKQ4zGQed1GFppgkRHL9kaELCbyksJtPX",
                marketId: "8nR8dG6b1CcxukTUvZRYtsFP7sZN9zZyFD5yWKWgmdfp",
                marketAuthority: "5XnStRwYjYE4vbFZSsaTihKFwJNis4ehbcaRaUMNfQX1",
                marketBaseVault: "J99wLj24sT4rk994Re5LhGsDJeyiWQSubVDo4YCPBYGy",
                marketQuoteVault: "H6cxTA66YsWFvZnoMHvprYyUUo1gttpitijgqFLavBgT",
                marketBids: "8NLTH1UZQVt26DGCZtcZcavoTwnyqsyoDAXxYGx4VMjF",
                marketAsks: "JDAo6dgKyV2TbjFz8gJz8pci7kJMaHB39UDT3hb9eNFX",
                marketEventQueue: "86cjVFnBZhFQcVGu2zeRiWEzHvBrocg62az5ntw7E9iB"
                // lookupTableAccount: "7bNYiTbYfxryEV6t61tFVSa9kVaj15Vsf8ofvE6kcfck"
            }]
        } catch (error) {
            console.log('loadPoolKeys_error')
        }
    }

    findPoolInfoForTokens(mintA: string, mintB: string) {
        const poolData = this.allPoolKeysJson.find(
            (i) => (i.baseMint === mintA && i.quoteMint === mintB) || (i.baseMint === mintB && i.quoteMint === mintA)
        )

        if (!poolData) return null

        return jsonInfo2PoolKeys(poolData) as LiquidityPoolKeys
    }

    private async _getProgramAccounts(baseMint: string, quoteMint: string): Promise<GetProgramAccountsResponse> {
        const layout = LIQUIDITY_STATE_LAYOUT_V4

        return this.connection.getProgramAccounts(new PublicKey(this.RAYDIUM_V4_PROGRAM_ID), {
            filters: [
                { dataSize: layout.span },
                {
                    memcmp: {
                        offset: layout.offsetOf('baseMint'),
                        bytes: new PublicKey(baseMint).toBase58(),
                    },
                },
                {
                    memcmp: {
                        offset: layout.offsetOf('quoteMint'),
                        bytes: new PublicKey(quoteMint).toBase58(),
                    },
                },
            ],
        })
    }

    async getProgramAccounts(baseMint: string, quoteMint: string) {
        const response = await Promise.all([
            this._getProgramAccounts(baseMint, quoteMint),
            this._getProgramAccounts(quoteMint, baseMint),
        ])

        return response.filter((r) => r.length > 0)[0] || []
    }

    async findRaydiumPoolInfo(baseMint: string, quoteMint: string): Promise<LiquidityPoolKeys | undefined> {
        const layout = LIQUIDITY_STATE_LAYOUT_V4

        const programData = await this.getProgramAccounts(baseMint, quoteMint)

        const collectedPoolResults = programData
            .map((info) => ({
                id: new PublicKey(info.pubkey),
                version: 4,
                programId: new PublicKey(this.RAYDIUM_V4_PROGRAM_ID),
                ...layout.decode(info.account.data),
            }))
            .flat()

        const pool = collectedPoolResults[0]

        if (!pool) return undefined

        const market = await this.connection.getAccountInfo(pool.marketId).then((item) => ({
            programId: item!.owner,
            ...MARKET_STATE_LAYOUT_V3.decode(item!.data),
        }))

        const authority = Liquidity.getAssociatedAuthority({
            programId: new PublicKey(this.RAYDIUM_V4_PROGRAM_ID),
        }).publicKey

        const marketProgramId = market.programId

        const poolKeys = {
            id: pool.id,
            baseMint: pool.baseMint,
            quoteMint: pool.quoteMint,
            lpMint: pool.lpMint,
            baseDecimals: Number.parseInt(pool.baseDecimal.toString()),
            quoteDecimals: Number.parseInt(pool.quoteDecimal.toString()),
            lpDecimals: Number.parseInt(pool.baseDecimal.toString()),
            version: pool.version,
            programId: pool.programId,
            openOrders: pool.openOrders,
            targetOrders: pool.targetOrders,
            baseVault: pool.baseVault,
            quoteVault: pool.quoteVault,
            marketVersion: 3,
            authority: authority,
            marketProgramId,
            marketId: market.ownAddress,
            marketAuthority: Market.getAssociatedAuthority({
                programId: marketProgramId,
                marketId: market.ownAddress,
            }).publicKey,
            marketBaseVault: market.baseVault,
            marketQuoteVault: market.quoteVault,
            marketBids: market.bids,
            marketAsks: market.asks,
            marketEventQueue: market.eventQueue,
            withdrawQueue: pool.withdrawQueue,
            lpVault: pool.lpVault,
            lookupTableAccount: PublicKey.default,
        } as LiquidityPoolKeys

        return poolKeys
    }

    async getOwnerTokenAccounts() {
        const walletTokenAccount = await this.connection.getTokenAccountsByOwner(this.wallet.publicKey, {
            programId: TOKEN_PROGRAM_ID,
        })

        return walletTokenAccount.value.map((i) => ({
            pubkey: i.pubkey,
            programId: i.account.owner,
            accountInfo: SPL_ACCOUNT_LAYOUT.decode(i.account.data),
        }))
    }

    async getSwapTransaction(
        toToken: string,
        amount: number,
        poolKeys: LiquidityPoolKeys,
        maxLamports: number = 100000,
        useVersionedTransaction = true,
        fixedSide: 'in' | 'out' = 'in',
        slippage: number = 5
    ): Promise<Transaction | VersionedTransaction> {
        const directionIn = poolKeys.quoteMint.toString() == toToken
        const { minAmountOut, amountIn } = await this.calcAmountOut(poolKeys, amount, slippage, directionIn)

        const userTokenAccounts = await this.getOwnerTokenAccounts()
        const swapTransaction = await Liquidity.makeSwapInstructionSimple({
            connection: this.connection,
            makeTxVersion: useVersionedTransaction ? 0 : 1,
            poolKeys: {
                ...poolKeys,
            },
            userKeys: {
                tokenAccounts: userTokenAccounts,
                owner: this.wallet.publicKey,
            },
            amountIn: amountIn,
            amountOut: minAmountOut,
            fixedSide: fixedSide,
            config: {
                bypassAssociatedCheck: false,
            },
            computeBudgetConfig: {
                microLamports: maxLamports,
            },
        })

        const recentBlockhashForSwap = await this.connection.getLatestBlockhash()
        const instructions = swapTransaction.innerTransactions[0].instructions.filter(Boolean)

        if (useVersionedTransaction) {
            const versionedTransaction = new VersionedTransaction(
                new TransactionMessage({
                    payerKey: this.wallet.publicKey,
                    recentBlockhash: recentBlockhashForSwap.blockhash,
                    instructions: instructions,
                }).compileToV0Message()
            )

            versionedTransaction.sign([this.wallet.payer])

            return versionedTransaction
        }

        const legacyTransaction = new Transaction({
            blockhash: recentBlockhashForSwap.blockhash,
            lastValidBlockHeight: recentBlockhashForSwap.lastValidBlockHeight,
            feePayer: this.wallet.publicKey,
        })

        legacyTransaction.add(...instructions)

        return legacyTransaction
    }

    async sendLegacyTransaction(tx: Transaction) {
        const txid = await this.connection.sendTransaction(tx, [this.wallet.payer], {
            skipPreflight: true,
        })

        return txid
    }

    async sendVersionedTransaction(tx: VersionedTransaction) {
        const txid = await this.connection.sendTransaction(tx, {
            skipPreflight: true,
        })

        return txid
    }

    async simulateLegacyTransaction(tx: Transaction) {
        const txid = await this.connection.simulateTransaction(tx, [this.wallet.payer])
        return txid
    }

    async simulateVersionedTransaction(tx: VersionedTransaction) {
        const txid = await this.connection.simulateTransaction(tx)
        return txid
    }

    getTokenAccountByOwnerAndMint(mint: PublicKey) {
        return {
            programId: TOKEN_PROGRAM_ID,
            pubkey: PublicKey.default,
            accountInfo: {
                mint: mint,
                amount: 0,
            },
        } as unknown as TokenAccount
    }

    async calcAmountOut(
        poolKeys: LiquidityPoolKeys,
        rawAmountIn: number,
        slippage: number = 5,
        swapInDirection: boolean
    ) {
        const poolInfo = await Liquidity.fetchInfo({ connection: this.connection, poolKeys })

        let currencyInMint = poolKeys.baseMint
        let currencyInDecimals = poolInfo.baseDecimals
        let currencyOutMint = poolKeys.quoteMint
        let currencyOutDecimals = poolInfo.quoteDecimals

        if (!swapInDirection) {
            currencyInMint = poolKeys.quoteMint
            currencyInDecimals = poolInfo.quoteDecimals
            currencyOutMint = poolKeys.baseMint
            currencyOutDecimals = poolInfo.baseDecimals
        }

        const currencyIn = new Token(TOKEN_PROGRAM_ID, currencyInMint, currencyInDecimals)
        const amountIn = new TokenAmount(currencyIn, rawAmountIn.toFixed(currencyInDecimals), false)
        const currencyOut = new Token(TOKEN_PROGRAM_ID, currencyOutMint, currencyOutDecimals)
        const slippageX = new Percent(slippage, 100) // 5% slippage

        const { amountOut, minAmountOut, currentPrice, executionPrice, priceImpact, fee } = Liquidity.computeAmountOut({
            poolKeys,
            poolInfo,
            amountIn,
            currencyOut,
            slippage: slippageX,
        })

        return {
            amountIn,
            amountOut,
            minAmountOut,
            currentPrice,
            executionPrice,
            priceImpact,
            fee,
        }
    }
}

export default RaydiumSwap