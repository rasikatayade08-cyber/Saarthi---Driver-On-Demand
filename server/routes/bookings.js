const express = require('express');
const { getBookings, getBookingById, createBooking, updateBookingStatus, cancelBooking } = require('../controllers/bookingController');
const router = express.Router();

router.get('/', getBookings);
router.get('/:id', getBookingById);
router.post('/', createBooking);
router.patch('/:id/status', updateBookingStatus);
router.patch('/:id/cancel', cancelBooking);

module.exports = router;
