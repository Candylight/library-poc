const express = require('express');
const router = express.Router();
const Resource = require('../models/resource');
const database = require('../components/database')

router.get('/', async (req, res) => {
  const resources = database.getResources();

  res.send(resources);
});

router.post('/', async (req, res) => {
  let resource = new Resource({
    id: req.body.id,
    name: req.body.name,
    description: req.body.description,
    url: req.body.url,
    category: req.body.category,
    type: req.body.type
  });
  resource = database.setResource(resource);

  res.send(resource);
});


router.get('/:id', async (req, res) => {
  const resource = database.findResourcesBy('id', req.params.id);

  if (!resource) return res.status(404).send('The resource with the given ID was not found.');

  res.send(resource);
});

module.exports = router;