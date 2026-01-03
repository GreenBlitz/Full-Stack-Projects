// בס"ד
import { backendBaseUrl } from "../config/frcConfig";

export const fetchFromProxy = async <T>(targetUrl: string): Promise<T> => {
  const fullUrl = `${backendBaseUrl}${encodeURIComponent(targetUrl)}`;
  const response = await fetch(fullUrl);

  return response.ok
    ? (response.json() as Promise<T>)
    : Promise.reject(new Error(`HTTP error status: ${response.status}`));
};
