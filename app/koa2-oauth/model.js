import Debug from 'debug';


const debug = Debug('model');
const db    = require('./db');
var model={};
// Client lookup - Note that for *authcode* grants, the secret is not provided
model.getClient = (id, secret) => {
    debug(`Looking up client ${id}:${secret}`);

    const lookupMethod = typeof secret === 'undefined'
        ? (client) => { return client.id === id; }
        : (client) => { return client.id === id && client.secret === secret };

    return db.clients.find(lookupMethod);
};

model.getUser = (username, password) => {
    debug(`Looking up user ${username}:${password}`);

    return db.users.find((user) => {
        return user.username === username && user.password === password;
    });
};

// In the client credentials grant flow, the client itself needs to be related
// with some form of user representation
model.getUserFromClient = (client) => {
    debug(`Looking up user for client ${client.name}`);
    return { name: client.name, isClient: true };
};

// Performs a lookup on the provided string and returns a token object
model.getAccessToken = (accessToken) => {
    debug(`Get access token ${accessToken}`);

    const token = db.tokens.find((token) => {
        return token.accessToken === accessToken;
    });

    if(!token) { return false; }

    // Populate with user and client model instances
    token.user = db.users.find((user) => {
        return user.id === token.user.id;
    });

    token.client = db.clients.find((client) => {
        return client.id === token.client.id;
    });

    return token;
};

// Performs a lookup on the provided string and returns a token object
model.getRefreshToken = (refreshToken) => {
    debug(`Get refresh token ${refreshToken}`);
    const token = db.tokens.find((token) => {
        return token.refreshToken === refreshToken;
    });

    if(!token) { return false; }

    // Populate with user and client model instances
    token.user = db.users.find((user) => {
        return user.id === token.user.id;
    });

    token.client = db.clients.find((client) => {
        return client.id === token.client.id;
    });

    return token;
};

// Saves the newly generated token object
model.saveToken = (token, client, user) => {
    debug(`Save token ${token.accessToken}`);

    token.user   = { id: user.id }; 
    token.client = { id: client.id };

    db.tokens.push(token);
    return token;
};

// Revoke refresh token after use - note ExpiresAt detail!
model.revokeToken = (token) => {
    debug(`Revoke token ${token.refreshToken}`);

    // Note: This is normally the DB object instance from getRefreshToken, so
    // just token.delete() or similar rather than the below findIndex.
    const idx = db.tokens.findIndex((item) => {
        return item.refreshToken === token.refreshToken;
    });

    db.tokens.splice(idx, 1);

    // Note: Presently, this method must return the revoked token object with
    // an expired date. This is currently being discussed in
    // https://github.com/thomseddon/node-oauth2-server/issues/251
    
    token.refreshTokenExpiresAt = new Date(1984);
    return token;
};

// Retrieves an authorization code
model.getAuthorizationCode = (code) => {
    debug(`Retrieving authorization code ${code}`);

    return db.authCodes.find((authCode) => {
        return authCode.authorizationCode === code;
    });
};

// Saves the newly generated authorization code object
model.saveAuthorizationCode = (code, client, user) => {
    debug(`Saving authorization code ${code.authorizationCode}`);
    code.user   = { id: user.id };
    code.client = { id: client.id };

    db.authCodes.push(code);
    return code;
};

// Revokes the authorization code after use - note ExpiresAt detail!
model.revokeAuthorizationCode = (code) => {
    debug(`Revoking authorization code ${code.authorizationCode}`);
    
    const idx = db.authCodes.findIndex((authCode) => {
        return authCode.authorizationCode === code.authorizationCode;
    });

    if(!idx) { return false; }

    db.authCodes.splice(idx, 1);
    code.expiresAt.setYear(1984); // Same as for `revokeToken()`

    return code;
};

// Called in `authenticate()` - basic check for scope existance
// `scope` corresponds to the oauth server configuration option, which
// could either be a string or boolean true.
// Since we utilize router-based scope check middleware, here we simply check
// for scope existance.
model.verifyScope = (token, scope) => {
    debug(`Verify scope ${scope} in token ${token.accessToken}`);
    if(scope && !token.scope) { return false; }
    return token;
};

// Can be used to sanitize or purely validate requested scope string
model.validateScope = (user, client, scope) => {
    debug(`Validating requested scope: ${scope}`);

    const validScope = (scope || '').split(' ').filter((key) => {
        return client.validScopes.indexOf(key) !== -1;
    });

    if(!validScope.length) { return false; }

    return validScope.join(' ');
};

export default model;