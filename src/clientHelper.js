'use strict';

const constants = require('./constants');
const crypto = require('crypto');
const request = require('request');

module.exports = {
    signHeaders: signHeaders,
    signPayload: signPayload,
    retryLogic: retryLogic,
    sendRequest: sendRequest,
    invokeApi: invokeApi,
    prepareOptions: prepareOptions
}

function getTimestamp() {
    const date = new Date();
    return date.toISOString().split('.')[0] + 'Z';
}

function getAPIEndpointBaseURL (configArgs) {
    if ((configArgs.overrideServiceUrl) && (configArgs.overrideServiceUrl.length > 0)) {
        process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0; // devo environment using self-signed certificate
        return configArgs.overrideServiceUrl;
    } else
        return constants.API_ENDPOINTS[constants.REGION_MAP[configArgs.region.toLowerCase()]];
}

function invokeApi(configArgs, apiOptions) {

    const options = {
        method: apiOptions.method,
        json: false,
        headers: apiOptions.headers,
        url: `https://${getAPIEndpointBaseURL(configArgs)}/${apiOptions.urlFragment}${getQueryString(apiOptions.queryParams)}`,
        body: apiOptions.payload
    };

    const response = this.retryLogic(options, 1);

    return response;
}

function getQueryString(requestParams) {
    if (requestParams) return `?${getParametersAsString(requestParams)}`;
    return ''; 
}

function getParametersAsString(requestParams) {
    if (!requestParams) return '';

    let queryParams = [];
    Object.keys(requestParams).forEach(function (param) {
        queryParams.push(`${param}=${encodeURIComponent(requestParams[param])}`);
    });
    return queryParams.join('&');
}

function prepareOptions(configArgs, options) {
    options.headers = options.headers || {};

    // if user doesn't pass in a string, assume it's a JS object and convert it to a JSON string
    if (!(typeof options.payload === 'string' || options.payload instanceof String)) {
        options.payload = JSON.stringify(options.payload);
    }

    if (configArgs['sandbox'] === true || configArgs['sandbox'] === 'true') {
        options.urlFragment = `sandbox/${constants.API_VERSION}/${options.urlFragment}`;
    } else {
        options.urlFragment = `live/${constants.API_VERSION}/${options.urlFragment}`;
    }
    return options;
}

function sign(privateKey, stringToSign) {
    const sign = crypto.createSign('RSA-SHA256').update(stringToSign);
    return sign.sign({
        key: privateKey,
        padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
        saltLength: 20
    }, 'base64');
}

function retryLogic(options, count) {
    const response = this.sendRequest(options, count);

    if (count > constants.RETRIES) {
        return response.then(function (result) {
            return result;
        }).catch(err => {
            return Promise.reject(err);
        });
    }

    return response.then(function (result) {
        return result;
    }).catch(err => {
        if (response.statusCode == 429 || response.statusCode >= 500) {
            return this.retryLogic(options, count += 1);
        } else {
            return Promise.reject(err);
        }
    })
}

function sendRequest(options, count) {
    const delayTime = count === 1 ? 0 : (2 ** (count - 1)) * 1000;

    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            request(options, function (err, response, body) {
                if (err) {
                    reject(err);
                } else if (response.statusCode >= 400) {
                    reject(response);
                } else {
                    resolve(response);
                }
            });
        }, delayTime);
    });
}

/* Expected options:
       options.method
       options.urlFragment
       options.payload
       options.headers
*/
function signHeaders(configArgs, options) {
    const headers = {};

    Object.assign(headers, options.headers);

    headers['x-amz-pay-region'] = configArgs.region;
    headers['x-amz-pay-host'] =  getAPIEndpointBaseURL(configArgs);
    headers['x-amz-pay-date'] = getTimestamp();
    headers['content-type'] =  'application/json';
    headers['accept'] = 'application/json';
    headers['user-agent'] = `amazon-pay-api-sdk-nodejs/${constants.SDK_VERSION} (JS/${process.versions.node}; ${process.platform})`;

    const lowercaseSortedHeaderKeys = Object.keys(headers).sort(function (a, b) {
        return a.toLowerCase().localeCompare(b.toLowerCase());
    });
    const signedHeaders = lowercaseSortedHeaderKeys.join(';');

    let payload = options.payload;
    if (payload === null || payload === undefined || options.urlFragment.includes(`/account-management/${constants.API_VERSION}/accounts`)) {
        payload = ''; // do not sign payload for payment critical data APIs
    }

    let canonicalRequest = options.method + '\n/'
        + options.urlFragment + '\n'
        + getParametersAsString(options.queryParams) + '\n';
    lowercaseSortedHeaderKeys.forEach(item => canonicalRequest += item.toLowerCase() + ':' + headers[item] + '\n');
    canonicalRequest += '\n' + signedHeaders + '\n' + crypto.createHash('SHA256').update(payload).digest('hex');

    const stringToSign = constants.AMAZON_SIGNATURE_ALGORITHM + '\n' +
        crypto.createHash('SHA256').update(canonicalRequest).digest('hex');

    const signature = sign(configArgs.privateKey, stringToSign);

    headers['authorization'] = constants.AMAZON_SIGNATURE_ALGORITHM
        + ' PublicKeyId=' + configArgs['publicKeyId']
        + ', SignedHeaders=' + signedHeaders
        + ', Signature=' + signature;

   return headers;
}

function signPayload(configArgs, payload) {
    // if user doesn't pass in a string, assume it's a JS object and convert it to a JSON string
    if (!(typeof payload === 'string' || payload instanceof String)) {
        payload = JSON.stringify(payload);
    }
    const stringToSign = constants.AMAZON_SIGNATURE_ALGORITHM + '\n' +
        crypto.createHash('SHA256').update(payload).digest('hex');

    return sign(configArgs.privateKey, stringToSign);
}
