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
    const nft_info = await query(nft_addr, {
        nft_info: {
            token_id: 'BTC'
        }
    })
    console.log(nft_info)
    // deploy evolve contract
    const evolve_code_path = '../artifacts/evolve.wasm'
    const evolve_code_id = await upload(wallet, evolve_code_path)
    // deploy contract
    const init_evlove_response = await init(wallet, evolve_code_id, {
        count: 1
    })
    const evolve_addr = init_evlove_response.contract_addr
    console.log(evolve_addr)
    const nft_info2 = await query(evolve_addr, {
        get_nft: {
            addr: nft_addr,
            token_id: 'BTC'
        }
    })
    console.log(nft_info2)
})()