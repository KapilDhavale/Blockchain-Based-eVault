// scripts/deploy.js
async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);
  
    const Lock = await ethers.getContractFactory("Lock");
    const unlockTime = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 365; // 1 year from now
    const lockedAmount = ethers.utils.parseEther("1"); // 1 ether
  
    const lock = await Lock.deploy(unlockTime, { value: lockedAmount });
    console.log("Lock contract deployed to:", lock.address);
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
  