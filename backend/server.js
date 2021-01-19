const app = require('express')();
const cors = require('cors')
const bodyParser = require('body-parser');
const config = require('./config');
const route = require('./route');
const logger = require('./logger');
const https = require('https');


app.use(bodyParser.json());
app.use(cors())
route.applyRoutes(app);

const server = https.createServer(config.options, app);

server.listen(config.port, () => {
    logger.info(1, `App listening at https://localhost:` + config.port)
});