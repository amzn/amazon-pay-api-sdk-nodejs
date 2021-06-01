'use strict';

// Including Required Modules 
const helper = require('../../src/clientHelper');
const assert = require('assert');

// Constants
const expectedLiveURI = 'live/v2/serviceName';
const expectedSandboxURI = 'sandbox/v2/serviceName';
const expectedUnfiedURI = 'v2/serviceName';

// Test cases to validate Environment specific URI
describe('Test Environment specific URI Test cases', () => {

    // Test to validate URI for Live  specific URI
    it('Testing Live specific URI', (done) => {
        const response = helper.prepareOptions(getPayConfig(false), {urlFragment: 'serviceName'});
        assert.strictEqual(response.urlFragment, expectedLiveURI);
        done();
    });

    // Test to validate URI for Sandbox  specific URI
    it('Testing Sandbox specific URI', (done) => {
        const response = helper.prepareOptions(getPayConfig(true), {urlFragment: 'serviceName'});
        assert.strictEqual(response.urlFragment, expectedSandboxURI);
        done();
    });

    // Generic method used to create Pay Configuration
    function getPayConfig(sandboxFlag){
        let payConfig = {
            'publicKeyId': 'XXXXXXXXXXXXXXXXXXXXXXXX',
            'privateKey':'keys/private.pem',
            'sandbox': sandboxFlag,
            'region': 'us',
        };
        return payConfig;
    }
});

// Test cases to validate Unified Endpoint specific URI
describe('Test Environment specific URI Test cases', () => {

    // Testing Unified endpoint URI by passing Live specific PublicKeyId
    it('Testing Unified endpoint URI for Live PublicKeyId', (done) => {
        const options = {urlFragment: 'serviceName'};
        const response = helper.prepareOptions(getPayConfig('LIVE-XXXXXXXXXXXXXXXXXXXXXXXX'), {urlFragment: 'serviceName'});
        assert.strictEqual(response.urlFragment, expectedUnfiedURI);
        done();
    });

    // Testing Unified endpoint URI by passing Sandbox specific PublicKeyId
    it('Testing Unified endpoint URI for Sandbox PublicKeyId', (done) => {
        const options = {urlFragment: 'serviceName'};
        const response = helper.prepareOptions(getPayConfig('SANDBOX-XXXXXXXXXXXXXXXXXXXXXXXX'), {urlFragment: 'serviceName'});
        assert.strictEqual(response.urlFragment, expectedUnfiedURI);
        done();
    });

    // Generic method used to create Pay Configuration
    function getPayConfig(publicKeyId){
        let payConfig = {
            'publicKeyId': publicKeyId,
            'privateKey':'keys/private.pem',
            'region': 'us',
        };
        return payConfig;
    }
});