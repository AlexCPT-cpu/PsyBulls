// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./ERC721Base.sol";

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

/**
 * @title PsyBulls NFT Contract
 */
contract PsyBulls is ERC721Base {
	using Counters for Counters.Counter;
    using SafeMath for uint256;

    Counters.Counter internal tokenIds;

    string public provenance = "";

    uint256 public immutable maxMintPerTx = 50;
    uint256 public immutable maxSupply;
    uint256 public immutable presaleDuration = 90 minutes;
    uint256 public immutable presaleMaxTokens = 1000;
    uint256 public immutable presaleMaxSpots = 600;

    uint256 public price = 0.18 ether;
    uint256 public pricePresale = 0.15 ether;

    bool public saleIsActive = false;
    uint256 public presaleSpotsFilled;
    uint256 public presaleStartedAt;
    uint256 public presaleEnd;

    mapping(address => bool) public whitelistedForPresale;

    address public team1;
    address public team2;
    address public team3;
    address public team4;

    constructor(
        string memory _name,
        string memory _symbol,
        uint256 _maxSupply,
        string memory _baseURI,
        address _team1,
        address _team2,
        address _team3,
        address _team4
    ) 
        ERC721Base(_name, _symbol, _baseURI)
    {
        maxSupply = _maxSupply;
        team1 = _team1;
        team2 = _team2;
        team3 = _team3;
        team4 = _team4;
    }

    modifier onlyWhitelisted {
        require(whitelistedForPresale[msg.sender], "Only whitelisted");
        _;
    }


    /**
     * @notice Mint `_amount` nfts with presale price. Only during presale and whitelisted addresses.
     * @param _amount: amount of nfts to mint
     */
    function mintPresale(uint256 _amount) external payable onlyWhitelisted {
        require(saleIsActive, "Presale not started yet");
        require(block.timestamp < presaleEnd, "Presale ended");
        require(totalSupply() < presaleMaxTokens, "Presale sold out");
        require((totalSupply() + _amount) <= presaleMaxTokens, "Exceeds presale supply");
        require(_amount > 0 && _amount <= maxMintPerTx, "Invalid amount");
        require(msg.value == pricePresale * _amount, "Value sent != presale price");

        _mintTokens(msg.sender, _amount);
    }

    /**
     * @notice Mint `_amount` nfts
     * @param _amount: amount of nfts to mint
     */
    function mint(uint256 _amount) external payable {
        require(saleIsActive, "Sale not started yet");
        require(block.timestamp >= presaleEnd || totalSupply() >= presaleMaxTokens, "Wait for presale to end");
        require((totalSupply() + _amount) <= maxSupply, "Exceeds max supply");
        require(_amount > 0 && _amount <= maxMintPerTx, "Invalid amount");
        require(msg.value == price * _amount, "Value sent != price");
        
        _mintTokens(msg.sender, _amount);
    }

    /**
     * @notice Reserve `amount` nfts by minting to `_to`. Only callable by owner.
     */
    function reserve(address _to, uint256 _amount) external onlyOwner {
        require(!saleIsActive, "Mint already started");
        require((totalSupply() + _amount) <= maxSupply, "Exceeds maxSupply");
        
        _mintTokens(_to, _amount);
    }

    /**
     * @notice Change price to `_price` in WEI.
     */
    function setPrice(uint256 _price) external onlyOwner {
        require(_price > 0, "Invalid price");
        price = _price;
    }

    /**
     * @notice Change price for presale to `_price` in WEI.
     */
    function setPricePresale(uint256 _price) external onlyOwner {
        require(_price > 0, "Invalid price");
        pricePresale = _price;
    }

    /**
     * @notice Start presale or continue minting. Only callable by owner.
     */
    function startSale() external onlyOwner {
        if (presaleStartedAt == 0) {
            presaleStartedAt = block.timestamp; // solhint-disable not-rely-on-time
            presaleEnd = block.timestamp + presaleDuration;
        }
        saleIsActive = true;
    }

    /**
     * @notice Stop the presale early and launch the pubic sale.
     */
    function endPresale() external onlyOwner {
        require(presaleStartedAt > 0, "Sale not started yet");
        require(block.timestamp < presaleEnd, "Presale already ended");
        presaleEnd = block.timestamp;
    }

    /**
     * @notice Pause minting. Only callable by owner.
     */
    function pauseSale() external onlyOwner {
        saleIsActive = false;
    }

    /**
     * @notice Set provenance once it's calculated.
     */
    function setProvenanceHash(string memory provenanceHash) external onlyOwner {
        provenance = provenanceHash;
    }

    /**
     * @notice Withdraw minting fees to team wallets. Only callable by owner.
     */
    function withdraw() external onlyOwner {
        uint256 teamSplit = address(this).balance / 4;
        payable(team1).transfer(teamSplit);
        payable(team2).transfer(teamSplit);
        payable(team3).transfer(teamSplit);
        payable(team4).transfer(address(this).balance);
    }

    /**
     * @notice Add addresses to presale whitelist. Only callable by owner.
     */
    function whitelistForPresale(address[] calldata _users) external onlyOwner {
        presaleSpotsFilled += _users.length;
        require(presaleSpotsFilled <= presaleMaxSpots, "Exceeds max presale spots");
        for (uint256 i = 0; i < _users.length; ++i) {
            whitelistedForPresale[_users[i]] = true;
        }
    }

    function presaleIsActive() external view returns (bool) {
        return block.timestamp < presaleEnd
            && totalSupply() < presaleMaxTokens;
    }

    function _mintTokens(address _to, uint256 _amount) internal {
        for (uint256 i = 0; i < _amount; ++i) {
            tokenIds.increment();
            _safeMint(_to, tokenIds.current());
        }
    }

    receive() external payable {} // solhint-disable no-empty-blocks
}