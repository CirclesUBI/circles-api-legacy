import Web3 from 'web3';
import FuelProvider from 'web3-fuel-provider';
import HubContractABI from '../../contracts/build/contracts/Hub.json';

const fuelProvider = new FuelProvider(
  {
    privateKey: process.env.PRIVATE_KEY,
    rpcUrl: process.env.RPC_URL,
    fuelUrl: process.env.FUEL_URL,
    network: process.env.NETWORK,
    txRelayAddress: process.env.TX_RELAY_ADDRESS,
    txSenderAddress: process.env.GAS_PROVIDER_ADDRESS,
    whiteListAddress: '0x0000000000000000000000000000000000000000'
  }
)

const web3 = new Web3(fuelProvider.start());
const HubContract = new web3.eth.Contract(
  HubContractABI,
  process.env.HUB_CONTRACT_ADDRESS
);

export default { HubContract }
