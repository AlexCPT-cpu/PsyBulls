// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

/**
 * @title this Contract allows the recovery of ERC721 and ERC20 tokens send to this contract.
 * @dev please Do not use this contract if it is meant to hold or store ERC20 or ERC721 tokens.
 */
contract RecoverTokens is Ownable {
    using SafeERC20 for IERC20;

    // Recover ERC20 tokens sent by accident
    event TokenRecoverd(address indexed token, uint256 amount);
    // Recover NFT tokens sent by accident
    event NFTRecovered(address indexed token, uint256[] indexed tokenId);
    
   
    /**
     * @notice Allows the owner to recover tokens sent to the contract by mistake
     * @param _token: token address
     * @dev Callable by owner
     */
    function ownerRecoverToken(address _token) external onlyOwner {
        uint256 amountToRecover = IERC20(_token).balanceOf(address(this));
        require(amountToRecover != 0, "Operations: No token to recover");

        IERC20(_token).safeTransfer(address(msg.sender), amountToRecover);

        emit TokenRecoverd(_token, amountToRecover);
    }

    /**
     * @notice Allows the owner to recover NFTs sent to the contract by mistake
     * @param _token: NFT token address
     * @param _tokenId: tokenId
     * @dev Callable by owner
     */
    function ownerRecoverNFT(address _token, uint256[] calldata _tokenId) external onlyOwner {
        uint256 length = _tokenId.length;

        for (uint256 i = 0; i < length; ++i) {
          IERC721(_token).safeTransferFrom(address(this), address(msg.sender), _tokenId[i]);
        }
        emit NFTRecovered(_token, _tokenId);
    }
}