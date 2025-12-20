import { AppConfig, UserSession, showConnect } from '@stacks/connect';
import { StacksMainnet, StacksTestnet } from '@stacks/network';

const appConfig = new AppConfig(['store_write', 'publish_data']);
export const userSession = new UserSession({ appConfig });

// Network configuration
export const network = new StacksMainnet();
// export const network = new StacksTestnet(); // Toggle for dev

export function authenticate() {
    showConnect({
        appDetails: {
            name: 'DefiDungeons',
            icon: window.location.origin + '/logo.png',
        },
        redirectTo: '/',
        onFinish: () => {
            window.location.reload();
        },
        userSession,
    });
}

export function getUserData() {
    return userSession.loadUserData();
}
