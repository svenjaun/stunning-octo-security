const { promisify } = require('util');
const exec = promisify(require('child_process').exec)

module.exports.executeCommand = async (command) => {
    return (await exec(command))["stdout"];
};