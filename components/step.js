const scenario = require('../scenarios');
const axios = require('axios');
const instance = axios.create({
  baseURL: 'http://127.0.0.1:3000'
});
const _ = require('lodash');

exports.goToNextStep = async function (args) {
  const nextStep = args.nextStep;

  const keywords = await instance.get('/types')
    .then(function (response) {
      return response.data.map(keyword => {
        return {text: keyword.name, value: keyword.id};
      });
    });

  scenario[nextStep].settings.attachments[0].actions[0].options = keywords;

  return scenario[nextStep].settings;
};
