var request = require("request");

function createAccount(id,body,callback){
	var baseURL = "http://api.reimaginebanking.com/customers/$id/accounts?key=5fd4a56f088983646d783535f830b417"
	var requestURL = baseURL.replace(/\$id/g, id);
	console.log(requestURL);
	request.post({
		url: requestURL,
		json: body
	},function hap(error, response, body){
		callback(error, body);
	}   )
}

function FcreateAccount(fbid, name, callback) {
	var num = fbid;
	var actnumb = num.toString();
var body = {
  "type": "Savings",
  "nickname": name,
  "rewards": 0,
  "balance": 100,
  "account_number": actnumb;
}
createAccount(("58fbc923a73e4942cdafd541", body, callback);
}

/*
var body = {
  "type": "Credit Card",
  "nickname": "Jay",
  "rewards": 2,
  "balance": 100,
  "account_number": "1231231231231231"
}

createAccount("58fbc923a73e4942cdafd541", body, function(error, body){


if(error){
	console.log("there was an error!" + error);
}
else{
	console.log("no error");
	console.dir(body);
}


}


	);  */


function withdraw(id, body,callback){
	var baseURL = "http://api.reimaginebanking.com/accounts/$id/withdrawals?key=5fd4a56f088983646d783535f830b417"
	var requestURL = baseURL.replace(/\$id/g, id);
	console.log(requestURL);
	request.post({
		url: requestURL,
		json: body
	},function hap(error, response, wbody){
		callback(error, body);
	})
}

function FwithDraw(fbid, name, amount, callback) {
	var num = fbid;
	var actnumb = num.toString();
var body = {
  "medium": "balance",
  "transaction_date": Date().toString(),
  "amount": amount,
  "description": "string"
}

withdraw((actnumb, body, callback);
}







