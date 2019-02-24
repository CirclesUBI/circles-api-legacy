const Web3 = require('web3');
const { generators, signers } = require('eth-signer');
const Transaction = require('ethereumjs-tx');

const TxRelaySigner = signers.TxRelaySigner;

const rpcUrl = process.env.RPC_URL || 'http://127.0.0.1:8545';

const web3 = new Web3(new Web3.providers.HttpProvider(rpcUrl));

const HubJSON = require('../contracts/build/contracts/Hub.json');
const HubFactoryJSON = require('../contracts/build/contracts/HubFactory.json');
const TxRelayContractJSON = require('../contracts/build/contracts/TxRelay.json');

const txRelayAddress = TxRelayContractJSON.networks[process.env.NETWORK_ID].address;
const hubFactoryAddress = HubFactoryJSON.networks[process.env.NETWORK_ID].address;

const HubFactoryContract = new web3.eth.Contract(
  HubFactoryJSON.abi,
  hubFactoryAddress
);

const TxRelayContract = new web3.eth.Contract(
  TxRelayContractJSON.abi,
  txRelayAddress
);

let HubContract;
let hubAddress;

const getSender = async () => {
  return generators.KeyPair.fromPrivateKey(process.env.PRIV_KEY);
};

const instantiateHub = async () => {
  const events = await HubFactoryContract.getPastEvents('Spawn', { fromBlock: 0, toBlock: 'latest' });
  HubContract = new web3.eth.Contract(
    HubJSON.abi,
    events[0].returnValues.newHub
  );
  hubAddress = events[0].returnValues.newHub;
};

const getNonce = async (sender) => {
  return TxRelayContract.methods.getNonce(sender).call();
};

const sign = async (txParams, relayNonce, signer) => {
  txParams.nonce = Web3.utils.toHex(relayNonce);
  const tx = new Transaction(txParams);
  const rawTx = `0x ${tx.serialize().toString('hex')}`;
  signer.signRawTx(rawTx, (err, metaSignedTx) => {
    const params = {
      metaNonce: txParams.nonce,
      metaSignedTx,
    };
    console.log(params);
    return metaSignedTx;
  });
};

getSender().then(async (senderKeyPair) => {
  await instantiateHub();
  const relayNonce = await getNonce(senderKeyPair.address);
  const txRelaySigner = new TxRelaySigner(
    senderKeyPair,
    txRelayAddress,
    senderKeyPair.address,
    '0x0000000000000000000000000000000000000000'
  );
  const tx = {
    from: senderKeyPair.address,
    to: hubAddress,
    value: 0,
    data: HubContract.methods.signup(senderKeyPair.address, 'test').encodeABI()
  };
  console.log(senderKeyPair);
  return sign(tx, relayNonce, txRelaySigner);
});
