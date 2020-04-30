'use strict';

// Including Required Modules 
const Client = require('../src/client');
const config = require('./config');
const assert = require('assert');
const uuidv4 = require('uuid/v4');
const headers = {
    'x-amz-pay-idempotency-key': uuidv4().toString().replace(/-/g, '')
};

const chargePermissionId = ''; // Enter Charge Permission ID

// Intiating WebStoreClient Class
const webStoreClient = new Client.WebStoreClient(config);

// Constants required to execute Unit Test cases
var checkoutSessionId;
var chargeId;
var refundId;

const createCheckoutSessionPayload = {
    webCheckoutDetails: {
        checkoutReviewReturnUrl: 'https://localhost/maxo/checkoutReview.html',
        checkoutResultReturnUrl: 'https://localhost/maxo/checkoutReturn.html'
    },
    storeId: '' // Enter Store ID
};
const updateCheckoutSessionPayload = {
    paymentDetails: {
        paymentIntent: 'Confirm',
        chargeAmount: {
            amount: 50,
            currencyCode: 'EUR'
        }
    },
    merchantMetadata: {
        merchantReferenceId: uuidv4().toString().replace(/-/g, ''),
        merchantStoreName: 'Test Shop EU',
        noteToBuyer: 'Thank you for your order!'
    }
};
const completeCheckoutSessionPayload = {
    chargeAmount: {
        amount: 50,
        currencyCode: 'EUR'
    }
}
const updateChargePermissionPayload = {
    merchantMetadata: {
        merchantReferenceId: uuidv4().toString().replace(/-/g, ''),
        merchantStoreName: 'Test Shop EU',
        noteToBuyer: 'Thank you for your order!',
        customInformation: 'Custom Info'
    }
};
const closeChargePermissionPayload = {
    closureReason: 'All actions completed',
    cancelPendingCharges: false
};
const createChargePayload = {
    chargePermissionId: chargePermissionId,
    chargeAmount: {
        amount: '10.00',
        currencyCode: 'EUR'
    },
    captureNow: false,
    canHandlePendingAuthorization: false
};
const captureChargePayload = {
    captureAmount: {
        amount: '10.00',
        currencyCode: 'EUR'
    },
    softDescriptor: 'AMZN'
}
const cancelChargePayload = {
    cancellationReason: 'Cancelling Charge Test'
};

// Validating Checkout Session API Calls
describe('WebStore Client Test Cases - Checkout Session APIs', () => {
    before(function () {
        if (!createCheckoutSessionPayload.storeId) {
            console.error('Please provide storeId in the payload before executing these test cases');
            this.skip();
        }
    });

    const expectedResponse = {
        checkoutSessionId: '',
        webCheckoutDetails: '',
        productType: '',
        paymentDetails: '',
        merchantMetadata: '',
        supplementaryData: '',
        buyer: '',
        billingAddress: '',
        paymentPreferences: '',
        statusDetails: '',
        shippingAddress: '',
        platformId: '',
        chargePermissionId: '',
        chargeId: '',
        constraints: '',
        creationTimestamp: '',
        expirationTimestamp: '',
        storeId: '',
        providerMetadata: '',
        releaseEnvironment: '',
        deliverySpecifications: ''
    };

    it('Validating Create Checkout Session API', (done) => {
        webStoreClient.createCheckoutSession(createCheckoutSessionPayload, headers).then(function (result) {
            var actualResponse = JSON.parse(result.body);
            checkoutSessionId = actualResponse.checkoutSessionId;
            assert.deepEqual(Object.keys(expectedResponse), Object.keys(actualResponse));
            done();
        }).catch(err => {
            done(err);
        });
    });

    it('Validating Get Checkout Session API', (done) => {
        webStoreClient.getCheckoutSession(checkoutSessionId, headers).then(function (result) {
            var actualResponse = JSON.parse(result.body);
            assert.deepEqual(Object.keys(expectedResponse), Object.keys(actualResponse));
            done();
        }).catch(err => {
            done(err);
        });
    });

    it('Validating Update Checkout Session API', (done) => {
        webStoreClient.updateCheckoutSession(checkoutSessionId, updateCheckoutSessionPayload).then(function (result) {
            var actualResponse = JSON.parse(result.body);
            assert.deepEqual(Object.keys(expectedResponse), Object.keys(actualResponse));
            done();
        }).catch(err => {
            done(err);
        });
    });

    // Can only run this after visiting amazonPayRedirectUrl
    it.skip('Validating Complete Checkout Session API', (done) => {
        webStoreClient.completeCheckoutSession(checkoutSessionId, completeCheckoutSessionPayload).then(function (result) {
            var actualResponse = JSON.parse(result.body);
            assert.deepEqual(Object.keys(expectedResponse), Object.keys(actualResponse));
            done();
        }).catch(err => {
            done(err);
        });
    });
});

describe('', () => {
    // Skip the tests if chargePermissionId is not provided
    before(function () {
        if (!chargePermissionId) {
            console.error('Please provide chargePermissionId before executing these test cases');
            this.skip();
        }
    });

    // Validating Charge Permission API Call's
    describe('WebStore Client Test Cases - Charge Permission APIs', (done) => {
        const expectedResponse = {
            chargePermissionId: '',
            chargePermissionReferenceId: '',
            platformId: '',
            buyer: '',
            shippingAddress: '',
            billingAddress: '',
            paymentPreferences: '',
            statusDetails: '',
            creationTimestamp: '',
            expirationTimestamp: '',
            merchantMetadata: '',
            releaseEnvironment: '',
            limits: '',
            presentmentCurrency: ''
        };

        it('Validating Get Charge Permission API', (done) => {
            webStoreClient.getChargePermission(chargePermissionId, headers).then(function (result) {
                var actualResponse = JSON.parse(result.body);
                assert.deepEqual(Object.keys(expectedResponse), Object.keys(actualResponse));
                done();
            }).catch(err => {
                done(err);
            });
        });

        it('Validating Update Charge Permission API', (done) => {
            webStoreClient.updateChargePermission(chargePermissionId, updateChargePermissionPayload, headers).then(function (result) {
                var actualResponse = JSON.parse(result.body);
                assert.deepEqual(Object.keys(expectedResponse), Object.keys(actualResponse));
                done();
            }).catch(err => {
                done(err);
            });
        });

        // Cannot Create Charge if Close Charge Permission is executed, unskip this test case and skip Charge API Tests to validate this API 
        it.skip('Validating Close Charge Permission API', (done) => {
            webStoreClient.closeChargePermission(chargePermissionId, closeChargePermissionPayload, headers).then(function (result) {
                var actualResponse = JSON.parse(result.body);
                assert.deepEqual(Object.keys(expectedResponse), Object.keys(actualResponse));
                done();
            }).catch(err => {
                done(err);
            });
        });
    });

    // Validating Create Charge API Call
    describe('WebStore Client Test Cases - Charge APIs', (done) => {
        const expectedResponse = {
            chargeId: '',
            chargeAmount: '',
            chargePermissionId: '',
            captureAmount: '',
            refundedAmount: '',
            softDescriptor: '',
            providerMetadata: '',
            statusDetails: '',
            creationTimestamp: '',
            expirationTimestamp: '',
            releaseEnvironment: ''
        };

        before(function () {
            if (!chargePermissionId) {
                console.error('Please Enter chargePermissionId and execute test cases');
                this.skip();
            }
        });

        it('Validating Create Charge API', (done) => {
            webStoreClient.createCharge(createChargePayload, headers).then(function (result) {
                var actualResponse = JSON.parse(result.body);
                chargeId = actualResponse.chargeId;
                assert.deepEqual(Object.keys(expectedResponse), Object.keys(actualResponse));
                done();
            }).catch(err => {
                done(err);
            });
        });

        it('Validating Get Charge API', (done) => {
            webStoreClient.getCharge(chargeId, headers).then(function (result) {
                var actualResponse = JSON.parse(result.body);
                assert.deepEqual(Object.keys(expectedResponse), Object.keys(actualResponse));
                done();
            }).catch(err => {
                done(err);
            });
        });

        it('Validating Capture Charge API', (done) => {
            webStoreClient.captureCharge(chargeId, captureChargePayload, {
                'x-amz-pay-idempotency-key': uuidv4().toString().replace(/-/g, '')
            }).then(function (result) {
                var actualResponse = JSON.parse(result.body);
                assert.deepEqual(Object.keys(expectedResponse), Object.keys(actualResponse));
                done();
            }).catch(err => {
                done(err);
            });
        });

        // Cannot Run both Capture charge and Cancel charge at same time, Run either Capture Capture or Cancel Charge
        it.skip('Validating Cancel Charge API', (done) => {
            webStoreClient.cancelCharge(chargeId, cancelChargePayload, headers).then(function (result) {
                var actualResponse = JSON.parse(result.body);
                assert.deepEqual(Object.keys(expectedResponse), Object.keys(actualResponse));
                done();
            }).catch(err => {
                done(err);
            });
        });
    });

    // Validating Refund API Call's
    describe('WebStore Client Test Cases - Refund APIs', (done) => {
        // Refund API should have different idempotency key, Hence creating new headers
        const headers = {
            'x-amz-pay-idempotency-key': uuidv4().toString().replace(/-/g, '')
        };
        const expectedResponse = {
            refundId: '',
            chargeId: '',
            creationTimestamp: '',
            refundAmount: '',
            statusDetails: '',
            softDescriptor: '',
            releaseEnvironment: ''
        };

        before(function () {
            if (!chargePermissionId) {
                console.error('Please Enter chargePermissionId and execute test cases');
                this.skip();
            }
        });

        it('Validating Create Refund API', (done) => {
            const refundpaylod = {
                chargeId: chargeId,
                refundAmount: {
                    amount: '10.00',
                    currencyCode: 'EUR'
                },
                softDescriptor: 'SOFT_DESCRIPTOR'
            };
            webStoreClient.createRefund(refundpaylod, headers).then(function (result) {
                var actualResponse = JSON.parse(result.body);
                refundId = actualResponse.refundId;
                assert.deepEqual(Object.keys(expectedResponse), Object.keys(actualResponse));
                done();
            }).catch(err => {
                done(err);
            });
        });

        it('Validating Get Refund API', (done) => {
            webStoreClient.getRefund(refundId, headers).then(function (result) {
                var actualResponse = JSON.parse(result.body);
                assert.deepEqual(Object.keys(expectedResponse), Object.keys(actualResponse));
                done();
            }).catch(err => {
                done(err);
            });
        });
    });

});