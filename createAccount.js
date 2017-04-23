var request = require("request");

module.exports = {
	createAccount: function(fbid, name, callback){ 
		var num = fbid;
		var actnumb = pad(num,16);
		var body = {
		  "type": "Savings",
		  "nickname": name,
		  "rewards": 0,
		  "balance": 100,
		  "account_number": actnumb
		}
		createAccount("58fbc923a73e4942cdafd541", body, callback);
	},
	withdraw: function(fbid, amount, callback) {
		var num = fbid;
		var actnumb = pad(num, 16);
		var date = new Date();
		var body = {
	  	"medium": "balance",
	  	"transaction_date": date.getFullYear()  + '-' + (date.getMonth() + 1) + '-' + date.getDate(),
	  	"amount": amount,
	  	"description": "string"
	  	}
		getAccount(actnumb, function(err, res) {

			console.log("withdrawing " + res);
			withdraw(res._id, body, callback);
		})
	},
	deposit: function(fbid, amount, callback){
		var num = fbid;
		var actnumb = pad(num, 16);
		var date = new Date();
		var body = {
		  "medium": "balance",
		  "transaction_date": date.getFullYear()  + '-' + (date.getMonth() + 1) + '-' + date.getDate(),
		  "amount": amount,
		  "description": "string"
		}

		getAccount(actnumb, function(err, res) {
			console.log("depositing " + res._id);
			deposit(res._id, body, callback);
		})
	}, 

	getBalance: function(name, callback){
	var requestURL = "http://api.reimaginebanking.com/accounts/?key=5fd4a56f088983646d783535f830b417"
  request.get({
    url: requestURL
  }, function(error, response){
    var id = "-1";
    var js = JSON.parse(response.body);
    //console.log("Getting Account. JSON: " + response.body)
    for(var x=0;x<js.length;x++){
      if(js[x].account_number!=null&&js[x].nickname==name){
        balance=js[x].balance;
      }
    }
    //console.log(id);
   
    callback(null, balance);
   
	});
}

};

function createAccount(id,body,callback){
	getAccount(body.account_number, function(err, res) {
		if (res != null) {
			console.log("res is not null")
			callback("already exists");
			return;
		}
				var baseURL = "http://api.reimaginebanking.com/customers/$id/accounts?key=5fd4a56f088983646d783535f830b417"
				var requestURL = baseURL.replace(/\$id/g, id);
				console.log(requestURL);
				request.post({
					url: requestURL,
					json: body
				},function hap(error, response, body){
					callback(error, body);
				}   )
	})

}

function FcreateAccount(fbid, name, callback) {
	var num = fbid;
	var actnumb = pad(num,16);
var body = {
  "type": "Savings",
  "nickname": name,
  "rewards": 0,
  "balance": 100,
  "account_number": actnumb
}
createAccount("58fbc923a73e4942cdafd541", body, callback);
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
function getAccount(fbid, callback){
	var requestURL = "http://api.reimaginebanking.com/accounts/?key=5fd4a56f088983646d783535f830b417"
  request.get({
    url: requestURL
  }, function(error, response){
    var id = "-1";
    var js = JSON.parse(response.body);
    //console.log("Getting Account. JSON: " + response.body)
    for(var x=0;x<js.length;x++){
      if(js[x].account_number!=null&&js[x].account_number==fbid){
        id=js[x]._id;
      }
    }
    //console.log(id);
   
    var moquestURL = "http://api.reimaginebanking.com/accounts/$id?key=5fd4a56f088983646d783535f830b417"
    var morquestURL = moquestURL.replace("$id", id);
    request.get({
      url: morquestURL
    }, function(error, response){
      //console.log(response.body);
      if (JSON.parse(response.body).code == 404) {
      	callback("404",null);
      } else {
      callback(null, JSON.parse(response.body));
  	}
    })

		


		})




	}






function withdraw(id, body,callback){
	var baseURL = "http://api.reimaginebanking.com/accounts/$id/withdrawals?key=5fd4a56f088983646d783535f830b417"
	var requestURL = baseURL.replace(/\$id/g, id);
	//console.log(requestURL);
	request.post({
		url: requestURL,
		json: body
	},function hap(error, response, wbody){
		if (callback){
			callback(error, body);
		}
	})
}

function fwithdraw(fbid, amount, callback) {
	var num = fbid;
	var actnumb = pad(num,16);
	var date = new Date();
var body = {
  "medium": "balance",
  "transaction_date": date.getFullYear()  + '-' + (date.getMonth() + 1) + '-' + date.getDate(),
  "amount": amount,
  "description": "string"
}


	getAccount(actnumb, function(err, res) {
		console.log("withdrawing " + res._id);
		withdraw(res._id, body, callback);
	})
//withdraw((actnumb, body, callback);
}




function deposit(id, body,callback){
	var baseURL = "http://api.reimaginebanking.com/accounts/$id/deposits?key=5fd4a56f088983646d783535f830b417"
	var requestURL = baseURL.replace(/\$id/g, id);
	console.log(requestURL);
	request.post({
		url: requestURL,
		json: body
	},function hap(error, response, wbody){
		if (callback)
			callback(error, body);
	})
}

function fdeposit(fbid, amount, callback) {
	var num = fbid;
	var actnumb = pad(num,16);
	var date = new Date();
var body = {
  "medium": "balance",
  "transaction_date": date.getFullYear()  + '-' + (date.getMonth() + 1) + '-' + date.getDate(),
  "amount": amount,
  "description": "string"
}

	getAccount(actnumb, function(err, res) {
		console.log("depositing " + res._id);
		deposit(res._id, body, callback);
	})
//withdraw((actnumb, body, callback);
}


//fwithdraw(1547012816666319, 25, function(err, body) {
//	console.log(body);
//})

/*fdeposit(1547012816666319, 3, function(err,body){
	console.log(body);
})
*/




function pad(n, width, z) {
  z = z || '1';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}






