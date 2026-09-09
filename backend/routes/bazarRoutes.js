const express = require('express');
const router = express.Router();
const bazarController = require('../controllers/bazarController');

router.get('/', bazarController.getBazar);
router.post('/', bazarController.addBazar);
router.put('/:id', bazarController.updateBazar);
router.delete('/:id', bazarController.deleteBazar);

module.exports = router;
