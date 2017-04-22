var request = require("request");

function createAccount(id,body,callback){
	var baseURL = "http://api.reimaginebanking.com/customers/$id/accounts?key=$id"
	var requestURL = baseURL.replace(/\$id/g, id);
	console.log(requestURL);
	request.post({
		url: requestURL,
		json:body
	},function hap(error, response, body){
		callback(error, body);
	}   )
}


var body = {
  "type": "Credit Card",
  "nickname": "Jay",
  "rewards": 2,
  "balance": 100,
  "account_number": "103"
}

createAccount("5fd4a56f088983646d783535f830b417", body, function(error, body){


if(error){
	console.log("there was an error!" + error);
}
else{
	console.log("no error");
	console.dir(body);
}


}


	);