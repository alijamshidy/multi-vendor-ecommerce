import axios from "axios";
const local = "http://localhost:8000";
const api = axios.create({
  baseURL: `${local}/v1/`,
});
export default api;
