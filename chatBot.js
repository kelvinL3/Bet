const login = require("facebook-chat-api");
var config = require('./config.js')
var flag1 = false;
var flag2 = false;
var flag3 = false;
var currentP1ID = 0;
var currentP2ID = 0;
var money = null;
var canJudge = 0;
var fin
var binary =-1;
var currentThread = 0;

//this is a callback, the input to the callback is the output of the function 
var x = function (err, api) { 
    if(err) {
    	return console.error(err);
	}

	//api.setOptions({listenEvents: true})
    api.listen(function(err, message) {
		var tokens = message.body.split(' ');
    	console.log(tokens +"\n"+tokens[0])

    	if (tokens[0].valueOf()==="help".valueOf()) {
    		api.sendMessage("Type \"bet [name]\" to start a bet \n \
    			Type info for group chat info \
    			Type betinfo for current bet info \
    			Type exit to cancel bet(if you are the better or betee)", message.threadID);
    	}

    	if (tokens[0].valueOf()==="info".valueOf()){
    		api.getThreadInfo(message.threadID, function(err, info){
    			api.sendMessage(info[0], message.threadID);
    		});
    	}

    	if (tokens[0].valueOf()==="betinfo".valueOf()){
    		api.sendMessage("Player 1: "+currentP1ID+"Player 2: "+currentP2ID+"for this amount: "+money, message.threadID);
    	}
    	
    	//BETS START HERE!!!
    	if (tokens[0].valueOf()==="bet".valueOf()) {
    		api.sendMessage("Start a bet with " + tokens[1] + " for how much? (give a number)", message.threadID);
    		flag1 = true;
    		currentP1ID = message.senderID;
    		currentP2ID = tokens[1];
    	}

    	if (tokens[0].valueOf()==="exit".valueOf()&&(message.senderID===currentP1ID||message.senderID===currentP2ID)) { //cancel bet
    		flag1 = false;
			flag2 = false;
			flag3 = false;
			currentP1ID = 0;
			currentP2ID = 0;
			money = null;
			canJudge = 0;
			binary =-1;
			currentThread = 0;
    		api.sendMessage("Done!", message.threadID);
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
    		canJudge=message.body
			flag3 =false;
			api.sendMessage("The final judge is " + canJudge, message.threadID);
    	}
    	api.sendMessage("---",message.threadID);
        //api.sendMessage(message.body+"  "+message.senderID, message.threadID);
    });
}
// Create simple echo bot
login({email: config.fb_user, password: config.fb_pass}, x); // fucntion takes in obj email/pass and a callback;




