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

describe("AgentBondReportRegistry lookups", function () {
  it("records who registered a hash and when", async function () {
    const [requester] = await hre.ethers.getSigners();
    const Registry = await hre.ethers.getContractFactory("AgentBondReportRegistry");
    const registry = await Registry.deploy();
    const reportHash = hre.ethers.keccak256(hre.ethers.toUtf8Bytes("lookup"));

    expect(await registry.isRegistered(reportHash)).to.equal(false);
    await registry.registerReport(reportHash, "good-research-bot", 88, "low");

    expect(await registry.isRegistered(reportHash)).to.equal(true);
    const record = await registry.records(reportHash);
    expect(record.requester).to.equal(requester.address);
    expect(record.trustScore).to.equal(88);
    expect(record.registeredAt).to.be.greaterThan(0);
  });

  it("rejects registering the same hash twice", async function () {
    const Registry = await hre.ethers.getContractFactory("AgentBondReportRegistry");
    const registry = await Registry.deploy();
    const reportHash = hre.ethers.keccak256(hre.ethers.toUtf8Bytes("dupe"));

    await registry.registerReport(reportHash, "good-research-bot", 88, "low");
    await expect(registry.registerReport(reportHash, "good-research-bot", 88, "low")).to.be.revertedWith(
      "Report already registered",
    );
  });

  it("rejects unknown risk levels", async function () {
    const Registry = await hre.ethers.getContractFactory("AgentBondReportRegistry");
    const registry = await Registry.deploy();
    const reportHash = hre.ethers.keccak256(hre.ethers.toUtf8Bytes("level"));

    await expect(registry.registerReport(reportHash, "good-research-bot", 88, "extreme")).to.be.revertedWith(
      "Invalid risk level",
    );
  });
});
