# Dpenney42 Token (DP42)

A BEP-20 token deployed on BNB Smart Chain Testnet. Created as part of the 42 School Tokenizer project.

**Contract address:** `0x0217F67B40ecc96eF22389ad05E10A54957EC165`
**Network:** BSC Testnet (Chain ID: 97)
**Explorer:** https://testnet.bscscan.com/address/0x0217F67B40ecc96eF22389ad05E10A54957EC165

---

## Why this stack

### Blockchain: BNB Smart Chain (BSC) Testnet

The project requires deploying a BEP-20 token and publishing it on bscscan. BNB Smart Chain is EVM-compatible — meaning it runs the same smart contracts as Ethereum, but with lower gas fees and faster block times (~3 seconds vs ~12 on Ethereum). I use the **testnet** (Chain ID: 97) because it's free — test tBNB tokens have no real value, so there's zero financial risk while learning.

### Language: Solidity 0.8.28

Solidity is the standard language for EVM-compatible blockchains (Ethereum, BSC, Polygon, etc.). Version 0.8+ was chosen because it has built-in overflow/underflow protection — in older versions, if you added 1 to the maximum uint256 value, it would silently wrap to 0. Now it reverts with an error. Safer by default.

### Framework: Hardhat (over Truffle, Foundry)

I considered three options:
- **Truffle** — older, less actively maintained, being sunset by ConsenSys
- **Foundry** — powerful but tests are written in Solidity, harder for beginners
- **Hardhat** — actively maintained, tests in JavaScript (more familiar), built-in local blockchain, great plugin ecosystem

Hardhat won because it has the lowest barrier to entry: JavaScript tests, clear error messages, and `hardhat-toolbox` bundles everything you need (ethers.js, Chai matchers, gas reporting, contract verification).

### Library: OpenZeppelin Contracts

Writing ERC-20 functions from scratch is risky — a single bug in `transfer()` or `approve()` could let someone steal all tokens. OpenZeppelin's contracts are **audited by security professionals** and used by most production tokens. I inherit `ERC20` and `Ownable` and get all standard functions (transfer, approve, transferFrom, balanceOf, allowance) for free. I only write custom logic on top (mint, burn).

### Wallet: MetaMask

MetaMask is the most widely used browser wallet in the Ethereum/BSC ecosystem. I chose it because:
- Free and open-source
- Works as a browser extension — easy to interact with dApps and bscscan
- Supports custom networks (I added BSC Testnet manually)
- Stores private keys locally in the browser (encrypted with your password)
- The private key can be exported for use in deployment scripts

### How I got test tBNB

To deploy a contract or send transactions on BSC Testnet, you need tBNB to pay gas fees (just like real BNB on mainnet, but worthless). I used the **BNB Chain Faucet** (https://www.bnbchain.org/en/testnet-faucet) — you paste your MetaMask wallet address, and it sends free tBNB to your account. No registration, no payment.

### Testing: Chai + ethers.js

- **Chai** — assertion library (`expect(balance).to.equal(42)`). Reads almost like English, easy to understand what each test checks
- **ethers.js** — JavaScript library to interact with the blockchain. Handles deploying contracts, calling functions, converting between human-readable numbers and blockchain format (e.g., `parseEther("42")` converts to `42000000000000000000`)

---

## Project structure

```
tokenizer/
├── README.md                  # This file — project overview
├── TASKS.md                   # Checklist of all project requirements
├── code/
│   ├── contracts/
│   │   └── Dpenney42.sol      # The smart contract
│   ├── test/
│   │   └── Dpenney42.test.js  # 5 tests covering all token functionality
│   ├── scripts/
│   │   └── deploy.js          # Deployment script
│   ├── hardhat.config.js      # Hardhat config (Solidity version, BSC Testnet network)
│   ├── package.json           # Node.js dependencies
│   └── .env                   # Private key (NOT committed to git)
├── deployment/
│   └── deploy.js              # Deployment script (copy for project structure requirement)
└── documentation/
    └── whitepaper.md          # Token whitepaper — purpose, perks, distribution, usage guide
```

---

## Phase 1: Environment Setup

**Goal:** Set up everything needed to write, test, and deploy a smart contract.

**What I did:**
1. Installed MetaMask browser extension and created a wallet (saved seed phrase securely)
2. Added BSC Testnet to MetaMask:
   - RPC URL: `https://data-seed-prebsc-1-s1.bnbchain.org:8545`
   - Chain ID: `97`
   - Symbol: `tBNB`
3. Got free test tBNB from the BNB Chain faucet (needed to pay gas fees for deployment)
4. Initialized Hardhat project:
   ```bash
   cd code
   npm init -y
   npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox@hh2
   npx hardhat init   # chose "Create a JavaScript project"
   ```
5. Installed OpenZeppelin contracts:
   ```bash
   npm install @openzeppelin/contracts
   ```

**What I got:** A working Hardhat project with all dependencies, a MetaMask wallet with test tBNB, ready to write a contract.

---

## Phase 2: Smart Contract

**Goal:** Write a BEP-20 token contract with the name "Dpenney42".

**What I did:**

Created `code/contracts/Dpenney42.sol` — an ERC-20 token that inherits from OpenZeppelin's audited contracts:

- **ERC20("Dpenney42", "DP42")** — token name and ticker symbol
- **Ownable(msg.sender)** — whoever deploys the contract becomes the owner
- **constructor(initialSupply)** — creates the initial tokens. I pass `42` at deploy time, and the constructor multiplies by `10^18` (18 decimals, because blockchain doesn't use floats)
- **mint(address, amount)** — owner can create new tokens and send them to any address
- **burn(amount)** — any user can destroy their own tokens

The contract is 26 lines. All the heavy lifting (transfer, approve, balanceOf, etc.) is inherited from OpenZeppelin's ERC20 — I don't need to rewrite standard functions.

**What I got:**
```
Compiled 7 Solidity files successfully
```

---

## Phase 3: Testing

**Goal:** Prove that every token function works correctly before deploying to a real network.

**What I did:**

Created `code/test/Dpenney42.test.js` with 5 tests. Each test deploys a fresh contract on Hardhat's local in-memory blockchain (nothing goes to the internet).

**What I got:**
```
  Dpenney42
    ✓ Should mint initial supply to owner
    ✓ Should transfer tokens between accounts
    ✓ Should approve and transferFrom tokens between accounts
    ✓ Should allow only owner to mint tokens
    ✓ Should allow users to burn their own tokens

  5 passing
```

### Test breakdown:

**1. Initial supply** — deploys contract with `42`, checks that owner's balance = 42 DP42

**2. Transfer** — owner sends 10 tokens to another account. Checks: recipient has 10, owner has 32

**3. Approve + TransferFrom** — owner approves a spender to use 7 tokens. Spender transfers 7 tokens from owner to a recipient. Checks: recipient has 7, allowance is now 0 (fully spent)

**4. Mint (owner only)** — owner mints 5 new tokens (balance becomes 47). Another user tries to mint — transaction reverts with `OwnableUnauthorizedAccount` error

**5. Burn** — owner mints 10 tokens to another user. That user burns all 10. Checks: balance = 0. This proves any user can burn their own tokens, not just the owner

---

## Phase 4: Deployment to BSC Testnet

**Goal:** Deploy the contract to a real (test) blockchain so it lives permanently on-chain.

**What I did:**

1. Installed `dotenv` to safely load the private key:
   ```bash
   npm install dotenv
   ```
2. Created `.env` with the MetaMask private key (added to `.gitignore` — never committed)
3. Updated `hardhat.config.js` — added BSC Testnet network config (RPC URL, Chain ID, private key)
4. Created `code/scripts/deploy.js` — script that deploys the contract with initial supply of 42
5. Deployed:
   ```bash
   npx hardhat run scripts/deploy.js --network bscTestnet
   ```

**What I got:**
```
Dpenney42 deployed to: 0x0217F67B40ecc96eF22389ad05E10A54957EC165
Network: BSC Testnet (Chain ID: 97)
Initial supply: 42 DP42
```

Two events were emitted during the deployment:
- **Transfer** — 42 tokens created (from `0x000...000` to owner). The zero address means "minted from nothing"
- **OwnershipTransferred** — ownership set from `0x000...000` to the deployer's wallet

The contract now lives on BSC Testnet permanently. It cannot be modified or deleted — only interacted with through its functions.

---

## Phase 5: Verification on bscscan

**Goal:** Publish the Solidity source code on bscscan so anyone can read it (not just the compiled bytecode).

**Why verification is needed:** When I deploy a contract, only the **compiled bytecode** (machine code like `0x608060...`) gets stored on the blockchain. The original Solidity source code stays on my computer — it never goes on-chain. bscscan is just a website that reads blockchain data, so it can only show the bytecode. It has no way to know what the original source code looked like.

Verification is the process where I send my `.sol` source code to bscscan, and it compiles the code independently. If the resulting bytecode matches what's already on the blockchain — bscscan trusts that this is the real source code and displays it publicly with a green checkmark. Reverse-engineering bytecode back to Solidity is impossible, so this is the only way to prove what the contract does.

**Important discovery:** To get an API key for bscscan, you don't register on bscscan itself — you need an **Etherscan** account. Since 2024, BSC data access is provided through **Etherscan API V2**. A single Etherscan API key works for BSC and 60+ other EVM chains. To query BSC specifically, you include Chain ID `56` (mainnet) or `97` (testnet) in the request.

Steps:
1. Register at [etherscan.io](https://etherscan.io)
2. Generate an API key in your Etherscan account
3. Add the key to `.env` as `BSCSCAN_API_KEY`
4. Add `etherscan` block to `hardhat.config.js` so Hardhat knows which API key to use for verification
5. Run verification:
   ```bash
   npx hardhat verify --network bscTestnet 0x0217F67B40ecc96eF22389ad05E10A54957EC165 42
   ```

**Why `42` at the end?** The constructor of my contract takes `initialSupply` as an argument. When I deployed, I passed `42`. This argument was encoded into the deployment bytecode. During verification, bscscan compiles the source code **and** appends the constructor arguments to produce the final bytecode. If I pass a different number, the bytecode won't match and verification will fail. It must be the exact same value I used during deployment.

**Note on API version:** Initially I configured `etherscan.apiKey` as an object with `{ bscTestnet: key }`, but this uses the deprecated V1 endpoint. Since May 2025, Etherscan requires V2. The fix is simple — pass the API key as a plain string: `apiKey: process.env.BSCSCAN_API_KEY`. Etherscan V2 determines the chain automatically from the Chain ID.

**What I got:**

Verification succeeded. The source code is now publicly visible at:
https://testnet.bscscan.com/address/0x0217F67B40ecc96eF22389ad05E10A54957EC165#code

bscscan now shows:
- **Source code** — my full `Dpenney42.sol` with all comments, readable by anyone
- **Compiler settings** — Solidity 0.8.28, EVM version "paris", optimizer disabled. These are the exact settings Hardhat used to compile the contract
- **Contract ABI** — the interface definition listing all functions (transfer, approve, mint, burn, etc.) with their parameter types. Any application (wallet, dApp) uses the ABI to know how to interact with the contract
- **Constructor arguments** — encoded as `000...002a` (hex). `0x2a` = 42 in decimal. The value is padded to 32 bytes (64 hex chars) because Solidity's `uint256` is always 256 bits. bscscan decoded it: `initialSupply (uint256): 42`

bscscan took my source code, these compiler settings, and the constructor argument, compiled everything independently — and the resulting bytecode matched what's on the blockchain. That's the proof that the published source code is genuine.

---

## Phase 6: Documentation

**Goal:** Create a whitepaper and usage guide so anyone can understand what DP42 is, how it works, and how to use it.

**What I did:**

Created `documentation/whitepaper.md` — a full whitepaper covering:

- **The Problem** — overcrowded clusters at 42 campus, no reservation system, no reward for student contributions
- **The Solution** — DP42 as a utility token for campus perks (towels, workstation reservations, coffee queue skip, "King of the Cluster" title)
- **Token Details** — fixed supply of 42, BEP-20 standard, burnable, verified on bscscan
- **Pricing** — campus perks from 0.1 DP42 (towel) to 2 DP42 (King of the Cluster)
- **Token Distribution** — three phases:
  1. **Airdrop** — every new student gets 0.01 DP42 upon enrollment
  2. **Achievement rewards** — earn DP42 for passing projects, code reviews, helping peers, hackathons
  3. **Peer-to-peer trading** — students trade freely among themselves
- **How to Use** — step-by-step instructions for students (MetaMask setup, getting tBNB for gas, importing DP42) and for the campus admin (distributing tokens, monitoring balances)
- **Roadmap** — from token creation to campus pilot

---

## Commands Cheat Sheet

All commands are run from the `code/` directory.

### 1. Setup (first time only)

```bash
cd code
npm install                # install all dependencies
```

### 2. Compile the contract

```bash
npx hardhat compile        # compiles .sol files → artifacts/
```

### 3. Run tests (local blockchain, no internet needed)

```bash
npx hardhat test           # runs all tests in test/ folder
```

### 4. Deploy to BSC Testnet

Requires `.env` file with `PRIVATE_KEY` and tBNB in the wallet for gas fees.

```bash
npx hardhat run scripts/deploy.js --network bscTestnet
```

Output will show the new contract address — **save it!**

### 5. Verify on bscscan

Requires `.env` file with `BSCSCAN_API_KEY`. Replace the address and constructor argument with your values.

```bash
npx hardhat verify --network bscTestnet <CONTRACT_ADDRESS> 42
```

Example with our current contract:
```bash
npx hardhat verify --network bscTestnet 0x0217F67B40ecc96eF22389ad05E10A54957EC165 42
```

`42` at the end is the constructor argument (`initialSupply`) — must match what was used during deploy.

### 6. Full evaluation demo (step by step)

```bash
# 1. Show tests pass
npx hardhat test

# 2. Deploy a fresh contract in front of reviewers
npx hardhat run scripts/deploy.js --network bscTestnet
# → copy the new contract address from output

# 3. Verify the new contract on bscscan
npx hardhat verify --network bscTestnet <NEW_ADDRESS> 42
# → check on https://testnet.bscscan.com/address/<NEW_ADDRESS>#code

# 4. Demonstrate functions via bscscan "Write Contract" / "Read Contract" tabs:
#    - balanceOf (check owner balance = 42 DP42)
#    - transfer (send tokens to another address)
#    - approve + transferFrom (delegated transfer)
#    - mint (create new tokens — owner only)
#    - burn (destroy your own tokens)
```

### .env file format

```
PRIVATE_KEY=your_metamask_private_key_here
BSCSCAN_API_KEY=your_etherscan_api_key_here
```

**Never commit `.env` to git!**

---

## Can a smart contract be deleted?

**No.** Blockchain is immutable — once a contract is deployed, it lives on-chain forever. There is no "undo" or "delete".

Solidity used to have a `selfdestruct` function that would destroy a contract and return remaining BNB to a specified address. However, since the **Ethereum Dencun upgrade (March 2024)**, `selfdestruct` no longer removes code and data from the blockchain — it's effectively dead.

What you **can** do instead of deleting:

- **Pause** — add a `Pausable` modifier (from OpenZeppelin) that freezes all token operations. The contract exists but every transaction reverts. Can be unpaused later
- **Burn all tokens** — destroy all 42 tokens. The contract remains, but the token supply becomes 0
- **Renounce ownership** — call `renounceOwnership()` (built into Ownable). After this, no one can mint new tokens ever again. This is irreversible

For this project, none of these are necessary. The contract at `0x0217F67B40ecc96eF22389ad05E10A54957EC165` will remain on BSC Testnet as long as the network exists.

**Tip for evaluation:** To demonstrate a fresh deploy in front of reviewers, simply run the deploy script again — it will create a **new** contract with a new address. The old one stays untouched. Each deploy costs ~0.001 tBNB (free from faucet).

---

## Security notes

- This project uses **only testnet** with free test tBNB — no real money is involved
- Private key is stored in `.env` and excluded from git via `.gitignore`
- The contract inherits from OpenZeppelin's audited contracts (not custom implementations)
- Only the contract owner can mint new tokens; any user can burn their own tokens
