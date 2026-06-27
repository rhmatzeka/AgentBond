import { expect } from "chai";
import hre from "hardhat";

describe("AgentBondReportRegistry", function () {
  it("registers a valid report hash and emits an event", async function () {
    const [requester] = await hre.ethers.getSigners();
    const Registry = await hre.ethers.getContractFactory("AgentBondReportRegistry");
    const registry = await Registry.deploy();
    const reportHash = hre.ethers.keccak256(hre.ethers.toUtf8Bytes("report"));

    await expect(registry.registerReport(reportHash, "good-research-bot", 88, "low"))
      .to.emit(registry, "ReportRegistered")
      .withArgs(requester.address, reportHash, "good-research-bot", 88, "low", (value: bigint) => value > BigInt(0));
  });

  it("rejects empty report hashes", async function () {
    const Registry = await hre.ethers.getContractFactory("AgentBondReportRegistry");
    const registry = await Registry.deploy();

    await expect(registry.registerReport(hre.ethers.ZeroHash, "good-research-bot", 88, "low")).to.be.revertedWith(
      "Invalid report hash",
    );
  });

  it("rejects trust scores above 100", async function () {
    const Registry = await hre.ethers.getContractFactory("AgentBondReportRegistry");
    const registry = await Registry.deploy();
    const reportHash = hre.ethers.keccak256(hre.ethers.toUtf8Bytes("report"));

    await expect(registry.registerReport(reportHash, "good-research-bot", 101, "low")).to.be.revertedWith(
      "Invalid trust score",
    );
  });
});
