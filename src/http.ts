import axios, { AxiosError } from "axios";
import { RGBHTTPClientParams } from "./types/rgb-model";

export const createClient = (params: RGBHTTPClientParams) => {

  const { xpub_van, xpub_col, rgbEndpoint, master_fingerprint } = params;
  const client = axios.create({
    baseURL: rgbEndpoint,
    headers: {
      "xpub-van": xpub_van,
      "xpub-col": xpub_col,
      "master-fingerprint": master_fingerprint
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