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

// const tx = {
//   // this could be provider.addresses[0] if it exists
//   from: fromAddress, 
//   // target address, this could be a smart contract address
//   to: toAddress, 
//   // optional if you want to specify the gas limit 
//   gas: gasLimit, 
//   // optional if you are invoking say a payable function 
//   value: 0,
//   // this encodes the ABI of the method and the arguements
//   data: myContract.methods.myMethod(arg, arg2).encodeABI() 
// };


const senderKeyPair = { address: web3.eth.accounts[0] }

txRelaySigner = new TxRelaySigner(
  senderKeyPair,
  txRelayAddress,
  senderKeyPair.address,
  '0x0'
)

const sign = async (txParams) => {
  const txRelayNonce = await TxRelayContract.methods.getNonce(senderKeyPair.address).call()
  txParams.nonce = Web3.utils.toHex(txRelayNonce)
  const tx = new Transaction(txParams)
  const rawTx = '0x' + tx.serialize().toString('hex')
  let metaSignedTx
  // if (this.isWeb3Provided === true) {
  //   metaSignedTx = await this.txRelaySigner.signRawTx(rawTx, this.signFunction)
  // } else {
    metaSignedTx = await this.txRelaySigner.signRawTx(rawTx)
  // }
  const params = {
    metaNonce: txParams.nonce,
    metaSignedTx,
    blockchain: 'blockchain'
  }
  console.log(params)
}

const signPromise = web3.eth.accounts.signTransaction(tx, privateKey);

// const signFunction = async (hash) => {
//   const sig = await web3.eth.signAsync(hash, address)
//   return sig
// }