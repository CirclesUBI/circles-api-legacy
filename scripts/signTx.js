//var request = require('request');

const BlueBird = require('bluebird')
const { generators, signers } = require('eth-signer')
const TxRelaySigner = signers.TxRelaySigner
const Transaction = require('ethereumjs-tx')

const rpcUrl = process.env.RPC_URL || 'http://127.0.0.1:8545'

const web3 = new Web3(new Web3.providers.HttpProvider(rpcUrl))

const HubContractJSON = require('../../contracts/build/contracts/Hub.json')
const TxRelayContractJSON = require('../../contracts/build/contracts/TxRelay.json')

const txRelayAddress = TxRelayContractJSON.networks[process.env.NETWORK_ID].address || process.env.RELAY_CONTRACT_ADDRESS
const hubAddress = process.env.HUB_CONTRACT_ADDRESS

const HubContract = new web3.eth.Contract(
  HubContractJSON.abi,
  hubAddress
)

const TxRelayContract = BlueBird.promisifyAll(new web3.eth.Contract(
  TxRelayContractJSON.abi,
  txRelayAddress
))

const senderKeyPair = { address: web3.eth.accounts[0] }

const txRelaySigner = new TxRelaySigner(
  senderKeyPair,
  txRelayAddress,
  senderKeyPair.address,
  '0x0'
)

const tx = {
  from: senderKeyPair.address, 
  to: hubAddress, 
  value: 0,
  data: HubContract.methods.signup(arg, arg2).encodeABI() 
};

const sign = async (txParams) => {
  const txRelayNonce = await TxRelayContract.methods.getNonce(senderKeyPair.address).call()
  txParams.nonce = Web3.utils.toHex(txRelayNonce)
  const tx = new Transaction(txParams)
  const rawTx = '0x' + tx.serialize().toString('hex')
  //let metaSignedTx
  // if (this.isWeb3Provided === true) {
  //   metaSignedTx = await this.txRelaySigner.signRawTx(rawTx, this.signFunction)
  // } else {
  const metaSignedTx = await txRelaySigner.signRawTx(rawTx)
  // }
  const params = {
    metaNonce: txParams.nonce,
    metaSignedTx,
    blockchain: 'blockchain'
  }
  console.log(params)
  return metaSignedTx
}

const signed = sign(tx, privateKey);

console.log(signed)

// const signFunction = async (hash) => {
//   const sig = await web3.eth.signAsync(hash, address)
//   return sig
// }