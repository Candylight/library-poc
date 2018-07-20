const _ = require('lodash');
const shortid = require('shortid');

let Category = function(data) {
    return this.sanitize(data);
};

Category.prototype.get = function (name) {
    return this[name];
};

Category.prototype.set = function (name, value) {
    this[name] = value;
};

Category.prototype.sanitize = function (data) {
    data = data || {};
    let category = {
        id: shortid.generate(),
        name: null,
        description: null,
        resources: [],
    };
    return _.pick(_.defaults(data, category), _.keys(category));
};

module.exports = Category;
