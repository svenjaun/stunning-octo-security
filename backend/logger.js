var fs = require('fs');
var util = require('util');
const { v4: uuidv4 } = require('uuid');

var log_file = fs.createWriteStream(__dirname + '/log/debug_' + new Date().toLocaleDateString().replace(/\//g, "_") + '.log', {flags : 'w'});

module.exports.log = (requestId, method, message) => {
    createLogString(requestId, "SUCESS", method, message)
};

module.exports.error = (requestId, method, message) => {
    createLogString(requestId, "ERROR", method, message)
};

module.exports.info = (requestId, method, message) => {
    createLogString(requestId, "INFO", method, message)
};


function createLogString(requestId, status, method, message) {
    let date = new Date()
    let log = " (" + status + ") --- " + requestId + " --- [" + util.format(date.toLocaleDateString(),date.toLocaleTimeString()) + "] \"" + util.format(method) + "\""
    if (message) {
        log += " :::::::: message = " + util.format(message)
    }
    log += '\n----------------------------------------------------------------\n';
    log_file.write(log);
}