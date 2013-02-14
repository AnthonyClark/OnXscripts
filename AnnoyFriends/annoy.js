//// Author: Anthony Clark
//// Created: 2013-02-13
////
//// This script is to send texts to a target contact until a specific pass phrase is recieved
//// by text from anybody other than the target themselves.
//// Use in good faith!

// Initializing variables 
var friend = {
        name:"Example",
        number: "12345678910"
    };
var pass_phrase = 'Never gonna give you up';
var annoy = 'Blah Blah irritating text! Blah blah! Get somebody to help you!';
var initial_message = 'The script has begun. It will stop when somebody other than you texts me exactly: "'+pass_phrase+'", good luck.';
var count = 1;
var wait_mins = 5;
// Begin the game!

device.messaging.sendSms({
        to: friend.number,
        body: initial_message
    });
console.log('Annoying texts to '+friend.name+' have begun!');

// Schedule the annoying texts!
device.scheduler.setTimer({
        name: "SMS", 
        time: 0,
        interval: wait_mins * 60000, 
        exact: false },
        
        function () {
            device.messaging.sendSms({
            to: friend.number,
            body: annoy
        });
        
        console.log('Text sent to '+friend.name + ' count: ' + count);
        count++;
});

// Check incomming texts for valid disable
device.messaging.on('smsReceived', function (sms) {
    
    console.log('sms received from', sms.from, 'with the following body:', sms.body);
    
    if(sms.body.toLowerCase().indexOf(pass_phrase.toLowerCase())!== -1 && sms.data.from != friend.number ){
        device.scheduler.removeTimer("SMS");
        
        console.log('Successfully cancelled the script.');
    }
});