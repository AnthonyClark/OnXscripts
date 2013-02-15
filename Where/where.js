//// Author: Anthony Clark
//// Created: 2013-02-14
////
//// This script allows for contacts to find my location by text.

// Initializing variables 
var messageText = "where?";

// End of variables

//  Register callback on sms received event
device.messaging.on('smsReceived', function (sms) {
	
	if (isContact(sms.data.from) && sms.data.body.toLowerCase() === messageText.toLowerCase()) {
		
		console.log('Location request from number: ' + sms.data.from);
		
		// getting location from cell, which is accurate enough in this case
		// time interval is 100  milliseconds, to get immediate location sample
		var locListener = device.location.createListener('CELL', 100);
		locListener.on('changed', function (signal) {
			
			// stop listening to location changed events after getting the current location
			locListener.stop();

			var mapUrlPattern = 'https://maps.google.com/?q=lat,+lon';
			var mapUrl =  mapUrlPattern.replace(/lat/g, signal.location.latitude).replace(/lon/g, signal.location.longitude);

			// sending text message  with the current location
			device.messaging.sendSms({
					to: sms.data.from,
					body: 'Hi, I am here: ' + mapUrl
				},
				function (err) {
					if (err) {
						console.error('Error sending text message: ' + JSON.stringify(err));
					}
				}
			);
		});
		locListener.start();
	} else {
		console.log('Text not from a contact, number: ' + sms.data.from);
	}
});

// Check to see if text is from a contact.
function isContact(number)
{      
	var contacts = device.contacts.findByPhone(number);
	if (contacts !== null)
	{
		return true;
	}
	return false;
}