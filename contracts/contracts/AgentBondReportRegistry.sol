// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/// @notice Tamper-evident registry for AgentBond risk report hashes.
/// Full reports stay off-chain; anyone can look a hash up to prove a report
/// existed, who anchored it, and what score it carried at that time.
contract AgentBondReportRegistry {
    struct Record {
        address requester;
        uint64 registeredAt;
        uint8 trustScore;
    }

    mapping(bytes32 => Record) public records;

    event ReportRegistered(
        address indexed requester,
        bytes32 indexed reportHash,
        string sellerAgentId,
        uint256 trustScore,
        string riskLevel,
        uint256 timestamp
    );

    function registerReport(
        bytes32 reportHash,
        string calldata sellerAgentId,
        uint256 trustScore,
        string calldata riskLevel
    ) external {
        require(reportHash != bytes32(0), "Invalid report hash");
        require(trustScore <= 100, "Invalid trust score");
        require(_isRiskLevel(riskLevel), "Invalid risk level");
        require(records[reportHash].registeredAt == 0, "Report already registered");

        records[reportHash] = Record(msg.sender, uint64(block.timestamp), uint8(trustScore));
        emit ReportRegistered(msg.sender, reportHash, sellerAgentId, trustScore, riskLevel, block.timestamp);
    }

    function isRegistered(bytes32 reportHash) external view returns (bool) {
        return records[reportHash].registeredAt != 0;
    }

    function _isRiskLevel(string calldata level) private pure returns (bool) {
        bytes32 h = keccak256(bytes(level));
        return h == keccak256("low") || h == keccak256("medium") || h == keccak256("high");
    }
}
