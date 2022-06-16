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
