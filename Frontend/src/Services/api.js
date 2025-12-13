import axios from "axios";
import { supabase } from "../lib/supabase.js";

const api = axios.create({
  baseURL: "https://farmlink-production.up.railway.app/api",
  withCredentials: false,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

/* ---------------------------------------------------------
   AUTH FUNCTIONS
-----------------------------------------------------------*/
export const registerUser = async (userData) => {
  console.log("🚀 Starting registration for:", userData.email);

  try {
    // 1. Create user in Supabase Auth WITH proper metadata
    console.log("🔐 Creating user in Supabase Auth...");

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: userData.email.trim().toLowerCase(),
      password: userData.password,
      options: {
        data: {
          // ✅ This is where metadata goes
          first_name: userData.firstName,
          last_name: userData.lastName,
          phone: userData.phone || "",
          location: userData.location || "",
          role: userData.role,
        },
      },
    });

    if (authError) {
      console.error("❌ Supabase Auth error:", authError);
      throw authError;
    }

    console.log("✅ Supabase Auth user created:", authData.user?.id);
    console.log("📦 User metadata saved:", authData.user?.user_metadata);

    // 2. Create profile in custom table
    console.log("💾 Creating profile in custom users table...");

    const { data: profileData, error: profileError } = await supabase
      .from("users")
      .insert({
        id: authData.user.id,
        email: userData.email.trim().toLowerCase(),
        first_name: userData.firstName,
        last_name: userData.lastName,
        phone: userData.phone || null,
        location: userData.location || null,
        role: userData.role,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (profileError) {
      console.error("❌ Profile creation error:", profileError);
      throw profileError;
    }

    console.log("✅ Profile created successfully");

    return {
      user: authData.user,
      profile: profileData,
      session: authData.session,
      requiresConfirmation: !authData.user?.confirmed_at,
    };
  } catch (error) {
    console.error("❌ Complete registration failed:", error);
    throw error;
  }
};

export const loginUser = async (email, password) => {
  const res = await api.post("/auth/login", { email, password });
  return res.data;
};

/* ---------------------------------------------------------
   PRODUCT FUNCTIONS
-----------------------------------------------------------*/
export const getProduceListings = async () => {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
    console.log("Fetched products from Supabase:", data);
    return data;
  } catch (error) {
    console.error("Error in getProduceListings:", error);
    return [];
  }
};

export const getProduceById = async (id) => {
  const res = await api.get(`/produce/${id}`);
  return res.data;
};

export const getMyFarmListings = async () => {
  const res = await api.get("/produce/my-listings");
  return res.data;
};

export const searchProducts = async (query) => {
  const res = await api.get(`/produce/search?q=${query}`);
  return res.data;
};

/* ---------------------------------------------------------
   INQUIRY FUNCTIONS
-----------------------------------------------------------*/
export const getInquiries = async () => {
  const res = await api.get("/inquiries");
  return res.data;
};

export const sendInquiry = async (inquiryData) => {
  const res = await api.post("/inquiries", inquiryData);
  return res.data;
};

/* ---------------------------------------------------------
   WEATHER FUNCTIONS
-----------------------------------------------------------*/
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

/* ---------------------------------------------------------
   ESCROW FUNCTIONS (SINGLE VERSION - REMOVE DUPLICATES!)
-----------------------------------------------------------*/
export const createEscrow = async (product, buyer, amount) => {
  console.log("🚀 Creating escrow with:", { product, buyer, amount });

  // Generate unique escrow ID
  const escrowId = `ESC-${Date.now()}-${Math.random()
    .toString(36)
    .substr(2, 9)}`;

  const escrowData = {
    id: escrowId,
    product_id: product.id || product._id,
    product_name: product.name,
    farmer_id: product.farmer_id || product.farm_id || "farmer_unknown",
    farmer_name: product.farmerName || product.farmer_name || "Unknown Farmer",
    buyer_id: buyer.id,
    buyer_name: `${buyer.first_name} ${buyer.last_name}`.trim(),
    amount: amount,
    status: "pending",
    created_at: new Date().toISOString(),
    funded_at: null,
    confirmed_at: null,
    shipped_at: null,
    completed_at: null,
    blockchain_tx_hash: null,
    smart_contract_address: null,
    terms: JSON.stringify({
      delivery_days: 7,
      inspection_period: 48,
      farmer_confirmation_required: true,
      buyer_confirmation_required: true,
    }),
    milestones: JSON.stringify([
      { step: "created", timestamp: new Date().toISOString(), completed: true },
      { step: "payment_funded", timestamp: null, completed: false },
      { step: "farmer_confirmed", timestamp: null, completed: false },
      { step: "goods_delivered", timestamp: null, completed: false },
      { step: "buyer_inspected", timestamp: null, completed: false },
      { step: "payment_released", timestamp: null, completed: false },
    ]),
  };

  console.log("📦 Escrow data:", escrowData);

  try {
    const { data, error } = await supabase
      .from("escrow_transactions")
      .insert(escrowData)
      .select()
      .single();

    if (error) {
      console.error("❌ Supabase error:", error);
      throw error;
    }

    console.log("✅ Escrow created successfully:", data);
    return data;
  } catch (error) {
    console.error("❌ Failed to create escrow:", error);
    throw error;
  }
};

export const getEscrowById = async (escrowId) => {
  try {
    const { data, error } = await supabase
      .from("escrow_transactions")
      .select("*")
      .eq("id", escrowId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching escrow:", error);
    throw error;
  }
};

export const getUserEscrows = async (userId) => {
  try {
    const { data, error } = await supabase
      .from("escrow_transactions")
      .select("*")
      .or(`farmer_id.eq.${userId},buyer_id.eq.${userId}`)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching user escrows:", error);
    throw error;
  }
};

export const updateEscrowStatus = async (escrowId, newStatus, options = {}) => {
  const updates = {
    status: newStatus,
    updated_at: new Date().toISOString(),
  };

  // Add timestamp based on status
  switch (newStatus) {
    case "funded":
      updates.funded_at = new Date().toISOString();
      break;
    case "confirmed":
      updates.confirmed_at = new Date().toISOString();
      break;
    case "shipped":
      updates.shipped_at = new Date().toISOString();
      break;
    case "completed":
      updates.completed_at = new Date().toISOString();
      break;
    case "cancelled":
      updates.cancelled_at = new Date().toISOString();
      break;
  }

  // Update blockchain hash if provided
  if (options.blockchainTxHash) {
    updates.blockchain_tx_hash = options.blockchainTxHash;
  }

  // Update milestones
  if (options.milestone) {
    const escrow = await getEscrowById(escrowId);
    const milestones = JSON.parse(escrow.milestones || "[]");

    const milestoneIndex = milestones.findIndex(
      (m) => m.step === options.milestone
    );
    if (milestoneIndex !== -1) {
      milestones[milestoneIndex].completed = true;
      milestones[milestoneIndex].timestamp = new Date().toISOString();
      updates.milestones = JSON.stringify(milestones);
    }
  }

  const { data, error } = await supabase
    .from("escrow_transactions")
    .update(updates)
    .eq("id", escrowId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getActiveEscrowsCount = async (userId) => {
  const { count, error } = await supabase
    .from("escrow_transactions")
    .select("*", { count: "exact", head: true })
    .or(`farmer_id.eq.${userId},buyer_id.eq.${userId}`)
    .in("status", ["pending", "funded", "confirmed", "shipped"]);

  if (error) throw error;
  return count;
};

export const deleteEscrow = async (escrowId) => {
  try {
    const { error } = await supabase
      .from("escrow_transactions")
      .delete()
      .eq("id", escrowId);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error("Error deleting escrow:", error);
    throw error;
  }
};

export default api;
