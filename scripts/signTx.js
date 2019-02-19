const Web3 = require('web3')
const { generators, signers } = require('eth-signer')
const TxRelaySigner = signers.TxRelaySigner
const Transaction = require('ethereumjs-tx')

const rpcUrl = process.env.RPC_URL || 'http://127.0.0.1:8545'

const web3 = new Web3(new Web3.providers.HttpProvider(rpcUrl))

const HubJSON = require('../contracts/build/contracts/Hub.json')
const HubFactoryJSON = require('../contracts/build/contracts/HubFactory.json')
const TxRelayContractJSON = require('../contracts/build/contracts/TxRelay.json')

const txRelayAddress = TxRelayContractJSON.networks[process.env.NETWORK_ID].address 
const hubFactoryAddress = HubFactoryJSON.networks[process.env.NETWORK_ID].address

const HubFactoryContract = new web3.eth.Contract(
  HubFactoryJSON.abi,
  hubFactoryAddress
)

const TxRelayContract = new web3.eth.Contract(
  TxRelayContractJSON.abi,
  txRelayAddress
)

let senderKeyPair;
let tx;
let txRelaySigner;
let HubContract;
let hubAddress;

const getSender = async () => {
  senderKeyPair = generators.KeyPair.fromPrivateKey(process.env.PRIV_KEY)
}

const instantiateHub = async () => {
  const events = await HubFactoryContract.getPastEvents("Spawn", { fromBlock: 0, toBlock: "latest" })
  HubContract = new web3.eth.Contract(
    HubJSON.abi,
    events[0].returnValues.newHub
  )
  hubAddress = events[0].returnValues.newHub
}

const sign = async (txParams) => {
  const txRelayNonce = await TxRelayContract.methods.getNonce(senderKeyPair.address).call()
  txParams.nonce = Web3.utils.toHex(txRelayNonce)
  const tx = new Transaction(txParams)
  const rawTx = '0x' + tx.serialize().toString('hex')
  txRelaySigner.signRawTx(rawTx, (err, metaSignedTx) => {
    const params = {
      metaNonce: txParams.nonce,
      metaSignedTx,
    }
    console.log(params)
    return metaSignedTx
  })
}

getSender().then(async () => {
  await instantiateHub()
  txRelaySigner = new TxRelaySigner(
    senderKeyPair,
    txRelayAddress,
    senderKeyPair.address,
    '0x0'
  )
  tx = {
    from: senderKeyPair.address, 
    to: hubAddress,
    value: 0,
    data: HubContract.methods.signup('test').encodeABI() 
  };
  return sign(tx);
})
