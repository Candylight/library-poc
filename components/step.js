const scenario = require('../scenarios');
const axios = require('axios');
const database = require('./database');
const instance = axios.create({
  baseURL: 'http://127.0.0.1:3000'
});
const _ = require('lodash');

exports.goToNextStep = async function (args) {
  const nextStep = args.nextStep;

  const keywords = await instance.get('/categories')
    .then(function (response) {
      return response.data.map(keyword => {
        return {text: keyword.name, value: JSON.stringify({
                value: keyword.id,
                next: 'keywords',
                method: 'searchByKeywords'
            }) };
      });
    });

  scenario[nextStep].settings.attachments[0].actions[0].options = keywords;

  return scenario[nextStep].settings;
};

exports.searchByKeywords = async function (args) {
    const selectedKeyword = JSON.parse(args.payload.actions[0].selected_options[0].value).value;
    const resources = await instance.get('/resources')
        .then(function (response) {
            return response.data.map(resource => {
                if (resource.categories.includes(selectedKeyword)) {
                    const resourceType = database.findTypesBy('id', resource.type)[0].name
                    if (resource.url !== undefined) {
                        return ` Type of resource: *${resourceType}* | ${resource.url} added by <@${resource.user}>`
                    }
                }
            })
        })

    const message = resources.join('\n')
    const nextStep = args.nextStep;

    const keywords = await instance.get('/categories')
        .then(function (response) {
            return response.data.map(keyword => {
                return {text: keyword.name, value: JSON.stringify({
                        value: keyword.id,
                        next: 'keywords',
                        method: 'searchByKeywords'
                    }) };
            });
        });

    const selectedKeywordName = database.findCategoriesBy('id', selectedKeyword)[0].name;

    scenario[nextStep].settings.attachments[0].actions[0].options = keywords;
    scenario[nextStep].settings.text = `Resource(s) for keyword \`${selectedKeywordName}\`:\n${message}`

    return scenario[nextStep].settings;
};