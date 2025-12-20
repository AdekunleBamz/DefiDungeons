import { openContractCall } from '@stacks/connect';
import {
    uintCV,
    stringAsciiCV,
    PostConditionMode,
} from '@stacks/transactions';
import { network, userSession } from './wallet.js';

console.log("Transactions module loaded");

// Contract Constants
export const CONTRACT_ADDRESS = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM';
export const CONTRACT_NAME = 'DefiDungeons';
