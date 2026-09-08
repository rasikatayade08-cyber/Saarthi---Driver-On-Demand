const MOCK_VEHICLES = [
  {
    _id: 'veh_001',
    owner: 'usr_001',
    nickname: 'My City',
    make: 'Honda',
    model: 'City',
    year: 2022,
    licensePlate: 'DL 01 AB 1234',
    color: 'Pearl White',
    type: 'sedan',
    isDefault: true,
  },
  {
    _id: 'veh_002',
    owner: 'usr_001',
    nickname: 'Family SUV',
    make: 'Toyota',
    model: 'Fortuner',
    year: 2021,
    licensePlate: 'UP 82 XY 5678',
    color: 'Phantom Black',
    type: 'suv',
    isDefault: false,
  },
  {
    _id: 'veh_003',
    owner: 'usr_001',
    nickname: 'Office Car',
    make: 'Maruti',
    model: 'Swift',
    year: 2023,
    licensePlate: 'DL 7C AB 9999',
    color: 'Magma Red',
    type: 'hatchback',
    isDefault: false,
  },
];

// GET /api/vehicles
const getVehicles = (req, res) => {
  res.json({ success: true, count: MOCK_VEHICLES.length, data: MOCK_VEHICLES });
};

// GET /api/vehicles/:id
const getVehicleById = (req, res) => {
  const vehicle = MOCK_VEHICLES.find(v => v._id === req.params.id);
  if (!vehicle) return res.status(404).json({ success: false, message: 'Vehicle not found' });
  res.json({ success: true, data: vehicle });
};

// POST /api/vehicles
const addVehicle = (req, res) => {
  const { make, model, licensePlate, color, type, nickname, year } = req.body;
  if (!make || !model || !licensePlate) {
    return res.status(400).json({ success: false, message: 'Make, model and license plate are required' });
  }
  const vehicle = {
    _id: `veh_${Date.now()}`,
    owner: 'usr_001',
    nickname: nickname || `${make} ${model}`,
    make, model, year,
    licensePlate: licensePlate.toUpperCase(),
    color, type: type || 'sedan',
    isDefault: MOCK_VEHICLES.length === 0,
  };
  MOCK_VEHICLES.push(vehicle);
  res.status(201).json({ success: true, message: 'Vehicle added successfully', data: vehicle });
};

// DELETE /api/vehicles/:id
const deleteVehicle = (req, res) => {
  const idx = MOCK_VEHICLES.findIndex(v => v._id === req.params.id);
  if (idx === -1) return res.status(404).json({ success: false, message: 'Vehicle not found' });
  MOCK_VEHICLES.splice(idx, 1);
  res.json({ success: true, message: 'Vehicle removed' });
};

module.exports = { getVehicles, getVehicleById, addVehicle, deleteVehicle };
