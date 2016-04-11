# node-adyen-cse

adyen client side encryption for Node.js.

## Installing

	npm install node-adyen-cse --save
	
### For ubuntu users

	sudo apt-get install libcurl3-dev
	npm install node-adyen-cse --save

## Usage

```js
var adyen = require('node-adyen-cse');
adyen.test(user, pwd, opts, callback);
```

## Example

### Client-side

Include adyen.encrypt.js library as described here: https://github.com/Adyen/php/blob/master/2.API/httppost/create-payment-cse.php

HTML Form

```html
<form method="POST" action="/api/payment" id="adyen-encrypted-form">
  <div class="form-group">
    <label for="adyen-encrypted-form-number">Card Number</label>
    <input type="text" class="form-control" id="adyen-encrypted-form-number" value="5555444433331111" size="20" autocomplete="off" data-encrypted-name="number">
  </div>
  <div class="form-group">
    <label for="adyen-encrypted-form-holder-name">Card Holder Name</label>
    <input type="text" class="form-control" id="adyen-encrypted-form-holder-name" value="John Doe" size="20" autocomplete="off" data-encrypted-name="holderName">
  </div>
  <div class="form-group">
    <label for="adyen-encrypted-form-cvc">CVC</label>
    <input type="text" class="form-control" id="adyen-encrypted-form-cvc" value="737" size="4" autocomplete="off" data-encrypted-name="cvc">
  </div>
  <div class="form-group col-xs-6">
    <label for="adyen-encrypted-form-expiry-month">Expiration Month (MM)</label>
    <input type="text" class="form-control" value="06" id="adyen-encrypted-form-expiry-month" size="2"  autocomplete="off" data-encrypted-name="expiryMonth">
  </div>
  <div class="form-group col-xs-6">
    <label for="adyen-encrypted-form-expiry-year">Expiration Year (YYYY)</label>
    <input type="text" class="form-control" value="2016" id="adyen-encrypted-form-expiry-year"  size="4"  autocomplete="off" data-encrypted-name="expiryYear">
  </div>
  
  <input type="hidden" id="adyen-encrypted-form-expiry-generationtime" data-encrypted-name="generationtime" />
  <button type="submit" class="btn btn-default">Create payment</button>
</form>
```

### Server-side

```js
var adyen = require('node-adyen-cse');
app.post('/api/payment', function (req, res) {
	var adyenRequestBody = {
		"action" : "Payment.authorise",
		"paymentRequest.merchantAccount" : "Hic2hMerchant",    
		"paymentRequest.amount.currency" : "EUR",
		"paymentRequest.amount.value" : "199",
		"paymentRequest.reference" : "TEST-PAYMENT-" + moment().format(),
		"paymentRequest.shopperIP" : "11.111.111.111",
		"paymentRequest.shopperEmail" : "test@hic2h.com",
		"paymentRequest.shopperReference" : "test-hic2h", 
		"paymentRequest.fraudOffset" : "0",
		"paymentRequest.additionalData.card.encrypted.json" : req.body['adyen-encrypted-data']
	};

	adyen.test("ws@Company.Company", "XXXXXXXXXXXXXXXXX", adyenRequestBody, function(err, response){
		res.json({err: err, response: response});
	});
});
```
