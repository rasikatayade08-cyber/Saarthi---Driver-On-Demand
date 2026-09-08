const BASE_URL = 'http://localhost:5000/api';

async function request(path, options = {}) {
  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      headers: { 'Content-Type': 'application/json', ...options.headers },
      ...options,
    });
    const data = await res.json();
    return data;
  } catch (err) {
    console.warn(`API call failed (${path}):`, err.message);
    return { success: false, error: err.message };
  }
}

export const api = {
  // Auth
  login: (body) => request('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  register: (body) => request('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  getMe: () => request('/auth/me'),

  // Bookings
  getBookings: (params = {}) => request(`/bookings?${new URLSearchParams(params)}`),
  getBooking: (id) => request(`/bookings/${id}`),
  createBooking: (body) => request('/bookings', { method: 'POST', body: JSON.stringify(body) }),
  cancelBooking: (id) => request(`/bookings/${id}/cancel`, { method: 'PATCH' }),

  // Vehicles
  getVehicles: () => request('/vehicles'),
  addVehicle: (body) => request('/vehicles', { method: 'POST', body: JSON.stringify(body) }),
  deleteVehicle: (id) => request(`/vehicles/${id}`, { method: 'DELETE' }),

  // Drivers
  getNearbyDrivers: () => request('/drivers/nearby'),

  // Health
  health: () => request('/health'),
};
