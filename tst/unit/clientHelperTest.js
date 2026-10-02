'use strict';

// Including Required Modules 
const helper = require('../../src/clientHelper');
const constants = require('../../src/constants');
const assert = require('assert');

// Constants
const expectedLiveURI = 'live/v2/serviceName';
const expectedSandboxURI = 'sandbox/v2/serviceName';
const expectedUnfiedURI = 'v2/serviceName';

// Test cases to validate Environment specific URI
describe('Test Environment specific URI Test cases', () => {

    // Test to validate URI for Live  specific URI
    it('Testing Live specific URI', (done) => {
        const response = helper.prepareOptions(getPayConfig(false), { urlFragment: 'serviceName' });
        assert.strictEqual(response.urlFragment, expectedLiveURI);

        //Test with V2 Algorithm passed in config
        const responseWithAlgorithm = helper.prepareOptions(getPayConfig(false, constants.AMAZON_SIGNATURE_ALGORITHM.V2), { urlFragment: 'serviceName' });
        assert.strictEqual(responseWithAlgorithm.urlFragment, expectedLiveURI);

        done();
    });

    // Test to validate URI for Sandbox  specific URI
    it('Testing Sandbox specific URI', (done) => {
        const response = helper.prepareOptions(getPayConfig(true), { urlFragment: 'serviceName' });
        assert.strictEqual(response.urlFragment, expectedSandboxURI);

        //Test with V2 Algorithm passed in config
        const responseWithAlgorithm = helper.prepareOptions(getPayConfig(true, constants.AMAZON_SIGNATURE_ALGORITHM.V2), { urlFragment: 'serviceName' });
        assert.strictEqual(responseWithAlgorithm.urlFragment, expectedSandboxURI);

        done();
    });

    // Generic method used to create Pay Configuration
    function getPayConfig(sandboxFlag, algorithmPassed = null) {
        let payConfig = {
            'publicKeyId': 'XXXXXXXXXXXXXXXXXXXXXXXX',
            'privateKey': 'keys/private.pem',
            'sandbox': sandboxFlag,
            'region': 'us',
        };

        if (algorithmPassed) {
            payConfig['algorithm'] = algorithmPassed;
        }
        return payConfig;
    }
});

// Test cases to validate Unified Endpoint specific URI
describe('Test Environment specific URI Test cases', () => {

    // Testing Unified endpoint URI by passing Live specific PublicKeyId
    it('Testing Unified endpoint URI for Live PublicKeyId', (done) => {
        const options = { urlFragment: 'serviceName' };
        const response = helper.prepareOptions(getPayConfig('LIVE-XXXXXXXXXXXXXXXXXXXXXXXX'), { urlFragment: 'serviceName' });
        assert.strictEqual(response.urlFragment, expectedUnfiedURI);

        //Test with V2 Algorithm passed in config
        const responseWithAlgorithm = helper.prepareOptions(getPayConfig('LIVE-XXXXXXXXXXXXXXXXXXXXXXXX', constants.AMAZON_SIGNATURE_ALGORITHM.V2), { urlFragment: 'serviceName' });
        assert.strictEqual(responseWithAlgorithm.urlFragment, expectedUnfiedURI);
        done();
    });

    // Testing Unified endpoint URI by passing Sandbox specific PublicKeyId
    it('Testing Unified endpoint URI for Sandbox PublicKeyId', (done) => {
        const options = { urlFragment: 'serviceName' };
        const response = helper.prepareOptions(getPayConfig('SANDBOX-XXXXXXXXXXXXXXXXXXXXXXXX'), { urlFragment: 'serviceName' });
        assert.strictEqual(response.urlFragment, expectedUnfiedURI);

        //Test with V2 Algorithm passed in config
        const responseWithAlgorithm = helper.prepareOptions(getPayConfig('SANDBOX-XXXXXXXXXXXXXXXXXXXXXXXX', constants.AMAZON_SIGNATURE_ALGORITHM.V2), { urlFragment: 'serviceName' });
        assert.strictEqual(responseWithAlgorithm.urlFragment, expectedUnfiedURI);

        done();
    });

    // Generic method used to create Pay Configuration
    function getPayConfig(publicKeyId, algorithmPassed = null) {
        let payConfig = {
            'publicKeyId': publicKeyId,
            'privateKey': 'keys/private.pem',
            'region': 'us',
        };

        if (algorithmPassed) {
            payConfig['algorithm'] = algorithmPassed;
        }
        return payConfig;
    }
});

// Test cases to validate that overrideServiceUrl does not disable TLS verification process-wide
describe('Test overrideServiceUrl TLS verification scope Test cases', () => {
    const crypto = require('crypto');
    const https = require('https');

    const TLS_ENV_VAR = 'NODE_TLS_REJECT_UNAUTHORIZED';
    const overrideUrl = 'localhost:8080';

    // Throwaway key generated per run so signHeaders can sign without real credentials
    const { privateKey } = crypto.generateKeyPairSync('rsa', {
        modulusLength: 2048,
        privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
        publicKeyEncoding: { type: 'spki', format: 'pem' }
    });

    let originalTlsEnvValue;

    beforeEach(() => {
        originalTlsEnvValue = process.env[TLS_ENV_VAR];
        delete process.env[TLS_ENV_VAR];
    });

    afterEach(() => {
        if (originalTlsEnvValue === undefined) {
            delete process.env[TLS_ENV_VAR];
        } else {
            process.env[TLS_ENV_VAR] = originalTlsEnvValue;
        }
    });

    // Calls invokeApi with a stubbed retryLogic so the request options are captured and no network call is made
    function captureRequestOptions(configArgs) {
        let captured;
        const context = {
            retryLogic: (options) => {
                captured = options;
                return Promise.resolve();
            }
        };
        helper.invokeApi.call(context, configArgs, {
            method: 'GET',
            headers: {},
            urlFragment: 'v2/serviceName',
            payload: null
        }, 1);
        return captured;
    }

    // Test to validate signHeaders with overrideServiceUrl does not mutate the global TLS setting
    it('Testing signHeaders with overrideServiceUrl does not modify NODE_TLS_REJECT_UNAUTHORIZED', (done) => {
        const headers = helper.signHeaders(getPayConfig(overrideUrl), {
            method: 'POST',
            urlFragment: 'v2/serviceName',
            payload: '{}'
        });

        assert.strictEqual(headers['x-amz-pay-host'], overrideUrl);
        assert.strictEqual(process.env[TLS_ENV_VAR], undefined);
        done();
    });

    // Test to validate invokeApi with overrideServiceUrl scopes relaxed TLS to that request only
    it('Testing invokeApi with overrideServiceUrl uses a per-request agent and does not modify NODE_TLS_REJECT_UNAUTHORIZED', (done) => {
        const options = captureRequestOptions(getPayConfig(overrideUrl));

        assert.strictEqual(options.url, `https://${overrideUrl}/v2/serviceName`);
        assert.ok(options.httpsAgent instanceof https.Agent);
        assert.strictEqual(options.httpsAgent.options.rejectUnauthorized, false);
        assert.strictEqual(process.env[TLS_ENV_VAR], undefined);
        done();
    });

    // Test to validate invokeApi without overrideServiceUrl keeps default TLS verification
    it('Testing invokeApi without overrideServiceUrl does not attach a relaxed agent', (done) => {
        const options = captureRequestOptions(getPayConfig());

        assert.strictEqual(options.url, `https://${constants.API_ENDPOINTS.na}/v2/serviceName`);
        assert.strictEqual(options.httpsAgent, undefined);
        assert.strictEqual(process.env[TLS_ENV_VAR], undefined);
        done();
    });

    // Test to validate a normal call after an override call still keeps default TLS verification
    it('Testing invokeApi without overrideServiceUrl after an override call keeps default TLS verification', (done) => {
        captureRequestOptions(getPayConfig(overrideUrl));
        const options = captureRequestOptions(getPayConfig());

        assert.strictEqual(options.httpsAgent, undefined);
        assert.strictEqual(process.env[TLS_ENV_VAR], undefined);
        done();
    });

    // Generic method used to create Pay Configuration
    function getPayConfig(overrideServiceUrl = null) {
        let payConfig = {
            'publicKeyId': 'XXXXXXXXXXXXXXXXXXXXXXXX',
            'privateKey': privateKey,
            'region': 'us',
            'sandbox': true
        };

        if (overrideServiceUrl) {
            payConfig['overrideServiceUrl'] = overrideServiceUrl;
        }
        return payConfig;
    }
});
