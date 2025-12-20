import { authenticate, userSession } from './wallet.js';
import { enterDungeon, completeDungeon, craftItem } from './transactions.js';
import { fetchPlayerStats } from './stats.js';

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

            // Load stats
            updateStats();
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

    const craftBtn = document.getElementById('btn-craft');
    if (craftBtn) {
        craftBtn.addEventListener('click', () => {
            const m1 = document.getElementById('material-input-1').value;
            const m2 = document.getElementById('material-input-2').value;
            if (m1 && m2) {
                craftItem([parseInt(m1), parseInt(m2)]);
            } else {
                alert('Please enter material IDs');
            }
        });
    }
});

async function updateStats() {
    const stats = await fetchPlayerStats();
    console.log("Stats fetched:", stats);
    if (stats && stats.value && stats.value.value) {
        // map-get? returns (some (tuple)) -> value.value is the tuple
        const data = stats.value.value;
        if (data) {
            document.getElementById('stat-xp').textContent = data.xp ? data.xp.value : '0';
            document.getElementById('stat-dungeons').textContent = data['total-dungeons-completed'] ? data['total-dungeons-completed'].value : '0';
            document.getElementById('stat-rewards').textContent = data['total-rewards-earned'] ? data['total-rewards-earned'].value : '0';
        }
    }
}
