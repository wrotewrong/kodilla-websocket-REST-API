const express = require('express');
const router = express.Router();
const db = require('../db');
const { v4: uuidv4 } = require('uuid');

const database = db.seats;

// get all seats
router.route('/seats').get((req, res) => {
  res.json(database);
});

// get seat by id
router.route('/seats/:id').get((req, res) => {
  const index = database.findIndex((element) => element.id == req.params.id);

  if (index != -1) {
    res.json(database[index]);
  } else {
    res.status(404).json({ message: 'Not found...' });
  }
});

// add seats
router.route('/seats').post((req, res) => {
  const filteredDatabase = database.filter(
    (element) => element.day == req.body.day && element.seat == req.body.seat
  );

  if (filteredDatabase.length == 0) {
    database.push({
      id: uuidv4(),
      day: Number(req.body.day),
      seat: Number(req.body.seat),
      client: req.body.client,
      email: req.body.email,
    });
    res.json({ message: 'OK' });
    req.io.emit('seatsUpdated', database);
    console.log('seats sent by the server');
  } else {
    res.status(404).json({ message: 'The slot is already taken...' });
  }
});

// modify seat by id
router.route('/seats/:id').put((req, res) => {
  const index = database.findIndex((element) => element.id == req.params.id);

  if (index != -1) {
    database[index] = {
      ...database[index],
      ...req.body,
    };
    res.json({ message: 'OK' });
  } else {
    res.status(404).json({ message: 'Not found...' });
  }
});

// delete seat by id
router.route('/seats/:id').delete((req, res) => {
  const index = database.findIndex((element) => element.id == req.params.id);

  if (index != -1) {
    database.splice(index, 1);
    res.json({ message: 'OK' });
  } else {
    res.status(404).json({ message: 'Not found...' });
  }
});

module.exports = router;
