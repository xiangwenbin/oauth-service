// import log.debug from 'log.debug';

import log4js from '../log4js';
import db from './db';
import { UserService, ClientService, OauthCodeService } from '../service';
import { UserFacade, ClientFacade } from '../facade';
const log = log4js.getLogger('DEBUG');
var model = {};
// Client lookup - Note that for *authcode* grants, the secret is not provided
model.getClient = async(clientId, secret) => {
    log.debug(`Looking up client ${clientId}:${secret}`);

    let client = await ClientFacade.getClientByClientIdAndSecret(clientId, secret).then((result) => {
        return result == null ? null : result.get({
            plain: true
        });
    });

    return client;
};
// /**
//  * 授权码授权未用到
//  */
// model.getUser = async(username, password) => {

//     log.debug(`Looking up user ${username}:${password}`);
//     let user = await UserService.getUserByUserNameAndPassword(username, password).then((result) => {
//         return result == null ? null : result.get({
//             plain: true
//         });
//     });
//     return user;
//     // return db.users.find((user) => {
//     //     return user.username === username && user.password === password;
//     // });
// };

// In the client credentials grant flow, the client itself needs to be related
// with some form of user representation
// model.getUserFromClient = (client) => {
//     log.debug(`Looking up user for client ${client.name}`);
//     return { name: client.name, isClient: true };
// };

// Performs a lookup on the provided string and returns a token object
model.getAccessToken = (accessToken) => {
    log.debug(`Get access token ${accessToken}`);

    const token = db.tokens.find((token) => {
        return token.accessToken === accessToken;
    });

    if (!token) { return false; }

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
    log.debug(`Get refresh token ${refreshToken}`);
    const token = db.tokens.find((token) => {
        return token.refreshToken === refreshToken;
    });

    if (!token) { return false; }

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
    log.debug(`Save token ${token.accessToken}`);

    token.user = { id: user.id };
    token.client = { id: client.id };

    db.tokens.push(token);
    return token;
};

// Revoke refresh token after use - note ExpiresAt detail!
model.revokeToken = (token) => {
    log.debug(`Revoke token ${token.refreshToken}`);

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
model.getAuthorizationCode = async(code) => {
    log.debug(`Retrieving authorization code ${code}`);
    let oauthCode = OauthCodeService.getOauthCodeByCode(code).then((result) => {
        return result == null ? null : result.get({
            plain: true
        });
    });
    if (oauthCode) {
        oauthCode.user = { id: oauthCode.userId };
        oauthCode.client = { id: oauthCode.clientId };
    }

    // return db.authCodes.find((authCode) => {
    //     return authCode.authorizationCode === code;
    // });
    return oauthCode;
};

// Saves the newly generated authorization code object
model.saveAuthorizationCode = async(code, client, user) => {
    log.debug(`Saving authorization code ${code.authorizationCode}`);
    let oauthCode = {
        code: code.authorizationCode,
        clientId: client.id,
        userId: user.id,
        expiresTime: code.expiresAt.getTime()
    };
    // code.user = { id: user.id };
    // code.client = { id: client.id };
    oauthCode = await OauthCodeService.createOauthCode(oauthCode).then((result) => {
        return result;
    });

    code.user = user;
    code.client = client;
    // db.authCodes.push(code);
    return code;
};

// Revokes the authorization code after use - note ExpiresAt detail!
model.revokeAuthorizationCode = async(oauthCode) => {
    log.debug(`Revoking authorization code ${oauthCode.code}`);


    // let oauthCode =await OauthCodeService.getOauthCodeByCode(code.authorizationCode).then((result) => {
    //     return result == null ? null : result.get({
    //         plain: true
    //     });
    // });
    // if(!oauthCode){
    //     return false;
    // }else{
    oauthCode.expiresTime = 0;
    let result = await OauthCodeService.updateOauthCode(oauthCode).then((result) => {
        return result;
    });
    // }
    if (result) {
        return false;
    } else
        return oauthCode;

    // const idx = db.authCodes.findIndex((authCode) => {
    //     return authCode.authorizationCode === code.authorizationCode;
    // });

    // if (!idx) { return false; }

    // db.authCodes.splice(idx, 1);
    // code.expiresAt.setYear(1984); // Same as for `revokeToken()`

    // return code;
};

// Called in `authenticate()` - basic check for scope existance
// `scope` corresponds to the oauth server configuration option, which
// could either be a string or boolean true.
// Since we utilize router-based scope check middleware, here we simply check
// for scope existance.
model.verifyScope = (token, scope) => {
    log.debug(`Verify scope ${scope} in token ${token.accessToken}`);
    if (scope && !token.scope) { return false; }
    return token;
};

// Can be used to sanitize or purely validate requested scope string
model.validateScope = (user, client, scope) => {
    log.debug(`Validating requested scope: ${scope}`);

    const validScope = (scope || '').split(' ').filter((key) => {
        return client.validScopes.indexOf(key) !== -1;
    });

    if (!validScope.length) { return false; }

    return validScope.join(' ');
};

export default model;