(function(){
var adyen = {};

var https = require('https');

// Usage:
//   var data = { 'first name': 'George', 'last name': 'Jetson', 'age': 110 };
//   var querystring = EncodeQueryData(data);
// 
function EncodeQueryData(data){
	var ret = [];
	for (var d in data)
	  ret.push(encodeURIComponent(d) + "=" + encodeURIComponent(data[d]));
	return ret.join("&");
}


function DecodeQueryData(query){
	var ret = {};
	var vars = query.split('&');
	for (var i = 0; i < vars.length; i++) {
		var pair = vars[i].split('=');
		ret[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
	}
	return ret;
}

/**
 * @param {user} web service user: Adyen Test CA >> Settings >> Users >> ws@Company.
 * @param {pwd} user password    : Adyen Test CA >> Settings >> Users >> ws@Company >> Generate Password >> Submit 
 * @param {opts} the options should contain the following variables:
	  * - action: Specifies the action on the web service.
	  * - merchantAccount: The merchant account the payment was processed with.
	  * - amount: The amount of the payment
	  * 	- currency: the currency of the payment
	  * 	- amount: the amount of the payment
	  * - reference: Your reference
	  * - shopperIP: The IP address of the shopper (optional/recommended)
	  * - shopperEmail: The e-mail address of the shopper 
	  * - shopperReference: The shopper reference, i.e. the shopper ID
	  * - fraudOffset: Numeric value that will be added to the fraud score (optional)
	  * - paymentRequest.additionalData.card.encrypted.json: The encrypted card catched by the POST variables.
	  * Example: opts: {
			"action" : "Payment.authorise",
			"paymentRequest.merchantAccount" : "Hic2h",    
			"paymentRequest.amount.currency" : "EUR",
			"paymentRequest.amount.value" : "199",
			"paymentRequest.reference" : "TEST-PAYMENT-" + moment().format(),
			"paymentRequest.shopperIP" : "41.143.170.207",
			"paymentRequest.shopperEmail" : "test@hic2h.com",
			"paymentRequest.shopperReference" : "test-hic2h", 
			"paymentRequest.fraudOffset" : "0",
			"paymentRequest.additionalData.card.encrypted.json" : req.body['adyen-encrypted-data']
	  }
 * * @param {callback} callback function
 */

function adyenTest(user, pwd, opts, callback){
	var opts = opts || {};
	var user = user || "";
	var pwd = pwd || "";

	/*curl.setOpt( 'URL', 'https://pal-test.adyen.com/pal/adapter/httppost' );
	curl.setOpt( 'HEADER', false );
	curl.setOpt( 'USERPWD', user + ":" + pwd);
	curl.setOpt( 'POSTFIELDS', EncodeQueryData(opts) );
	 
	curl.on( 'end', function( statusCode, body, headers ) {
		if(statusCode === 200) callback(null, DecodeQueryData(body));
		else if(statusCode === 401) callback("Adyen Service Authentication Error");
		else if(statusCode === 403) callback("Access to the specified resource has been forbidden.");
		else callback("Unknown server Error");
	    this.close();
	});
	 
	curl.on( 'error', function( err ) {callback(err);});
	curl.perform();*/

	// Start using HTTPS requests instead of curl to call adyen server.

	var adyenRequestHeader = {
		host: 'pal-test.adyen.com',
		method: 'POST',
		auth: user + ':' + pwd,
		path: '/pal/adapter/httppost'
	};
	var adyenRequestRequest = https.request(adyenRequestHeader, function (proxyResponse) {

	    var data = "";
	    proxyResponse.on('data', function (chunk) {
	        data += chunk;
	    });
	    proxyResponse.on('end', function(){
			if(proxyResponse.statusCode === 200) callback(null, DecodeQueryData(data));
			else if(proxyResponse.statusCode === 401) callback("Adyen Service Authentication Error");
			else if(proxyResponse.statusCode === 403) callback("Access to the specified resource has been forbidden.");
			else callback("Unknown server Error");
	    });
		proxyResponse.on('error', function(err) {
			callback(err)
		})
	  });
	adyenRequestRequest.write(EncodeQueryData(opts));
	adyenRequestRequest.end();
}

function adyenLive(user, pwd, opts, callback){
	//TODO: adyenLive
}

adyen.test = adyenTest;
adyen.live = adyenLive;
module.exports = adyen;

})();