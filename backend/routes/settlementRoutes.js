const express = require('express');
const router = express.Router();
const settlementController = require('../controllers/settlementController');

router.get('/', settlementController.getSettlements);
router.post('/', settlementController.settleMember);

module.exports = router;
