// SPDX-License-Identifier: MIT

// OpenZeppelin Contracts v4.4.1 (utils/math/SafeMath.sol)
import "./utils/RecoverTokens.sol";
import "./PsyLockSystem.sol";


pragma solidity >=0.8.11;

// CAUTION
// This version of SafeMath should only be used with Solidity 0.8 or later,
// because it relies on the compiler's built in overflow checks.

/**
 * @dev Wrappers over Solidity's arithmetic operations.
 *
 * NOTE: `SafeMath` is generally not needed starting with Solidity 0.8, since the compiler
 * now has built in overflow checking.
 */

// File: @openzeppelin/contracts/utils/Context.sol


// OpenZeppelin Contracts v4.4.1 (utils/Context.sol)

pragma solidity ^0.8.0;

/**
 * @dev Provides information about the current execution context, including the
 * sender of the transaction and its data. While these are generally available
 * via msg.sender and msg.data, they should not be accessed in such a direct
 * manner, since when dealing with meta-transactions the account sending and
 * paying for execution may not be the actual sender (as far as an application
 * is concerned).
 *
 * This contract is only required for intermediate, library-like contracts.
 */


// File: @openzeppelin/contracts/access/Ownable.sol


// OpenZeppelin Contracts v4.4.1 (access/Ownable.sol)

pragma solidity ^0.8.0;


/**
 * @dev Contract module which provides a basic access control mechanism, where
 * there is an account (an owner) that can be granted exclusive access to
 * specific functions.
 *
 * By default, the owner account will be the one that deploys the contract. This
 * can later be changed with {transferOwnership}.
 *
 * This module is used through inheritance. It will make available the modifier
 * `onlyOwner`, which can be applied to your functions to restrict their use to
 * the owner.
 */


// File: contracts/G-DogzMiner.sol

pragma solidity ^0.8.11;



contract PsyMiner is RecoverTokens {
    using SafeMath for uint256;

    PsyLockSystem public PsyLockContract;

    uint256[6] private COWS_TO_COMPOUND_1MINERS = [4320000, 2880000, 1440000, 1080000, 864000, 786000];
    uint256 private PSN = 10000;
    uint256 private PSNH = 5000;
    uint256[6] public MARKET_SEED = [432000000000, 288000000000, 144000000000, 108000000000, 86400000000, 78600000000];
    uint256[5] public RATE_LIMITER = [5000, 30000, 60000, 75000, 90000];
    uint256 private devFeeVal = 5;
    bool private initialized = false;
    address payable private recAdd;
    mapping(address => uint256) private compoundMiners;
    mapping(address => uint256) private claimedCows;
    mapping(address => uint256) private lastCompound;
    mapping(address => address) private referrals;
    mapping(address => bool) private hasParticipated;
    uint256 public users;
    event RecAddressUpdated(address _old, address _new);

    constructor(PsyLockSystem _lockContract) {
        recAdd = payable(0xb5Afa0238113a3c67787AC184BF4865a80E11C03);
        PsyLockContract = _lockContract;
    }

    function updateRecAddress(address newAddress) external onlyOwner {
        require(newAddress != address(0), "Can not be zero");
        emit RecAddressUpdated(recAdd, newAddress);
        recAdd = payable(newAddress);
    }

    function buyCows(address ref) public payable {
        uint256[] memory nfts = PsyLockContract.depositsOf(msg.sender);
        require(nfts.length > 0, "No NFTs Staked");
        require(initialized);
        (, uint i) = calculateRate(msg.sender);
        uint256 z = SafeMath.sub(address(this).balance, msg.value);
        uint256 CowsBought = calculateCowBuy(msg.value, z, i);
        CowsBought = SafeMath.sub(CowsBought, devFee(CowsBought));
        uint256 fee = devFee(msg.value);
        recAdd.transfer(fee);
        claimedCows[msg.sender] = SafeMath.add(
            claimedCows[msg.sender],
            CowsBought
        );

        if (!hasParticipated[msg.sender]) {
            hasParticipated[msg.sender] = true;
            users++;
        }
        compoundCows(ref);
    }

    function compoundCows(address ref) public {
        require(initialized);
        (uint i,) = calculateRate(msg.sender);
        (uint z,) = calculateRateIndex(msg.sender);

        if (ref == msg.sender) {
            ref = address(0);
        }

        if (
            referrals[msg.sender] == address(0) &&
            referrals[msg.sender] != msg.sender
        ) {
            referrals[msg.sender] = ref;
        }

        uint256 clamsUsed = getMyCows(msg.sender);
        uint256 newMiners = SafeMath.div(clamsUsed, i);
        compoundMiners[msg.sender] = SafeMath.add(
            compoundMiners[msg.sender],
            newMiners
        );
        claimedCows[msg.sender] = 0;
        lastCompound[msg.sender] = block.timestamp;

        //send referral clams
        claimedCows[referrals[msg.sender]] = SafeMath.add(
            claimedCows[referrals[msg.sender]],
            SafeMath.div(clamsUsed, 8)
        );

        //boost market to nerf miners hoarding
        MARKET_SEED[z] = SafeMath.add(MARKET_SEED[z], SafeMath.div(clamsUsed, 5));
    }

    function sellCows() public {
        require(initialized);
        (,uint i) = calculateRate(msg.sender);
        (uint z,) = calculateRateIndex(msg.sender);
        uint256 hasClams = getMyCows(msg.sender);
        uint256 clamsValue = calculateCowSell(hasClams, i);
        uint256 fee = devFee(clamsValue);
        claimedCows[msg.sender] = 0;
        lastCompound[msg.sender] = block.timestamp;
        MARKET_SEED[z] = SafeMath.add(MARKET_SEED[z], hasClams);
        recAdd.transfer(fee);
        payable(msg.sender).transfer(SafeMath.sub(clamsValue, fee));
    }

    function cowsRewards(address _adr) public view returns (uint256) {
        (,uint i) = calculateRate(msg.sender);
        uint256 hasClams = getMyCows(_adr);
        uint256 clamsValue = calculateCowSell(hasClams, i);
        return clamsValue;
    }

        function calculateRate(address _addr) public view returns (uint256 marketEggs, uint256 marketSeed) {
        uint256 rate = PsyLockContract.findRateOfUser(_addr);
        if (rate < RATE_LIMITER[0]) {
            marketEggs = COWS_TO_COMPOUND_1MINERS[0];
            marketSeed = MARKET_SEED[0];
        } else if (rate < COWS_TO_COMPOUND_1MINERS[1]) {
            marketEggs = COWS_TO_COMPOUND_1MINERS[1];
            marketSeed = MARKET_SEED[1];
        }  else if (rate < RATE_LIMITER[2]) {
            marketEggs = COWS_TO_COMPOUND_1MINERS[2];
            marketSeed = MARKET_SEED[2];
        }  else if (rate < RATE_LIMITER[3]) {
            marketEggs = COWS_TO_COMPOUND_1MINERS[3];
            marketSeed = MARKET_SEED[3];
        }  else if (rate < RATE_LIMITER[4]) {
            marketEggs = COWS_TO_COMPOUND_1MINERS[4];
            marketSeed = MARKET_SEED[4];
        }  else if (rate >= RATE_LIMITER[4]) {
            marketEggs = COWS_TO_COMPOUND_1MINERS[5];
            marketSeed = MARKET_SEED[5];
        }
    }

    function calculateRateIndex(address _addr) public view returns (uint256 marketEggs, uint256 marketSeed) {
        uint256 rate = PsyLockContract.findRateOfUser(_addr);
        if (rate < RATE_LIMITER[0]) {
            marketEggs = 0;
            marketSeed = 0;
        } else if (rate < COWS_TO_COMPOUND_1MINERS[1]) {
            marketEggs = 1;
            marketSeed = 1;
        }  else if (rate < RATE_LIMITER[2]) {
            marketEggs = 2;
            marketSeed = 2;
        }  else if (rate < RATE_LIMITER[3]) {
            marketEggs = 3;
            marketSeed = 3;
        }  else if (rate < RATE_LIMITER[4]) {
            marketEggs = 4;
            marketSeed = 4;
        }  else if (rate >= RATE_LIMITER[4]) {
            marketEggs = 5;
            marketSeed = 5;
        }
    }

    function calculateTrade(
        uint256 rt,
        uint256 rs,
        uint256 bs
    ) private view returns (uint256) {
        return
            SafeMath.div(
                SafeMath.mul(PSN, bs),
                SafeMath.add(
                    PSNH,
                    SafeMath.div(
                        SafeMath.add(
                            SafeMath.mul(PSN, rs),
                            SafeMath.mul(PSNH, rt)
                        ),
                        rt
                    )
                )
            );
    }

    function calculateCowSell(uint256 clams, uint256 i) public view returns (uint256) {
        return calculateTrade(clams, i, address(this).balance);
    }

    function calculateCowBuy(uint256 eth, uint256 contractBalance, uint i)
        public
        view
        returns (uint256)
    {
        return calculateTrade(eth, contractBalance, i);
    }

    function calculateCowBuySimple(uint256 eth, uint i) public view returns (uint256) {
        return calculateCowBuy(eth, address(this).balance, i);
    }

    function devFee(uint256 amount) private view returns (uint256) {
        return SafeMath.div(SafeMath.mul(amount, devFeeVal), 100);
    }

    function seedMarket() public payable onlyOwner {
        initialized = true;
    }

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function getMyMiners(address adr) public view returns (uint256) {
        return compoundMiners[adr];
    }

    function getMyCows(address adr) public view returns (uint256) {
        return SafeMath.add(claimedCows[adr], getCowsSinceLastCompound(adr));
    }

    function getCowsSinceLastCompound(address adr)
        public
        view
        returns (uint256)
    {
        (uint i,) = calculateRate(msg.sender);
        uint256 secondsPassed = min(
            i,
            SafeMath.sub(block.timestamp, lastCompound[adr])
        );
        return SafeMath.mul(secondsPassed, compoundMiners[adr]);
    }

    function min(uint256 a, uint256 b) private pure returns (uint256) {
        return a < b ? a : b;
    }
}