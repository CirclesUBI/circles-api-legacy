const Web3 = require('web3');
const FuelProvider = require('fuel-web3-provider');
const HubContractABI = require('../../contracts/build/contracts/Hub.json');
const logger = require('../lib/logger');

const fuelProvider = new FuelProvider(
  {
    privateKey: process.env.PRIVATE_KEY.slice(2),
    rpcUrl: process.env.RPC_URL,
    fuelUrl: process.env.FUEL_URL,
    network: process.env.NETWORK,
    txRelayAddress: process.env.TX_RELAY_ADDRESS,
    txSenderAddress: process.env.GAS_PROVIDER_ADDRESS,
    whiteListAddress: '0x0000000000000000000000000000000000000000'
  }
)

logger.info(fuelProvider.start)
const provider = fuelProvider.start()

const web3 = new Web3(provider);
const HubContract = new web3.eth.Contract(
  HubContractABI,
  process.env.HUB_CONTRACT_ADDRESS
);

module.exports = HubContract
