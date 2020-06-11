var builder = require('botbuilder');

module.exports = [
  function (session) {
    builder.Prompts.text(session, 'Por favor, indícame la denominación/nombre del inmueble.');
  },

/* function (session) {
  builder.Prompts.text(session, 'Por favor, indícame la descripción del inmueble.');
}, */

function (session, results, next) {
  console.log(session);
  session.dialogData.destination = results.response;
  session.send('Estoy buscando la partida de la denominación %s', results.response);
  next();
},

]