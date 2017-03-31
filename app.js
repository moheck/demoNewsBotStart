var restify = require('restify');
var builder = require('botbuilder');
var request = require('request');

//=========================================================
// Bot Setup
//=========================================================


// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});  

// Create Chat bot, provide appId and pw of registered bot.
// while testing locally appId and pw can be blank  
var connector = new builder.ChatConnector({
    appId: "",
    appPassword: ""
});

// Construct a UniversalBot with the connector to our app service.
// bot is the brains of our bot, uses dialogs to handle all conversations
var bot = new builder.UniversalBot(connector);

// Post anything picked up by the connector to /api/messages
server.post('/api/messages', connector.listen());

// Create LUIS recognizer
// var model = '';
// var recognizer = new builder.LuisRecognizer(model);
// Create IntentDialog, passing in recognizer
// var intents = new builder.IntentDialog({ recognizers: [recognizer]});

var intents = new builder.IntentDialog();

//=========================================================
// Bots Dialogs
//=========================================================

bot.dialog('/', intents);

//THIS IS WHAT WE WILL CODE TOGETHER

// when intent matches regular expression, "Hello", run Greeting Dialog
intents.matches(/^Hello/i, function(session){
    session.beginDialog('/greeting');
});

// if intent doesn't match anything, send failure message
intents.onDefault(function(session){
    session.send("Sorry, I don't know how to handle your request.");
    session.endDialog();
});

// Greeting Dialog
bot.dialog('/greeting', [
    function (session, args, next) {
        if (!session.userData.name) {
            session.beginDialog('/profile');
        } else {
            next();
        }
    },
    function (session, results) {
        session.send('Hello %s!', session.userData.name);
        session.endDialog();
    }
]);

// Profile Setup Dialog
bot.dialog('/profile', [
    function (session) {
        builder.Prompts.text(session, 'Hi! What is your name?');
    },
    function (session, results) {
        session.userData.name = results.response;
        session.endDialog();
    }
]);