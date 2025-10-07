import axios from "axios";

// # API_BASE_URL=http://10.0.2.2:3000 # If you're using an Android emulator, use 10.0.2.2
// # API_BASE_URL=http://youripaddress:3000 # If you're using a physical device, use your machine's local network IP address

// const API_BASE_URL = "http://10.0.2.2:3000";
const API_BASE_URL = "http://192.168.1.27:3000";

export const client = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// --- Interceptor to attach JWT token ---
// client.interceptors.request.use(async (config) => {
//   const token = await AsyncStorage.getItem("userToken");
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });
