const _ = require('lodash');
const shortid = require('shortid');

let Resource = function(data) {
    return this.sanitize(data);
};

Resource.prototype.get = function (name) {
    return this[name];
};

Resource.prototype.set = function (name, value) {
    this[name] = value;
};

Resource.prototype.sanitize = function (data) {
    data = data || {};
    let resource = {
        id: shortid.generate(),
        name: null,
        description: null,
        url: null,
        category: null,
        type: null,
        user: null,
        views: 0
    };
    return _.pick(_.defaults(data, resource), _.keys(resource));
};

module.exports = Resource;
