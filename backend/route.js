const auth = require("./auth");
const db = require("./db/db");
const logger = require("./logger");
const command = require("./command");
const { v4: uuidv4 } = require('uuid');
var util = require('util');

module.exports.applyRoutes = (app) => {

    app.post('/register', async (req, res) => {
        let uuid = uuidv4();
        logger.info(uuid,"POST /register")
        let privateKey = await auth.saveUser(req.body.username, req.body.email, req.body.password);
        if (privateKey) {
            res.status(201).send({privateKey: privateKey})
            logger.log(uuid,"POST /register", {username: req.body.username, email: req.body.email})
        } else {
            res.status(400).send("Unable to register")
            logger.error(uuid,"POST /register", {username: req.body.username, email: req.body.email})
        }
    });

    app.post('/login', async (req, res) => {
        let uuid = uuidv4();
        logger.info(uuid,"POST /login")
        let token = await auth.login(req.body.username, req.body.password, req.body.key)
        if (token) {
            res.status(200).send({token});
            logger.log(uuid,"POST /login", {username: req.body.username})
        } else {
            res.status(401).send('Unauthorized');
            logger.error(uuid,"POST /login", "Unauthorized")
        }
    });

    app.get('/', async (req, res) => {
        let uuid = uuidv4();
        logger.info(uuid,"GET /")
        let role = await auth.verifyToken(req.headers.authorization)
        if (role) {
            res.status(200).send(await db.getAllUser(role))
            logger.log(uuid,"GET /", { role: role })
        } else {
            logger.error(uuid,"GET /", "Forbidden")
            res.status(403).send('Forbidden');
        }
    });

    app.put('/admin', async (req, res) => {
        let uuid = uuidv4();
        logger.info(uuid,"PUT /admin")
        let role = await auth.verifyToken(req.headers.authorization)
        if (role) {
            logger.log(uuid,"PUT /admin", {role: role})
            if (await auth.importance(role) > 50) {
                res.status(200).send(await db.grantAdmin(req.body.email))
                logger.log(uuid,"PUT /admin", "OK")
            } else {
                res.status(401).send('Unauthorized');
                logger.error(uuid,"PUT /admin", "Unauthorized")
            }
        } else {
            res.status(403).send('Forbidden');
            logger.error(uuid,"PUT /admin", "Forbidden")
        }
    });

    app.delete('/admin/:id', async (req, res) => {
        let uuid = uuidv4();
        logger.info(uuid,"PUT /admin" + req.params.id)
        let role = await auth.verifyToken(req.headers.authorization)
        if (role) {
            logger.info(uuid, "PUT /admin", {role: role})
            if (await auth.importance(role) > 10000) {
                res.status(200).send(await db.removeAdmin(req.params.id))
                logger.log(uuid,"DELETE /admin/" + req.params.id, "OK")
            } else {
                res.status(401).send('Unauthorized');
                logger.error(uuid,"DELETE /admin/" + req.params.id, "Unauthorized")
            }
        } else {
            res.status(403).send('Forbidden');
            logger.error(uuid,"DELETE /admin/" + req.params.id, "Forbidden")
        }
    });

    app.post('/command', async (req, res) => {
        let uuid = uuidv4();
        logger.info(uuid,"POST /command")
        let role = await auth.verifyToken(req.headers.authorization)
        if (role) {
            logger.info(uuid, "POST /command", {role: role})
            if (await auth.importance(role) > 50) {
                if (validateCommand(req.body.command)) {
                    let response = await command.executeCommand(req.body.command);
                    res.status(200).send({ output: response})
                    logger.log(uuid,"POST /command", response)
                } else {
                    res.status(400).send('Malicious Request');
                    logger.error(uuid,"POST /command", util.format("Malicious Request", req.body.command))
                }
            } else {
                res.status(401).send('Unauthorized');
                logger.error(uuid,"POST /command", "Unauthorized")
            }
        } else {
            res.status(403).send('Forbidden');
            logger.error(uuid,"POST /command", "Forbidden")
        }
    });

    app.get('/role', async (req, res) => {
        let uuid = uuidv4();
        logger.info(uuid,"GET /role")
        let role = await auth.verifyToken(req.headers.authorization)
        if (role) {
            res.status(200).send({ role })
            logger.log(uuid, "GET /role", {role: role})
        } else {
            res.status(403).send('Forbidden');
            logger.error(uuid,"POGETST /role", "Forbidden")
        }
    });
}

function validateCommand(commandToValidate) {
    let whitelist = ["ls"];
    let blacklist = ["&", ";", "|", "&", ">", "<"];
    let clean = false;
    for (let whiteObject of whitelist) {
        if (commandToValidate.startsWith(whiteObject)) {
            clean = true;
        }
    }
    for (let blackObject of blacklist) {
        if (commandToValidate.indexOf(blackObject) > -1) {
            return false;
        }
    }
    return clean;
}