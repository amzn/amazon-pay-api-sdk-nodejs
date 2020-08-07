'use strict';

const fs = require('fs');
// Please Update the below mentioned values before running test cases

const configArgs = {
    'publicKeyId': 'AGSQL22LHYAGJB367CTD2RHD', // Enter your Public ID
    'privateKey': fs.readFileSync('AmazonPay_publicKeyId.pem'), // Path to your private key file'
    'region': 'US',
    'sandbox': true,
    'currencyCode': 'USD',
    'countryCode': 'US',
    'storeId': 'amzn1.application-oa2-client94bad969a384414a94033d9e93f9fdf8'
};

module.exports = configArgs;