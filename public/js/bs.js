var urlSearchParams = new URLSearchParams(window.location.search);
var bsObj = {
    token: urlSearchParams.get('_token'),
    onFieldEventHandler: {
        /*OPTIONAL*/ setupComplete: function () {
            console.warn("setupComplete");
        },
        /*OPTIONAL*/threeDsChallengeExecuted: function () {
            console.warn("threeDsChallengeExecuted");
        },
        // tagId returns: "ccn", "cvv", "exp" 
        onFocus: function (tagId) { }, // Handle focus
        onBlur: function (tagId) { }, // Handle blur 
        onError: function (tagId, errorCode /*, errorDescription*/) { }, // Handle a change in validation
        /*errorCode returns:
            "10" --> invalidCcNumber, invalidExpDate, invalidCvv Dependent on the tagId;
            "22013" --> "CC type is not supported by the merchant"; 
            "14040" --> " Token is expired";
            "14041" --> " Could not find token";
            "14042" --> " Token is not associated with a payment method, please verify your client integration or contact BlueSnap support";
            "400" --> "Session expired please refresh page to continue";
            "403", "404", "500" --> "Internal server error please try again later"; 
        */

        /* errorDescription is optional. Returns BlueSnap's standard error description */

        onType: function (tagId, cardType  , cardData) {
            /* cardType will give card type, and only applies to ccn: AMEX, VISA, MASTERCARD, AMEX, DISCOVER, DINERS, JCB */
            if (null != cardData) {
                /* cardData is an optional parameter which will provide ccType, last4Digits, issuingCountry, isRegulatedCard, cardSubType, binCategory and ccBin details (only applies to ccn) in a JsonObject */
                console.log(cardData);
            }
        },

        onValid: function (tagId) { }, // Handle a change in validation
    },
    /* example:
        style: {
        "Selector": {
        "Property": "Value",
        "Property2": "Value2"
        },                                                                                                                                                             
        "Selector2": {
        "Property": "Value"
        } 
    }, */
    style: {
        ":focus": {
            //style for all input elements on focus event
            "color": "orange"
        },
        "input": {
            //style for all input elements 
            "color": "black"
        },
        ".invalid": {
            //style for all input elements when invalid
            "color": "red"
        }
    },
    ccnPlaceHolder: "1234 5678 9012 3456", //for example
    cvvPlaceHolder: "123", //for example
    expPlaceHolder: "MM/YY" //for example
};

//Run the following command after Document Object Model (DOM) is fully loaded 
// bluesnap.hostedPaymentFieldsCreate(bsObj);