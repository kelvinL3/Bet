const login = require("facebook-chat-api");
var jay = require('./createAccount.js');
var config = require('./config.js')
var MongoClient = require('mongodb').MongoClient

var flag1 = false;
var flag1a = false;
var flag2 = false;
var flag3 = false;

var currentflag = 0;

var currentP1ID = 0;
var betString = null;
var currentP2ID = 0;
var money = null;
var canJudge = 0;
var finJudge = 0;
var binary =-1;
var Cstep = false;
var f1 = false;
var f2 = false;
var finalConfirmation = false;
var currentThread = 0;
var whichWon = -1;
var iii = -1;
var currentstep=0;


var bool=false;
var disagree = false;

var url = 'mongodb://capen:bettingapp@ds133418.mlab.com:33418/bettingapp';

// Use connect method to connect to the server
MongoClient.connect(url, function(err, db) {
//console.log(jay.withdraw);

//this is a callback, the input to the callback is the output of the function 
var x = function (err, api) { 
    if(err) {
    	return console.error(err);
	}
    //EXAMPLE USAGE OF GETNAME AND GETID
    /*getName(api, 100000728466267, function(err, name) {
        console.log(name);
    });
    getID(api, "Aaron Kau", 1492866947455267, function(err, id) {
        console.log(id);
    });*/



	//api.setOptions({listenEvents: true})
    api.listen(function(err, message) {
		var tokens = message.body.split(' ');
    	console.log(tokens +"\n"+tokens[0])
    	console.log(currentstep)
    	if (tokens[0].valueOf()==="help".valueOf()) {
    		api.sendMessage("Type \"bet [name]\" to start a bet \r\nType info for group chat info\r\nType betinfo for current bet info\r\nType exit to cancel bet", message.threadID);
    	}

    	if (tokens[0].valueOf()==="info".valueOf()){
    		api.getThreadInfo(message.threadID, function(err, info){
    			api.sendMessage(info[0], message.threadID);
    		});
    	}

    	if (tokens[0].valueOf()==="betinfo".valueOf()){
	    	getName(api, currentP1ID, function(err, res) {
			getName(api, currentP2ID, function(err, res2) {
			jay.getBalance(res,function(err,bal1) {
			jay.getBalance(res2, function(err,bal2) {
    			api.sendMessage("Player 1: "+res+"Player 2: "+res2+" who have these amounts, already ("+bal1+", "+ bal2 +") for this amount: "+money, message.threadID);
			})
			})
			})
			})
    	}
    	
    	//-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-
		if (tokens[0]==="exit"||tokens[0]==="close"||tokens[0]==="clear"||tokens[0]==="stop") { //cancel bet
    		flag1 = false;
			flag1a = false;
			flag2 = false;
			flag3 = false;

			currentflag = 0;

			currentP1ID = 0;
			betString = null;
			currentP2ID = 0;
			money = null;
			canJudge = 0;
			finJudge = 0;
			binary =-1;
			Cstep = false;
			f1 = false;
			f2 = false;
			finalConfirmation = false;
			currentThread = 0;
			whichWon = -1;
			iii = -1;
			currentstep=0;
		    bool=false;
		    disagree = false;
    		api.sendMessage("Reset!", message.threadID);
		}
    	//BETS START HERE!!!

	if ((finalConfirmation===true)&&(tokens[0]==="win:")) { // to determine winner
        getName(api, message.senderID, function(err, obj) {
            if (obj == finJudge) {
                var fullname = "";
                for (var i=1;i<tokens.length;i++) {
                    if (i>1) fullname += " "
                    fullname += tokens[i];
                }
                getID(api, fullname, message.threadID , function(err, id) {
                if (err) {
                    console.log(err);
                } 
                console.log(fullname);
                var temp = id
                if (temp===currentP1ID) {
                    api.sendMessage(canJudge + " has decided that " + fullname + " is the winner of the bet! Congratulations!", message.threadID);
                    jay.deposit(currentP1ID, 2*money, function(err, response) {

                    });

                        
                    whichWon=1;
                } else if (temp===currentP2ID) {
                    api.sendMessage(canJudge + " has decided that " + fullname + " is the winner of the bet! Congratulations!", message.threadID);
                    whichWon=2;
                    jay.deposit(currentP2ID, 2*money, function(err, response){

                    });
                } else {
                    console.log("error!")
                }
                	getName(api, currentP1ID, function(err, p1) {
                    	getName(api, currentP2ID, function(err, p2){ 

                    		var winnerName;
                    		if(whichWon==1){ winnerName=p1;}
                    			else if(whichWon==2){winnerName=p2;}

                    			var date = new Date();
                    		db.collection('bets').insert({
	                    		date: date.getFullYear()  + '-' + (date.getMonth() + 1) + '-' + date.getDate(),
		                    	betee: p2,
		                    	better:p1,
		                    	amount: money,
		                    	reason: betString,
		                    	winner: winnerName


                    		});
                    		
                    	})
                    })

                });
            }
        })
	}
	
	if ((Cstep===true)&&(message.senderID===currentP1ID||message.senderID===currentP2ID)) { //to confirm
    	if ((message.body==="yes")&&(message.senderID===currentP1ID)) {
    		f1="yes";
    	}
    	if ((message.body==="yes")&&(message.senderID===currentP2ID)) {
    		f2="yes";
    	}
    	if ((message.body==="no")&&(message.senderID===currentP1ID)) {
    		f1="no";
    	}
    	if ((message.body==="no")&&(message.senderID===currentP2ID)) {
    		f2="no";
    	}
    	if (f1==="yes"&&f2==="yes") {
			api.sendMessage("Everyone has agreed on the judge!\r\nBet has started!"+"\r\nJudge " + canJudge +" enter \"win: player name\" to confirm the winner.", message.threadID);
					  
			console.log("MONEY : " + money + " MONEY AS INT " + parseInt(money));
			getName(api, currentP2ID, function(err, name) {
				var id2 = parseInt(currentP2ID)
				console.log(id2);
				
			  jay.createAccount(id2, name, function(err, body){
			  //	console.log("1 " + body);
			  	//jay.withdraw(id2, 3, function(err, body) {
			  	//	console.log("2 "  + JSON.stringify(body));
			  	//});
			  	jay.withdraw(id2, parseInt(money), function(err, body) {
			  		console.log("2 " + JSON.stringify(body))
			  	})
			  	//console.log("created 2 " + err + " body: " + JSON.stringify(body));
			  }); 
			});
			console.log("hi");
				
			getName(api, currentP1ID, function(err, name) {

				var id1 = parseInt(currentP1ID)
				console.log(id1);
			  jay.createAccount(id1, name, function(err, body){
			  	console.log("3 " + body);
			  	//jay.withdraw(id1, 3, function(err, body) {
			    //	console.log("4 " + JSON.stringify(body));
			  	//});
			  	jay.withdraw(id1, parseInt(money), function(err, body) {
			  		console.log("4 " + JSON.stringify(body))
			  	})
			  	//console.log("created 1 " + err + " body: " + JSON.stringify(body));
			  }); 
			});
			
			Cstep=false;
			f1=false;
			f2=false;
			finalConfirmation=true;
    	} else {
    		getName(api, currentP1ID, function(err, res) {
			getName(api, currentP2ID, function(err, res2) {
	    		if ((f1=="no")&&(f2=="no")) {
	    			api.sendMessage("No one has agreed on " + canJudge, message.threadID);
	    		} else if ((f1=="yes")&&(f2=="no")) {
					api.sendMessage(res2 + " has rejected! \r\nPlease nominate another judge.", message.threadID);
					currentstep=3;
					bool=true;
					f1=false;
					f2=false;
	    		} else if ((f1=="no")&&(f2=="yes")) {
	    			api.sendMessage(res + " has rejected! \r\nPlease nominate another judge.", message.threadID);
	    			currentstep=3;
	    			bool=true;
	    			f1=false;
	    			f2=false;
	    		} //else if ((trap1===)&&(trap2===)) {
	    		//	api.sendMessage("Error: "+res+" has entered " + f1 + " and " + res2 + " has entered " + f2+".", message.threadID);
	    		//}
    		})
			})
    	}
    }
    bool=false;
	if (/*flag3===true*/currentstep==4&&(((message.senderID===currentP1ID)&&(iii===1))||((message.senderID===currentP2ID)&&(iii===0)))) { //to confirm with other person
		if (canJudge===message.body) {
			flag3 =false;
			currentstep++;
			finJudge=canJudge;
			api.sendMessage("The judge is " + finJudge+".\r\nBoth players please type \"yes\" to confirm final bet!!!", message.threadID);
			Cstep = true;
		} else if (message.body==="no") {
			api.sendMessage("Player One, please nominate another judge.", message.threadID);
            currentstep--;
            bool=true;
		}
		
	} else if (currentstep == 4) {
        //api.sendMessage(iii + " " + canJudge, message.threadID);
    }
	if ((!bool)&&(currentstep==3/*flag2===true*/&&(message.senderID===currentP1ID||message.senderID===currentP2ID))) { //to assign the judge, requires flag1 if sequence to happen already
		canJudge=message.body
		currentstep++;
		flag3 =true;
		api.sendMessage("The candidate judge is " + canJudge + ".\r\nRecipient, enter \"no\" if you disagree. Or enter the name of the nominated judge if you agree.", message.threadID);
		flag2=false;
		if (message.senderID===currentP1ID) {
			iii=0;
		} else {
			iii=1;
		}
	}
	if (currentstep==2/*flag1===true*/&&message.senderID==currentP1ID) { //to prompt for the amount of money
		getName(api, currentP1ID, function(err, res) {
		getName(api, currentP2ID, function(err, res2) {
		jay.getBalance(res,function(err,bal1) {
		jay.getBalance(res2, function(err,bal2) {
		jay.createAccount(currentP1ID, res, function(err, body){
		jay.createAccount(currentP2ID, res2, function(err, body){
			if (isNaN(message.body)) {
				api.sendMessage("Error, not a number! Try again! (quit to start over)", message.threadID);
			} else if (bal1-parseInt(message.body)<0) {
				api.sendMessage(res + " does not have sufficient funds. Use a lower number.", message.threadID);
			} else if (bal2-parseInt(message.body)<0) {
				api.sendMessage(res2 +" does not have sufficient funds. Use a lower number.", message.threadID);
			} else {
		   		money = message.body;
		   		flag1=false;
		   		flag2=true;
		   		currentstep++;
	            api.sendMessage(res+" or "+ res2 +", please name a judge.", message.threadID);
			}
		})
		})
		})
		})
		})
		})
	}
	if (tokens[0].valueOf()==="outcome".valueOf()&&/*(flag1a===true)*/currentstep==1&&(message.senderID==currentP1ID)) { //add condition player 1 must be the one to enter
		api.sendMessage("Start a bet for how much? (number)", message.threadID);
		flag1 = true;
		flag1a = false;
		currentstep+=1;
		betString = message.body.substring(message.body.indexOf(" "));

	}
	if (tokens[0].valueOf()==="bet".valueOf()) {
		
		flag1 = true;
		currentstep+=1;
		//getName(api, message.senderID, function(err, obj) {
		//	currentP1ID = obj;
		//})
		currentP1ID = message.senderID;
		var fullname = "";
		for (var i=1;i<tokens.length;i++) {
			if (i>1) fullname+= " ";
			fullname += tokens[i];
		}
		console.log(fullname);
		getID(api, fullname, message.threadID, function(err, obj) {
			if (err) {
				api.sendMessage("We were unable to find this user in this group chat. Please enter the user's full name.", message.threadID);
				console.log(err);
				currentstep -= 1;
			} else {
				api.sendMessage("Please enter the winning condition or description of your bet. \r\nEnter \"outcome (outcome)\"", message.threadID);
				console.log(obj);
				currentP2ID = obj;
			}
		});
		//currentP2ID = tokens[1];
	}
	//console.log(tokens[0] + " outcome")
	//console.log(currentstep + " " + 1)
	//console.log(message.senderID + " " + currentP1ID);
	//console.log(currentstep);
    //api.sendMessage("---",message.threadID);
        //api.sendMessage(message.body+"  "+message.senderID, message.threadID);
    });
}
// Create simple echo bot
login({email: config.fb_user, password: config.fb_pass}, x); // fucntion takes in obj email/pass and a callback;


});
function getID(api, name, threadID, callback) {
	var found = false;
    api.getThreadInfo(threadID, function(err, info) {
        if (err) {
            callback(err);
            return;
        } else {
            api.getUserInfo(info.participantIDs, function(err, obj) {
                info.participantIDs.forEach(function(id) {
                    if (obj[id].name == name) {
                        callback(null, id);
                        found = true;
                    }
                });
                if (!found)
                	callback("Unable to find ID");
            });
        }
        
        return;
    });
}

function getName(api, userID, callback) {
    api.getUserInfo(userID, function(err, obj) {
        if (err) {
            callback(err);
            return;
        } else {
            callback(null, obj[userID].name);
        }
    });
}


