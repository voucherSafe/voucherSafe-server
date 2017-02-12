var path = require('path'),
fs = require('fs');

exports.privateKey = fs.readFileSync('/etc/letsencrypt/live/vouchersafe.purandara.in/privkey.pem').toString();
exports.certificate = fs.readFileSync('/etc/letsencrypt/live/vouchersafe.purandara.in/fullchain.pem').toString();
exports.ca = fs.readFileSync('/etc/letsencrypt/live/vouchersafe.purandara.in/fullchain.pem').toString();