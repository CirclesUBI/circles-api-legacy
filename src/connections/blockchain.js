<<<<<<< HEAD
const Web3 = require('web3');
// const FuelProvider = require('fuel-web3-provider');
const HubContractABI = require('../../contracts/build/contracts/Hub.json');
=======
const Web3 = require('web3')
const FuelProvider = require('fuel-web3-provider')
const HubContractJSON = require('../../contracts/build/contracts/Hub.json')
const logger = require('../lib/logger')
const fuelConfig = require('../config/env').fuelConfig
>>>>>>> 048c239d47e2501453ba914451ca1ebe1c54f894

// const fuelProvider = new FuelProvider(
//   {
//     privateKey: process.env.PRIVATE_KEY.slice(2),
//     rpcUrl: process.env.RPC_URL,
//     fuelUrl: process.env.FUEL_URL,
//     network: process.env.NETWORK,
//     txRelayAddress: process.env.TX_RELAY_ADDRESS,
//     txSenderAddress: process.env.GAS_PROVIDER_ADDRESS,
//     whiteListAddress: '0x0000000000000000000000000000000000000000'
//   }
// )

// console.log(fuelProvider.start)
// let provider = fuelProvider.start()

<<<<<<< HEAD
const web3 = new Web3("ws://localhost:8545");
// const HubContract = new web3.eth.Contract(
//   HubContractABI,
//   process.env.HUB_CONTRACT_ADDRESS
// );
=======
const web3 = new Web3(provider)
const HubContract = new web3.eth.Contract(
  HubContractJSON.abi,
  process.env.HUB_CONTRACT_ADDRESS
)
>>>>>>> 048c239d47e2501453ba914451ca1ebe1c54f894

// module.exports = HubContract
