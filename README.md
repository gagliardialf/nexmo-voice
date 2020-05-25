# Nexmo Voice APIs Certification
Build a Voice API call menu that presents your users with a list of options. These should include:

- Listening to an audio file of your choice
- Hearing the current time and date
- Being transferred to another number that you own with a “we are now connecting you to an agent who will be able to help you” message

#### _RUNNING INSTRUCTION_
1. add a .nexmo-app file with the configuration for app_id and private_key
2. add a .env file with the following keys:
   `NEXMO_API_KEY`
   `NEXMO_API_SECRET`   
   `NEXMO_APPLICATION_ID`
   `NEXMO_APPLICATION_PRIVATE_KEY_PATH`
   `TRANSFER_NUMBER`
   `OWNED_NUMBERS` (comma-separated list)
2. install the packages (`npm i`)
3. run the server (`node server.js`). It will run on port 3000
4. expose it on the Internet with ngrok
5. set up the Nexmo application webhooks for answer, events and rtc

The webpage on http://localhost:3000 allows calls towards on of the `OWNED_NUMBERS`; otherwise, a message is playeded informing that the inserted number is not allowed
