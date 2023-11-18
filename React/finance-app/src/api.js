import axios from "axios";

//axios connection with the url from our fastAPI service
const api = axios.create({
  baseURL: "http://localhost:8000",
});

export default api;
