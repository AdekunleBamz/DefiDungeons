import { AppConfig, UserSession, showConnect } from '@stacks/connect';

const appConfig = new AppConfig(['store_write', 'publish_data']);
export const userSession = new UserSession({ appConfig });

export function authenticate() {
    showConnect({
        appDetails: {
            name: 'DefiDungeons',
            icon: window.location.origin + '/logo.png', // Placeholder
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
