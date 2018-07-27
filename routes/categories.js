const express = require('express');
const router = express.Router();
const Category = require('../models/category');
const database = require('../components/database')

router.get('/', async (req, res) => {
  const categories = database.getCategories();

  res.send(categories);
});

router.post('/', async (req, res) => {
  let category = new Category({
    id: req.body.id,
    name: req.body.name,
    description: req.body.description,
  });
  database.setCategory(category);

  res.send(category);
});

router.get('/:id', async (req, res) => {
  const category = database.findCategoriesBy('id', req.params.id);

  if (!category) return res.status(404).send('The category with the given ID was not found.');

  res.send(category);
});

module.exports = router;