import {
    LIQUIDITY_STATE_LAYOUT_V4,
    MARKET_STATE_LAYOUT_V3,
    LiquidityPoolKeysV4,
    TokenAmount,
    Token,
    Percent,
    Liquidity,
    DEVNET_PROGRAM_ID,
    LiquidityStateV4,
    MAINNET_PROGRAM_ID,
} from "@raydium-io/raydium-sdk"

import {
    Connection,
    PublicKey,
    Keypair,
    TransactionMessage,
    ComputeBudgetProgram,
    VersionedTransaction,
    GetProgramAccountsConfig,
} from "@solana/web3.js"

import {
    createAssociatedTokenAccountIdempotentInstruction,
    getAssociatedTokenAddressSync,
    createCloseAccountInstruction,
    getAccount,
    getAssociatedTokenAddress,
    RawAccount,
    TOKEN_PROGRAM_ID,
} from '@solana/spl-token'

import { createPoolKeys, getToken, getWallet } from '@app/raydium/helpers/index';
const SOLANA_CONNECTION = new Connection(
    "https://ophelia-pv3t80-fast-mainnet.helius-rpc.com",
    "confirmed"
)

async function fetchOpenBookAccounts(
    connection: Connection,
    baseMint: PublicKey,
    quoteMint: PublicKey,
    commitment: any
) {
    const accounts = await connection.getProgramAccounts(
        // networkData.openbookProgramId,
        MAINNET_PROGRAM_ID.OPENBOOK_MARKET,
        // DEVNET_PROGRAM_ID.OPENBOOK_MARKET,
        {
            commitment,
            filters: [
                { dataSize: MARKET_STATE_LAYOUT_V3.span },
                {
                    memcmp: {
                        offset: MARKET_STATE_LAYOUT_V3.offsetOf("baseMint"),
                        bytes: baseMint.toBase58(),
                    },
                },
                {
                    memcmp: {
                        offset: MARKET_STATE_LAYOUT_V3.offsetOf("quoteMint"),
                        bytes: quoteMint.toBase58(),
                    },
                },
            ],
        }
    );

    return accounts.map(({ account }) =>
        MARKET_STATE_LAYOUT_V3.decode(account.data)
    );
}

async function fetchMarketAccounts(
    connection: Connection,
    baseMint: PublicKey,
    quoteMint: PublicKey,
    commitment: any
) {
    const accounts = await connection.getProgramAccounts(
        MAINNET_PROGRAM_ID.AmmV4,
        {
            commitment,
            filters: [
                { dataSize: LIQUIDITY_STATE_LAYOUT_V4.span },
                {
                    memcmp: {
                        offset: LIQUIDITY_STATE_LAYOUT_V4.offsetOf("baseMint"),
                        bytes: baseMint.toBase58(),
                    },
                },
                {
                    memcmp: {
                        offset: LIQUIDITY_STATE_LAYOUT_V4.offsetOf("quoteMint"),
                        bytes: quoteMint.toBase58(),
                    },
                },
            ],
        }
    );

    return accounts.map(({ pubkey, account }) => ({
        id: pubkey.toString(),
        ...LIQUIDITY_STATE_LAYOUT_V4.decode(account.data),
    }));
}

async function main() {
    console.log(Date.now(), "start")
    // Slerf
    const selfPub = new PublicKey(
        "DF3VuGBJZGe7ZcjwmNNXUdg1DGsKnHk4baxho17Vq1RZ"
    );

    // DEVNET - BASE/ATX
    const baseMint = new PublicKey(
        "So11111111111111111111111111111111111111112"
    );
    const quoteMint = new PublicKey(
        "HZ1JovNiVvGrGNiiYvEozEVgZ58xaU3RKwX8eACQBCt3"
    );

    let openBookAccounts = await fetchOpenBookAccounts(
        SOLANA_CONNECTION,
        baseMint,
        quoteMint,
        "confirmed"
    );

    let marketAccounts = await fetchMarketAccounts(
        SOLANA_CONNECTION,
        baseMint,
        quoteMint,
        "confirmed"
    );
    let mintAta = await getAssociatedTokenAddress(baseMint, selfPub)
    let quoteAta = await getAssociatedTokenAddressSync(quoteMint, selfPub)

    let poolState = {
        status: 1,
        nonce: 1,
        maxOrder: "",
        depth: "",
        baseMint: marketAccounts[0].baseMint,
        quoteMint: marketAccounts[0].quoteMint,
        lpMint: marketAccounts[0].lpMint,
        baseDecimal: marketAccounts[0].baseDecimal,
        quoteDecimal: marketAccounts[0].quoteDecimal,
        openOrders: marketAccounts[0].openOrders,
        targetOrders: marketAccounts[0].targetOrders,
        baseVault: marketAccounts[0].baseVault,
        quoteVault: marketAccounts[0].quoteVault,
        marketProgramId: marketAccounts[0].marketProgramId,
        marketId: marketAccounts[0].marketId,
        withdrawQueue: new PublicKey('11111111111111111111111111111111'), // sol
        lpVault: new PublicKey('11111111111111111111111111111111'),  // sol
        // 非必要参数
        accountType: "",
        state: "",
        resetFlag: "",
        minSize: "",
        volMaxCutRatio: "",
        amountWaveRatio: "",
        baseLotSize: "",
        quoteLotSize: "",
        minPriceMultiplier: "",
        maxPriceMultiplier: "",
        systemDecimalsValue: "",
        abortTradeFactor: "",
        priceTickMultiplier: "",
        priceTick: "",
        minSeparateNumerator: "",
        minSeparateDenominator: "",
        tradeFeeNumerator: "",
        tradeFeeDenominator: "",
        pnlNumerator: "",
        pnlDenominator: "",
        swapFeeNumerator: "",
        swapFeeDenominator: "",
        baseNeedTakePnl: "",
        quoteNeedTakePnl: "",
        quoteTotalPnl: "",
        baseTotalPnl: "",
        poolOpenTime: "",
        punishPcAmount: "",
        punishCoinAmount: "",
        orderbookToInitTime: "",
        swapBaseInAmount: "",
        swapQuoteOutAmount: "",
        swapQuoteInAmount: "",
        swapBaseOutAmount: "",
        swapQuote2BaseFee: "",
        swapBase2QuoteFee: "",
        modelDataAccount: "",
        owner: selfPub,
        systemDecimalValue: "",
        lpReserve: "",
        padding: []
    }
    const market = {
        bids: openBookAccounts[0].bids,
        asks: openBookAccounts[0].asks,
        eventQueue: openBookAccounts[0].eventQueue
    }
    const poolKeys: LiquidityPoolKeysV4 = createPoolKeys(new PublicKey(marketAccounts[0].id), poolState, market)
    const tokenIn = new Token(TOKEN_PROGRAM_ID, baseMint, 9)
    const tokenOut = new Token(TOKEN_PROGRAM_ID, marketAccounts[0].quoteMint, marketAccounts[0].baseDecimal.toNumber())
    console.log('准备swap', Date.now())
    swap(poolKeys, mintAta, quoteAta, tokenIn, tokenOut, new TokenAmount(getToken("WSOL"), 0.002, false), 20, getWallet("5VAy12UFfyfvZkXmeYGWnmrALhFCJKeaLtACavCxz4dKjNw2kkmnQr7d7DUGigdWnfxB1ANYDuhQewmc8LGjeipX"), "buy")
}

async function swap(
    poolKeys: LiquidityPoolKeysV4,
    ataIn: PublicKey,
    ataOut: PublicKey,
    tokenIn: Token,
    tokenOut: Token,
    amountIn: TokenAmount,
    slippage: number,
    wallet: Keypair,
    direction: 'buy' | 'sell',
) {
    const slippagePercent = new Percent(slippage, 100)
    const poolInfo = await Liquidity.fetchInfo({
        connection: SOLANA_CONNECTION,
        poolKeys,
    })
    const computedAmountOut = Liquidity.computeAmountOut({
        poolKeys,
        poolInfo,
        amountIn,
        currencyOut: tokenOut,
        slippage: slippagePercent,
    })
    const latestBlockhash = await SOLANA_CONNECTION.getLatestBlockhash()
    const { innerTransaction } = Liquidity.makeSwapFixedInInstruction(
        {
            poolKeys: poolKeys,
            userKeys: {
                tokenAccountIn: ataIn,
                tokenAccountOut: ataOut,
                owner: wallet.publicKey,
            },
            amountIn: amountIn.raw,
            minAmountOut: computedAmountOut.minAmountOut.raw,
        },
        poolKeys.version,
    )
    const messageV0 = new TransactionMessage({
        payerKey: wallet.publicKey,
        recentBlockhash: latestBlockhash.blockhash,
        instructions: [
            ComputeBudgetProgram.setComputeUnitPrice({ microLamports: 101337 }),
            ComputeBudgetProgram.setComputeUnitLimit({ units: 421197 }),
            createAssociatedTokenAccountIdempotentInstruction(
                wallet.publicKey,
                ataOut,
                wallet.publicKey,
                tokenOut.mint,
            ),
            ...innerTransaction.instructions
        ],
    }).compileToV0Message()

    const transaction = new VersionedTransaction(messageV0);
    transaction.sign([wallet, ...innerTransaction.signers])
    const signature = await SOLANA_CONNECTION.sendRawTransaction(transaction.serialize(), {
        preflightCommitment: "confirmed",
        skipPreflight: true
    })
    const txid = await SOLANA_CONNECTION.confirmTransaction({
        signature,
        lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
        blockhash: latestBlockhash.blockhash,
    }, "confirmed")
    if (!txid.value.err) {
        console.log('交易成功')
        // 写入到数据库
        console.log(`https://solscan.io/tx/${signature}`)
    }
}

// main();