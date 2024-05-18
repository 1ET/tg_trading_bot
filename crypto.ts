import C from '@originjs/crypto-js-wasm';
const fs = require("fs")
const path = require('path')
// const privatepem2 = fs.readFileSync("./pem/privatekey.pem") //私有key
// const publicpem2 = fs.readFileSync("./pem/publickey.pem")  //公有key
// const prikey2 = privatepem2.toString()
// const pubkey2 = publicpem2.toString()

async function main() {
    await C.RSA.loadWasm()
    // const msg = 'testMSG';
    // const msg = '5VAy12UFfyfvZkXmeYGWnmrALhFCJKeaLtACavCxz4dKjNw2kkmnQr7d7DUGigdWnfxB1ANYDuhQewmc8LGjeipX';
    const msg = '5VAy12UFfyfvZkXmeYGWnmrALhFCJKeaLtACavCxz4dKjNw2kkmnQr7d7DUGigdWnfxB1ANYDuhQewmc8LGjeipX';
    console.log('加密开始', Date.now())
    const encrypted = C.RSA.encrypt(msg, { hashAlgo: "MD5", encryptPadding: 'oaep', key: path.resolve('./pem/privatekey.pem') })
    const transF = Array.from(encrypted)
    console.log('encrypted===>', transF.length)
    console.log('加密结束', Date.now())
    // expect(new TextDecoder().decode(decrypted)).toBe(msg);
    console.log('解密开始', Date.now())
    const uint8TransF = new Uint8Array(128)
    uint8TransF.set(transF)
    const decrypted = C.RSA.decrypt(encrypted, { encryptPadding: 'OAEP', });
    console.log('解密结束', Date.now())

    // expect(new TextDecoder().decode(decrypted)).toBe(msg);
    console.log("decrypted===>", new TextDecoder().decode(decrypted))
}

main()