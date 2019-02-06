const Web3 = require('web3');
const FuelProvider = require('fuel-web3-provider');
const HubContractABI = require('../../contracts/build/contracts/Hub.json');
const logger = require('../lib/logger');
const fuelConfig = require('../config/env').fuelConfig

const fuelProvider = new FuelProvider(fuelConfig)

logger.info(fuelProvider.start)
const provider = fuelProvider.start()

const web3 = new Web3(provider);
const HubContract = new web3.eth.Contract(
  HubContractABI,
  process.env.HUB_CONTRACT_ADDRESS
);

module.exports = HubContract
