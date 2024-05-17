import RaydiumSwap from './raydiumSwap/swap'
import { Transaction, Connection, VersionedTransaction, LAMPORTS_PER_SOL } from '@solana/web3.js'
import { MAINNET_PROGRAM_ID, LIQUIDITY_STATE_LAYOUT_V4, MARKET_STATE_LAYOUT_V3, } from '@raydium-io/raydium-sdk';
require('dotenv').config()
const connection = new Connection(process.env.RPC_URL || "", { commitment: 'confirmed' })

// swap
const swap = async () => {

}

// 查询池子
const checkPool = async (mintA: string, mintB: string) => {
    const executeSwap = false
    const wallet = "1231313131"
    const raydiumSwap = new RaydiumSwap(connection, wallet, MAINNET_PROGRAM_ID.AmmV4)
    const findPoolKey = await raydiumSwap.findPoolInfoForTokens(mintA, mintB)

}


export { swap, checkPool }
