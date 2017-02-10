
export default {
    clients: [{
        id: 'saas',
        secret: 'superSecret', 
        name: 'saas',
        accessTokenLifetime: 3600,    // If omitted, server default will be used
        refreshTokenLifetime: 604800, // ^
        redirectUris: ['https://www.getpostman.com/oauth2/callback'],
        grants: ['client_credentials', 'refresh_token', 'authorization_code', 'password'],
        validScopes: ['all'],
    }],
    users: [{
        id: 1,
        name: 'AzureDiamond',
        username: 'foo@example.com',
        password: 'hunter2',
    }],
    tokens: [],
    authCodes: []
};
