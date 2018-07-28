const config = require('./config/slack');
const verificationToken = config.config.slack.verification;
const command = require('./components/command');
const bot = require('./components/bot');
const step = require('./components/step');

const categoriesRouter = require('./routes/categories');
const typesRouter = require('./routes/types');
const resourcesRouter = require('./routes/resources');

// EVENT API
const createSlackEventAdapter = require('@slack/events-api').createSlackEventAdapter;
const slackEvents = createSlackEventAdapter(verificationToken);

// INTERACTIVE MESSAGES API
const { createMessageAdapter } = require('@slack/interactive-messages');
const slackMessages = createMessageAdapter(verificationToken);

// Initialize an Express application
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());
app.use('/slack/events', slackEvents.expressMiddleware());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/slack/actions', slackMessages.expressMiddleware());

app.use('/categories', categoriesRouter);
app.use('/types', typesRouter);
app.use('/resources', resourcesRouter);

app.post('/commands/share', function (req, res) {
    command.handleCommandRequest(req.body, function (err, callback) {
        res.status(200).send();
    });
});

slackEvents.on('message', (event) => {
    if (event.username === 'hackathonbot' || event.subtype === 'bot_message' || (event.hasOwnProperty('previous_message') && event.previous_message.subtype === 'bot_message')) {
        return processMessageFromBot(event);
    } else {
        return processMessageFromUser(event);
    }
});

slackMessages.action('', (payload, respond) => {
    const actionType = payload.actions[0].type;
    const settings = getStepSettings(actionType, payload);

    return executeStepMethod(settings, payload);
});

/**
 * Get step settings (next step, method and options)
 *
 * @param actionType
 * @param payload
 * @returns {*}
 */
function getStepSettings (actionType, payload) {
    switch (actionType) {
    case 'select':
        let value = null;
        value = ifJson(payload.actions[0].selected_options[0].value);
        return value;
    case 'button':
    default:
        return JSON.parse(payload.actions[0].value);
    }
}

/**
 * Check if action value is a stringify json
 *
 * @param value
 * @returns {*}
 */
function ifJson (value) {
    try {
        return JSON.parse(value);
    } catch (e) {
        return false;
    }
}

/**
 * Dynamically execute a method in components/stepHelper.js to each scenario step (methods, nextStep and options are included in the paypload value)
 *
 * @param settings
 * @param payload
 */
function executeStepMethod (settings, payload) {
    const nextStep = settings.next;
    const stepMethod = settings.method;
    const args = [
        {
            'payload': payload,
            'nextStep': nextStep
        }
    ];

    return step[stepMethod].apply(this, args);
}

function processMessageFromUser(event) {
    if (event.channel.charAt(0) === 'D') {
        return bot.startConversationWithBot(event);
    }
}

function processMessageFromBot(event) {
}

slackEvents.on('error', console.error);

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
