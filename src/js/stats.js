import { callReadOnlyFunction, standardPrincipalCV, cvToJSON } from '@stacks/transactions';
import { CONTRACT_ADDRESS, CONTRACT_NAME } from './transactions.js';
import { network, userSession } from './wallet.js';

export async function fetchPlayerStats() {
    if (!userSession.isUserSignedIn()) return null;

    const userData = userSession.loadUserData();
    const address = userData.profile.stxAddress.mainnet || userData.profile.stxAddress.testnet;

    const options = {
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACT_NAME,
        functionName: 'get-player-stats',
        functionArgs: [standardPrincipalCV(address)],
        network,
        senderAddress: address,
    };

    try {
        const result = await callReadOnlyFunction(options);
        return cvToJSON(result);
    } catch (e) {
        console.error("Error fetching stats", e);
        return null;
    }
}
