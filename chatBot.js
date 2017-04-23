const login = require("facebook-chat-api");
var config = require('./config.js')
var flag1 = false;
var flag1a = false;
var flag2 = false;
var flag3 = false;
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

    	if (tokens[0].valueOf()==="help".valueOf()) {
    		api.sendMessage("Type \"bet [name]\" to start a bet \n \
    			Type info for group chat info \
    			Type betinfo for current bet info \
    			Type exit to cancel bet(can if you are the better or betee)", message.threadID);
    	}

    	if (tokens[0].valueOf()==="info".valueOf()){
    		api.getThreadInfo(message.threadID, function(err, info){
    			api.sendMessage(info[0], message.threadID);
    		});
    	}

    	if (tokens[0].valueOf()==="betinfo".valueOf()){
    		api.sendMessage("Player 1: "+currentP1ID+"Player 2: "+currentP2ID+"for this amount: "+money, message.threadID);
    	}
    	
    	//-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-
		if (tokens[0].valueOf()==="exit".valueOf()&&(message.senderID===currentP1ID||message.senderID===currentP2ID)) { //cancel bet
		    		flag1 = false;
					flag1a = false;
					flag2 = false;
					flag3 = false;
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
		    		api.sendMessage("Reset!", message.threadID);
		}
    	//BETS START HERE!!!
    	if (tokens[0].valueOf()==="bet".valueOf()) {
    		api.sendMessage("Start a bet with " + tokens[1] + " for how much? (give a number)\
    			Also enter what the winning condition is.", message.threadID);
    		flag1 = true;
    		currentP1ID = message.senderID;
    		currentP2ID = tokens[1];
    	}

    	if (tokens[0].valueOf()==="outcome".valueOf()&&(flag1a===true)&&(message.senderID==currentP1ID)) { //add condition player 1 must be the one to enter
    		api.sendMessage("Start a bet with " + tokens[1] + " for how much? (give a number)", message.threadID);
    		flag1 = true;
    		flag1a = false;
    		
    		betString = message.substring(message.indexOf(" "));
    	}

    	
    	if (flag1===true&&message.senderID==currentP1ID) { //to prompt for the amount of money
    			if (isNaN(message.body)) {
    				api.sendMessage("Error, not a number! Try again! (quit to start over)", message.threadID);
    			} else {
	 		   		money = message.body;
	 		   		flag1=false;
	 		   		flag2=true;
	 		   		api.sendMessage(currentP1ID+" or "+ currentP2ID +", please name a judge", message.threadID);
    			}
    	}
    	if (flag2===true&&(message.senderID===currentP1ID||message.senderID===currentP2ID)) { //to assign the judge, requires flag1 if sequence to happen already
    		canJudge=message.body
			flag3 =true;
			api.sendMessage("The candidate judge is " + canJudge, message.threadID);
			flag2=false;
			if (message.senderID===currentP1ID) {
				i=0;
			} else {
				i=1;
			}
    	}
    	if (flag3===true&&(((message.senderID===currentP1ID)&&(i===1))||((message.senderID===currentP2ID)&&(i===0)))) { //to confirm with other person
    		canJudge=message.body;
			flag3 =false;
			finJudge=canJudge;
			api.sendMessage("The final judge is " + finJudge, message.threadID);
			Cstep = true;
    	}
    	if ((Cstep===true)&&(message.senderID===currentP1ID||message.senderID===currentP2ID)) { //to confirm
	    	if ((tokens[0]==="yes")&&(message.senderID===currentP1ID)) {
	    		f1="yes";
	    	}
	    	if ((tokens[0]==="yes")&&(message.senderID===currentP2ID)) {
	    		f2="yes";
	    	}
	    	if (f1==="yes"&&f2==="yes") {
				api.sendMessage("Everyone has agreed! Bet has started!" + canJudge +"\n \
					Judge, enter \"win: player\" to confirm the winner.", message.threadID);
				Cstep=false;
				f1=false;
				f2=false;
				finalConfirmation=true;
	    	} else {
	    		if (f1=="yes") {
	    			api.sendMessage("f1 has agreed!" + canJudge, message.threadID);
	    		} else if (f2=="yes") {
					api.sendMessage("f2 has agreed!" + canJudge, message.threadID);
	    		} else {
	    			api.sendMessage("No one has agreed" + canJudge, message.threadID);
	    		}
	    	}
	    }

	    if ((finalConfirmation===true)&&(message.senderID===finJudge)&&(tokens[0]==="win:")) { // to determine winner
	    	getID(api, tokens[1], message.threadID , function(err, id) { 
	    	var temp = id
	    	if (temp===currentP1ID) {
	    		api.sendMessage(tokens[1] + canJudge, message.threadID);
	    		whichWon=1;
	    	} else if (temp===currentP2ID) {
	    		api.sendMessage(tokens[1] + canJudge, message.threadID);
	    		whichWon=2;
	    	} else {
	    		console.log("error!")
	    	}
	    	 });

	    }



    	api.sendMessage("---",message.threadID);
        //api.sendMessage(message.body+"  "+message.senderID, message.threadID);
    });
}
// Create simple echo bot
login({email: config.fb_user, password: config.fb_pass}, x); // fucntion takes in obj email/pass and a callback;

function getID(api, name, threadID, callback) {
    api.getThreadInfo(threadID, function(err, info) {
        if (err) {
            callback(err);
            return;
        } else {
            api.getUserInfo(info.participantIDs, function(err, obj) {
                info.participantIDs.forEach(function(id) {
                    if (obj[id].name == name) {
                        callback(null, id);
                        return;
                    }
                });
            });
        }
        callback("Unable to find ID");
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


