import axios from "axios";

const api = axios.create({
  // baseURL: "http://18.231.177.147:3000",
  baseURL: "http://localhost:3000",
  timeout: 5000
});

export default api;
