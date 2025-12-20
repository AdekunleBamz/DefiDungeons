import { openContractCall } from '@stacks/connect';
import {
    uintCV,
    stringAsciiCV,
    PostConditionMode,
} from '@stacks/transactions';
import { network, userSession } from './wallet.js';

console.log("Transactions module loaded");
