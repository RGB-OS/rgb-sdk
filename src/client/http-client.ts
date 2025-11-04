import axios, { AxiosError, type AxiosInstance, type InternalAxiosRequestConfig } from "axios";
import { RGBHTTPClientParams } from "../types/rgb-model";
import { NetworkError } from "../errors";
import { logger } from "../utils/logger";
import { validateRequired, validateString } from "../utils/validation";
import { DEFAULT_API_TIMEOUT } from "../constants";

/**
 * Create HTTP client for RGB Node API
 */
export const createClient = (params: RGBHTTPClientParams): AxiosInstance => {
  const { xpub_van, xpub_col, rgbEndpoint, master_fingerprint } = params;

  // Validate required parameters
  validateRequired(rgbEndpoint, 'rgbEndpoint');
  validateString(xpub_van, 'xpub_van');
  validateString(xpub_col, 'xpub_col');
  validateString(master_fingerprint, 'master_fingerprint');

  const client = axios.create({
    baseURL: rgbEndpoint,
    timeout: DEFAULT_API_TIMEOUT,
    headers: {
      "xpub-van": xpub_van,
      "xpub-col": xpub_col,
      "master-fingerprint": master_fingerprint
    },
  });

  // Request interceptor
  client.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      logger.debug('Request:', {
        method: config.method?.toUpperCase(),
        url: config.url,
        baseURL: config.baseURL,
      });
      return config;
    },
    (error) => {
      logger.error('Request failed:', error);
      return Promise.reject(new NetworkError('Request configuration failed', undefined, error));
    }
  );

  // Response interceptor
  client.interceptors.response.use(
    (response) => {
      logger.debug('Response:', {
        status: response.status,
        url: response.config.url,
      });
      return response;
    },
    (error: AxiosError) => {
      if (error.response) {
        // Server responded with error status
        const status = error.response.status;
        const data = error.response.data;
        const url = error.config?.url;
        
        logger.error('API Error:', {
          status,
          url,
          data,
        });

        return Promise.reject(
          new NetworkError(
            `API request failed: ${status} ${error.response.statusText}`,
            status,
            error
          )
        );
      } else if (error.request) {
        // Request was made but no response received
        logger.error('Network error - no response:', {
          message: error.message,
          code: error.code,
        });

        return Promise.reject(
          new NetworkError(
            `Network error: ${error.message || 'No response received from server'}`,
            undefined,
            error
          )
        );
      } else {
        // Something else happened
        logger.error('Request setup error:', error.message);
        return Promise.reject(
          new NetworkError(`Request error: ${error.message}`, undefined, error)
        );
      }
    }
  );

  return client;
};