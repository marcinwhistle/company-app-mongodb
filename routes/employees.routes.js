const express = require('express');
const router = express.Router();
const ObjectId = require('mongodb').ObjectId;

router.get('/employees', (req, res) => {
  // res.json(db.employees);
  req.db
    .collection('employees')
    .find()
    .toArray((err, data) => {
      if (err) res.status(500).json({ message: err });
      else res.json(data);
    });
});

router.get('/employees/random', (req, res) => {
  // res.json(db.employees[Math.floor(Math.random() * db.length)]);
  req.db
    .collection('employees')
    .aggregate([{ $sample: { size: 1 } }])
    .toArray((err, data) => {
      if (err) res.status(500).json({ message: err });
      else res.json(data[0]);
    });
});

router.get('/employees/:id', (req, res) => {
  // res.json(db.employees.find((item) => item.id == req.params.id));
  req.db
    .collection('employees')
    .findOne({ _id: ObjectId(req.params.id) }, (err, data) => {
      if (err) res.status(500).json({ message: err });
      else if (!data) res.status(404).json({ message: 'NotFound' });
      else res.json(data);
    });
});

router.post('/employees', (req, res) => {
  const { firstName, lastName, department } = req.body;
  // db.employees.push({ id: 3, firstName, lastName });
  // res.json({ message: 'OK' });
  req.db
    .collection('departments')
    .insertOne(
      { firstname: firstName, lastName: lastName, department: department },
      (err) => {
        if (err) res.status(500).json({ message: err });
        else res.json({ message: 'OK' });
      }
    );
});

router.put('/employees/:id', (req, res) => {
  const { firstName, lastName, department } = req.body;
  // db = db.employees.map((item) =>
  //   item.id == req.params.id ? { ...item, firstName, lastName } : item
  // );
  // res.json({ message: 'OK' });
  req.db.collection('employees').updateOne(
    { _id: ObjectId(req.params.id) },
    {
      $set: {
        firstName: firstName,
        lastName: lastName,
        department: department,
      },
    },
    (err) => {
      if (err) res.status(500).json({ message: err });
      else res.json({ message: 'OK' });
    }
  );
});

router.delete('/employees/:id', (req, res) => {
  // db = db.employees.filter((item) => item.id != req.params.id);
  // res.json({ message: 'OK' });
  req.db
    .collection('employees')
    .deleteOne({ _id: ObjectId(req.params.id) }, (err) => {
      if (err) res.status(500).json({ message: err });
      else res.json({ message: 'OK' });
    });
});

module.exports = router;
