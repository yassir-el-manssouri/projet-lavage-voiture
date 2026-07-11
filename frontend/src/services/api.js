export const API_URL = 'http://localhost:5000/api';

export const loginCall = async (email, password) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Erreur inconnue');
  
  localStorage.setItem('token', data.token);
  localStorage.setItem('user', JSON.stringify(data.user));
  
  return data;
};

export const registerCall = async (name, email, password) => {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    // Par défaut, nouvel inscrit = CLIENT
    body: JSON.stringify({ name, email, password, role: 'CLIENT' }),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Erreur inconnue');
  
  return data;
};

export const getReservations = async () => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/reservations`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Erreur inconnue');
  
  return data;
};

export const getAvailability = async (date) => {
  const response = await fetch(`${API_URL}/reservations/availability?date=${date}`);
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Erreur inconnue');
  return data;
};

export const createReservation = async (reservationData) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/reservations`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(reservationData),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Erreur inconnue');
  
  return data;
};

// --- NOUVELLES ROUTES ---

export const getCurrentUser = async () => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/auth/me`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Erreur inconnue');
  return data;
};

export const getVehicles = async () => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/vehicles`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Erreur inconnue');
  return data;
};

export const addVehicle = async (vehicleData) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/vehicles`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(vehicleData),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Erreur inconnue');
  return data;
};

export const deleteVehicle = async (id) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/vehicles/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Erreur inconnue');
  return data;
};

export const submitFeedback = async (id, feedback) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/reservations/${id}/feedback`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(feedback),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Erreur inconnue');
  
  return data;
};

// --- SERVICES ---

export const getServices = async () => {
  const response = await fetch(`${API_URL}/services`);
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Erreur inconnue');
  return data;
};

export const createService = async (serviceData) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/services`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(serviceData),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Erreur inconnue');
  return data;
};

export const updateService = async (id, serviceData) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/services/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(serviceData),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Erreur inconnue');
  return data;
};

export const deleteService = async (id) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/services/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Erreur inconnue');
  return data;
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};
