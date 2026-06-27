// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract AgentBondReportRegistry {
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

        emit ReportRegistered(msg.sender, reportHash, sellerAgentId, trustScore, riskLevel, block.timestamp);
    }
}
