const {toBn} = require("evm-bn");
const hre = require("hardhat");
// import { formatEther } from '@ethersproject/units'

async function getDeployerBalance(deployer) {
  return `Deployer Balance: ${hre.ethers.utils.formatEther(await deployer.getBalance())}`;
}

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log(
    "Deploying contracts with the account:",
    deployer.address
  );

  console.log(await getDeployerBalance(deployer));

  let txHash, txReceipt
  const CollectionFactory = await hre.ethers.getContractFactory("CollectionFactory");
  const collectionFactory = await CollectionFactory.deploy(toBn("0.0002"));
  await collectionFactory.deployed();
  console.log("CollectionFactory deployed to:", collectionFactory.address);

  txHash = collectionFactory.deployTransaction.hash;
  txReceipt = await hre.ethers.provider.waitForTransaction(txHash);
  let nftMarketAddress = txReceipt.contractAddress

  console.log("CollectionFactory deployed to:", txHash, txReceipt, nftMarketAddress);

  console.log(await getDeployerBalance(deployer));

  const MarketPlace = await hre.ethers.getContractFactory("MarketPlace");
  const marketPlace = await MarketPlace.deploy();
  await marketPlace.deployed();
  console.log("MarketPlace deployed to:", marketPlace.address);

  txHash = marketPlace.deployTransaction.hash;
  txReceipt = await hre.ethers.provider.waitForTransaction(txHash);
  let marketPlaceAddress = txReceipt.contractAddress

  console.log("marketPlace deployed to:", txHash, txReceipt, marketPlaceAddress);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });