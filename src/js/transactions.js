import { openContractCall } from '@stacks/connect';
import {
    uintCV,
    stringAsciiCV,
    contractPrincipalCV,
    PostConditionMode,
} from '@stacks/transactions';
import { network, userSession } from './wallet.js';

console.log("Transactions module loaded");

// Contract Constants
export const CONTRACT_ADDRESS = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM';
export const CONTRACT_NAME = 'DefiDungeons';

export function enterDungeon() {
    const tokenAddress = 'SP2PABAF9FTAJYNFZH93XENAJ8FVY99RRM50D2JG9'; // mock
    const tokenName = 'my-token';

    const options = {
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACT_NAME,
        functionName: 'enter-dungeon',
        functionArgs: [
            contractPrincipalCV(tokenAddress, tokenName)
        ],
        postConditionMode: PostConditionMode.Allow,
        network,
        appDetails: {
            name: 'DefiDungeons',
            icon: window.location.origin + '/logo.png',
        },
        onFinish: (data) => {
            console.log('Transaction submitted:', data.txId);
            window.open(`https://explorer.hiro.so/txid/${data.txId}?chain=testnet`, '_blank');
        },
    };

    openContractCall(options);
}
