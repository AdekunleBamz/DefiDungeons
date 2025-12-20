import { authenticate, userSession } from './wallet.js';
import { enterDungeon, completeDungeon } from './transactions.js';

document.addEventListener('DOMContentLoaded', async () => {
    console.log('DefiDungeons App Initialized');

    if (userSession.isUserSignedIn()) {
        console.log('User signed in');
        document.getElementById('connect-wallet').classList.add('hidden');
        document.getElementById('wallet-info').classList.remove('hidden');

        try {
            const userData = userSession.loadUserData();
            const address = userData.profile.stxAddress.mainnet || userData.profile.stxAddress.testnet;
            document.getElementById('stx-address').textContent = `${address.slice(0, 6)}...${address.slice(-4)}`;
        } catch (e) {
            console.error("Error loading user data", e);
        }
    }

    const connectBtn = document.getElementById('connect-wallet');
    if (connectBtn) {
        connectBtn.addEventListener('click', () => {
            authenticate();
        });
    }

    const disconnectBtn = document.getElementById('disconnect-wallet');
    if (disconnectBtn) {
        disconnectBtn.addEventListener('click', () => {
            userSession.signUserOut('/');
        });
    }

    const enterBtn = document.getElementById('btn-enter-dungeon');
    if (enterBtn) {
        enterBtn.addEventListener('click', () => {
            enterDungeon();
        });
    }

    const completeBtn = document.getElementById('btn-complete-dungeon');
    if (completeBtn) {
        completeBtn.addEventListener('click', () => {
            completeDungeon();
        });
    }
});
