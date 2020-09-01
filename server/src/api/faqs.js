/* eslint-disable consistent-return */
const express = require('express');
const monk = require('monk');
const Joi = require('joi');

const db = monk(process.env.MONGO_URI);
const faqs = db.get('faqs');

const router = express.Router();

const schema = Joi.object({
  question: Joi.string().trim().required(),
  answer: Joi.string().trim().required(),
  videoURL: Joi.string().uri(),
});

router.get('/', async (req, res, next) => {
  try {
    const items = await faqs.find({});
    res.json(items);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const item = await faqs.findOne({
      _id: id,
    });
    if (!item) {
      return next();
    }
    return res.json(item);
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    // console.log(req.body);
    const value = await schema.validateAsync(req.body);
    const inserted = await faqs.insert(value);
    res.json(inserted);
  } catch (error) {
    next(error);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    //   Setting Id
    const { id } = req.params;
    // Validating by joi
    const value = await schema.validateAsync(req.body);
    // Find that specific item by id
    const item = faqs.findOne({
      _id: id,
    });
    // If that id is not in database then return error
    if (!item) return next();
    // Updating value in the database
    // eslint-disable-next-line no-unused-vars
    const updated = await faqs.update(
      {
        _id: id,
      },
      {
        $set: value,
      }
    );
    // returning that value back to the database.
    return res.json(value);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    // Removing param id from database.
    await faqs.remove({ _id: id });
    res.status(200).send('Successfully deleted');
  } catch (error) {
    next(error);
  }
});

module.exports = router;
