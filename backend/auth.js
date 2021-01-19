const config = require('./config');
const db = require("./db/db.js")
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const forge = require('node-forge');


// register user
module.exports.saveUser = async (username, email, password) => {
    let roleId = await db.getRoleId("Octo_User");
    const hash = bcrypt.hashSync(password + config.salt, 10);

    const pattern = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    if (!pattern.test(email)) {
        return null;
    }
    let keys = await keyPair();
    if (keys.err) {
        return null;
    }
    let user = await db.saveUser(username, email, hash, roleId['id'], keys["publicKey"]);
    if (user) {
        return keys["privateKey"]
    }
}

// login user
module.exports.login = async (username, password) => {
    let user = await db.getUser(username);
    if (user && bcrypt.compareSync(password + config.salt, user.pw_hash)) {
        try {
            return await jwt.sign(
                {
                    id: user.id,
                    username: user.username,
                    email: user.email
                }, config.jwt_secret_key, { expiresIn: '1800000' });

        } catch (err) {
            return null
        }

    }
    return null;
}

// check if token is correct
module.exports.verifyToken = async (auth) => {
    if (auth) {
        let token = auth.split(" ")[1]
        try {
            let authUser = await jwt.verify(token, config.jwt_secret_key);
            return await db.getUserRole(authUser.username);
        } catch (err) {
            console.log(err);
            return null;
        }
    }
    return null;
}

// check importance of user
module.exports.importance = async (role) => {
    return (role ? await db.getImportance(role) : 0)["importance"];
}


async function keyPair() {
    let keyPair;
    await new Promise(resolve => {
        crypto.generateKeyPair('rsa', {
            modulusLength: 4096,
            publicKeyEncoding: {
                type: 'spki',
                format: 'pem'
            },
            privateKeyEncoding: {
                type: 'pkcs8',
                format: 'pem',
                cipher: 'aes-256-cbc',
                passphrase: 'secret'
            }
        }, (err, publicKey, privateKey) => {
            publicKey = publicKey.replace(/\n/g, "")
            privateKey = privateKey.replace(/\n/g, "")
            keyPair = { err, publicKey, privateKey }
            resolve()
        });
    })
    return keyPair;
}