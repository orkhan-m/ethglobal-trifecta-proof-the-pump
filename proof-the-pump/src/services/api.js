const API_URL = "http://localhost:5001/api";

export const api = {
  // Get all pumps
  getPumps: async () => {
    const response = await fetch(`${API_URL}/pumps`);
    if (!response.ok) {
      throw new Error("Failed to fetch pumps");
    }
    return response.json();
  },

  // Create a new pump
  createPump: async (pumpData) => {
    const response = await fetch(`${API_URL}/pumps`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(pumpData),
    });
    if (!response.ok) {
      throw new Error("Failed to create pump");
    }
    return response.json();
  },

  // Add participant to a pump
  addParticipant: async (pumpId, address) => {
    const response = await fetch(`${API_URL}/pumps/${pumpId}/participants`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ address }),
    });
    if (!response.ok) {
      throw new Error("Failed to add participant");
    }
    return response.json();
  },
};
