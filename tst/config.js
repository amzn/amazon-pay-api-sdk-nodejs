'use strict';

const fs = require('fs');
// Please Update the below mentioned values before running test cases
const configArgs = {
    'publicKeyId': '', // Enter your Public Key ID
    'privateKey': fs.readFileSync('AmazonPay_publicKeyId.pem'), // Path to your private key file
    'region': 'eu',
    'sandbox': true
};

module.exports = configArgs;