var builder = require('botbuilder');
var Store = require('./store');

module.exports = [

    function (session) {
        DialogLabels = {
            Num_Partida: 'Número de Partida',
            Des_inmueble: 'Descripción del Inmueble',
        },
        // prompt for search option
        builder.Prompts.choice(
            session,
            'Estoy atento. Dime, ¿que deseas consultar desde poderes?',
            [DialogLabels.Num_Partida, DialogLabels.Des_inmueble],
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
            case DialogLabels.Num_Partida:
                return session.beginDialog('Num_Partida');
            case DialogLabels.Des_inmueble:
                return session.beginDialog('Des_Inmueble');
        }


    }
    
]/* ,
    // Destination
    function (session) {
        session.send('Estoy atento. Dime, ¿que deseas consultar? 1.Numero de Partida 2.Descripción de Inmueble');
        builder.Prompts.text(session, 'Please enter your destination');
    },
    function (session, results, next) {
        session.dialogData.destination = results.response;
        session.send('Looking for hotels in %s', results.response);
        next();
    },

    // Check-in
    function (session) {
        builder.Prompts.time(session, 'When do you want to check in?');
    },
    function (session, results, next) {
        session.dialogData.checkIn = results.response.resolution.start;
        next();
    },

    // Nights
    function (session) {
        builder.Prompts.number(session, 'How many nights do you want to stay?');
    },
    function (session, results, next) {
        session.dialogData.nights = results.response;
        next();
    },

    // Search...
    function (session) {
        var destination = session.dialogData.destination;
        var checkIn = new Date(session.dialogData.checkIn);
        var checkOut = checkIn.addDays(session.dialogData.nights);

        session.send(
            'Ok. Searching for Hotels in %s from %d/%d to %d/%d...',
            destination,
            checkIn.getMonth() + 1, checkIn.getDate(),
            checkOut.getMonth() + 1, checkOut.getDate());

        // Async search
        Store
            .searchHotels(destination, checkIn, checkOut)
            .then(function (hotels) {
                // Results
                session.send('I found in total %d hotels for your dates:', hotels.length);

                var message = new builder.Message()
                    .attachmentLayout(builder.AttachmentLayout.carousel)
                    .attachments(hotels.map(hotelAsAttachment));

                session.send(message);

                // End
                session.endDialog();
            });
    }
];

// Helpers
function hotelAsAttachment(hotel) {
    return new builder.HeroCard()
        .title(hotel.name)
        .subtitle('%d stars. %d reviews. From $%d per night.', hotel.rating, hotel.numberOfReviews, hotel.priceStarting)
        .images([new builder.CardImage().url(hotel.image)])
        .buttons([
            new builder.CardAction()
                .title('More details')
                .type('openUrl')
                .value('https://www.bing.com/search?q=hotels+in+' + encodeURIComponent(hotel.location))
        ]);
}

Date.prototype.addDays = function (days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}; */