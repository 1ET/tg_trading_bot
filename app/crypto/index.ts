import C from '@originjs/crypto-js-wasm';
const path = require('path')

async function initCrypto() {
    try {
        console.log("crypto swam启动中")
        await C.RSA.loadWasm()
        console.log("crypto swam启动成功")
    } catch (error) {
        console.log("crypto swam启动失败")
        process.exit(0)
    }
}

function encrypted(privatekey: string): string {
    const encrypted = C.RSA.encrypt(privatekey, { hashAlgo: "MD5", encryptPadding: 'oaep', key: path.resolve('./pem/privatekey.pem') })
    const encryptedArray = Array.from(encrypted)
    const encryptedString = JSON.stringify(encryptedArray)
    return encryptedString
}

function decrypted(encryptedString: string) {
    const decryptedString = JSON.parse(encryptedString)
    const decryptedArr = new Uint8Array(decryptedString.length)
    decryptedArr.set(decryptedString)
    const decrypted = C.RSA.decrypt(decryptedArr, { encryptPadding: 'OAEP', })
    return new TextDecoder().decode(decrypted)
}

export { initCrypto, encrypted, decrypted };