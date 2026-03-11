# Dpenney42 (DP42) — Whitepaper

## Abstract

Dpenney42 (DP42) is a BEP-20 utility token built for the 42 School campus ecosystem. With a fixed supply of 42 tokens, DP42 solves a real problem every 42 student knows — overcrowded clusters, no free workstations, and the eternal hunt for a towel. DP42 gives students a fun, blockchain-based way to access campus perks and rewards active participation in the school community.

---

## The Problem

42 School campuses are peer-to-peer learning environments with limited physical resources:

- **Overcrowded clusters** — during peak hours, finding a free workstation is a challenge. Students waste time walking between clusters looking for a spot
- **No reservation system** — it's first-come, first-served. If you step away for coffee, your spot is gone
- **No reward for contribution** — students who help peers, review code, and organize events get no tangible recognition

---

## The Solution

DP42 is a utility token that can be spent on campus perks and earned through achievements. It introduces a lightweight economy where active students are rewarded and campus resources can be managed in a fun, transparent way.

---

## Token Details

| Property | Value |
|---|---|
| **Name** | Dpenney42 |
| **Symbol** | DP42 |
| **Standard** | BEP-20 (ERC-20 compatible) |
| **Blockchain** | BNB Smart Chain (Testnet) |
| **Decimals** | 18 |
| **Total supply** | 42 DP42 (fixed) |
| **Mintable** | No — the initial 42 tokens are the only ones that will ever exist |
| **Burnable** | Yes — any holder can burn their own tokens |
| **Contract address** | `0x0217F67B40ecc96eF22389ad05E10A54957EC165` |

### Why 42?

42 is the answer to the Ultimate Question of Life, the Universe, and Everything. It's also the name of our school. The total supply mirrors this — scarce by design, valuable by necessity.

---

## What You Can Spend DP42 On

| Perk | Cost |
|---|---|
| Campus towel | 0.1 DP42 |
| Skip the coffee queue | 0.1 DP42 |
| Reserve a workstation for 2 hours | 0.5 DP42 |
| Couch in the quiet zone for 1 hour | 0.5 DP42 |
| Workstation next to a power outlet | 1 DP42 |
| Title "King of the Cluster" for a day | 2 DP42 |

Prices are intentionally low — with 42 tokens in circulation, even 0.1 DP42 has meaning.

---

## Token Distribution

### Phase 1: Airdrop (Initial Distribution)

Every new 42 student receives **0.01 DP42** upon enrollment. This is enough to try the system (grab a towel or skip a coffee queue) but not enough to do everything — students are encouraged to earn more through contributions.

With 42 total tokens, this model supports up to 4,200 initial airdrops before the supply is exhausted, which provides plenty of room for a campus-sized community.

### Phase 2: Achievement Rewards

Students earn DP42 by contributing to the campus community:

| Achievement | Reward |
|---|---|
| Pass a project with outstanding score | 0.05 DP42 |
| Complete a code review for a peer | 0.02 DP42 |
| Help a fellow student debug a problem | 0.01 DP42 |
| Organize or participate in a campus event | 0.1 DP42 |
| Win a hackathon | 0.5 DP42 |

Rewards are distributed by the contract owner (campus admin) using the `mint` function — wait, the supply is fixed at 42, so rewards are distributed via `transfer` from the owner's pool, not minted. This preserves the hard cap.

### Phase 3: Peer-to-Peer Trading

Students can freely trade DP42 among themselves using standard ERC-20 transfers:

- **Direct transfer** — send tokens to another student's wallet (`transfer`)
- **Delegated transfer** — approve a friend to spend your tokens on your behalf (`approve` + `transferFrom`)

Example scenarios:
- "I'll give you 0.5 DP42 for your power outlet spot"
- "Cover my coffee skip today, I'll send you 0.1 DP42"
- "Trade my King of the Cluster title for 3 workstation reservations"

The peer-to-peer economy creates organic price discovery — perks are worth what students are willing to pay.

---

## Smart Contract Architecture

The contract is built on top of OpenZeppelin's audited libraries:

```
Dpenney42
├── inherits ERC20        — standard token functions (transfer, approve, balanceOf, allowance)
└── inherits Ownable      — owner-only privileges (mint)
```

### Functions

| Function | Who can call | What it does |
|---|---|---|
| `transfer(to, amount)` | Any holder | Send tokens to another address |
| `approve(spender, amount)` | Any holder | Allow someone else to spend your tokens |
| `transferFrom(from, to, amount)` | Approved spender | Transfer tokens on behalf of the owner |
| `balanceOf(address)` | Anyone | Check token balance of an address |
| `allowance(owner, spender)` | Anyone | Check how many tokens a spender is approved to use |
| `mint(to, amount)` | Owner only | Create new tokens (used only for initial distribution) |
| `burn(amount)` | Any holder | Permanently destroy your own tokens |

### Security

- The contract inherits from OpenZeppelin — the most widely used and audited smart contract library
- Only the owner can mint new tokens — no one else can inflate the supply
- Any user can burn their own tokens but cannot burn someone else's
- The contract is verified on bscscan — anyone can read the source code and confirm it matches the bytecode

---

## How to Use DP42

### For Students

1. **Install MetaMask** — browser extension wallet (free)
2. **Add BSC Testnet** to MetaMask:
   - Network: BNB Smart Chain Testnet
   - RPC URL: `https://data-seed-prebsc-1-s1.bnbchain.org:8545`
   - Chain ID: `97`
   - Symbol: `tBNB`
3. **Get test tBNB** from the [BNB Chain Faucet](https://www.bnbchain.org/en/testnet-faucet) — this is **not** DP42. tBNB is the native currency of the BSC network, used to pay transaction fees (gas). Think of it like postage stamps: DP42 is the letter you're sending, tBNB is the stamp that pays the postal service to deliver it. Every blockchain operation (transfer, approve, etc.) costs a tiny amount of tBNB. It's free on testnet.
4. **Add DP42 token** to MetaMask — import custom token using the contract address: `0x0217F67B40ecc96eF22389ad05E10A54957EC165`
5. **Receive airdrop** — contact the campus admin to get your initial 0.01 DP42
6. **Start earning and spending** — check the perks table and achievement rewards above

### For Campus Admin (Contract Owner)

1. Use MetaMask or bscscan's "Write Contract" tab to call functions
2. **Distribute tokens** — use `transfer` to send DP42 to student wallets
3. **Monitor balances** — use `balanceOf` on bscscan's "Read Contract" tab
4. **View all transactions** — check the contract's transaction history on bscscan

---

## Roadmap

| Phase | Description | Status |
|---|---|---|
| Token creation | Write and test the smart contract | Done |
| Deployment | Deploy to BSC Testnet | Done |
| Verification | Publish source code on bscscan | Done |
| Documentation | Whitepaper and usage guide | Done |
| Campus pilot | Airdrop to first group of students | Planned |
| Feedback | Adjust perks and prices based on usage | Planned |

---

## Disclaimer

DP42 is a testnet token created for educational purposes as part of the 42 School Tokenizer project. It has no real monetary value. All transactions happen on BSC Testnet using free test tBNB. Never use real money or mainnet for this project.
