import {create_wallet, init, query, upload, transfer, execute, migrate} from './util'

require('dotenv').config()
const { MNEMONIC } = process.env

const wallet = create_wallet(MNEMONIC);

(async() => {
    // upload code
    const nft_code_path = '../artifacts/cw721_metadata_onchain.wasm'
    const nft_code_id = await upload(wallet, nft_code_path)
    console.log(nft_code_id)
    // migrate contract
    const addr = 'terra10rdmqjwsf6n9jrxk8avnk7uh224e0l2ne2ez77'
    const migrate_response = await migrate(wallet, addr, nft_code_id, {})
    console.log(migrate_response)
})()