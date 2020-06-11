var builder = require('botbuilder');

module.exports = [
  function (session) {
    builder.Prompts.text(session, 'Por favor, indícame el número de tu partida registral');
  },

/* function (session) {
  builder.Prompts.text(session, 'Por favor, indícame la descripción del inmueble.');
}, */
function (session, results, next) {
  console.log(session);
  session.dialogData.destination = results.response;
  session.send('Estoy buscando la partida N° %s', results.response);
  next();
},

]