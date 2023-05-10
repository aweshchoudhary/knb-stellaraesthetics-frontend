import axios from "axios";
import BASE_URL from "./BASE_URL";

const instance = axios.create({
  baseURL: BASE_URL,
});

export default instance;
