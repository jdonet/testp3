const express = require('express');
const logger = require('morgan');

const app = express();

var listener = app.listen(8085, function(){
  console.log('Listening on port ' + listener.address().port); //Listening on port 8888
});

app.use(logger('dev'));
app.use(express.json());

const entrepriseRouter = require('./routes/entrepriseRouter');
const secteurRouter = require('./routes/secteurRouter');

app.use('/entreprises', entrepriseRouter);
app.use('/secteurs', secteurRouter);

// gestion d'erreur
app.use((err, req, res, next) => {
  console.log("error handler: ", err);
  if (res.headersSent) {
    return next(err);
  }
  res.status(err.status || 500)
  res.json(err);
});

module.exports = app;
