const express = require('express');

const emojis = require('./emojis');

const router = express.Router();

const faqs = require('./faqs');

router.get('/', (req, res) => {
  res.json({
    message: 'API - 👋🌎🌍🌏',
  });
});

router.use('/emojis', emojis);
router.use('/faqs', faqs);

module.exports = router;
