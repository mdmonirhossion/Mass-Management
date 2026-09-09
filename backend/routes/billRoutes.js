const express = require('express');
const router = express.Router();
const billController = require('../controllers/billController');

router.get('/', billController.getBills);
router.post('/', billController.addBill);
router.put('/:id', billController.updateBill);
router.delete('/:id', billController.deleteBill);

module.exports = router;
