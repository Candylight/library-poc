const express = require('express');
const router = express.Router();
const Type = require('../models/type');
const database = require('../components/database')

router.get('/', async (req, res) => {
  const types = database.getTypes();

  res.send(types);
});

router.post('/', async (req, res) => {
  let type = new Type({
    id: req.body.id,
    name: req.body.name,
    description: req.body.description,
  });
  type = database.setType(type);

  res.send(type);
});

router.get('/:id', async (req, res) => {
  const type = database.findTypesBy('id', req.params.id);

  if (!type) return res.status(404).send('The type with the given ID was not found.');

  res.send(type);
});

module.exports = router;