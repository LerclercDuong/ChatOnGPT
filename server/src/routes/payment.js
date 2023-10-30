const express = require('express');
const router = express.Router();
const Payment = require('../api/payment');

router.post('/zalopay', Payment.doPaymentZaloPay);


module.exports = router;