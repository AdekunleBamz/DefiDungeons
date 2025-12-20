# DefiDungeons

## Overview

DefiDungeons is a professional-grade blockchain game built on Stacks using Clarity. It features a dungeon crawling mechanic where players can stake tokens to enter dungeons, earn rewards, and track their stats on-chain.

## Features

- **Clarity 4 Integration**: Utilizes the latest Clarity features for robust smart contract logic.
- **Token Integation**: Supports SIP-10 like token traits for entry fees and rewards.
- **Secure Architecture**: Implements owner-only administrative functions and secure asset handling.
- **Stat Tracking**: On-chain tracking of player progress, dungeons completed, and rewards earned.

## Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [Clarinet](https://github.com/hirosystems/clarinet) (latest version)

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd DefiDungeons
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Testing

Run the Vitest test suite to verify the contract logic:

```bash
npm run test
```

## Contract Interface

### Administrative
- `set-allowed-token(principal)`: Update the token used for gameplay.
- `set-dungeon-manifest(string-ascii 100)`: Update the daily dungeon message.

### Gameplay
- `enter-dungeon(token-trait, principal)`: Pay entry fee to start a dungeon.
- `complete-dungeon(token-trait, principal)`: Finish a dungeon and claim rewards.
- `craft-item(list 10 uint)`: Craft items using raw materials (demonstration of list operations).

## License

MIT
## Frontend Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start development server:
   ```bash
   npm run dev
   ```

3. Open `http://localhost:5173`.

## Chainhooks (Event Monitoring)

1. Configure hooks in `chainhooks/config.json`.
2. Run listener:
   ```bash
   node server/listener.js
   ```
