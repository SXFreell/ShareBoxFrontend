import axios, { AxiosInstance } from "axios";

const instance: AxiosInstance = axios.create({
    baseURL: "http://localhost:41250/",
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    }
});

export default instance;