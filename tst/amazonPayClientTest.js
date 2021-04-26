'use strict';

// Including Required Modules 
const Client = require('../src/client');
const config = require('./config');
const assert = require('assert');
const crypto = require('crypto');
const fs = require('fs');

const publicKey = ``; // Provide public key here to run the tests
const generateButtonSignaturePayloadObject = {
    storeId: 'amzn1.application-oa2-client.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    webCheckoutDetails: {
        checkoutReviewReturnUrl: 'https://localhost/test/CheckoutReview.php',
        checkoutResultReturnUrl: 'https://localhost/test/CheckoutResult.php'
    }
};
const generateButtonSignaturePayloadString = '{"storeId":"amzn1.application-oa2-client.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx","webCheckoutDetails":{"checkoutReviewReturnUrl":"https://localhost/test/CheckoutReview.php","checkoutResultReturnUrl":"https://localhost/test/CheckoutResult.php"}}';
const generateButtonSignaturePayloadEscapedString = '{"storeId\":\"amzn1.application-oa2-client.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx\",\"webCheckoutDetails\":{\"checkoutReviewReturnUrl\":\"https:\/\/localhost\/test\/CheckoutReview.php\",\"checkoutResultReturnUrl\":\"https:\/\/localhost\/test\/CheckoutResult.php\"}}';
const expectedStringToSign = `AMZN-PAY-RSASSA-PSS
8dec52d799607be40f82d5c8e7ecb6c171e6591c41b1111a576b16076c89381c`;

const mwsAuthToken = ''; // Provide public key here to run the tests
const merchantId = ''; // Provide merchantId

function verify (signature) {
    var verifier = crypto.createVerify('RSA-SHA256').update(expectedStringToSign);
    return verifier.verify({
        key: publicKey,
        padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
    }, signature, 'base64');
}

describe('AmazonPay Client Test Cases - Generate Button Signature', () => {
    before(function () {
        if (!publicKey) {
            console.error('Please provide publicKey before executing these test cases');
            this.skip();
        }
    });

    it('Validating Generate Button Signature Method', (done) => {
        const amazonPayCLient = new Client.AmazonPayClient(config);
        const signatureOne = amazonPayCLient.generateButtonSignature(generateButtonSignaturePayloadObject);
        const signatureTwo = amazonPayCLient.generateButtonSignature(generateButtonSignaturePayloadString);
        const signatureThree = amazonPayCLient.generateButtonSignature(generateButtonSignaturePayloadEscapedString);
        assert.ok(verify(signatureOne), 'Failed for JS object payload');
        assert.ok(verify(signatureTwo), 'Failed for string payload');
        assert.ok(verify(signatureThree), 'Failed for escaped string payload');
        done();
    });
});

describe('AmazonPay Client Test Cases - Get Authorization Token', () => {
    before(function () {
        if (!mwsAuthToken || !merchantId) {
            console.error('Please provide mwsAuthToken and merchantId before executing these test cases');
            this.skip();
        }
    });
    it('Validating Get Authorization Token API', (done) => {
        const configCopy = {...config};
        configCopy.sandbox = false;
        const amazonPayCLient = new Client.AmazonPayClient(configCopy);
        amazonPayCLient.getAuthorizationToken(mwsAuthToken, merchantId)
        .then(function (result) {
            var actualResponse = result.data;
            assert.ok(actualResponse.authorizationToken);
            done();
        })
        .catch(function (err) {
            done(err);
        });
    })
});