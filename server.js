const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.use(express.static('node_modules/nexmo-client/dist'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


/* STEP 1

Nexmo will make an HTTP request to your answer_url when an inbound call is received.

You need to create a webhook server that is capable of receiving this request 
and returning an NCCO containing an action (https://developer.nexmo.com/voice/voice-api/ncco-reference).

As a first step, create an ncco with a talk action. Call the LVN number and check if it's working.

NOTE: Please remember to set up application webhook in the Nexmo Dashboard (https://dashboard.nexmo.com/applications)

*/
  

/* STEP 2

Implement VAPI Event Webhook & RTC Event Webhook. Log the request body using console.log and return 200 OK
Make sure to configure webhooks in your dashboard.

Doc: https://developer.nexmo.com/voice/voice-api/webhook-reference#event-webhook

*/


/* STEP 3

Go to the client side and complete the task before.

Once you've completed client side, you need to edit the NCCO to forward the call to a PSTN number.

Please check the Answer Webhook body, you will have to extract the PSTN Number to connect to.

Implement a logic to allow calls only to allowed numbers (for example, only to your personal number).
If the number is in the allowed numbers, the call is forwarded to it.
Otherwise, implement a TTS action with an alert to the user (for example: Sorry, that number is not permitted).


Doc: https://developer.nexmo.com/voice/voice-api/ncco-reference

*/


// STEP 1 - VAPI ANSWER WEBHOOK
// Type the code below this point please
app.get('/webhooks/answer', (req, res) => {
	console.log("Answer:");
	console.log(req.query);
	var destNumber = req.query.to;
	const ncco = [
		{
			  action: 'talk',			  
			  text: 'Please enter a digit'
		},		
		{
			action: 'input',
			maxDigits: 1,
			timeOut: 5,
			eventUrl: [`${req.protocol}://${req.get('host')}/webhooks/dtmf`]
		  }
	  ]
	
	res.json(ncco);
});

const onEvent = (request, response) => {
	console.log('ON EVENT:' + JSON.stringify(request.body))
}
const onRTC = (request, response) => {
	console.log('ON RTC:' + JSON.stringify(request.body.body))
}
const onDTMF = (request, response) => {
	console.log('DTMF:' + JSON.stringify(request.body.dtmf))
	
	//const ncco = [{
	//	action: 'talk',
	//	text: `You pressed ${request.body.dtmf}`
	//  }]

	let ncco = dtmfToNcco(request.body.dtmf);
	if (!ncco) {
		ncco =  [
			{
				action: 'talk',			  
				text: 'I didn\'t get your choice. Please enter a digit.'
			},		
			{
				action: 'input',
				maxDigits: 1,
				timeOut: 5,
				eventUrl: [`${request.protocol}://${request.get('host')}/webhooks/dtmf`]
			}
		];
	}
	console.log('Next NCCO:' + JSON.stringify(ncco));
	response.json(ncco);
}

const dtmfToNcco = (dtmf) => {
	switch (dtmf) {
		case "1":
			//Listening to "Twinkle Twinkle Little Star"
			return [
				{
					action: 'talk',			  
					text: 'Here is classical music masterpiece.'
				},
				{
					action: 'stream',
					streamUrl: ['https://ia800907.us.archive.org/15/items/TwinkleTwinkleLittleStarPlain/Twinkle_Twinkle_Little_Star_plain.mp3'],
				},
				{
					action: 'talk',			  
					text: 'Thanks for calling. Bye!'
				}
			];
		case "2":
			//Hearing the current time and date
			var d = new Date();
			return [
				{
					action: 'talk',			  
					text: `Today is ${d.toLocaleDateString()}. It's ${d.toLocaleTimeString()}. Thanks for calling. Bye!`
				}
			];
		case "3":
			//Being transferred to another number that you own with a “we are now connecting you to an agent who will be able to help you” message
			return [
				{
					action: 'talk',			  
					text: 'We are now connecting you to an agent who will be able to help you.'
				},
				{
					action: 'connect',					
					endpoint: [
					  {
						type: 'phone',
						number: '442039051305'
					  }
					]
				  }
			];
		default:
			return null;
	} 

}


app
  .post('/webhooks/event', onEvent)
  .post('/webhooks/rtc', onRTC)
  .post('/webhooks/dtmf', onDTMF)




app.get('/', function (req, res) {
	res.sendFile(path.join(__dirname + '/index.html'));
});

app.listen(port, () => console.log(`Server listening on port ${port}!`));