const fs = require('fs');
var config = {};

config.port = process.env.PORT || 443;
config.db_user = process.env.DB_USERNAME || 'sec'
config.db_host = process.env.DB_HOST || 'localhost'
config.db_password = process.env.DB_PASSWORD || 'admin'
config.db_name = process.env.DB_NAME || 'stunning-octo-security'
config.options = {
    key: fs.readFileSync(__dirname + '/key.pem'),
    cert: fs.readFileSync(__dirname + '/cert.pem')
}
config.salt = process.env.SALT || 'stunning-octo-security-salt-1234-secure'
config.jwt_secret_key = process.env.JWT_KEY || 'stunning-octo-security-jwt-1234-secure'
module.exports = config;
