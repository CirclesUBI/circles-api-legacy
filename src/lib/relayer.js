const { generators, signers } = require('eth-signer')
const { web3, TxRelayContract } = require('../connections/blockchain')
const apiPrivKey = require('../config/env').apiPrivKey
const Transaction = require('ethereumjs-tx')
const logger = require('./logger')

const TxRelaySigner = signers.TxRelaySigner
const SimpleSigner = signers.SimpleSigner
const BN = web3.utils.BN

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
    nonce: `0x${tx.nonce.toString('hex') || 0}`,
    gasPrice: `0x${tx.gasPrice.toString('hex')}`,
    to: `0x${tx.to.toString('hex')}`,
    value: `0x${tx.value.toString('hex') || 0}`,
    data: `0x${tx.data.toString('hex')}`,
    from
  }
  let price = 3000000
  // const types = ['uint8', 'bytes32', 'bytes32', 'address', 'bytes', 'address']
  // console.log('decoding')
  // console.log(web3.eth.abi.decodeParameters(types, `0x${tx.data.toString('hex')}`))
  try {
    price = await web3.eth.estimateGas(txCopy)
  } catch (err) {
    throw err
  }
  return new BN(price)
}

const isMetaSignatureValid = async (metaSignedTx, metaNonce) => {
  if (!metaSignedTx) throw new Error('no metaSignedTx')
  let decodedTx
  let relayerAddress
  try {
    relayerAddress = await getRelayerAddress()
    decodedTx = TxRelaySigner.decodeMetaTx(metaSignedTx)
  } catch (error) {
    logger.error('Error on TxRelaySigner.decodeMetaTx or getRelayerAddress')
    logger.error(error)
    return false
  }

  if (decodedTx.claimedAddress === '0x') {
    logger.info('no claimedAddress')
    return false
  }

  let nonce
  try {
    nonce = await getRelayNonce(decodedTx.claimedAddress)
  } catch (error) {
    logger.error('Error on getRelayNonce')
    logger.error(error)
    return false
  }
  if (metaNonce !== undefined && metaNonce > nonce) {
    nonce = metaNonce.toString()
  }
  try {
    logger.info(
      `trying to validate metasig, relayerAddress is ${relayerAddress}`
    )
    const validMetaSig = TxRelaySigner.isMetaSignatureValid(
      relayerAddress,
      decodedTx,
      nonce
    )
    return validMetaSig
  } catch (error) {
    logger.error('Error on TxRelaySigner.isMetaSignatureValid')
    logger.error(error)
    return false
  }
}

const signTx = async ({ txHex }) => {
  if (!txHex) throw new Error('no txHex')
  const tx = new Transaction(Buffer.from(txHex, 'hex'))
  const signer = initSigner()
  const price = await web3.eth.getGasPrice()
  tx.gasPrice = new BN(price).toNumber()
  tx.nonce = await web3.eth.getTransactionCount(signer.getAddress())
  const estimatedGas = await estimateGas(tx, signer.getAddress())
  // add some buffer to the limit
  tx.gasLimit = estimatedGas.add(new BN(1000000))
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
    signedRawTx = `0x${signedRawTx}`
  }
  const txHash = await web3.eth.sendSignedTransaction(signedRawTx)
  return txHash
}

const handle = async req => {
  const body = req.body || JSON.parse(req.body)

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
    signedRawTx = await signTx({ txHex: body.metaSignedTx })
    console.log('done signing')
  } catch (error) {
    logger.error('Error signing transaction')
    logger.error(error)
    return { code: 500, message: error.message }
  }

  try {
    const txHash = await sendRawTransaction(signedRawTx)
    return txHash
  } catch (error) {
    logger.error('Error on sendRawTransaction')
    logger.error(error)
    return { code: 500, message: error.message }
  }
}

module.exports = { handle }
