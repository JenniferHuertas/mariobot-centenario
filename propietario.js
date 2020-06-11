var builder = require('botbuilder');

module.exports = [
  function (session) {
    builder.Prompts.text(session, 'Por favor, Indicame la denominación/nombre del inmueble ó el número de partida');
  },

function (session, results, next) {
  console.log(session);
  session.dialogData.destination = results.response;
  session.send('Estoy buscando el inmueble %s', results.response);
  next();
},

]