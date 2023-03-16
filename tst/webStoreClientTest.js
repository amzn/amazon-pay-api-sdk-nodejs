'use strict';

// Including Required Modules
const Client = require('../src/client');
const config = require('./config');
const configWithAlgorithm = require('./configWithAlgorithm');
const assert = require('assert');
const uuidv4 = require('uuid/v4');
const headers = {
    'x-amz-pay-idempotency-key': uuidv4().toString().replace(/-/g, '')
};
const headersWithV2Algorithm = {
    'x-amz-pay-idempotency-key': uuidv4().toString().replace(/-/g, '')
};

const chargePermissionId = ''; // Enter Charge Permission ID
const chargePermissionIdWithV2Algorithm = ''; // Enter Charge Permission ID
const buyerToken = ''; // Enter Buyer Token
const buyerTokenWithV2Algorithm = ''; // Enter Buyer Token

// Intiating WebStoreClient Class
const webStoreClient = new Client.WebStoreClient(config);
const webStoreClientWithAlgorithm = new Client.WebStoreClient(configWithAlgorithm);

// Constants required to execute Unit Test cases
var checkoutSessionId;
var chargeId;
var chargeIdWithV2Algorithm;
var refundId;

const createCheckoutSessionPayload = {
    webCheckoutDetails: {
        checkoutReviewReturnUrl: 'https://localhost/maxo/checkoutReview.html',
        checkoutResultReturnUrl: 'https://localhost/maxo/checkoutReturn.html'
    },
    storeId: config.storeId // Enter Store ID
};
const updateCheckoutSessionPayload = {
    paymentDetails: {
        paymentIntent: 'Confirm',
        chargeAmount: {
            amount: 50,
            currencyCode: config.currencyCode
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
        currencyCode: config.currencyCode
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
        amount: '0.01',
        currencyCode: config.currencyCode
    },
    captureNow: false,
    canHandlePendingAuthorization: false
};
const createChargePayloadWithV2Algorithm = {
    chargePermissionId: chargePermissionIdWithV2Algorithm,
    chargeAmount: {
        amount: '0.01',
        currencyCode: config.currencyCode
    },
    captureNow: false,
    canHandlePendingAuthorization: false
};

const captureChargePayload = {
    captureAmount: {
        amount: '0.01',
        currencyCode: config.currencyCode
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
        chargePermissionType: '',
        orderType: '',
        recurringMetadata: '',
        paymentMethodOnFileMetadata: '',
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

    it('Validating Get Buyer API', (done) => {
        webStoreClient.getBuyer(buyerToken, headers).then(function (result) {
            assert.strictEqual(result.status, 200);
            var actualResponse = result.data;
            assert.deepStrictEqual(actualResponse.buyerId.startsWith('amzn1.account.'), true);
            done();
        }).catch(err => {
            done(err);
        });
    });

    it('Validating Get Buyer API with V2 Algorithm', (done) => {
        webStoreClientWithAlgorithm.getBuyer(buyerTokenWithV2Algorithm, headersWithV2Algorithm).then(function (result) {
            assert.strictEqual(result.status, 200);
            var actualResponse = result.data;
            assert.deepStrictEqual(actualResponse.buyerId.startsWith('amzn1.account.'), true);
            done();
        }).catch(err => {
            done(err);
        });
    });

    it('Validating Create Checkout Session API', (done) => {
        webStoreClient.createCheckoutSession(createCheckoutSessionPayload, headers).then(function (result) {
            assert.strictEqual(result.status, 201);
            var actualResponse = result.data;
            checkoutSessionId = actualResponse.checkoutSessionId;
            assert.deepStrictEqual(Object.keys(expectedResponse), Object.keys(actualResponse));
            done();
        }).catch(err => {
            done.error(err);
        });
    });

    it('Validating Create Checkout Session API with V2 Algorithm', (done) => {
        webStoreClientWithAlgorithm.createCheckoutSession(createCheckoutSessionPayload, headersWithV2Algorithm).then(function (result) {
            assert.strictEqual(result.status, 201);
            var actualResponse = result.data;
            checkoutSessionId = actualResponse.checkoutSessionId;
            assert.deepStrictEqual(Object.keys(expectedResponse), Object.keys(actualResponse));
            done();
        }).catch(err => {
            done(err);
        });
    });

    it('Validating Get Checkout Session API', (done) => {
        webStoreClient.getCheckoutSession(checkoutSessionId, headers).then(function (result) {
            assert.strictEqual(result.status, 200);
            var actualResponse = result.data;
            assert.deepStrictEqual(Object.keys(expectedResponse), Object.keys(actualResponse));
            done();
        }).catch(err => {
            done(err);
        });
    });

    it('Validating Get Checkout Session API with V2 Algorithm', (done) => {
        webStoreClientWithAlgorithm.getCheckoutSession(checkoutSessionId, headersWithV2Algorithm).then(function (result) {
            assert.strictEqual(result.status, 200);
            var actualResponse = result.data;
            assert.deepStrictEqual(Object.keys(expectedResponse), Object.keys(actualResponse));
            done();
        }).catch(err => {
            done(err);
        });
    });

    it('Validating Update Checkout Session API', (done) => {
        webStoreClient.updateCheckoutSession(checkoutSessionId, updateCheckoutSessionPayload).then(function (result) {
            assert.strictEqual(result.status, 200);
            var actualResponse = result.data;
            assert.deepStrictEqual(Object.keys(expectedResponse), Object.keys(actualResponse));
            done();
        }).catch(err => {
            done(err);
        });
    });

    it('Validating Update Checkout Session API with V2 Algorithm', (done) => {
        webStoreClientWithAlgorithm.updateCheckoutSession(checkoutSessionId, updateCheckoutSessionPayload).then(function (result) {
            assert.strictEqual(result.status, 200);
            var actualResponse = result.data;
            assert.deepStrictEqual(Object.keys(expectedResponse), Object.keys(actualResponse));
            done();
        }).catch(err => {
            done(err);
        });
    });

    // Can only run this after visiting amazonPayRedirectUrl
    it.skip('Validating Complete Checkout Session API', (done) => {
        webStoreClient.completeCheckoutSession(checkoutSessionId, completeCheckoutSessionPayload).then(function (result) {
            assert.strictEqual(result.status, 200);
            var actualResponse = result.data;
            assert.deepStrictEqual(Object.keys(expectedResponse), Object.keys(actualResponse));
            done();
        }).catch(err => {
            done(err);
        });
    });

    // Can only run this after visiting amazonPayRedirectUrl
    it.skip('Validating Complete Checkout Session API With V2 Algorithm', (done) => {
        webStoreClient.completeCheckoutSession(checkoutSessionId, completeCheckoutSessionPayload).then(function (result) {
            assert.strictEqual(result.status, 200);
            var actualResponse = result.data;
            assert.deepStrictEqual(Object.keys(expectedResponse), Object.keys(actualResponse));
            done();
        }).catch(err => {
            done(err);
        });
    });
});

describe('', () => {
    // Skip the tests if chargePermissionId is not provided
    before(function () {
        if (!chargePermissionId && !chargePermissionIdWithV2Algorithm) {
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
            chargePermissionType: '',
            recurringMetadata: '',
            presentmentCurrency: ''
        };

        it('Validating Get Charge Permission API', (done) => {
            webStoreClient.getChargePermission(chargePermissionId, headers).then(function (result) {
                assert.strictEqual(result.status, 200);
                var actualResponse = result.data;
                assert.deepStrictEqual(Object.keys(expectedResponse), Object.keys(actualResponse));
                done();
            }).catch(err => {
                done(err);
            });
        });

        it('Validating Get Charge Permission API with V2 Algorithm', (done) => {
            webStoreClientWithAlgorithm.getChargePermission(chargePermissionIdWithV2Algorithm, headersWithV2Algorithm).then(function (result) {
                assert.strictEqual(result.status, 200);
                var actualResponse = result.data;
                assert.deepStrictEqual(Object.keys(expectedResponse), Object.keys(actualResponse));
                done();
            }).catch(err => {
                done(err);
            });
        });

        it('Validating Update Charge Permission API', (done) => {
            webStoreClient.updateChargePermission(chargePermissionId, updateChargePermissionPayload, headers).then(function (result) {
                assert.strictEqual(result.status, 200);
                var actualResponse = result.data;
                assert.deepStrictEqual(Object.keys(expectedResponse), Object.keys(actualResponse));
                done();
            }).catch(err => {
                done(err);
            });
        });

        it('Validating Update Charge Permission API with V2 Algorithm', (done) => {
            webStoreClientWithAlgorithm.updateChargePermission(chargePermissionIdWithV2Algorithm, updateChargePermissionPayload, headersWithV2Algorithm).then(function (result) {
                assert.strictEqual(result.status, 200);
                var actualResponse = result.data;
                assert.deepStrictEqual(Object.keys(expectedResponse), Object.keys(actualResponse));
                done();
            }).catch(err => {
                done(err);
            });
        });

        // Cannot Create Charge if Close Charge Permission is executed, unskip this test case and skip Charge API Tests to validate this API 
        it.skip('Validating Close Charge Permission API', (done) => {
            webStoreClient.closeChargePermission(chargePermissionId, closeChargePermissionPayload, headers).then(function (result) {
                assert.strictEqual(result.status, 200);
                var actualResponse = result.data;
                assert.deepStrictEqual(Object.keys(expectedResponse), Object.keys(actualResponse));
                done();
            }).catch(err => {
                done(err);
            });
        });

        it.skip('Validating Close Charge Permission API with V2 Algorithm', (done) => {
            webStoreClient.closeChargePermission(chargePermissionIdWithV2Algorithm, closeChargePermissionPayload, headersWithV2Algorithm).then(function (result) {
                assert.strictEqual(result.status, 200);
                var actualResponse = result.data;
                assert.deepStrictEqual(Object.keys(expectedResponse), Object.keys(actualResponse));
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
            convertedAmount: '',
            conversionRate: '',
            channel: '',
            chargeInitiator: '',
            statusDetails: '',
            creationTimestamp: '',
            expirationTimestamp: '',
            releaseEnvironment: '',
            merchantMetadata: '',
            platformId: ''
        };

        before(function () {
            if (!chargePermissionId && !chargePermissionIdWithV2Algorithm) {
                console.error('Please Enter chargePermissionId and execute test cases');
                this.skip();
            }
        });

        it('Validating Create Charge API', (done) => {
            webStoreClient.createCharge(createChargePayload, headers).then(function (result) {
                assert.strictEqual(result.status, 201);
                var actualResponse = result.data;
                chargeId = actualResponse.chargeId;
                assert.deepStrictEqual(Object.keys(expectedResponse), Object.keys(actualResponse));
                done();
            }).catch(err => {
                done(err);
            });
        });

        it('Validating Create Charge API with V2 Algorithm', (done) => {
            webStoreClientWithAlgorithm.createCharge(createChargePayloadWithV2Algorithm, headersWithV2Algorithm).then(function (result) {
                assert.strictEqual(result.status, 201);
                var actualResponse = result.data;
                chargeIdWithV2Algorithm = actualResponse.chargeId;
                assert.deepStrictEqual(Object.keys(expectedResponse), Object.keys(actualResponse));
                done();
            }).catch(err => {
                done(err);
            });
        });

        it('Validating Get Charge API', (done) => {
            webStoreClient.getCharge(chargeId, headers).then(function (result) {
                assert.strictEqual(result.status, 200);
                var actualResponse = result.data;
                assert.deepStrictEqual(Object.keys(expectedResponse), Object.keys(actualResponse));
                done();
            }).catch(err => {
                done(err);
            });
        });

        it('Validating Get Charge API with V2 Algorithm', (done) => {
            webStoreClientWithAlgorithm.getCharge(chargeIdWithV2Algorithm, headersWithV2Algorithm).then(function (result) {
                assert.strictEqual(result.status, 200);
                var actualResponse = result.data;
                assert.deepStrictEqual(Object.keys(expectedResponse), Object.keys(actualResponse));
                done();
            }).catch(err => {
                done(err);
            });
        });

        it('Validating Capture Charge API', (done) => {
            webStoreClient.captureCharge(chargeId, captureChargePayload, {
                'x-amz-pay-idempotency-key': uuidv4().toString().replace(/-/g, '')
            }).then(function (result) {
                assert.strictEqual(result.status, 200);
                var actualResponse = result.data;
                assert.deepStrictEqual(Object.keys(expectedResponse), Object.keys(actualResponse));
                done();
            }).catch(err => {
                done(err);
            });
        });

        it('Validating Capture Charge API with V2 Algorithm', (done) => {
            webStoreClientWithAlgorithm.captureCharge(chargeIdWithV2Algorithm, captureChargePayload, {
                'x-amz-pay-idempotency-key': uuidv4().toString().replace(/-/g, '')
            }).then(function (result) {
                assert.strictEqual(result.status, 200);
                var actualResponse = result.data;
                assert.deepStrictEqual(Object.keys(expectedResponse), Object.keys(actualResponse));
                done();
            }).catch(err => {
                done(err);
            });
        });

        // Cannot Run both Capture charge and Cancel charge at same time, Run either Capture Capture or Cancel Charge
        it.skip('Validating Cancel Charge API', (done) => {
            webStoreClient.cancelCharge(chargeId, cancelChargePayload, headers).then(function (result) {
                assert.strictEqual(result.status, 200);
                var actualResponse = result.data;
                assert.deepStrictEqual(Object.keys(expectedResponse), Object.keys(actualResponse));
                done();
            }).catch(err => {
                done(err);
            });
        });

        // Cannot Run both Capture charge and Cancel charge at same time, Run either Capture Capture or Cancel Charge
        it.skip('Validating Cancel Charge API with V2 Algorithm', (done) => {
            webStoreClientWithAlgorithm.cancelCharge(chargeIdWithV2Algorithm, cancelChargePayload, headersWithV2Algorithm).then(function (result) {
                assert.strictEqual(result.status, 200);
                var actualResponse = result.data;
                assert.deepStrictEqual(Object.keys(expectedResponse), Object.keys(actualResponse));
                done();
            }).catch(err => {
                done(err);
            });
        });
    });

    //Validating Refund API Call's
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
            if (!chargePermissionId && !chargePermissionIdWithV2Algorithm) {
                console.error('Please Enter chargePermissionId and execute test cases');
                this.skip();
            }
        });

        it('Validating Create Refund API', (done) => {
            const refundpaylod = {
                chargeId: chargeId,
                refundAmount: {
                    amount: '0.01',
                    currencyCode: config.currencyCode
                },
                softDescriptor: 'SOFT_DESCRIPTOR'
            };
            webStoreClient.createRefund(refundpaylod, headers).then(function (result) {
                assert.strictEqual(result.status, 201);
                var actualResponse = result.data;
                refundId = actualResponse.refundId;
                assert.deepStrictEqual(Object.keys(expectedResponse), Object.keys(actualResponse));
                done();
            }).catch(err => {
                done(err);
            });
        });

        it('Validating Create Refund API with V2 Algorithm', (done) => {
            const refundpaylod = {
                chargeId: chargeId,
                refundAmount: {
                    amount: '0.01',
                    currencyCode: config.currencyCode
                },
                softDescriptor: 'SOFT_DESCRIPTOR'
            };
            webStoreClientWithAlgorithm.createRefund(refundpaylod, headers).then(function (result) {
                assert.strictEqual(result.status, 201);
                var actualResponse = result.data;
                refundId = actualResponse.refundId;
                assert.deepStrictEqual(Object.keys(expectedResponse), Object.keys(actualResponse));
                done();
            }).catch(err => {
                done(err);
            });
        });

        it('Validating Get Refund API', (done) => {
            webStoreClient.getRefund(refundId, headers).then(function (result) {
                assert.strictEqual(result.status, 200);
                var actualResponse = result.data;
                assert.deepStrictEqual(Object.keys(expectedResponse), Object.keys(actualResponse));
                done();
            }).catch(err => {
                done(err);
            });
        });

        it('Validating Get Refund API with V2 Algorithm', (done) => {
            webStoreClientWithAlgorithm.getRefund(refundId, headers).then(function (result) {
                assert.strictEqual(result.status, 200);
                var actualResponse = result.data;
                assert.deepStrictEqual(Object.keys(expectedResponse), Object.keys(actualResponse));
                done();
            }).catch(err => {
                done(err);
            });
        });
    });


    // ------------ Testing the CV2 Reporting APIs ---------------
    describe('WebStore Client Test Cases - CV2 Reporting APIs', (done) => {
        const startTime = '20221118T150630Z';
        const endTime = '20221202T150350Z';

        const expectGetReportResponse = {
            createdTime: '',
            endTime: '',
            processingEndTime: '',
            processingStartTime: '',
            processingStatus: '',
            reportId: '',
            reportType: '',
            startTime: ''
        }

        const expectGetReportSchedulesReponse = {
            nextReportCreationTime: '',
            reportScheduleId: '',
            reportType: '',
            scheduleFrequency: '',
        }

        // Tests the GetReports API
        it('Validating Get Report API', (done) => {
            const requestPayload = {
                'reportType': '',
                'processingStatus': '',
                'createdSince': startTime,
                'createdUntil': endTime,
                'pageSize': '10'
            }
            webStoreClient.getReports().then(function (result) {
                assert.strictEqual(result.status, 200);
                var response = result.data;
                var reports = response['reports'];
                assert.deepStrictEqual(Object.keys(expectGetReportResponse), Object.keys(reports[0]));
                done();
            }).catch(err => {
                done(err);
            });
        });

        // Tests the GetReportById API
        it('Validating Get Report By Id API', (done) => {
            const reportId = '60079019360';
            webStoreClient.getReportById(reportId, headers).then(function (result) {
                assert.strictEqual(result.status, 200);
                var response = result.data;
                assert.deepStrictEqual(Object.keys(expectGetReportResponse), Object.keys(response));
                done();
            }).catch(err => {
                done(err);
            });
        });

        // Cannot test GerReportDocument right now, as it deals with Settlement reports which are not supported in our accounts
        // Tests Get Report Document API
        // it('Validating Get Report Document API', (done) => {
        //     const reportDocumentId = '61516019327';
        //     webStoreClient.getReportDocument(reportDocumentId, headers).then(function (result) {
        //         assert.strictEqual(result.status, 200);
        //         var response = result.data;
        //         assert.deepStrictEqual(Object.keys(expectGetReportResponse), Object.keys(response));
        //         done();
        //     }).catch(err => {
        //         done(err);
        //     });
        // });

        // Tests Get Report Schedules API
        it('Validating Get Report Schedules API', (done) => {
            const reportTypes = '_GET_FLAT_FILE_OFFAMAZONPAYMENTS_ORDER_REFERENCE_DATA_,_GET_FLAT_FILE_OFFAMAZONPAYMENTS_BILLING_AGREEMENT_DATA_';
            webStoreClient.getReportSchedules(reportTypes, headers).then(function (result) {
                assert.strictEqual(result.status, 200);
                var response = result.data;
                var reportSchedules = response['reportSchedules'];
                assert.deepStrictEqual(Object.keys(expectGetReportSchedulesReponse), Object.keys(reportSchedules[0]));
                done();
            }).catch(err => {
                done(err);
            });
        });

        // Tests Get Report Schedule by Id API
        it('Validating Get Report Schedule by Id API', (done) => {
            const reportScheduleId = '50011019347';
            webStoreClient.getReportScheduleById(reportScheduleId, headers).then(function (result) {
                assert.strictEqual(result.status, 200);
                var response = result.data;
                assert.deepStrictEqual(Object.keys(expectGetReportSchedulesReponse), Object.keys(response));
                done();
            }).catch(err => {
                done(err);
            });
        });

        // Tests Create Report API
        it('Validating Create Report API', (done) => {
            const requestPayload = {
                'reportType': '_GET_FLAT_FILE_OFFAMAZONPAYMENTS_AUTHORIZATION_DATA_',
                'startTime': startTime,
                'endTime': endTime
            }
            webStoreClient.createReport(requestPayload, headers).then(function (result) {
                assert.strictEqual(result.status, 201);
                var response = result.data;
                var reportId = response['reportId'];
                assert.ok(reportId !== null);
                done();
            }).catch(err => {
                done(err);
            });
        });
     
        // Tests Create and Cancel ReportSchedule API
        it('Validating Create Report Schedule API and Cancel Report Schedule API', (done) => {
            const requestPayload = {
                'reportType': '_GET_FLAT_FILE_OFFAMAZONPAYMENTS_AUTHORIZATION_DATA_',
                'scheduleFrequency': 'PT84H',
                'nextReportCreationTime': startTime,
                'deleteExistingSchedule': true
            }
            webStoreClient.createReportSchedule(requestPayload, headers).then(function (result) {
                assert.strictEqual(result.status, 201);
                var response = result.data;
                var reportScheduleId = response['reportScheduleId'];
                assert.ok(reportScheduleId !== null);

                webStoreClient.cancelReportSchedule(reportScheduleId).then(function (resuLt) {
                    assert.strictEqual(resuLt.status, 200);
                }).catch(err => {
                    done(err);
                });

                done();
            }).catch(err => {
                done(err);
            });
        });
    });
})

