const async = require('async');
const config = require('../config/slack');
const appToken = config.config.slack.app;
const WebClient = require('@slack/client').WebClient;
const api = new WebClient(appToken);
const scenario = require('../scenarios');
const triggeringWords = ['hello'];

exports.startConversationWithBot = function (event) {
    if (triggeringWords.indexOf(event.text.toLowerCase()) + 1) {
        async.waterfall([
            async.apply(getUser, event),
            async.apply(botWelcomeMessage, event),
        ]
        );
    }
};

function getUser(event, callback) {
    api.users.info(event.user, function(err, res) {
        const user = {id: res.user.id, name: res.user.name};
        callback(err, user);
    });
}

function botWelcomeMessage(event, user, callback) {
    api.chat.postMessage(event.channel, `Hello <@${user.name}> ! Thirsty of knowledge ?`, scenario.menu.settings, function(err, res) {
        callback(err, user, res);
    });
}