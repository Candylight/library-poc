const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const categoriesRouter = require('./routes/categories');
const typesRouter = require('./routes/types');
const resourcesRouter = require('./routes/resources');

const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());

const config = require('./config/slack');
const appToken = config.config.slack.app;
const WebClient = require('@slack/client').WebClient;
const api = new WebClient(appToken);
const verificationToken = config.config.slack.verification;

// EVENT API
const createSlackEventAdapter = require('@slack/events-api').createSlackEventAdapter;
const slackEvents = createSlackEventAdapter(verificationToken);

// INTERACTIVE MESSAGES API
const { createMessageAdapter } = require('@slack/interactive-messages');
const slackMessages = createMessageAdapter(verificationToken);

app.use('/slack/events', slackEvents.expressMiddleware());
app.use('/slack/actions', slackMessages.expressMiddleware());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/categories', categoriesRouter);
app.use('/types', typesRouter);
app.use('/resources', resourcesRouter);

app.post('/commands/share', function (req, res) {
  console.log(req);
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
