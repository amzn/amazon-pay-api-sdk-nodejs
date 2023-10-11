### Version 2.3.1 - October 2023
* Introducing new API called finalizeCheckoutSession which validates checkout attributes and finalizes checkout session. On success returns charge permission id and charge id. Use this API to process payments for JavaScript-based integrations.
* Introducing new Merchant Onboarding & Account Management APIs, which allows our partners to onboard merchants programatically and as part of account management offer them creation, updation and deletion/dissociation capability.
* Fixed the getReports API to handle null query parameters without throwing errors.
* Added the Sample Code snippets for the Charge APIs, Charge Permission APIs and Refund APIs.
* Updated the README file.

### Version 2.3.0 - March 2023
* Introducing new v2 Reporting APIs. Reports allow you to retieve consolidated data about Amazon Pay transactions and settlements. In addition to managing and downloading reports using Seller Central, Amazon Pay offers APIs to manage and retrieve your reports.
* Introducing new signature generation algorithm AMZN-PAY-RSASSA-PSS-V2 and increasing salt length from 20 to 32.
* Added support for handling new parameter 'shippingAddressList' in Checkout Session response. Change is fully backwards compatible.
* Added Error code 408 to API retry logic
* Note : To use new algorithm AMZN-PAY-RSASSA-PSS-V2, "algorithm" needs to be provided as an additional field in "config" and also while rendering Amazon Pay button in "createCheckoutSessionConfig". The changes are backwards-compatible, SDK will use AMZN-PAY-RSASSA-PSS by default.
 
#### Version 2.2.2 - June 2022
* Fixed security vulnerabilities in dependencies.

#### Version 2.2.1 - January 2022
* Applied patch to address issues occurred in Version 2.2.0.
**Please dont use Version 2.2.0**

#### Version 2.2.0 - January 2022
* Migrated signature generating algorithm from AMZN-PAY-RSASSA-PSS to AMZN-PAY-RSASSA-PSS-V2 & increased salt length from 20 to 32
* Note : From this SDK version, "algorithm" need to be provided as additional field in "createCheckoutSessionConfig" while rendering Amazon Pay button.

#### Version 2.1.5 - October 2021
* Fixed Security Vulnerabilities by upgrading 'axios' library version
* ReadMe file updates

#### Version 2.1.4 - May 2021
* Enabled support for environment specific keys (i.e Public key & Private key). The changes are fully backwards-compatible, where merchants can also use non environment specific keys

#### Version 2.1.3 - April 2021
* Removed deprecated library 'request' which is used to make HTTP/HTTPS calls
* Added library 'axios' to make HTTP/HTTPS calls

#### Version 2.1.2 - March 2021
* Removing deprecated API calls

#### Version 2.1.1 - June 2020
* Underlying endpoint for getBuyer API changed

#### Version 2.1.0 - June 2020
* Added getBuyer() API call

#### Version 2.0.1 - May 2020
* Modify package.json to use @amazonpay scope for npm

#### Version 2.0.0 - April 2020
* Initial release
