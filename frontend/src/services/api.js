import axios from "axios";

const API_BASE_URL = "http://localhost:8000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Face Recognition API calls
export const faceAPI = {
  // Enroll a new face
  enrollFace: async (name, imageData) => {
    try {
      const response = await api.post("/faces/enroll", {
        name,
        image_data: imageData,
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || "Failed to enroll face");
    }
  },

  // Recognize faces in an image
  recognizeFaces: async (imageData) => {
    try {
      const response = await api.post("/faces/recognize", {
        image_data: imageData,
      });
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.detail || "Failed to recognize faces"
      );
    }
  },

  // Get all enrolled faces
  getAllFaces: async () => {
    try {
      const response = await api.get("/faces/");
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || "Failed to fetch faces");
    }
  },

  // Delete a face
  deleteFace: async (faceId) => {
    try {
      const response = await api.delete(`/faces/${faceId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || "Failed to delete face");
    }
  },

  // Get faces count
  getFacesCount: async () => {
    try {
      const response = await api.get("/faces/count");
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.detail || "Failed to get faces count"
      );
    }
  },

  // Get performance metrics
  getMetrics: async () => {
    try {
      const response = await api.get("/metrics");
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || "Failed to get metrics");
    }
  },
};

export default api;
