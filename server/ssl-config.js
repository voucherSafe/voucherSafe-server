var path = require('path'),
fs = require('fs');

exports.privateKey = fs.readFileSync(path.join(__dirname, './private/domain.key')).toString();
exports.certificate = fs.readFileSync(path.join(__dirname, './private/domain.crt')).toString();
exports.ca = fs.readFileSync(path.join(__dirname, './private/intermediate.pem')).toString();