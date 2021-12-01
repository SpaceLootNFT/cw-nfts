import {create_wallet, init, query, upload, transfer, execute, migrate} from './util'

require('dotenv').config()
const { MNEMONIC } = process.env

const wallet = create_wallet(MNEMONIC);

(async() => {
    // upload code
    const nft_code_path = '../artifacts/cw721_metadata_onchain.wasm'
    const nft_code_id = await upload(wallet, nft_code_path)
    console.log(nft_code_id)
    // deploy contract
    const init_response = await init(wallet, nft_code_id, {
        name: 'ChainToken',
        symbol: 'CT',
        minter: wallet.key.accAddress
    })
    console.log(init_response.contract_addr)
    const nft_addr = init_response.contract_addr
    const response = await execute(wallet, nft_addr, {
        mint: {
            token_id: 'BTC',
            owner: wallet.key.accAddress,
            token_uri: '',
            extension: {
                descript: 'A peer-to-peer electronic cash system',
                name: 'BitCoin',
                attributes: [
                    {
                        trait_type: 'Consensus',
                        value: 'Proof Of Work'
                    }, {
                        trait_type: 'Governance',
                        value: 'Decentralize'
                    }
                ]
            }
        }
    })
    console.log(response)
    /*
    const nft_info = await query(nft_addr, {
        nft_info: {
            token_id: 'BTC'
        }
    })
    console.log(nft_info)
    */
})()