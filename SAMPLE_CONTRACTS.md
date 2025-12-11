# Sample Smart Contracts for Testing

Use these contracts to test SecureChain Auditor's vulnerability detection capabilities.

## 1. Vulnerable Token Contract

This contract contains multiple vulnerabilities that SecureChain Auditor will detect.

```solidity
pragma solidity ^0.8.0;

contract VulnerableToken {
    mapping(address => uint256) public balances;
    uint256 public totalSupply;
    address public owner;
    
    constructor(uint256 initialSupply) {
        owner = msg.sender;
        totalSupply = initialSupply;
        balances[msg.sender] = initialSupply;
    }
    
    // Reentrancy vulnerability
    function withdraw(uint256 amount) public {
        require(balances[msg.sender] >= amount, "Insufficient balance");
        
        // Vulnerable: External call before state change
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Transfer failed");
        
        // State change after external call - REENTRANCY RISK
        balances[msg.sender] -= amount;
    }
    
    // Integer overflow vulnerability (pre-0.8.0)
    function transfer(address to, uint256 amount) public {
        require(balances[msg.sender] >= amount);
        
        balances[msg.sender] -= amount;
        balances[to] += amount; // Could overflow in older Solidity
    }
    
    // Access control vulnerability
    function mint(address to, uint256 amount) public {
        // Missing onlyOwner modifier
        totalSupply += amount;
        balances[to] += amount;
    }
    
    // Unchecked external call
    function sendFunds(address payable recipient) public {
        recipient.call{value: 1 ether}(""); // No return value check
    }
    
    // Hardcoded address
    function withdrawToAdmin() public {
        address admin = 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb;
        (bool success, ) = admin.call{value: address(this).balance}("");
        require(success);
    }
    
    // Gas inefficiency - storage in loop
    function batchTransfer(address[] memory recipients, uint256 amount) public {
        for (uint256 i = 0; i < recipients.length; i++) {
            balances[recipients[i]] += amount; // Storage access in loop
        }
    }
}
```

**Expected Detections:**
- Reentrancy (Critical)
- Integer Overflow (High)
- Access Control (High)
- Unchecked Call (High)
- Hardcoded Address (Medium)
- Gas Optimization (Medium)

---

## 2. Secure Token Contract

This is a properly audited contract with security best practices.

```solidity
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract SecureToken is ERC20, Ownable, ReentrancyGuard {
    
    constructor(string memory name, string memory symbol, uint256 initialSupply) 
        ERC20(name, symbol) {
        _mint(msg.sender, initialSupply * 10 ** decimals());
    }
    
    // Secure mint with access control
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
    
    // Secure withdrawal with reentrancy protection
    function withdraw(uint256 amount) public nonReentrant {
        require(balanceOf(msg.sender) >= amount, "Insufficient balance");
        
        // Checks-Effects-Interactions pattern
        _burn(msg.sender, amount);
        
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Transfer failed");
    }
    
    // Safe external call with return value check
    function sendFunds(address payable recipient, uint256 amount) public onlyOwner {
        require(recipient != address(0), "Invalid recipient");
        
        (bool success, ) = recipient.call{value: amount}("");
        require(success, "Transfer failed");
    }
    
    // Parameterized address instead of hardcoded
    function withdrawToAdmin(address payable admin) public onlyOwner {
        require(admin != address(0), "Invalid admin address");
        
        (bool success, ) = admin.call{value: address(this).balance}("");
        require(success, "Transfer failed");
    }
    
    // Gas-optimized batch transfer
    function batchTransfer(address[] calldata recipients, uint256[] calldata amounts) 
        public 
        onlyOwner {
        require(recipients.length == amounts.length, "Array length mismatch");
        
        uint256 length = recipients.length;
        for (uint256 i = 0; i < length; i++) {
            _transfer(msg.sender, recipients[i], amounts[i]);
        }
    }
}
```

**Expected Detections:**
- None (clean code)

---

## 3. Staking Contract with Vulnerabilities

```solidity
pragma solidity ^0.8.0;

contract VulnerableStaking {
    mapping(address => uint256) public stakes;
    mapping(address => uint256) public rewards;
    address public rewardToken;
    
    // Reentrancy vulnerability
    function unstake(uint256 amount) public {
        require(stakes[msg.sender] >= amount);
        
        // Vulnerable: External call before state update
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success);
        
        stakes[msg.sender] -= amount;
    }
    
    // Access control vulnerability
    function setRewardToken(address token) public {
        rewardToken = token; // No onlyOwner check
    }
    
    // Integer arithmetic vulnerability
    function claimRewards() public {
        uint256 reward = calculateReward(msg.sender);
        rewards[msg.sender] += reward; // Could overflow
    }
    
    function calculateReward(address user) internal view returns (uint256) {
        return stakes[user] * 10; // Simplified calculation
    }
}
```

**Expected Detections:**
- Reentrancy (Critical)
- Access Control (High)
- Integer Overflow (High)

---

## 4. NFT Contract with Issues

```solidity
pragma solidity ^0.8.0;

contract VulnerableNFT {
    mapping(uint256 => address) public tokenOwner;
    mapping(address => uint256) public balances;
    uint256 public tokenCounter;
    
    // Unchecked external call
    function safeTransferFrom(address from, address to, uint256 tokenId) public {
        require(tokenOwner[tokenId] == from);
        
        tokenOwner[tokenId] = to;
        balances[from]--;
        balances[to]++;
        
        // Dangerous: No return value check
        to.call(abi.encodeWithSignature("onERC721Received(address,address,uint256,bytes)", 
            msg.sender, from, tokenId, ""));
    }
    
    // Hardcoded values
    function mint(address to) public {
        require(msg.sender == 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb);
        
        tokenOwner[tokenCounter] = to;
        balances[to]++;
        tokenCounter++;
    }
}
```

**Expected Detections:**
- Unchecked Call (High)
- Hardcoded Address (Medium)

---

## 5. Flash Loan Vulnerable Contract

```solidity
pragma solidity ^0.8.0;

interface IFlashLoanReceiver {
    function executeOperation(
        address asset,
        uint256 amount,
        uint256 premium,
        address initiator,
        bytes calldata params
    ) external returns (bytes32);
}

contract FlashLoanVulnerable is IFlashLoanReceiver {
    address public lendingPool;
    mapping(address => uint256) public balances;
    
    // Reentrancy vulnerability in flash loan callback
    function executeOperation(
        address asset,
        uint256 amount,
        uint256 premium,
        address initiator,
        bytes calldata params
    ) external override returns (bytes32) {
        // Vulnerable: State changes after external calls
        uint256 amountOwed = amount + premium;
        
        // Perform operations with borrowed funds
        balances[initiator] += amount;
        
        // Vulnerable: Unchecked approval
        IERC20(asset).approve(lendingPool, amountOwed);
        
        return keccak256("ERC3156FlashBorrower.onFlashLoan");
    }
}

interface IERC20 {
    function approve(address spender, uint256 amount) external returns (bool);
}
```

**Expected Detections:**
- Reentrancy (Critical)
- Unchecked Call (High)

---

## How to Use These Contracts

1. **Copy the contract code** from above
2. **Go to SecureChain Auditor** at `http://localhost:3000`
3. **Click "New Audit"**
4. **Paste the contract code** into the code editor
5. **Select the blockchain** (Ethereum, Polygon, etc.)
6. **Click "Start Audit"**
7. **Review the detected vulnerabilities**
8. **View the clean code suggestions**
9. **Generate a PDF report**

---

## Testing Checklist

- [ ] Vulnerable Token Contract - Should detect 6+ vulnerabilities
- [ ] Secure Token Contract - Should detect 0 vulnerabilities
- [ ] Staking Contract - Should detect 3+ vulnerabilities
- [ ] NFT Contract - Should detect 2+ vulnerabilities
- [ ] Flash Loan Contract - Should detect 2+ vulnerabilities

---

## Additional Resources

- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts/)
- [Solidity Security Best Practices](https://docs.soliditylang.org/en/latest/security-considerations.html)
- [OWASP Smart Contract Top 10](https://owasp.org/www-project-smart-contract-top-10/)
- [Ethereum Security](https://ethereum.org/en/developers/docs/smart-contracts/security/)

---

**Test SecureChain Auditor with these contracts to see vulnerability detection in action!**
