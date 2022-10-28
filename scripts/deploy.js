// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {

  const PsyBulls = await hre.ethers.getContractFactory("PsyBulls");
  const PsyLockSystem = await hre.ethers.getContractFactory("PsyLockSystem");
  const PsyMiner = await hre.ethers.getContractFactory("PsyMiner");

  const nft = await PsyBulls.deploy('one', 'two', 5555, 'six', '0xb5Afa0238113a3c67787AC184BF4865a80E11C03', '0xb5Afa0238113a3c67787AC184BF4865a80E11C03', '0xb5Afa0238113a3c67787AC184BF4865a80E11C03', '0xb5Afa0238113a3c67787AC184BF4865a80E11C03');
   await nft.deployed()

  const lock = await PsyLockSystem.deploy(nft.address);
    await lock.deployed()
  const miner = await PsyMiner.deploy(lock.address)
    await miner .deployed()



  console.log(
    `deployed NFT at ${nft.address}`
  );
  console.log(
    `deployed Lock at ${lock.address}`
  );
  console.log(
    `deployed Miner at ${miner.address}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
/*
deployed NFT at 0x3484e58f596Cdab7848001853f94056dFCf0B540
deployed Lock at 0x2DfE47D6A110ABfa8C28Ca419759Ba7Af42a085F
deployed Miner at 0xbE416091FB481420f91E6E867c52d2453471d82c
npx hardhat verify --network <network> <address> <constructor arguements>
npx hardhat verify --network mumbai 0xbE416091FB481420f91E6E867c52d2453471d82c 0x2DfE47D6A110ABfa8C28Ca419759Ba7Af42a085F
 */
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
