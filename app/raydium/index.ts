import RaydiumSwap from './raydiumSwap/swap'
import { Transaction, Connection, VersionedTransaction, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js'
import { MAINNET_PROGRAM_ID, TokenAccount, SPL_ACCOUNT_LAYOUT, LIQUIDITY_STATE_LAYOUT_V4, MARKET_STATE_LAYOUT_V3, } from '@raydium-io/raydium-sdk';
require('dotenv').config()
const connection = new Connection(process.env.RPC_URL || "", { commitment: 'confirmed' })
import axios from "axios";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";

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
// 查看余额
const checkBalance = async (publicKey: PublicKey) => {
    const result = await connection.getBalance(new PublicKey(publicKey))
    return result
}

async function getOwnerTokenAccounts(publicKey) {
    const SOLANA_CONNECTION = new Connection(
        "https://ophelia-pv3t80-fast-mainnet.helius-rpc.com",
        "confirmed"
    )
    const walletTokenAccount = await SOLANA_CONNECTION.getTokenAccountsByOwner(publicKey, {
        programId: TOKEN_PROGRAM_ID,
    })

    return walletTokenAccount.value.map((i) => ({
        pubkey: i.pubkey,
        programId: i.account.owner,
        accountInfo: SPL_ACCOUNT_LAYOUT.decode(i.account.data),
    }))
}

// 查询token信息-通过dexscreen
const checkTokenInfo = async (publicKey: string) => {
    const responese = await axios.get(`https://api.dexscreener.com/latest/dex/tokens/${publicKey}`)
    if (responese.status === 200) {
        const parisArray = responese.data.pairs
        console.log('checkTokenInfo==>', parisArray)
        if (parisArray && parisArray.length) {
            let raydiumPool = parisArray.filter(item => item.dexId === "raydium")
            console.log("找到交易对==>", raydiumPool)
            return raydiumPool
        } else {
            console.log('未找到交易对')
            return false
        }
    } else {
        console.log('服务器错误-未找到交易对')
        return false
    }
}


export {
    swap,
    checkPool,
    checkBalance,
    checkTokenInfo
}
