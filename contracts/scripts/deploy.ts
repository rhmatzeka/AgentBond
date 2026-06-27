import hre from "hardhat";

async function main() {
  const Registry = await hre.ethers.getContractFactory("AgentBondReportRegistry");
  const registry = await Registry.deploy();
  await registry.waitForDeployment();

  console.log(`AgentBondReportRegistry deployed to ${await registry.getAddress()}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
