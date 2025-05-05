import axios, { AxiosError } from "axios";

export const createClient = (xpub: string) => {
  const client = axios.create({
    baseURL: "http://127.0.0.1:8000",
    headers: {
      "xpub": xpub,
    },
  });
  client.interceptors.response.use(
    response => response,
    (error: AxiosError) => {
      if (error.response) {
        console.error("API Error:", error.response?.status, error.response?.data);
        return Promise.reject(error);
      } else {
        return Promise.reject(
          new Error(`Network error: ${error.message}`)
        );
      }
    }
  );
  return client;
};