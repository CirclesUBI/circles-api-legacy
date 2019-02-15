const Web3 = require('web3')
const HubContractJSON = require('../../contracts/build/contracts/Hub.json')
const TxRelayContractJSON = require('../../contracts/build/contracts/TxRelay.json')
const logger = require('../lib/logger')
const rpcUrl = require('../config/env').rpcUrl

// const fuelProvider = new FuelProvider(fuelConfig)

// logger.info(fuelProvider.start)
// const provider = fuelProvider.start()

//const web3 = new Web3(provider)
const web3 = new Web3(new Web3.providers.HttpProvider(rpcUrl))

const HubContract = new web3.eth.Contract(
  HubContractJSON.abi,
  process.env.HUB_CONTRACT_ADDRESS
)

const TxRelayContract = new web3.eth.Contract(
  TxRelayContractJSON.abi,
  process.env.RELAY_CONTRACT_ADDRESS
)

module.exports = {
  web3,
  HubContract,
  TxRelayContract }
