const _ = require('lodash');
const shortid = require('shortid');

let Type = function(data) {
    return this.sanitize(data);
};

Type.prototype.get = function (name) {
    return this[name];
};

Type.prototype.set = function (name, value) {
    this[name] = value;
};

Type.prototype.sanitize = function (data) {
    data = data || {};
    let type = {
        id: shortid.generate(),
        name: null,
        description: null,
        resources: [],
    };
    return _.pick(_.defaults(data, type), _.keys(type));
};

module.exports = Type;
