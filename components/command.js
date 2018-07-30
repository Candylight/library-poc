const database = require('./database');
const axios = require('axios');
const instance = axios.create({
    baseURL: 'http://127.0.0.1:3000'
});
const _ = require('lodash');
const config = require('../config/slack');
const appToken = config.config.slack.app;
const WebClient = require('@slack/client').WebClient;
const api = new WebClient(appToken);

exports.handleCommandRequest = function (request, callback) {
    const content = request.text.split(' ');
    const user = request.user_id;
    const link = content[0];
    const keywords  = content[1].split('/');
    const type = content[2];

    let resourceType = new Promise((resolve, reject)=> {
        let typeRequest = database.findTypesBy('name', type);
        if (typeRequest.length > 0) {
            resolve(typeRequest[0]);
        } else {
            instance.post('/types' , {name:type})
                .then(function (response) {
                    resolve(response.data);
                })
                .catch(function (error) {
                    reject(error);
                });
        }
    });

    let resourceCategories = new Promise((resolve, reject)=> {
        let categories = keywords.map((keyword) => {
            let categoryRequest = database.findCategoriesBy('name', keyword);
            if (categoryRequest.length > 0) {
                return Promise.resolve(categoryRequest[0]);
            }

            return instance.post('/categories' , {name:keyword})
                .then(function (response) {
                    return response.data;
                })
                .catch(function (error) {
                    reject(error);
                });
        });

        return Promise.all(categories).then(result => {
            resolve(result);
        });
    });

    Promise.all([resourceType, resourceCategories]).then(function (values) {
        new Promise((resolve, reject)=> {
            let resourceRequest = database.findResourcesBy('url', link);
            if (resourceRequest.length > 0) {
                api.chat.postMessage(user, `Sorry <@${user}> but your link ${resourceRequest[0].url} has already been posted by <@${resourceRequest[0].user}>. Try to check <#CBZFQ2YAZ>.`, function(err, res) {
                });
                resolve(resourceRequest[0]);
            } else {
                instance.post('/resources' ,
                    {
                        url: link,
                        user: user,
                        type: values[0].id,
                        categories: _.map(values[1], 'id')

                    })
                    .then(function (response) {
                        resolve(response.data[0]);
                    })
                    .catch(function (error) {
                        reject(error);
                    });
                api.chat.postMessage('CBZFQ2YAZ', `A new *${type}* link has been shared by <@${user}>: ${link} related to \`${keywords.join('/')}\``, function(err, res) {
                });
            }
        });

        callback();
    });

};
