'use strict';

module.exports = {
    SDK_VERSION: '2.2.2',
    API_VERSION: 'v2',
    RETRIES: 3,
    API_ENDPOINTS: {
        na: 'pay-api.amazon.com',
        eu: 'pay-api.amazon.eu',
        jp: 'pay-api.amazon.jp'
    },
    REGION_MAP: {
        na: 'na',
        us: 'na',
        de: 'eu',
        uk: 'eu',
        eu: 'eu',
        jp: 'jp'
    },
    AMAZON_SIGNATURE_ALGORITHM: 'AMZN-PAY-RSASSA-PSS'
};
