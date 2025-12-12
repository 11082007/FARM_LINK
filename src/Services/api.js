import axios from "axios";

const api = axios.create({
  // baseURL: "http://localhost:3000/api",
  baseURL: "https://farmlink-production.up.railway.app/api",
  withCredentials: false,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const registerUser = async (userData) => {
  const res = await api.post("/auth/register", userData);
  return res.data;
};

export const loginUser = async (email, password) => {
  const res = await api.post("/auth/login", { email, password });
  return res.data;
};

export const getProduceListings = async () => {
  const res = await api.get("/produce");
  return res.data;
};

export const getProduceById = async (id) => {
  const res = await api.get(`/produce/${id}`);
  return res.data;
};

export const getMyFarmListings = async () => {
  const res = await api.get("/produce/my-listings");
  return res.data;
};

export const getInquiries = async () => {
  const res = await api.get("/inquiries");
  return res.data;
};

export const sendInquiry = async (inquiryData) => {
  const res = await api.post("/inquiries", inquiryData);
  return res.data;
};

export const searchProducts = async (query) => {
  const res = await api.get(`/produce/search?q=${query}`);
  return res.data;
};

const WEATHER_API_KEY = import.meta.env.VITE_TOMORROW_API_KEY;
const GEOCODE_API_KEY = import.meta.env.VITE_OPENCAGE_API_KEY;

export const getCoordinates = async (locationName) => {
  const res = await axios.get("https://api.opencagedata.com/geocode/v1/json", {
    params: {
      q: locationName,
      key: GEOCODE_API_KEY,
      limit: 1,
    },
  });

  if (!res.data.results?.length) throw new Error("Location not found");

  const { lat, lng } = res.data.results[0].geometry;
  return { lat, lon: lng };
};

export const getWeatherForecast = async (lat, lon) => {
  const res = await axios.get("https://api.tomorrow.io/v4/weather/realtime", {
    params: {
      location: `${lat},${lon}`,
      apikey: WEATHER_API_KEY,
      units: "metric",
    },
  });

  return res.data;
};

export const getRecommendations = (weather) => {
  if (!weather?.data?.values) {
    return ["Weather data unavailable"];
  }

  const { temperature: temp, precipitationIntensity: rain = 0 } =
    weather.data.values;
  const recs = [];

  if (temp < 18) recs.push("⚠️ Cold — protect crops from frost");
  else if (temp > 35) recs.push("🌡️ Hot — ensure irrigation");

  if (rain > 1) recs.push("🌧️ Heavy rain — check drainage");

  if (recs.length === 0) recs.push("✅ Good weather for farming");

  return recs;
};

export default api;
