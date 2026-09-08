const express = require('express');
const { getVehicles, getVehicleById, addVehicle, deleteVehicle } = require('../controllers/vehicleController');
const router = express.Router();

router.get('/', getVehicles);
router.get('/:id', getVehicleById);
router.post('/', addVehicle);
router.delete('/:id', deleteVehicle);

module.exports = router;
