const { generators, signers } = require('eth-signer')
const TxRelaySigner = signers.TxRelaySigner
const { web3, TxRelayContract } = require('../connections/blockchain')
// const TxRelayerContract = require('../connections/blockchain').TxRelayContract
const apiPrivKey = require('../config/env').apiPrivKey
const Transaction = require('ethereumjs-tx')

const SimpleSigner = signers.SimpleSigner

const getRelayerAddress = () => {
  return TxRelayContract.options.address
}

const getRelayNonce = async address => {
  if (!address) throw new Error('no address')
  const nonce = await TxRelayContract.methods.getNonce(address).call()
  return nonce.toString(16)
}

const initSigner = () => {
  const signer = new SimpleSigner(generators.KeyPair.fromPrivateKey(apiPrivKey))
  return signer
}

const estimateGas = async (tx, from) => {
  if (!tx) throw new Error('no tx object')

  const txCopy = {
    nonce: '0x' + (tx.nonce.toString('hex') || 0),
    gasPrice: '0x' + tx.gasPrice.toString('hex'),
    to: '0x' + tx.to.toString('hex'),
    value: '0x' + (tx.value.toString('hex') || 0),
    data: '0x' + tx.data.toString('hex'),
    from
  }
  let price = 3000000
  try {
    price = await web3.eth.estimateGas(txCopy)
  } catch (err) {
    throw err
  }
  return price
}

const isMetaSignatureValid = async (metaSignedTx, metaNonce) => {
  if (!metaSignedTx) throw new Error('no metaSignedTx')
  let decodedTx
  let relayerAddress
  try {
    relayerAddress = await getRelayerAddress()
    decodedTx = TxRelaySigner.decodeMetaTx(metaSignedTx)
  } catch (error) {
    console.log('Error on TxRelaySigner.decodeMetaTx or getRelayerAddress')
    console.log(error)
    return false
  }

  if (decodedTx.claimedAddress === '0x') {
    console.log('no claimedAddress')
    return false
  }

  let nonce
  try {
    nonce = await getRelayNonce(decodedTx.claimedAddress)
  } catch (error) {
    console.log('Error on getRelayNonce')
    console.log(error)
    return false
  }
  if (metaNonce !== undefined && metaNonce > nonce) {
    nonce = metaNonce.toString()
  }
  try {
    console.log('trying to validate metasig')
    console.log(relayerAddress)
    const validMetaSig = TxRelaySigner.isMetaSignatureValid(
      relayerAddress,
      decodedTx,
      nonce
    )
    return validMetaSig
  } catch (error) {
    console.log('Error on TxRelaySigner.isMetaSignatureValid')
    console.log(error)
    return false
  }
}

const signTx = async ({ txHex }) => {
  if (!txHex) throw new Error('no txHex')
  const tx = new Transaction(Buffer.from(txHex, 'hex'))
  const signer = initSigner()
  tx.value = new web3.utils.BN(0)
  tx.gasPrice = await web3.eth.getGasPrice()
  console.log('gasPrice' + tx.gasPrice.toString())
  console.log(signer.getAddress())
  tx.nonce = await web3.eth.getTransactionCount(signer.getAddress())
  const estimatedGas = await estimateGas(tx, signer.getAddress())
  console.log('estimatedgas' + estimatedGas.toString())
  // add some buffer to the limit
  tx.gasLimit = estimatedGas
  console.log(tx.value.toString('hex'))
  const rawTx = tx.serialize().toString('hex')
  return new Promise((resolve, reject) => {
    signer.signRawTx(rawTx, (error, signedRawTx) => {
      if (error) {
        reject(error)
      }
      resolve(signedRawTx)
    })
  })
}

const sendRawTransaction = async signedRawTx => {
  if (!signedRawTx) throw new Error('no signedRawTx')

  if (!signedRawTx.startsWith('0x')) {
    signedRawTx = '0x' + signedRawTx
  }
  const txHash = await web3.eth.sendSignedTransaction(signedRawTx)

  // let txObj = Wallet.parseTransaction(signedRawTx)
  // txObj.gasLimit = txObj.gasLimit.toString(16)
  // txObj.gasPrice = txObj.gasPrice.toString()
  // txObj.value = txObj.value.toString(16)

  // await this.storeTx(txHash, networkName, txObj)

  return txHash
}

const handle = async event => {
  let body

  if (event && event.body) {
    try {
      body = event.body || JSON.parse(event.body)
    } catch (e) {
      return { code: 400, message: 'no json body' }
    }
  } else {
    return { code: 400, message: 'no json body' }
  }

  if (!body.metaSignedTx) {
    return { code: 400, message: 'metaSignedTx parameter missing' }
  }

  // support hex strings starting with 0x
  if (body.metaSignedTx.startsWith('0x')) {
    body.metaSignedTx = body.metaSignedTx.slice(2)
  }

  // Check if metaTx signature is valid
  if (!(await isMetaSignatureValid(body.metaSignedTx, body.metaNonce))) {
    return { code: 403, message: 'MetaTx signature invalid' }
  }

  let signedRawTx
  try {
    signedRawTx = await signTx({
      txHex: body.metaSignedTx,
      blockchain: body.blockchain
    })
  } catch (error) {
    console.log('Error on this.ethereumMgr.signTx')
    console.log(error)
    return { code: 500, message: error.message }
  }

  try {
    const txHash = await sendRawTransaction(signedRawTx, body.blockchain)
    return null, txHash
  } catch (error) {
    console.log('Error on sendRawTransaction')
    console.log(error)
    return { code: 500, message: error.message }
  }
}

module.exports = { handle }
