import axios, { AxiosInstance } from "axios";

const instance: AxiosInstance = axios.create({
    baseURL: location.protocol+"//"+location.hostname+":"+location.port+"/api/",
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    }
});

export default instance;