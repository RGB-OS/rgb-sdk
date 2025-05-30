import axios, { AxiosError } from "axios";

export const createClient = (xpub_van: string,xpub_col:string, rgbManagerEndpoint:string) => {
  const client = axios.create({
    baseURL: rgbManagerEndpoint,
    headers: {
      "xpub-van": xpub_van,
      "xpub-col":xpub_col,
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