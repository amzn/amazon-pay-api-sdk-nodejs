'use strict';

const helper = require('./clientHelper');

class AmazonPayClient {
    constructor(configArgs) {
        this.configArgs = Object.freeze(configArgs);
    }

    /** API to process a request 
     *   - Makes an API Call using the specified options.
     * @param {Object} options - The options to make the API Call
     * @param {String} options.method - The HTTP request method
     * @param {String} options.urlFragment - The URI for the API Call
     * @param {String} [options.payload=null] - The payload for the API Call
     * @param {Object} [options.headers=null] - The headers for the API Call
     * @param {Object} [options.queryParams=null] - The headers for the API Call
     **/
    apiCall(options) {
        const preparedOptions = helper.prepareOptions(this.configArgs, options);
        preparedOptions.headers = helper.signHeaders(this.configArgs, preparedOptions);
        return helper.invokeApi(this.configArgs, preparedOptions);
    }

    /** Signs the request headers
     *   - Signs the request provided and returns the signed headers object.
     * @param {Object} options - The options to make the API Call
     * @param {String} options.method - The HTTP request method
     * @param {String} options.urlFragment - The URI for the API Call
     * @param {String} [options.payload=null] - The payload for the API Call
     * @param {Object} [options.headers=null] - The headers for the API Call
     **/
    getSignedHeaders(options) {
        const preparedOptions = helper.prepareOptions(this.configArgs, options);
        return helper.signHeaders(this.configArgs, preparedOptions);
    }

    /** Lets the solution provider get Authorization Token for their merchants if they are granted the delegation.
     *   - Please note that your solution provider account must have a pre-existing relationship (valid and active MWS authorization token) with the merchant account in order to use this function.
     * @param {String} mwsAuthToken - The mwsAuthToken
     * @param {String} merchantId - The MerchantId
     * @param {Object} [headers=null] - The headers for the request
     **/
    getAuthorizationToken(mwsAuthToken, merchantId, headers = null) {
        return this.apiCall({
            method: 'GET',
            urlFragment: `authorizationTokens/${mwsAuthToken}`,
            headers: headers,
            queryParams: {
                merchantId: merchantId
            }
        });
    }

    /** Generates static signature for amazon.Pay.renderButton used by checkout.js.
     *   - Returns signature as string.
     * @param {Object} payload - The payload for the request
     * @returns {String} signature
     **/
    generateButtonSignature(payload) {
        return helper.signPayload(this.configArgs, payload);
    }

    /** Lets the solution provider make the DeliveryTrackers request with their auth token.
     *   - Lets you provide shipment tracking information to Amazon Pay so that Amazon Pay will be able to notify buyers on Alexa when shipments are delivered.
     * @see https://developer.amazon.com/docs/amazon-pay-onetime/delivery-notifications.html#api-reference
     * @param {Object} payload - The payload for the request
     * @param {String} payload.amazonOrderReferenceId - The Amazon Order Reference ID or Charge Permission Id associated with the order for which the shipments need to be tracked
     * @param {String} payload.trackingNumber - The tracking number for the shipment provided by the shipping company
     * @param {Object} payload.carrierCode - The shipping company code used for delivering goods to the customer
     * @param {Object} [headers=null] - The headers for the request
     **/
    deliveryTrackers(payload, headers = null) {
        return this.apiCall({
            method: 'POST',
            urlFragment: 'deliveryTrackers',
            payload: payload,
            headers: headers
        });
    }
}

class InStoreClient extends AmazonPayClient {
    constructor(configArgs) {
        super(configArgs);
    }

    /** API to initiate a purchase with a merchant 
     *   - Initiates a purchase with a merchant.
     * @see //TODO Update Live URL
     * @param {Object} payload - The payload for the request
     * @param {Object} [headers=null] - The headers for the request
     **/
    merchantScan(payload, headers = null) {
        return this.apiCall({
            method: 'POST',
            urlFragment: 'in-store/merchantScan',
            payload: payload,
            headers: headers
        });
    }

    /** API to create Charge to the buyer
     *   - Creates a charge to the buyer with the requested amount.
     * @see //TODO Update Live URL
     * @param {Object} payload - The payload for the request
     * @param {Object} [headers=null] - The headers for the request
     **/
    charge(payload, headers = null) {
        return this.apiCall({
            method: 'POST',
            urlFragment: 'in-store/charge',
            payload: payload,
            headers: headers
        });
    }

    /** API to create a Refund to the buyer
     *   - Refunds an amount that was previously charged to the buyer.
     * @see //TODO Update Live URL
     * @param {Object} payload - The payload for the request
     * @param {Object} [headers=null] - The headers for the request
     **/
    refund(payload, headers = null) {
        return this.apiCall({
            method: 'POST',
            urlFragment: 'in-store/refund',
            payload: payload,
            headers: headers
        });
    }
}

class WebStoreClient extends AmazonPayClient {
    constructor(configArgs) {
        super(configArgs);
    }

    /** API to get the Buyer object
     *   - Get Buyer details can include buyer ID, name, email address, postal code, and country code
     *   - when used with the Amazon.Pay.renderButton 'SignIn' productType and corresponding signInScopes
     * @param {String} buyerToken - The checkout session Id
     * @param {Object} [headers=null] - The headers for the request
     **/
    getBuyer(buyerToken, headers = null) {
        return this.apiCall({
            method: 'GET',
            urlFragment: `buyers/${buyerToken}`,
            headers: headers
        });
    }

    /** API to create a CheckoutSession object
     *   - Creates a new CheckoutSession object.
     * @see https://amazonpaycheckoutintegrationguide.s3.amazonaws.com/amazon-pay-api-v2/checkout-session.html#create-checkout-session
     * @param {Object} payload - The payload for the request
     * @param {Object} headers - The headers for the request
     **/
    createCheckoutSession(payload, headers) {
        return this.apiCall({
            method: 'POST',
            urlFragment: 'checkoutSessions',
            payload: payload,
            headers: headers
        });
    }

    /** API to get the CheckoutSession object
     *   - Retrives details of a previously created CheckoutSession object.
     * @see https://amazonpaycheckoutintegrationguide.s3.amazonaws.com/amazon-pay-api-v2/checkout-session.html#get-checkout-session
     * @param {String} checkoutSessionId - The checkout session Id
     * @param {Object} [headers=null] - The headers for the request
     **/
    getCheckoutSession(checkoutSessionId, headers = null) {
        return this.apiCall({
            method: 'GET',
            urlFragment: `checkoutSessions/${checkoutSessionId}`,
            headers: headers
        });
    }

    /** API to update the CheckoutSession object
     *   - Updates a previously created CheckoutSession object.
     * @see https://amazonpaycheckoutintegrationguide.s3.amazonaws.com/amazon-pay-api-v2/checkout-session.html#update-checkout-session
     * @param {String} checkoutSessionId - The checkout session Id
     * @param {Object} payload - The payload for the request
     * @param {Object} [headers=null] - The headers for the request
     **/
    updateCheckoutSession(checkoutSessionId, payload, headers = null) {
        return this.apiCall({
            method: 'PATCH',
            urlFragment: `checkoutSessions/${checkoutSessionId}`,
            payload: payload,
            headers: headers
        });
    }

    /** API to complete a Checkout Session
     *   - Confirms the completion of buyer checkout.
     * @see //TODO Update Live URL
     * @param {String} checkoutSessionId - The checkout session Id
     * @param {Object} payload - The payload for the request
     * @param {Object} [headers=null] - The headers for the request
     **/
    completeCheckoutSession(checkoutSessionId, payload, headers = null) {
        return this.apiCall({
            method: 'POST',
            urlFragment: `checkoutSessions/${checkoutSessionId}/complete`,
            payload: payload,
            headers: headers
        });
    }

    /** API to get a ChargePermission object
     *   - Retrives details of a previously created ChargePermission object.
     * @see https://amazonpaycheckoutintegrationguide.s3.amazonaws.com/amazon-pay-api-v2/charge-permission.html#get-charge-permission
     * @param {String} chargePermissionId - The charge permission Id
     * @param {Object} [headers=null] - The headers for the request
     **/
    getChargePermission(chargePermissionId, headers = null) {
        return this.apiCall({
            method: 'GET',
            urlFragment: `chargePermissions/${chargePermissionId}`,
            headers: headers
        });
    }

    /** API to update a ChargePermission object
     *   - Updates a previously created ChargePermission object.
     * @see https://amazonpaycheckoutintegrationguide.s3.amazonaws.com/amazon-pay-api-v2/charge-permission.html#update-charge-permission
     * @param {String} chargePermissionId - The charge permission Id
     * @param {Object} payload - The payload for the request
     * @param {Object} [headers=null] - The headers for the request
     **/
    updateChargePermission(chargePermissionId, payload, headers = null) {
        return this.apiCall({
            method: 'PATCH',
            urlFragment: `chargePermissions/${chargePermissionId}`,
            payload: payload,
            headers: headers
        });
    }

    /** API to close a ChargePermission object
     *   - Closes a perviously created ChargePermission object.
     * @see https://amazonpaycheckoutintegrationguide.s3.amazonaws.com/amazon-pay-api-v2/charge-permission.html#close-charge-permission
     * @param {String} chargePermissionId - The charge permission Id
     * @param {Object} payload - The payload for the request
     * @param {Object} [headers=null] - The headers for the request
     **/
    closeChargePermission(chargePermissionId, payload, headers = null) {
        return this.apiCall({
            method: 'DELETE',
            urlFragment: `chargePermissions/${chargePermissionId}/close`,
            payload: payload,
            headers: headers
        });
    }

    /** API to create a Charge object
     *   - Creates a new Charge object.
     * @see https://amazonpaycheckoutintegrationguide.s3.amazonaws.com/amazon-pay-api-v2/charge.html#create-charge
     * @param {Object} payload - The payload for the request
     * @param {Object} headers - The headers for the request
     **/
    createCharge(payload, headers) {
        return this.apiCall({
            method: 'POST',
            urlFragment: 'charges',
            payload: payload,
            headers: headers
        });
    }

    /** API to get the Charge object
     *   - Retrieves a perviously created Charge object.
     * @see https://amazonpaycheckoutintegrationguide.s3.amazonaws.com/amazon-pay-api-v2/charge.html#get-charge
     * @param {String} chargeId - The charge Id
     * @param {Object} [headers=null] - The headers for the request
     **/
    getCharge(chargeId, headers = null) {
        return this.apiCall({
            method: 'GET',
            urlFragment: `charges/${chargeId}`,
            headers: headers
        });
    }

    /** API to create a captureCharge request
     *   - Captures an existing charge
     * @see https://amazonpaycheckoutintegrationguide.s3.amazonaws.com/amazon-pay-api-v2/charge.html#capture-charge
     * @param {String} chargeId - The charge Id
     * @param {Object} payload - The payload for the request
     * @param {Object} [headers=null] - The headers for the request
     **/
    captureCharge(chargeId, payload, headers = null) {
        return this.apiCall({
            method: 'POST',
            urlFragment: `charges/${chargeId}/capture`,
            payload: payload,
            headers: headers
        });
    }

    /** API to create a cancelCharge request
     *   - Cancels an existing charge.
     * @see https://amazonpaycheckoutintegrationguide.s3.amazonaws.com/amazon-pay-api-v2/charge.html#cancel-charge
     * @param {String} chargeId - The charge Id
     * @param {Object} payload - The payload for the request
     * @param {Object} [headers=null] - The headers for the request
     **/
    cancelCharge(chargeId, payload, headers = null) { 
        return this.apiCall({
            method: 'DELETE',
            urlFragment: `charges/${chargeId}/cancel`,
            payload: payload,
            headers: headers
        });
    }

    /** API to create a Refund object
     *   - Generates a refund.
     * @see https://amazonpaycheckoutintegrationguide.s3.amazonaws.com/amazon-pay-api-v2/refund.html#create-refund
     * @param {Object} payload - The payload for the request
     * @param {Object} headers - The headers for the request
     **/
    createRefund(payload, headers) {
        return this.apiCall({
            method: 'POST',
            urlFragment: 'refunds',
            payload: payload,
            headers: headers
        });
    }

    /** API to get a Refund object
     *   - Retreives details of an existing refund.
     * @see https://amazonpaycheckoutintegrationguide.s3.amazonaws.com/amazon-pay-api-v2/refund.html#get-refund
     * @param {String} refundId - The refund Id
     * @param {Object} [headers=null] - The headers for the request
     **/
    getRefund(refundId, headers = null) {
        return this.apiCall({
            method: 'GET',
            urlFragment: `refunds/${refundId}`,
            headers: headers
        });
    }
}

module.exports = {
    AmazonPayClient: AmazonPayClient,
    InStoreClient: InStoreClient,
    WebStoreClient: WebStoreClient
};
