// This loads the environment variables from the .env file
require('dotenv-extended').load();

var builder = require('botbuilder');
var restify = require('restify');

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log('%s listening to %s', server.name, server.url);
});

// Create chat bot and listen to messages
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});
server.post('/api/messages', connector.listen());

var DialogLabels = {
    Poderes: 'Poderes',
    Partidas: 'Partidas',
    Proyectos: 'Proyectos'
};

// Bot Storage: Here we register the state storage for your bot. 
// Default store: volatile in-memory store - Only for prototyping!
// We provide adapters for Azure Table, CosmosDb, SQL Azure, or you can implement your own!
// For samples and documentation, see: https://github.com/Microsoft/BotBuilder-Azure
var inMemoryStorage = new builder.MemoryBotStorage();

var bot = new builder.UniversalBot(connector, [
    function (session) {
        // prompt for search option
        builder.Prompts.choice(
            session,
            'Estoy atento. Dime, ¿Qué deseas consultar?',
            [DialogLabels.Partidas, DialogLabels.Poderes, DialogLabels.Proyectos],
            {
                maxRetries: 3,
                retryPrompt: 'Lo siento, no he encontrado esta información'
            });
    },
    function (session, result) {
        if (!result.response) {
            // exhausted attemps and no selection, start over
            session.send('Ooops! Too many attemps :( But don\'t worry, I\'m handling that exception and you can try again!');
            return session.endDialog();
        }

        // on error, start over
        session.on('error', function (err) {
            session.send('Failed with message: %s', err.message);
            session.endDialog();
        });

        // continue on proper dialog
        var selection = result.response.entity;
        switch (selection) {
            case DialogLabels.Partidas:
                return session.beginDialog('Partidas');
            case DialogLabels.Poderes:
                return session.beginDialog('Poderes');
            case DialogLabels.Proyectos:
                return session.beginDialog('Proyectos');
        }
    }
]).set('storage', inMemoryStorage); // Register in memory storage

bot.dialog('Partidas', require('./partidas'));
bot.dialog('Poderes', require('./poderes'));
bot.dialog('Proyectos', require('./proyectos'))
    .triggerAction({
        matches: [/help/i, /Proyectos/i, /problem/i]
    });

// log any bot errors into the console
bot.on('error', function (e) {
    console.log('And error ocurred', e);
});