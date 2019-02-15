const { generators, signers } = require('eth-signer')
const TxRelaySigner = signers.TxRelaySigner
const web3 = require('../connections/blockchain').web3
const TxRelayerContract = require('../connections/blockchain').TxRelayContract
const secretSeed = require('../config/env').secretSeed

const HDSigner = signers.HDSigner

const getRelayerAddress = () => {
  return TxRelayContract.address
}

const getRelayNonce = async (address) => {
  if (!address) throw new Error('no address')
  const nonce = await TxRelayContract.getNonce(address)
  return nonce.toString(16)
}

const initSigner = (secretSeed) => {
  const hdPrivKey = generators.Phrase.toHDPrivateKey(secretSeed)
  signer = new HDSigner(hdPrivKey)
  return signer
}

const estimateGas = (tx, from) => {
  if (!tx) throw new Error('no tx object')

  let txCopy = {
    nonce: '0x' + (tx.nonce.toString('hex') || 0),
    gasPrice: '0x' + tx.gasPrice.toString('hex'),
    to: '0x' + tx.to.toString('hex'),
    value: '0x' + (tx.value.toString('hex') || 0),
    data: '0x' + tx.data.toString('hex'),
    from
  }
  let price = 3000000
  try {
    price = await web3.eth.estimateGasAsync(txCopy)
  }
  return price
}

const isMetaSignatureValid = async (metaSignedTx, metaNonce) => {
  if (!metaSignedTx) throw new Error('no metaSignedTx')
  let decodedTx
  let relayerAddress
  try {
    decodedTx = TxRelaySigner.decodeMetaTx(metaSignedTx)
    relayerAddress = await getRelayerAddress(blockchain)
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
    nonce = await getRelayNonce(decodedTx.claimedAddress, blockchain)
  } catch (error) {
    console.log('Error on getRelayNonce')
    console.log(error)
    return false
  }
  if (metaNonce !== undefined && metaNonce > nonce) {
    nonce = metaNonce.toString()
  }
  try {
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

const signTx = ({ txHex }) => {
  if (!txHex) throw new Error('no txHex')
  const tx = new Transaction(Buffer.from(txHex, 'hex'))
  const signer = initSigner();
  tx.gasPrice = await web3.eth.getGasPriceAsync()
  tx.nonce = await web3.eth.getTransactionCountAsync(signer.getAddress())
  const estimatedGas = await estimateGas(
    tx,
    signer.getAddress(),
    blockchain
  )
  // add some buffer to the limit
  tx.gasLimit = estimatedGas + 1000

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

const sendRawTransaction = (signedRawTx) => {
  if (!signedRawTx) throw new Error('no signedRawTx')

  if (!signedRawTx.startsWith('0x')) {
    signedRawTx = '0x' + signedRawTx
  }
  const txHash = await web3.eth.sendRawTransactionAsync(
    signedRawTx
  )

  // let txObj = Wallet.parseTransaction(signedRawTx)
  // txObj.gasLimit = txObj.gasLimit.toString(16)
  // txObj.gasPrice = txObj.gasPrice.toString()
  // txObj.value = txObj.value.toString(16)

  // await this.storeTx(txHash, networkName, txObj)

  return txHash
}

const handle = async (event) => {
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
  if (!(await isMetaSignatureValid(body))) {
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
    const txHash = await sendRawTransaction(
      signedRawTx,
      body.blockchain
    )
    return null, txHash
  } catch (error) {
    console.log('Error on this.ethereumMgr.sendRawTransaction')
    console.log(error)
    return { code: 500, message: error.message }
  }
}

module.exports = handle
