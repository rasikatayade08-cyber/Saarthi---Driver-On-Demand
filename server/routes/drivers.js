const express = require('express');
const router = express.Router();

const MOCK_DRIVERS = [
  { _id: 'drv_001', name: 'Suresh Kumar', rating: 4.8, experience: 7, totalRides: 1243, isAvailable: true, distanceKm: 1.2, etaMin: 4, phone: '+91 77889 90011', isVerified: true },
  { _id: 'drv_002', name: 'Ravi Sharma', rating: 4.6, experience: 5, totalRides: 892, isAvailable: true, distanceKm: 2.1, etaMin: 7, phone: '+91 88990 01122', isVerified: true },
  { _id: 'drv_003', name: 'Amit Singh', rating: 4.9, experience: 10, totalRides: 2100, isAvailable: true, distanceKm: 3.4, etaMin: 9, phone: '+91 99001 12233', isVerified: true },
];

// Helper: Calculate driver match score & rank
function calculateRankings(drivers) {
  return drivers
    .map(d => {
      // Score formula: Rating (40%) + Proximity/ETA (40%) + Experience (20%)
      const etaScore = Math.max(0, 100 - d.etaMin * 8);
      const ratingScore = (d.rating / 5) * 100;
      const expScore = Math.min(100, d.experience * 10);
      
      const matchScore = Math.round(ratingScore * 0.4 + etaScore * 0.4 + expScore * 0.2);

      return {
        ...d,
        distance: `${d.distanceKm} km`,
        eta: `${d.etaMin} mins`,
        matchScore,
      };
    })
    .sort((a, b) => b.matchScore - a.matchScore) // Highest score first
    .map((drv, idx) => ({
      ...drv,
      rank: idx + 1,
      badge: idx === 0 ? '🏆 Best Match' : idx === 1 ? '⚡ Fast Response' : '🌟 Top Rated',
    }));
}

// GET /api/drivers/nearby — returns ranked nearby drivers
router.get('/nearby', (_req, res) => {
  const available = MOCK_DRIVERS.filter(d => d.isAvailable);
  const rankedDrivers = calculateRankings(available);
  res.json({
    success: true,
    count: rankedDrivers.length,
    algorithm: 'Weighted Proximity + Rating + Experience Match',
    data: rankedDrivers
  });
});

// POST /api/drivers/dispatch — dispatch request to top driver
router.post('/dispatch', (req, res) => {
  const { driverId, bookingId } = req.body;
  const driver = MOCK_DRIVERS.find(d => d._id === driverId) || MOCK_DRIVERS[0];

  res.json({
    success: true,
    message: `Dispatch request sent to Driver ${driver.name}`,
    data: {
      bookingId: bookingId || `bkg_${Date.now()}`,
      assignedDriver: driver,
      dispatchStatus: 'accepted',
      acceptedAt: new Date().toISOString(),
    }
  });
});

// GET /api/drivers
router.get('/', (_req, res) => {
  res.json({ success: true, count: MOCK_DRIVERS.length, data: MOCK_DRIVERS });
});

module.exports = router;
