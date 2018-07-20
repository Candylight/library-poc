const lowdb = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const categoryAdapter = new FileSync('./database/categories.json');
const typeAdapter = new FileSync('./database/type.json');
const resourceAdapter = new FileSync('./database/resource.json');

const categoryTable = lowdb(categoryAdapter);
const typeTable = lowdb(typeAdapter);
const resourceTable = lowdb(resourceAdapter);

categoryTable.defaults({categories: []}).write();
typeTable.defaults({types: []}).write();
resourceTable.defaults({resources: []}).write();

// ╔═════════════════════════════════════════╗
// ║              Categories                 ║
// ╚═════════════════════════════════════════╝
exports.setCategory = function(category) {
    return categoryTable.get('categories')
        .push(category)
        .write();
};

exports.getCategories = function() {
    return categoryTable.get('categories')
        .value();
};

exports.findCategoriesBy = function(data, value) {
    return categoryTable.get('categories')
        .filter((category) => category[data] === value)
        .value();
};

// ╔═════════════════════════════════════════╗
// ║               Types                     ║
// ╚═════════════════════════════════════════╝
exports.setType = function(type) {
    return typeTable.get('types')
        .push(type)
        .write();
};

exports.getTypes = function() {
    return typeTable.get('types')
        .value();
};

exports.findTypesBy = function(data, value) {
    return typeTable.get('types')
        .filter((type) => type[data] === value)
        .value();
};

// ╔═════════════════════════════════════════╗
// ║                Resources                ║
// ╚═════════════════════════════════════════╝
exports.setResource = function(resource) {
    return resourceTable.get('resources')
        .push(resource)
        .write();
};

exports.getResources = function() {
    return resourceTable.get('resources')
        .value();
};

exports.findResourcesBy = function(data, value) {
    return resourceTable.get('resources')
        .filter((resource) => resource[data] === value)
        .value();
};