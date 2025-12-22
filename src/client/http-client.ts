import axios, { AxiosError, type AxiosInstance, type InternalAxiosRequestConfig } from "axios";
import { RGBHTTPClientParams } from "../types/rgb-model";
import { NetworkError, BadRequestError, NotFoundError, ConflictError, RgbNodeError, SDKError } from "../errors";
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

  /**
   * Extract error message from API response
   */
  const extractErrorMessage = (status: number, data: any, defaultMessage: string): string => {
    if (typeof data === 'string') {
      return data;
    }
    if (data && typeof data === 'object') {
      // Try common error message fields
      if (data.detail) return String(data.detail);
      if (data.message) return String(data.message);
      if (data.error) return String(data.error);
    }
    return defaultMessage;
  };

  /**
   * Map HTTP status code to specific error class
   */
  const createHttpError = (status: number, message: string, cause: AxiosError): SDKError => {
    switch (status) {
      case 400:
        return new BadRequestError(message, cause);
      case 404:
        return new NotFoundError(message, cause);
      case 409:
        return new ConflictError(message, cause);
      case 500:
      case 502:
      case 503:
      case 504:
        return new RgbNodeError(message, status, cause);
      default:
        // For other status codes, use NetworkError with status code
        return new NetworkError(message, status, cause);
    }
  };

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
        const defaultMessage = `API request failed: ${status} ${error.response.statusText || 'Unknown error'}`;
        const message = extractErrorMessage(status, data, defaultMessage);
        
        logger.error('API Error:', {
          status,
          url,
          data,
          message,
        });

        return Promise.reject(createHttpError(status, message, error));
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